-- Leads do Diagnóstico Frédy
-- Rode no SQL Editor do Supabase ou via `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- contato
  name               text not null,
  email              text not null,
  whatsapp           text not null,           -- só dígitos, com DDD
  segment            text,

  -- respostas
  answers            jsonb not null,          -- values crus (pra reprocessar)
  answers_readable   jsonb not null,          -- rótulos legíveis (pra CRM/relatório)

  -- diagnóstico (calculado no servidor)
  maturity_score     integer not null,
  max_maturity_score integer not null,
  maturity_pct       integer not null,
  maturity_level     text not null check (maturity_level in ('alta','media','inicial')),
  vendas_score       integer not null default 0,
  atendimento_score  integer not null default 0,
  pos_venda_score    integer not null default 0,
  top_sector         text,
  solution_timeline  text,
  revenue            text,

  -- rastreio
  source             text not null default 'diagnostico-fredy',
  user_agent         text,
  crm_card_id        text                     -- preenchido pelo n8n depois de criar o card
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));
create index if not exists leads_level_idx on public.leads (maturity_level);

-- RLS LIGADO e SEM política pra anon/authenticated:
-- só a service_role (usada no route handler) consegue ler e escrever.
alter table public.leads enable row level security;

revoke all on public.leads from anon, authenticated;

comment on table public.leads is 'Leads capturados pelo Diagnóstico Frédy (diagnostico.fredy.app)';
