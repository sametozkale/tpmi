-- Run in Supabase SQL editor
create table if not exists public.transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tx_id text not null unique,
  metal_name text not null,
  symbol text not null,
  side text not null check (side in ('buy', 'sell')),
  quantity numeric(18, 6) not null check (quantity > 0),
  unit_price numeric(18, 6) not null check (unit_price > 0),
  total_value numeric(18, 6) not null check (total_value >= 0),
  executed_at timestamptz not null,
  status text not null check (status in ('completed', 'pending')),
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_executed_idx
  on public.transactions (user_id, executed_at desc);

alter table public.transactions enable row level security;

-- Required so API requests signed in as `authenticated` can access the table.
grant usage on schema public to authenticated;
grant select, insert on public.transactions to authenticated;
grant usage, select on sequence public.transactions_id_seq to authenticated;

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions
  for select
  using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);
