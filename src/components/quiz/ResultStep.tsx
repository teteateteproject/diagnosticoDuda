"use client";

import { MATURITY_CONFIG, SECTOR_CONFIG, answerLabels, type Answers, type Diagnosis } from "@/lib/scoring";
import { quizQuestions, type SectorKey } from "@/lib/questions";
import { CONFIG } from "@/lib/config";
import { Button, ButtonLink, TextLink } from "@/components/site/Button";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "@/components/site/icons";

export type SaveState = "saving" | "saved" | "local" | "error";

const TONE_PILL: Record<"green" | "yellow" | "blue", string> = {
  green: "bg-level-alta text-level-fg",
  yellow: "bg-level-media text-level-fg",
  blue: "bg-level-inicial text-level-fg",
};

export function ResultStep({
  diagnosis,
  answers,
  contactName,
  saveState,
  onRestart,
}: {
  diagnosis: Diagnosis;
  answers: Answers;
  contactName: string;
  saveState: SaveState;
  onRestart: () => void;
}) {
  const cfg = MATURITY_CONFIG[diagnosis.maturityLevel];
  const firstName = contactName.trim().split(/\s+/)[0] || "Olá";
  const sectors = (Object.keys(SECTOR_CONFIG) as SectorKey[]).map((key) => ({
    key,
    label: SECTOR_CONFIG[key].label,
    color: SECTOR_CONFIG[key].colorVar,
    score: diagnosis.sectorScores[key],
  }));
  const maxSector = Math.max(...sectors.map((s) => s.score), 1);
  const topScore = Math.max(...sectors.map((s) => s.score));
  const today = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date());

  return (
    <div className="rise print-page">
      {/* Cabeçalho só na impressão */}
      <div className="mb-6 hidden border-b border-line pb-4 print:block">
        <p className="text-[18px] font-extrabold text-ink">Diagnóstico {CONFIG.product}</p>
        <p className="text-[13px] text-ink-muted-2">
          Relatório de maturidade em IA para {contactName} · {today}
        </p>
      </div>

      {/* Painel escuro com o resultado */}
      <section className="hero-glow relative overflow-hidden rounded-2xl bg-strong px-7 py-7 text-on-strong-body sm:px-9 sm:py-8">
        <div className="relative grid gap-7 sm:grid-cols-[auto_1fr] sm:items-start">
          <div>
            <div className="num text-[54px] font-extrabold leading-none tracking-[-0.04em] text-accent">
              {diagnosis.maturityPct}%
            </div>
            <div className="num mt-2 text-[14px] font-semibold text-on-strong-body">
              {diagnosis.maturityScore} de {diagnosis.maxMaturityScore} pontos
            </div>
          </div>
          <div>
            <span className={`inline-block rounded-pill px-3 py-1 text-[13px] font-bold ${TONE_PILL[cfg.tone]}`}>
              {cfg.label}
            </span>
            <h1 className="mt-3 text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-on-strong">
              {firstName}, {cfg.description}
            </h1>
            <div className="mt-5 h-2 w-full max-w-[22rem] overflow-hidden rounded-pill bg-on-strong-line">
              <div
                className="h-full rounded-pill bg-accent transition-[width] duration-700 ease-out"
                style={{ width: `${diagnosis.maturityPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impacto por setor */}
      <section className="mt-5 rounded-2xl border border-line-2 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[19px] font-bold tracking-[-0.02em] text-ink">Onde {CONFIG.theProduct} entrega primeiro</h2>
          <span className="text-[14px] text-ink-muted-2">Impacto por setor</span>
        </div>
        <ul className="mt-5 grid gap-4">
          {sectors.map((s) => {
            const isTop = s.score === topScore && s.score > 0;
            const pct = Math.round((s.score / maxSector) * 100);
            return (
              <li key={s.key}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: s.color, boxShadow: "0 0 0 1px rgba(10,10,10,.25)" }} aria-hidden="true" />
                    <span className={`text-[15px] font-bold ${isTop ? "text-ink" : "text-ink-muted"}`}>{s.label}</span>
                    {isTop && (
                      <span className="rounded-pill bg-accent-tint px-[10px] py-[3px] text-[12.5px] font-bold text-accent-ink">
                        Maior impacto
                      </span>
                    )}
                  </div>
                  <span className="num text-[14px] font-bold text-ink">{s.score} pts</span>
                </div>
                <div className="mt-2 h-[10px] overflow-hidden rounded-pill bg-bg-s2">
                  <div
                    className="h-full rounded-pill transition-[width] duration-700 ease-out"
                    style={{ width: `${pct}%`, background: s.color }}
                    role="img"
                    aria-label={`${s.label}: ${s.score} pontos`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Diagnóstico detalhado */}
      <section className="mt-5 rounded-2xl border border-line-2 p-6">
        <h2 className="text-[19px] font-bold tracking-[-0.02em] text-ink">Seu diagnóstico</h2>
        <p className="mt-3 text-[16px] leading-[1.7]">{diagnosis.diagnosisText}</p>
        <div className="mt-5 rounded-r-lg border-l-4 border-accent bg-bg-s1 px-6 py-5">
          <div className="text-[14px] font-bold text-accent-ink">Resumindo</div>
          <p className="mt-[6px] text-[18px] font-semibold leading-[1.5] text-ink">{diagnosis.sectorMessage}</p>
        </div>

        <h3 className="mt-6 text-[17px] font-bold tracking-[-0.02em] text-ink">Próximos passos</h3>
        <ul className="mt-3 grid gap-2">
          {diagnosis.nextSteps.map((step) => (
            <li key={step} className="flex items-start gap-3 text-[15.5px] leading-[1.6]">
              <CheckIcon className="mt-[5px] h-[18px] w-[18px] shrink-0 text-accent-check" />
              <span>{step}</span>
            </li>
          ))}
        </ul>

        <div className="no-print mt-7 flex flex-wrap gap-3 max-[560px]:[&_a]:w-full max-[560px]:[&_button]:w-full">
          <ButtonLink href={diagnosis.ctaLink}>
            <WhatsAppIcon /> {diagnosis.ctaText}
          </ButtonLink>
          <Button type="button" onClick={() => window.print()}>
            Baixar diagnóstico <ArrowRightIcon />
          </Button>
        </div>
        <p className="no-print mt-3 text-[13px] text-ink-muted-2" aria-live="polite">
          {saveState === "saving" && "Salvando seu diagnóstico…"}
          {saveState === "saved" && "Diagnóstico salvo. O time pode te chamar no WhatsApp se fizer sentido."}
          {saveState === "local" && "Resultado calculado nesta tela. Configure o Supabase ou o webhook pra guardar os leads."}
          {saveState === "error" && "Não conseguimos salvar o resultado, mas ele continua válido nesta tela."}
        </p>
      </section>

      {/* Respostas */}
      <details className="no-print mt-5 rounded-2xl border border-line-2 p-6">
        <summary className="cursor-pointer list-none text-[17px] font-bold tracking-[-0.02em] text-ink marker:content-none">
          Suas respostas
        </summary>
        <ul className="mt-4 divide-y divide-line">
          {quizQuestions.map((q) => {
            const labels = answerLabels(q.id, answers);
            if (!labels.length) return null;
            return (
              <li key={q.id} className="py-3 text-[14px]">
                <div className="font-bold text-ink">{q.question}</div>
                <div className="mt-[2px]">{labels.join(", ")}</div>
              </li>
            );
          })}
        </ul>
      </details>

      <div className="no-print mt-6">
        <TextLink onClick={onRestart}>Refazer diagnóstico</TextLink>
      </div>
    </div>
  );
}
