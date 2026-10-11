import { fredy } from "./fredy";
import { duda } from "./duda";
import type { ProductDefinition } from "./types";

export type { ProductDefinition, QuizQuestion, QuizOption, SectorKey, MaturityLevel } from "./types";

const REGISTRY: Record<ProductDefinition["key"], ProductDefinition> = { fredy, duda };

const requested = (process.env.NEXT_PUBLIC_PRODUCT ?? "fredy").trim().toLowerCase();

/** Produto ativo neste build (NEXT_PUBLIC_PRODUCT=fredy|duda; padrão fredy) */
export const PRODUCT: ProductDefinition =
  requested in REGISTRY ? REGISTRY[requested as ProductDefinition["key"]] : fredy;
