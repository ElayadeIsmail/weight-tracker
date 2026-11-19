create table if not exists public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null default (timezone('utc', now())::date),
  dish_name text not null,
  serving text,
  items text,
  calories_kcal numeric(7,1) not null,
  protein_g numeric(6,1) not null default 0,
  carbohydrates_g numeric(6,1) not null default 0,
  fat_g numeric(6,1) not null default 0,
  fiber_g numeric(6,1) not null default 0,
  confidence numeric(3,2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists meal_entries_user_entry_date_idx
on public.meal_entries (user_id, entry_date desc);

drop trigger if exists meal_entries_updated_at on public.meal_entries;

create trigger meal_entries_updated_at
before update on public.meal_entries
for each row
execute function public.set_updated_at();

alter table public.meal_entries enable row level security;

grant select, insert, update, delete on table public.meal_entries to authenticated;
grant all on table public.meal_entries to service_role;

drop policy if exists "Meal entries are viewable by owner" on public.meal_entries;
create policy "Meal entries are viewable by owner"
on public.meal_entries
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Meal entries are insertable by owner" on public.meal_entries;
create policy "Meal entries are insertable by owner"
on public.meal_entries
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Meal entries are updatable by owner" on public.meal_entries;
create policy "Meal entries are updatable by owner"
on public.meal_entries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Meal entries are deletable by owner" on public.meal_entries;
create policy "Meal entries are deletable by owner"
on public.meal_entries
for delete
to authenticated
using (auth.uid() = user_id);
