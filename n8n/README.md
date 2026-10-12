# Workflows n8n — Diagnóstico → WTS

- `Diagnostico_Duda_WTS.json` — site da Duda → webhook `/webhook/diagnostico-duda`, etiquetas `Diagnóstico Duda` (contato) e `Duda` + `Diagnóstico Duda` (card)
- `Diagnostico_Fredy_WTS.json` — site do Frédy → webhook `/webhook/diagnostico-fredy`, etiquetas `Diagnóstico Frédy` (contato) e `Frédy` + `Diagnóstico Frédy` (card)

Os dois têm a mesma estrutura (abaixo descrita com a Duda) e apontam pro mesmo painel/etapa. Importe em workflows.tedyleads.com.br (Import from File).

Fluxo: **Webhook** (POST `/webhook/diagnostico-duda`, Header Auth) → **É Duda?** (só `product = duda` segue) → **Montar dados** (Code: telefone `+55…`, título do card, texto da anotação) → **Criar/atualizar contato** (`POST core/v1/contact`, upsert por telefone, etiqueta Diagnóstico Duda) → **Criar card** (`POST crm/v2/panel/card`, etapa Consciência do Funil Comercial - Duda/Frédy, vinculado ao contato) → **Anotar respostas no card** (`POST crm/v1/panel/card/{id}/note`) → *Gravar card_id no Supabase* (desativado; ative quando a tabela `leads` existir).

Depois de importar:
1. Reatribua as credenciais (import não mantém): `WTS API - SDR Duda` nos três HTTP Request; crie `Diagnóstico Duda - Webhook Secret` (Header Auth, Name `Authorization`, Value `Bearer <segredo>`) no Webhook.
2. No Vercel do projeto: `N8N_LEAD_WEBHOOK_URL=https://webhooks.tedyleads.com.br/webhook/diagnostico-duda` (ou `-fredy`) e `N8N_WEBHOOK_SECRET=<o segredo SEM "Bearer">`. A credencial do Webhook no n8n leva `Bearer <segredo>` — e é uma credencial própria, não a do WTS.
3. Ative o workflow e responda o diagnóstico uma vez pra testar.

`montar_dados.js` é o código do nó Code, em arquivo só pra leitura/edição.
