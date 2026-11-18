create table if not exists public.intake_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'onboarding')),
  name text not null,
  email text not null,
  subject text,
  category text,
  message text,
  business_name text,
  phone text,
  location text,
  industry text,
  services text[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.bos_records (
  id uuid primary key default gen_random_uuid(),
  record_type text not null check (
    record_type in (
      'clients',
      'projects',
      'tasks',
      'meetings',
      'messages',
      'documents',
      'notifications',
      'enquiries',
      'financial_transactions'
    )
  ),
  data jsonb not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists intake_requests_created_at_idx
  on public.intake_requests (created_at desc);
create index if not exists bos_records_type_created_at_idx
  on public.bos_records (record_type, created_at desc);

alter table public.intake_requests enable row level security;
alter table public.bos_records enable row level security;

create or replace function public.is_aqua_founder()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'thorisommekwa68@gmail.com',
    'dkdrougs@gmail.com'
  );
$$;

revoke all on function public.is_aqua_founder() from public, anon;
grant execute on function public.is_aqua_founder() to authenticated;

drop policy if exists "Public can submit intake requests" on public.intake_requests;
create policy "Public can submit intake requests"
  on public.intake_requests for insert
  to anon, authenticated
  with check (
    length(trim(name)) between 1 and 160
    and length(trim(email)) between 3 and 320
    and length(coalesce(message, '')) <= 10000
    and length(coalesce(subject, '')) <= 300
    and length(coalesce(business_name, '')) <= 200
  );

drop policy if exists "Founders can read intake requests" on public.intake_requests;
create policy "Founders can read intake requests"
  on public.intake_requests for select
  to authenticated
  using (public.is_aqua_founder());

drop policy if exists "Founders can manage BOS records" on public.bos_records;
drop policy if exists "Founders can read BOS records" on public.bos_records;
drop policy if exists "Founders can add BOS records" on public.bos_records;
drop policy if exists "Founders can update BOS records" on public.bos_records;
drop policy if exists "Founders can delete BOS records" on public.bos_records;
create policy "Founders can read BOS records"
  on public.bos_records for select
  to authenticated
  using (public.is_aqua_founder());
create policy "Founders can add BOS records"
  on public.bos_records for insert
  to authenticated
  with check (public.is_aqua_founder() and created_by = auth.uid());
create policy "Founders can update BOS records"
  on public.bos_records for update
  to authenticated
  using (public.is_aqua_founder())
  with check (public.is_aqua_founder());
create policy "Founders can delete BOS records"
  on public.bos_records for delete
  to authenticated
  using (public.is_aqua_founder());

grant usage on schema public to anon, authenticated;
grant insert on public.intake_requests to anon, authenticated;
grant select on public.intake_requests to authenticated;
grant select, insert, update, delete on public.bos_records to authenticated;
