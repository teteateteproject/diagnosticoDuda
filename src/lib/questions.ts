/**
 * Perguntas do produto ativo. As definições vivem em src/products/<produto>.ts.
 *
 * Duas dimensões de pontuação por opção:
 *  - maturidade: quão pronta a operação está pra adotar IA/CRM (soma -> nível Alta/Média/Inicial)
 *  - vendas / atendimento / posVenda: onde o produto entrega mais impacto imediato (setor vencedor)
 */
import { PRODUCT } from "@/products";

export type { QuizOption, QuizQuestion, SectorKey } from "@/products";

export const quizQuestions = PRODUCT.questions;

export const TOTAL_QUESTIONS = quizQuestions.length;

/** Rótulos amigáveis dos segmentos/nichos (pergunta `segment`), usados no diagnóstico e no CRM */
export const SEGMENT_LABELS: Record<string, string> = Object.fromEntries(
  (quizQuestions.find((q) => q.id === "segment")?.options ?? []).map((o) => [o.value, o.label]),
);
