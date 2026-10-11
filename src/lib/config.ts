/**
 * Fatos que mudam (telefone, nomes, links) vivem aqui, derivados do produto ativo.
 * Nunca repita um número ou URL no JSX.
 */
import { PRODUCT } from "@/products";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || PRODUCT.whatsappDefault;

export const CONFIG = {
  productKey: PRODUCT.key,
  product: PRODUCT.name,
  productFull: PRODUCT.nameFull,
  theProduct: PRODUCT.theName,
  siteName: `Diagnóstico ${PRODUCT.name}`,
  siteUrl: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) || PRODUCT.siteUrlDefault,
  description: PRODUCT.description,
  audience: PRODUCT.audience,
  whatsapp: {
    number: WHATSAPP_NUMBER,
    display: formatPhone(WHATSAPP_NUMBER),
  },
  totalMinutes: PRODUCT.totalMinutes,
} as const;

export function waLink(message: string): string {
  return `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Aceita "diagnostico.fredy.app", "http://..." ou "https://..." sem quebrar o build */
function normalizeUrl(raw?: string): string | null {
  if (!raw) return null;
  const v = raw.trim().replace(/\/+$/, "");
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    return new URL(withProto).origin;
  } catch {
    return null;
  }
}

function formatPhone(digits: string): string {
  // 55 47 4003 4215 -> (47) 4003-4215
  const m = digits.match(/^55(\d{2})(\d{4})(\d{4})$/);
  if (m) return `(${m[1]}) ${m[2]}-${m[3]}`;
  const m2 = digits.match(/^55(\d{2})(\d{5})(\d{4})$/);
  if (m2) return `(${m2[1]}) ${m2[2]}-${m2[3]}`;
  return digits;
}

export const WHATSAPP_ICON_PATH =
  "M.5 23.5l1.6-6A11.4 11.4 0 1 1 12 23.4a11.5 11.5 0 0 1-5.5-1.4zM12 3.7a9.4 9.4 0 0 0-8 14.3l.2.4-1 3.5 3.6-1 .4.2A9.4 9.4 0 1 0 12 3.7m5.5 13.4c-.2.6-1.4 1.2-1.9 1.2s-1.3.2-3.6-.8a8.7 8.7 0 0 1-3.8-3.4c-.3-.4-.9-1.4-.9-2.6s.6-1.9.9-2.1a.9.9 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.2.2-.3.3-.1.6a8 8 0 0 0 3.3 2.9c.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 1c.3.1.4.2.5.3s0 .8-.3 1.4";
