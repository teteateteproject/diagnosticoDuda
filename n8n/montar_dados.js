// Nó "Montar dados" (Code, Run Once for All Items)
// Entrada: body do webhook enviado pelo site (POST /api/leads → N8N_LEAD_WEBHOOK_URL)
const b = $input.first().json.body ?? $input.first().json;

// ---- telefone: só dígitos, com DDI 55, no formato que o WTS usa (+55DDDNÚMERO)
let digits = String(b.whatsapp || '').replace(/\D/g, '');
if (!(digits.startsWith('55') && digits.length >= 12)) digits = '55' + digits;
const phone = '+' + digits;

// ---- rótulos
const nivelMap = { alta: 'Alta', media: 'Média', inicial: 'Inicial' };
const nivel = nivelMap[b.maturity_level] || b.maturity_level || '';
const d = b.diagnosis || {};
const ans = b.answers || {};
const readable = b.answers_readable || {};

const dataBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

// ---- anotação do card: respostas por bloco
const blocks = [];
for (const q of (b.answers_detail || [])) {
  let blk = blocks.find(x => x.name === q.block);
  if (!blk) { blk = { name: q.block, items: [] }; blocks.push(blk); }
  blk.items.push(`• ${q.question}\n  → ${q.answer || '—'}`);
}

const note = [
  `DIAGNÓSTICO DUDA — ${dataBR}`,
  `Nome: ${b.name}`,
  `E-mail: ${b.email}`,
  `WhatsApp: ${phone}`,
  `Segmento: ${b.segment || '—'}`,
  ``,
  `RESULTADO`,
  `Maturidade: ${nivel} (${b.maturity_score}/${b.max_maturity_score} pts · ${b.maturity_pct}%)`,
  `Setor de maior impacto: ${b.top_sector}`,
  `Vendas ${b.vendas_score} · Suporte ${b.atendimento_score}`,
  `Prazo pra resolver: ${readable.solution_timeline || ans.solution_timeline || '—'}`,
  `Faturamento: ${readable.revenue || ans.revenue || '—'}`,
  ``,
  `RESPOSTAS`,
  ...blocks.flatMap(blk => [`[${blk.name}]`, ...blk.items, ``]),
  `DIAGNÓSTICO ENTREGUE`,
  d.diagnosisText || '',
  ``,
  `Próximos passos sugeridos:`,
  ...((d.nextSteps || []).map(s => `• ${s}`)),
  ``,
  `CTA mostrado: ${d.ctaText || '—'}`,
  `Lead ID (Supabase): ${b.id || '—'}`,
].join('\n').slice(0, 8000); // limite da API

return [{
  json: {
    lead_id: b.id || null,
    product: b.product || 'duda',
    name: b.name,
    email: b.email,
    phone,
    segment: b.segment || '',
    nivel,
    nivel_key: b.maturity_level,
    pct: b.maturity_pct,
    top_sector: b.top_sector,
    prazo: readable.solution_timeline || ans.solution_timeline || '',
    faturamento: readable.revenue || ans.revenue || '',
    card_title: `Diagnóstico Duda · ${b.name} · Maturidade ${nivel} (${b.maturity_pct}%)`,
    card_description: (d.diagnosisText || '').slice(0, 8000),
    note,
    data_br: dataBR,
  },
}];
