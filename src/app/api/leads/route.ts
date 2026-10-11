import { NextResponse, type NextRequest } from "next/server";
import { leadPayloadSchema } from "@/lib/schema";
import { generateDiagnosis, calculateScores, answerLabels, type Answers } from "@/lib/scoring";
import { quizQuestions, SEGMENT_LABELS } from "@/lib/questions";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;

export async function POST(req: NextRequest) {
  // 1. Rate limit por IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitos envios. Tente de novo em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  // 2. Corpo pequeno e JSON válido
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload muito grande." }, { status: 413 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // 3. Validação estrita (só values conhecidos das perguntas)
  const parsed = leadPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400 },
    );
  }
  const { contact, answers, website, startedAt } = parsed.data;

  // 4. Anti-bot: honeypot preenchido ou formulário "respondido" em < 5s
  if (website) return NextResponse.json({ ok: true }, { status: 200 }); // finge sucesso
  if (startedAt && Date.now() - startedAt < 5_000) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 5. Diagnóstico calculado AQUI (nunca aceitamos score do cliente)
  const diagnosis = generateDiagnosis(answers as Answers);
  const scores = calculateScores(answers as Answers);

  const segment =
    answers.segment === "outro" && answers.segment_other
      ? `Outro: ${answers.segment_other}`
      : SEGMENT_LABELS[answers.segment as string] ?? String(answers.segment);

  const readableAnswers = Object.fromEntries(
    quizQuestions.map((q) => [q.id, answerLabels(q.id, answers as Answers).join(", ")]),
  );

  const row = {
    name: contact.name,
    email: contact.email.toLowerCase(),
    whatsapp: contact.whatsapp,
    segment,
    answers, // jsonb cru (values)
    answers_readable: readableAnswers, // jsonb com rótulos
    maturity_score: scores.maturidade,
    max_maturity_score: diagnosis.maxMaturityScore,
    maturity_pct: diagnosis.maturityPct,
    maturity_level: diagnosis.maturityLevel,
    vendas_score: scores.vendas,
    atendimento_score: scores.atendimento,
    pos_venda_score: scores.posVenda,
    top_sector: diagnosis.topSectorLabel,
    solution_timeline: answers.solution_timeline,
    revenue: answers.revenue,
    source: "diagnostico-fredy",
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  // 6. Persistência (Supabase). Sem env configurado, segue sem salvar (dev local).
  let id: string | null = null;
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("leads").insert(row).select("id").single();
    if (error) {
      console.error("[leads] supabase insert failed:", error.message);
    } else {
      id = data.id as string;
    }
  }

  // 7. Webhook n8n → card no CRM Frédy (best-effort, com timeout)
  await notifyN8n({ id, ...row, diagnosis });

  const persisted = id !== null || Boolean(process.env.N8N_LEAD_WEBHOOK_URL);
  return NextResponse.json({ ok: true, id, persisted, diagnosis }, { status: 201 });
}

async function notifyN8n(payload: unknown) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!url) return;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6_000);
  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.N8N_WEBHOOK_SECRET) {
      headers.authorization = `Bearer ${process.env.N8N_WEBHOOK_SECRET}`;
    }
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) console.error("[leads] n8n webhook status", res.status);
  } catch (err) {
    console.error("[leads] n8n webhook failed:", (err as Error).message);
  } finally {
    clearTimeout(t);
  }
}
