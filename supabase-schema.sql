create table if not exists public.poke_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.poke_profiles enable row level security;

drop policy if exists "Users can read own PokeColect data" on public.poke_profiles;
create policy "Users can read own PokeColect data"
  on public.poke_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own PokeColect data" on public.poke_profiles;
create policy "Users can insert own PokeColect data"
  on public.poke_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own PokeColect data" on public.poke_profiles;
create policy "Users can update own PokeColect data"
  on public.poke_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
