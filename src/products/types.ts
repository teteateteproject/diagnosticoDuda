/**
 * Tudo que muda de um produto pro outro (Frédy x Duda) vive numa ProductDefinition.
 * O código do app é o mesmo; `NEXT_PUBLIC_PRODUCT` escolhe qual definição carregar.
 */

export type SectorKey = "vendas" | "atendimento" | "posVenda";
export type MaturityLevel = "alta" | "media" | "inicial";

export interface QuizOption {
  label: string;
  value: string;
  maturidade?: number;
  vendas?: number;
  atendimento?: number;
  posVenda?: number;
  /** Abre um campo de texto livre quando selecionada */
  hasTextInput?: boolean;
}

export interface QuizQuestion {
  id: string;
  block: string;
  question: string;
  hint?: string;
  multiple?: boolean;
  maxSelect?: number;
  /** id da resposta de texto livre vinculada (ex.: segment_other) */
  textInputId?: string;
  options: QuizOption[];
}

export interface ProductDefinition {
  key: "fredy" | "duda";
  /** "Frédy" */
  name: string;
  /** "Frédy.app" */
  nameFull: string;
  /** "o Frédy" / "a Duda" — pra frases em código compartilhado */
  theName: string;
  /** "agência" / "empresa" */
  orgNoun: string;
  /** Público em uma linha, usado no <title> */
  audience: string;
  /** Logo em /public (opcional). Sem ele, o header usa um wordmark tipográfico. */
  logo?: { src: string; width: number; height: number };
  /** Linha do footer: o que o produto é, em uma frase */
  tagline: string;
  whatsappDefault: string;
  siteUrlDefault: string;
  description: string;
  totalMinutes: number;

  landing: {
    h1: string;
    lead: string;
    stepsIntro: string;
    step1Text: string;
    step2Text: string;
    step3Text: string;
    receiveIntro: string;
    deliverables: string[];
    calloutText: string;
    quote: string;
    ctaTitle: string;
    ctaText: string;
    whatsappMessage: string;
  };

  contactLead: string;

  sectors: Record<SectorKey, { label: string; message: string }>;
  sectorsAllLabel: string;
  sectorsCombinedMessage: string;
  sectorsTiedMessage: (labels: string) => string;

  /** Frase depois do nome: "Mariana, {description}" (começa em minúscula) */
  maturity: Record<MaturityLevel, string>;
  nextSteps: Record<MaturityLevel, string[]>;
  cta: Record<MaturityLevel, { text: string; message: string }>;

  diagnosisText: (args: { levelText: string; segmentLabel: string; topLabel: string; topMessage: string }) => string;

  questions: QuizQuestion[];
}
