import { quizQuestions, SEGMENT_LABELS, type SectorKey } from "./questions";
import { waLink } from "./config";
import { PRODUCT } from "@/products";

export type { MaturityLevel } from "@/products";

export type Answers = Record<string, string | string[]>;

import type { MaturityLevel } from "@/products";

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
  alta: { label: "Maturidade alta", short: "Alta", description: PRODUCT.maturity.alta, tone: "green" },
  media: { label: "Maturidade média", short: "Média", description: PRODUCT.maturity.media, tone: "yellow" },
  inicial: { label: "Maturidade inicial", short: "Inicial", description: PRODUCT.maturity.inicial, tone: "blue" },
};

export const SECTOR_CONFIG: Record<SectorKey, { label: string; colorVar: string; message: string }> = {
  vendas: { ...PRODUCT.sectors.vendas, colorVar: "var(--color-sector-1)" },
  atendimento: { ...PRODUCT.sectors.atendimento, colorVar: "var(--color-sector-2)" },
  posVenda: { ...PRODUCT.sectors.posVenda, colorVar: "var(--color-sector-3)" },
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
      label: PRODUCT.sectorsAllLabel,
      message: PRODUCT.sectorsCombinedMessage,
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
    message: PRODUCT.sectorsTiedMessage(labels),
  };
}

function getCta(level: MaturityLevel) {
  const c = PRODUCT.cta[level];
  return { text: c.text, link: waLink(c.message) };
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
  const diagnosisText = PRODUCT.diagnosisText({ levelText, segmentLabel, topLabel: top.label, topMessage: top.message });

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
    nextSteps: PRODUCT.nextSteps[level],
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
