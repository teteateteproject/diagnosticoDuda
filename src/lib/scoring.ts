import { quizQuestions, SEGMENT_LABELS, type SectorKey } from "./questions";
import { CONFIG, waLink } from "./config";

export type Answers = Record<string, string | string[]>;

export type MaturityLevel = "alta" | "media" | "inicial";

export interface Scores {
  maturidade: number;
  vendas: number;
  atendimento: number;
  posVenda: number;
}

export interface Diagnosis {
  maturityLevel: MaturityLevel;
  maturityLabel: string;
  maturityScore: number;
  maxMaturityScore: number;
  maturityPct: number;
  sectorScores: Record<SectorKey, number>;
  topSectorKey: SectorKey | "combined";
  topSectorLabel: string;
  sectorMessage: string;
  diagnosisText: string;
  nextSteps: string[];
  ctaText: string;
  ctaLink: string;
}

/** Pontuação máxima possível de maturidade (derivada das perguntas) */
export const MAX_MATURITY_SCORE = quizQuestions.reduce((sum, q) => {
  const m = q.options.map((o) => o.maturidade ?? 0).sort((a, b) => b - a);
  if (q.multiple && q.maxSelect) return sum + m.slice(0, q.maxSelect).reduce((s, v) => s + v, 0);
  return sum + (m[0] ?? 0);
}, 0);

/** Cortes em % do máximo (mesma proporção do modelo original: 62% / 40%) */
const THRESHOLDS = { alta: 0.62, media: 0.4 } as const;

export function calculateScores(answers: Answers): Scores {
  const scores: Scores = { maturidade: 0, vendas: 0, atendimento: 0, posVenda: 0 };
  for (const q of quizQuestions) {
    const a = answers[q.id];
    if (!a) continue;
    const values = Array.isArray(a) ? a : [a];
    for (const v of values) {
      const opt = q.options.find((o) => o.value === v);
      if (!opt) continue;
      scores.maturidade += opt.maturidade ?? 0;
      scores.vendas += opt.vendas ?? 0;
      scores.atendimento += opt.atendimento ?? 0;
      scores.posVenda += opt.posVenda ?? 0;
    }
  }
  return scores;
}

export function getMaturityLevel(score: number): MaturityLevel {
  const pct = score / MAX_MATURITY_SCORE;
  if (pct >= THRESHOLDS.alta) return "alta";
  if (pct >= THRESHOLDS.media) return "media";
  return "inicial";
}

export const MATURITY_CONFIG: Record<
  MaturityLevel,
  { label: string; short: string; description: string; tone: "green" | "yellow" | "blue" }
> = {
  alta: {
    label: "Maturidade alta",
    short: "Alta",
    description: `sua operação está pronta pro ${CONFIG.product}. Volume, equipe e urgência já pedem IA no atendimento.`,
    tone: "green",
  },
  media: {
    label: "Maturidade média",
    short: "Média",
    description: `sua operação está em evolução. Tem demanda, mas ainda perde venda por falta de processo e velocidade.`,
    tone: "yellow",
  },
  inicial: {
    label: "Maturidade inicial",
    short: "Inicial",
    description: `sua operação está em estágio inicial. O primeiro passo é organizar os leads antes de automatizar.`,
    tone: "blue",
  },
};

export const SECTOR_CONFIG: Record<SectorKey, { label: string; colorVar: string; message: string }> = {
  vendas: {
    label: "Vendas",
    colorVar: "var(--color-green)",
    message: `O ${CONFIG.product} vai acelerar a conversão: orçamento em minutos, follow-up automático dos orçamentos parados e nenhum lead esquecido no WhatsApp ou Instagram.`,
  },
  atendimento: {
    label: "Atendimento",
    colorVar: "var(--color-cat-marketing)",
    message: `O ${CONFIG.product} vai organizar o atendimento: triagem com IA, distribuição automática entre consultores e tempo de resposta em segundos, 24 horas por dia.`,
  },
  posVenda: {
    label: "Pós-viagem",
    colorVar: "var(--color-cat-servico)",
    message: `O ${CONFIG.product} vai estruturar o pós-viagem: avaliação automática, lembretes de recompra por data e campanhas pra quem já viajou com você.`,
  },
};

const NEXT_STEPS: Record<MaturityLevel, string[]> = {
  alta: [
    "Agendar uma demonstração com o time comercial",
    "Mapear os painéis do CRM (leads, orçamentos, pós-viagem)",
    "Definir o agente de IA do primeiro atendimento",
  ],
  media: [
    "Ver casos de agências parecidas com a sua",
    "Centralizar WhatsApp, Instagram e site num só lugar",
    "Criar uma cadência de follow-up pros orçamentos parados",
  ],
  inicial: [
    "Receber os materiais da Academia Frédy",
    "Registrar cada lead com origem e status",
    "Definir um tempo máximo de resposta pra equipe",
  ],
};

function getTopSector(scores: Scores) {
  const sectors = (Object.keys(SECTOR_CONFIG) as SectorKey[]).map((key) => ({
    key,
    label: SECTOR_CONFIG[key].label,
    score: scores[key],
  }));
  const max = Math.max(...sectors.map((s) => s.score));
  if (max === 0) {
    return {
      key: "combined" as const,
      label: "Vendas, Atendimento e Pós-viagem",
      message: `O ${CONFIG.product} vai atuar de forma integrada: vendas, atendimento e pós-viagem na mesma ferramenta.`,
    };
  }
  const tied = sectors.filter((s) => s.score === max);
  if (tied.length === 1) {
    return { key: tied[0].key, label: tied[0].label, message: SECTOR_CONFIG[tied[0].key].message };
  }
  const labels = tied.map((t) => t.label).join(" e ");
  return {
    key: "combined" as const,
    label: labels,
    message: `O ${CONFIG.product} vai atuar em ${labels} ao mesmo tempo, entregando resultado em mais de uma frente.`,
  };
}

function getCta(level: MaturityLevel) {
  const map = {
    alta: {
      text: "Agendar demonstração",
      msg: `Olá! Minha agência teve Maturidade Alta no Diagnóstico ${CONFIG.product} e quero agendar uma demonstração.`,
    },
    media: {
      text: "Ver casos de agências",
      msg: `Olá! Minha agência teve Maturidade Média no Diagnóstico ${CONFIG.product} e quero conhecer casos de agências parecidas.`,
    },
    inicial: {
      text: "Receber materiais da Academia",
      msg: `Olá! Minha agência teve Maturidade Inicial no Diagnóstico ${CONFIG.product} e quero receber os materiais da Academia Frédy.`,
    },
  } as const;
  return { text: map[level].text, link: waLink(map[level].msg) };
}

export function generateDiagnosis(answers: Answers): Diagnosis {
  const scores = calculateScores(answers);
  const level = getMaturityLevel(scores.maturidade);
  const cfg = MATURITY_CONFIG[level];
  const top = getTopSector(scores);
  const cta = getCta(level);

  const segment = typeof answers.segment === "string" ? answers.segment : "";
  const segmentLabel =
    segment === "outro" && typeof answers.segment_other === "string" && answers.segment_other.trim()
      ? answers.segment_other.trim()
      : SEGMENT_LABELS[segment] ?? "";

  const levelText = { alta: "maturidade alta", media: "maturidade média", inicial: "maturidade inicial" }[level];
  const segmentPart = segmentLabel ? ` Operações de ${segmentLabel.toLowerCase()} como a sua` : " Sua operação";

  const diagnosisText = `Com base nas suas respostas, sua operação tem ${levelText} pra adotar o ${CONFIG.product}.${segmentPart} tende${segmentLabel ? "m" : ""} a ganhar mais rápido em ${top.label}. ${top.message}`;

  return {
    maturityLevel: level,
    maturityLabel: cfg.label,
    maturityScore: scores.maturidade,
    maxMaturityScore: MAX_MATURITY_SCORE,
    maturityPct: Math.round((scores.maturidade / MAX_MATURITY_SCORE) * 100),
    sectorScores: { vendas: scores.vendas, atendimento: scores.atendimento, posVenda: scores.posVenda },
    topSectorKey: top.key,
    topSectorLabel: top.label,
    sectorMessage: top.message,
    diagnosisText,
    nextSteps: NEXT_STEPS[level],
    ctaText: cta.text,
    ctaLink: cta.link,
  };
}

/** Rótulo legível de uma resposta (pra tela de revisão e pro CRM) */
export function answerLabels(questionId: string, answers: Answers): string[] {
  const q = quizQuestions.find((x) => x.id === questionId);
  const a = answers[questionId];
  if (!q || !a) return [];
  const values = Array.isArray(a) ? a : [a];
  return values.map((v) => {
    const opt = q.options.find((o) => o.value === v);
    if (!opt) return v;
    if (opt.hasTextInput && q.textInputId && typeof answers[q.textInputId] === "string") {
      const extra = (answers[q.textInputId] as string).trim();
      return extra ? `${opt.label}: ${extra}` : opt.label;
    }
    return opt.label;
  });
}
