create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  height_cm numeric(5,1) not null default 170,
  goal_weight_kg numeric(5,1) not null default 70,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);


create table if not exists public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  weight_kg numeric(5,1) not null,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint weight_entries_user_date_unique
    unique (user_id, entry_date)
);

create index if not exists weight_entries_user_entry_date_idx
on public.weight_entries (user_id, entry_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists weight_entries_updated_at on public.weight_entries;

create trigger weight_entries_updated_at
before update on public.weight_entries
for each row
execute function public.set_updated_at();



alter table public.profiles enable row level security;
alter table public.weight_entries enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Weight entries are viewable by owner" on public.weight_entries;
create policy "Weight entries are viewable by owner"
on public.weight_entries
for select
using (auth.uid() = user_id);

drop policy if exists "Weight entries are insertable by owner" on public.weight_entries;
create policy "Weight entries are insertable by owner"
on public.weight_entries
for insert
with check (auth.uid() = user_id);

drop policy if exists "Weight entries are updatable by owner" on public.weight_entries;
create policy "Weight entries are updatable by owner"
on public.weight_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Weight entries are deletable by owner" on public.weight_entries;
create policy "Weight entries are deletable by owner"
on public.weight_entries
for delete
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
