# Diagnóstico Frédy / Duda

Quiz de qualificação que mede a maturidade em IA de uma operação e aponta em qual frente o produto entrega resultado primeiro. Lead salvo no Supabase e enviado por webhook pro n8n (card no CRM).

**Um código, dois produtos.** `NEXT_PUBLIC_PRODUCT` escolhe qual definição carregar no build:

| `NEXT_PUBLIC_PRODUCT` | Público | Setores | Tema |
|---|---|---|---|
| `fredy` (padrão) | agências de viagens, multipropriedade, parques, hotelaria | Vendas / Atendimento / Pós-viagem | claro, Plus Jakarta Sans (cores placeholder até receber a marca) |
| `duda` | empresas com 3+ vendedores e vários canais, qualquer nicho | Vendas / Suporte / Pós-vendas | navy escuro + laranja, Archivo + Inter |

No Vercel: dois projetos apontando pro mesmo repo, cada um com seu `NEXT_PUBLIC_PRODUCT`, `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_SITE_URL`.

## Onde mexer

- **Perguntas, textos, setores, CTAs, WhatsApp padrão de cada produto**: `src/products/fredy.ts` e `src/products/duda.ts` (contrato em `src/products/types.ts`).
- **Tema (cores, raio de botão)**: `src/app/globals.css` — `@theme` é o padrão (Frédy) e `:root[data-product="duda"]` sobrescreve. Os componentes só usam tokens semânticos (`accent`, `strong`, `btn`, `cta`, `sector-*`, `level-*`).
- **Logo**: campo `logo` no produto (`{ src: "/logos/duda.svg", width, height }`), arquivo em `public/logos/`. Sem logo, o header usa um wordmark tipográfico.
- **Fontes**: `src/app/layout.tsx` (`FONT_SETUP`), arquivos em `src/fonts/`.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack, React 19) | SSR da landing, route handler pra API no mesmo deploy (Vercel) |
| Linguagem | **TypeScript** strict | Tipos das perguntas e do payload derivados de um único arquivo |
| Estilo | **Tailwind CSS v4** com `@theme` | Tokens do design system viram variáveis CSS, sem config JS |
| Validação | **Zod 4** | Mesmo schema no cliente e no servidor (`src/lib/schema.ts`) |
| Dados | **Supabase** (Postgres + RLS) | Já é a stack de deploy; service role só no servidor |
| Fonte | Plus Jakarta Sans variável **self-hosted** (`next/font/local`) | Zero request externo, OFL |
| Gráfico | Barras em CSS/SVG puro | Sem Recharts: 0 KB extra e 100% no padrão visual |

Sem shadcn, sem biblioteca de ícones, sem framer-motion. O bundle da landing é só React + Next.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
```

Sem `.env.local` o app funciona inteiro: o diagnóstico é calculado e exibido, só não persiste (a tela avisa).

## Variáveis de ambiente

| Variável | Onde | O que |
|---|---|---|
| `NEXT_PUBLIC_PRODUCT` | build | `fredy` (padrão) ou `duda` |
| `NEXT_PUBLIC_SITE_URL` | cliente | URL pública (metadata/OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | cliente | WhatsApp comercial, só dígitos com DDI (padrão: Frédy `554740034215`, Duda `554840034215`) |
| `SUPABASE_URL` | servidor | URL do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | **Nunca** com prefixo `NEXT_PUBLIC_` |
| `N8N_LEAD_WEBHOOK_URL` | servidor | Webhook que recebe o lead (opcional) |
| `N8N_WEBHOOK_SECRET` | servidor | Enviado em `Authorization: Bearer …` pro n8n validar |

## Banco

Rode `supabase/migrations/0001_leads.sql` no SQL Editor (ou `supabase db push`). A tabela `leads` fica com RLS ligado e **sem política** pra `anon`/`authenticated`: só a service role (no route handler) lê e escreve.

## Fluxo

```
/                      landing (hero, como funciona, o que recebe, CTA)
/diagnostico           contato → perguntas → resultado (client, estado em sessionStorage)
POST /api/leads        valida (zod) → rate limit → honeypot → calcula diagnóstico no servidor
                       → insert Supabase → POST webhook n8n (best-effort, timeout 6s)
```

O diagnóstico aparece na tela na hora (calculado no cliente com a mesma função) e o POST roda em paralelo. O servidor **recalcula** a pontuação a partir das respostas; nunca aceita score vindo do navegador.

## Payload que chega no n8n

```json
{
  "id": "uuid-ou-null",
  "name": "Mariana Souza",
  "email": "m@agencia.com.br",
  "whatsapp": "47999991234",
  "segment": "Multipropriedade / Timeshare",
  "answers": { "role": "socio_fundador", "channels": ["whatsapp", "instagram"], "...": "values crus" },
  "answers_readable": { "role": "Sócio(a) / Fundador(a)", "follow_up": "O consultor lembra e cobra manualmente", "...": "rótulos" },
  "maturity_score": 39, "max_maturity_score": 50, "maturity_pct": 78, "maturity_level": "alta",
  "vendas_score": 14, "atendimento_score": 7, "pos_venda_score": 2,
  "top_sector": "Vendas",
  "solution_timeline": "1_mes", "revenue": "acima_1mi",
  "source": "diagnostico-fredy",
  "diagnosis": { "maturityLabel": "Maturidade alta", "diagnosisText": "...", "nextSteps": ["..."], "ctaText": "...", "ctaLink": "https://wa.me/..." }
}
```

Sugestão de workflow: Webhook (valida o Bearer) → Set (monta card) → WTS `POST /crm/v1/panel/card` no painel de leads do diagnóstico → `PATCH` do `crm_card_id` de volta no Supabase.

## Editar o diagnóstico

- **Perguntas, opções e pesos**: `src/products/<produto>.ts`. Pontuação máxima, cortes dos níveis (62% / 40%) e validação zod são derivados automaticamente.
- **Lógica de pontuação** (comum aos dois): `src/lib/scoring.ts`.

## Segurança (já aplicado)

- Service role só no servidor (`server-only`), RLS sem política pública.
- Validação estrita com zod: só `values` conhecidos passam, corpo máx. 32 KB.
- Rate limit por IP (8 envios / 10 min, em memória). Pra multi-instância, trocar por `@upstash/ratelimit` mantendo a assinatura de `rateLimit()`.
- Honeypot + tempo mínimo de preenchimento (5 s): bots recebem `{ok:true}` e nada é salvo.
- Security headers (nosniff, X-Frame DENY, HSTS, Referrer-Policy), `poweredByHeader` off, source maps off.
- Webhook pro n8n com Bearer e timeout; falha não derruba a resposta pro usuário.

## Deploy (Vercel)

1. Importe o repo, framework Next.js (detectado).
2. Cole as variáveis do `.env.example` em Settings → Environment Variables.
3. Rode a migration no Supabase.
4. Aponte `diagnostico.fredy.app` pro projeto.
