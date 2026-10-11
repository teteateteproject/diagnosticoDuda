/**
 * Rate limit simples em memória (janela fixa por IP).
 *
 * Em Vercel/serverless cada instância tem o próprio contador, então isso é uma
 * primeira barreira, não a definitiva. Pra algo robusto, troque por
 * @upstash/ratelimit (Redis) mantendo a mesma assinatura.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_HITS = 8; // envios por IP por janela

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.count >= MAX_HITS) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

// Limpeza preguiçosa pra não crescer sem limite
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}, WINDOW_MS).unref?.();
