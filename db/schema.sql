-- PROOFOFWORK DATABASE

create extension if not exists pgcrypto;

-- 1. STUDENT PROFILES
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text default '',
    username text unique,
    bio text default '',
    skills text[] default '{}',
    is_public boolean default true,
    created_at timestamptz default now()
);

-- 2. PORTFOLIO ENTRIES
create table public.portfolio_entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    title text not null,
    description text,
    evidence_url text,
    entry_type text default 'Project',
    evidence_status text default 'Self-reported'
        check (evidence_status in ('Self-reported', 'Evidence linked')),
    created_at timestamptz default now()
);

-- 3. AUTOMATIC PROFILE CREATION
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', '')
    );
    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 4. ENABLE SECURITY
alter table public.profiles enable row level security;
alter table public.portfolio_entries enable row level security;

-- 5. PROFILE POLICIES
create policy "View public profiles"
on public.profiles for select
using (is_public = true or auth.uid() = id);

create policy "Update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- 6. PORTFOLIO POLICIES
create policy "View public portfolio entries"
on public.portfolio_entries for select
using (
    exists (
        select 1 from public.profiles
        where profiles.id = portfolio_entries.user_id
        and (profiles.is_public = true or profiles.id = auth.uid())
    )
);

create policy "Add own entries"
on public.portfolio_entries for insert
with check (auth.uid() = user_id);

create policy "Edit own entries"
on public.portfolio_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Delete own entries"
on public.portfolio_entries for delete
using (auth.uid() = user_id);0

