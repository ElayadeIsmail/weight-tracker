alter table public.profiles
  add column if not exists sex text,
  add column if not exists birth_date date,
  add column if not exists activity_level text,
  add column if not exists calorie_target_kcal numeric(7,1);

alter table public.profiles
  drop constraint if exists profiles_sex_check;

alter table public.profiles
  add constraint profiles_sex_check
  check (sex is null or sex in ('male', 'female'));

alter table public.profiles
  drop constraint if exists profiles_activity_level_check;

alter table public.profiles
  add constraint profiles_activity_level_check
  check (
    activity_level is null
    or activity_level in (
      'sedentary',
      'lightly_active',
      'moderately_active',
      'very_active',
      'extra_active'
    )
  );

alter table public.profiles
  drop constraint if exists profiles_calorie_target_kcal_check;

alter table public.profiles
  add constraint profiles_calorie_target_kcal_check
  check (
    calorie_target_kcal is null
    or (
      calorie_target_kcal >= 800
      and calorie_target_kcal <= 10000
    )
  );

alter table public.profiles
  drop constraint if exists profiles_birth_date_check;

alter table public.profiles
  add constraint profiles_birth_date_check
  check (
    birth_date is null
    or (
      birth_date >= date '1900-01-01'
      and birth_date <= (timezone('utc', now())::date)
    )
  );
