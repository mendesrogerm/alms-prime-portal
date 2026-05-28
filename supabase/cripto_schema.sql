-- ALMS Prime Cripto - estrutura inicial Supabase
-- Execute este arquivo no Supabase SQL Editor.

create table if not exists public.cripto_ativos (
  id uuid primary key default gen_random_uuid(),
  simbolo text not null unique,
  nome text not null,
  ativo boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.cripto_transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ativo_id uuid not null references public.cripto_ativos(id) on delete restrict,
  tipo text not null check (tipo in ('COMPRA', 'VENDA')),
  quantidade numeric not null check (quantidade > 0),
  preco_unitario numeric not null check (preco_unitario > 0),
  moeda_preco text not null default 'BRL' check (moeda_preco in ('BRL', 'USD')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.cripto_historico_precos (
  id uuid primary key default gen_random_uuid(),
  ativo_id uuid not null references public.cripto_ativos(id) on delete cascade,
  preco_fechamento numeric not null check (preco_fechamento >= 0),
  data_registro timestamp with time zone not null,
  created_at timestamp with time zone not null default now()
);

alter table public.cripto_ativos enable row level security;
alter table public.cripto_transacoes enable row level security;
alter table public.cripto_historico_precos enable row level security;

drop policy if exists "Todos autenticados podem ler ativos cripto" on public.cripto_ativos;
create policy "Todos autenticados podem ler ativos cripto"
on public.cripto_ativos
for select
to authenticated
using (true);

drop policy if exists "Todos autenticados podem cadastrar ativos cripto" on public.cripto_ativos;
create policy "Todos autenticados podem cadastrar ativos cripto"
on public.cripto_ativos
for insert
to authenticated
with check (true);

drop policy if exists "Usuario gerencia suas transacoes cripto" on public.cripto_transacoes;
create policy "Usuario gerencia suas transacoes cripto"
on public.cripto_transacoes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Todos autenticados podem ler historico cripto" on public.cripto_historico_precos;
create policy "Todos autenticados podem ler historico cripto"
on public.cripto_historico_precos
for select
to authenticated
using (true);

insert into public.cripto_ativos (simbolo, nome)
values
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('SOL', 'Solana'),
  ('BNB', 'BNB'),
  ('ADA', 'Cardano')
on conflict (simbolo) do nothing;
