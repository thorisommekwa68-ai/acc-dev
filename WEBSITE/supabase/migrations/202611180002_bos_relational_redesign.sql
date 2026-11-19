-- Aqua Capricorn BOS relational redesign
-- Additive migration: preserves bos_records and intake_requests.
-- Execute manually in Supabase SQL Editor. Do not run against production without review.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'Africa/Johannesburg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  default_currency char(3) not null default 'ZAR',
  timezone text not null default 'Africa/Johannesburg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  role_name text not null check (role_name in ('owner', 'administrator', 'operator', 'finance', 'viewer')),
  can_manage_business boolean not null default false,
  can_manage_members boolean not null default false,
  can_manage_inquiries boolean not null default true,
  can_manage_projects boolean not null default true,
  can_manage_clients boolean not null default true,
  can_manage_finance boolean not null default false,
  unique (business_id, role_name)
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_name text not null check (role_name in ('owner', 'administrator', 'operator', 'finance', 'viewer')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  joined_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create table if not exists public.business_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);

create table if not exists public.business_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  default_currency char(3) not null default 'ZAR',
  accounting_basis text not null default 'cash' check (accounting_basis in ('cash', 'accrual')),
  bank_balance numeric(14,2),
  bank_balance_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  business_name text,
  client_type text not null default 'One-off' check (client_type in ('One-off', 'Recurring', 'Subscription')),
  email text,
  telephone text,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  acquisition_source text,
  first_acquired_at timestamptz,
  subscription_status text check (subscription_status in ('None', 'Active', 'Paused', 'Cancelled')),
  subscription_start_date date,
  subscription_end_date date,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text,
  email text,
  telephone text,
  role text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  reference text not null,
  client_id uuid references public.clients(id) on delete set null,
  contact_name text not null,
  email text,
  telephone text,
  requested_service text,
  description text,
  source text not null default 'Website',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Awaiting information', 'Under review', 'Accepted', 'Declined', 'Archived')),
  legacy_intake_id uuid references public.intake_requests(id) on delete set null,
  received_at timestamptz not null default now(),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, reference),
  unique (legacy_intake_id)
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid,
  reference text not null,
  status text not null default 'Draft' check (status in ('Draft', 'Sent', 'Accepted', 'Declined', 'Expired')),
  currency char(3) not null default 'ZAR',
  subtotal numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  issue_date date,
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, reference)
);

create table if not exists public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  description text not null,
  quantity numeric(14,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  inquiry_id uuid unique references public.enquiries(id) on delete set null,
  name text not null,
  reference text not null,
  service_category text not null check (service_category in ('App Development', 'Website Development', 'Automation', 'Design and Branding', 'Graphic Design', 'Digital Services', 'Other')),
  description text,
  requirements text,
  budget numeric(14,2) not null default 0,
  initial_expenditure_estimate numeric(14,2) not null default 0,
  currency char(3) not null default 'ZAR',
  status text not null default 'Planning' check (status in ('Planning', 'Active', 'On hold', 'Completed', 'Cancelled')),
  start_date date,
  deadline date,
  progress numeric(5,2) not null default 0 check (progress between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, reference)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'quotations_project_fk'
      and conrelid = 'public.quotations'::regclass
  ) then
    alter table public.quotations
      add constraint quotations_project_fk
      foreign key (project_id) references public.projects(id) on delete set null;
  end if;
end $$;

create table if not exists public.project_stages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  stage_key text,
  weight numeric(5,2) not null default 0 check (weight between 0 and 100),
  position integer not null default 0,
  status text not null default 'Not started' check (status in ('Not started', 'In progress', 'Completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.project_stage_notes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  stage_id uuid not null references public.project_stages(id) on delete cascade,
  note text not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  start_date date,
  due_date date,
  status text not null default 'Not started' check (status in ('Not started', 'In progress', 'Blocked', 'Completed')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  notes text,
  assignee_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'Pending',
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  storage_path text,
  mime_type text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  project_id uuid references public.projects(id) on delete set null,
  reference text not null,
  status text not null default 'Draft' check (status in ('Draft', 'Issued', 'Partially paid', 'Paid', 'Overdue', 'Cancelled')),
  currency char(3) not null default 'ZAR',
  issue_date date,
  due_date date,
  subtotal numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, reference)
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(14,2) not null default 1,
  unit_price numeric(14,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  reference text not null,
  amount numeric(14,2) not null check (amount > 0),
  currency char(3) not null default 'ZAR',
  payment_method text,
  payment_date date not null,
  status text not null default 'Recorded' check (status in ('Recorded', 'Reversed')),
  created_at timestamptz not null default now(),
  unique (business_id, reference)
);

create table if not exists public.invoice_payments (
  invoice_id uuid not null references public.invoices(id) on delete restrict,
  payment_id uuid not null references public.payments(id) on delete restrict,
  business_id uuid not null references public.businesses(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  allocated_at timestamptz not null default now(),
  primary key (invoice_id, payment_id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  reference text not null,
  description text not null,
  category text not null check (category in ('Project production', 'Materials', 'Software', 'Marketing', 'Transport', 'Subscriptions', 'Equipment', 'Administrative', 'Other')),
  amount numeric(14,2) not null check (amount >= 0),
  currency char(3) not null default 'ZAR',
  expense_date date not null,
  payment_status text not null default 'Recorded' check (payment_status in ('Recorded', 'Paid', 'Unpaid')),
  supplier text,
  supporting_document_reference text,
  created_at timestamptz not null default now(),
  unique (business_id, reference)
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Safe permission helpers
create or replace function public.is_active_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = p_business_id
      and bm.user_id = auth.uid()
      and bm.status = 'active'
  );
$$;
revoke all on function public.is_active_business_member(uuid) from public, anon;
grant execute on function public.is_active_business_member(uuid) to authenticated;

create or replace function public.has_business_permission(p_business_id uuid, p_permission text)
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select case
    when p_permission = 'manage_finance' then coalesce((
      select rp.can_manage_finance
      from public.business_members bm
      join public.role_permissions rp
        on rp.business_id = bm.business_id and rp.role_name = bm.role_name
      where bm.business_id = p_business_id
        and bm.user_id = auth.uid()
        and bm.status = 'active'
    ), false)
    when p_permission = 'manage_inquiries' then coalesce((
      select rp.can_manage_inquiries
      from public.business_members bm
      join public.role_permissions rp
        on rp.business_id = bm.business_id and rp.role_name = bm.role_name
      where bm.business_id = p_business_id
        and bm.user_id = auth.uid()
        and bm.status = 'active'
    ), false)
    when p_permission = 'manage_projects' then coalesce((
      select rp.can_manage_projects
      from public.business_members bm
      join public.role_permissions rp
        on rp.business_id = bm.business_id and rp.role_name = bm.role_name
      where bm.business_id = p_business_id
        and bm.user_id = auth.uid()
        and bm.status = 'active'
    ), false)
    when p_permission = 'manage_clients' then coalesce((
      select rp.can_manage_clients
      from public.business_members bm
      join public.role_permissions rp
        on rp.business_id = bm.business_id and rp.role_name = bm.role_name
      where bm.business_id = p_business_id
        and bm.user_id = auth.uid()
        and bm.status = 'active'
    ), false)
    else public.is_active_business_member(p_business_id)
  end;
$$;

create or replace function public.calculate_project_progress(p_project_id uuid)
returns numeric
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select coalesce(sum(case when ps.status = 'Completed' then ps.weight else 0 end), 0)
  from public.project_stages ps
  where ps.project_id = p_project_id;
$$;

create or replace function public.calculate_invoice_balance(p_invoice_id uuid)
returns numeric
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select greatest(
    coalesce((select i.total from public.invoices i where i.id = p_invoice_id), 0)
    - coalesce((select sum(ip.amount) from public.invoice_payments ip where ip.invoice_id = p_invoice_id), 0),
    0
  );
$$;

-- Atomic inquiry acceptance. Repeated calls are duplicate-safe.
create or replace function public.accept_enquiry_as_project(
  p_enquiry_id uuid,
  p_project_name text,
  p_client_id uuid,
  p_service_category text,
  p_description text,
  p_budget numeric,
  p_currency char(3),
  p_start_date date,
  p_deadline date,
  p_requirements text default null,
  p_initial_expenditure_estimate numeric default 0,
  p_notes text default null
) returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_business_id uuid;
  v_project_id uuid;
  v_reference text;
begin
  select e.business_id into v_business_id
  from public.enquiries e
  where e.id = p_enquiry_id
    and public.has_business_permission(e.business_id, 'manage_inquiries');

  if v_business_id is null then
    raise exception 'Inquiry not found or access denied';
  end if;
  if p_budget is null or p_budget < 0 then
    raise exception 'Budget must be zero or greater';
  end if;
  if p_initial_expenditure_estimate is null or p_initial_expenditure_estimate < 0 then
    raise exception 'Initial expenditure estimate must be zero or greater';
  end if;

  select pr.id into v_project_id
  from public.projects pr
  where pr.inquiry_id = p_enquiry_id;

  if v_project_id is not null then
    return v_project_id;
  end if;

  v_reference := 'PRJ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.projects (
    business_id, client_id, inquiry_id, name, reference, service_category,
    description, requirements, budget, initial_expenditure_estimate, currency,
    status, start_date, deadline, progress, notes
  ) values (
    v_business_id, p_client_id, p_enquiry_id, btrim(p_project_name), v_reference, p_service_category,
    p_description, p_requirements, p_budget, p_initial_expenditure_estimate, coalesce(p_currency, 'ZAR'),
    'Planning', p_start_date, p_deadline, 0, p_notes
  )
  returning id into v_project_id;

  insert into public.project_stages (business_id, project_id, name, stage_key, weight, position, status)
  values
    (v_business_id, v_project_id, 'Working on the Problem', 'problem_definition', 20, 1, 'Not started'),
    (v_business_id, v_project_id, 'Research', 'research', 20, 2, 'Not started'),
    (v_business_id, v_project_id, 'Ideation', 'ideation', 20, 3, 'Not started'),
    (v_business_id, v_project_id, 'Prototyping', 'prototyping', 20, 4, 'Not started'),
    (v_business_id, v_project_id, 'Evaluation', 'evaluation', 20, 5, 'Not started');

  update public.enquiries
  set status = 'Accepted', updated_at = now()
  where id = p_enquiry_id;

  insert into public.activity_logs (business_id, user_id, entity_type, entity_id, action, details)
  values (v_business_id, auth.uid(), 'project', v_project_id, 'created_from_enquiry',
    jsonb_build_object('inquiry_id', p_enquiry_id));

  return v_project_id;
end;
$$;

create or replace function public.allocate_invoice_payment(
  p_payment_id uuid,
  p_invoice_id uuid,
  p_amount numeric
) returns void
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_business_id uuid;
  v_payment_amount numeric;
  v_payment_currency char(3);
  v_invoice_currency char(3);
  v_allocated numeric;
  v_invoice_total numeric;
  v_invoice_paid numeric;
begin
  select p.business_id, p.amount, p.currency
    into v_business_id, v_payment_amount, v_payment_currency
  from public.payments p
  where p.id = p_payment_id;
  if v_business_id is null or not public.has_business_permission(v_business_id, 'manage_finance') then
    raise exception 'Payment not found or access denied';
  end if;

  select i.currency, i.total
    into v_invoice_currency, v_invoice_total
  from public.invoices i
  where i.id = p_invoice_id and i.business_id = v_business_id;
  if v_invoice_currency is null then
    raise exception 'Invoice not found';
  end if;
  if v_payment_currency <> v_invoice_currency then
    raise exception 'Payment and invoice currencies do not match';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Allocation amount must be positive';
  end if;

  select coalesce(sum(ip.amount), 0) into v_allocated
  from public.invoice_payments ip where ip.payment_id = p_payment_id;
  if v_allocated + p_amount > v_payment_amount then
    raise exception 'Payment allocation exceeds available payment amount';
  end if;

  select coalesce(sum(ip.amount), 0) into v_invoice_paid
  from public.invoice_payments ip where ip.invoice_id = p_invoice_id;
  if v_invoice_paid + p_amount > v_invoice_total then
    raise exception 'Payment allocation exceeds invoice balance';
  end if;

  insert into public.invoice_payments (invoice_id, payment_id, business_id, amount)
  values (p_invoice_id, p_payment_id, v_business_id, p_amount)
  on conflict (invoice_id, payment_id) do update
  set amount = public.invoice_payments.amount + excluded.amount;

  update public.invoices i
  set status = case
        when coalesce((select sum(ip.amount) from public.invoice_payments ip where ip.invoice_id = i.id), 0) >= i.total then 'Paid'
        else 'Partially paid'
      end,
      updated_at = now()
  where i.id = p_invoice_id;
end;
$$;

-- Recalculate weighted project progress when stages change.
create or replace function public.sync_project_progress()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  update public.projects
  set progress = public.calculate_project_progress(coalesce(new.project_id, old.project_id)),
      updated_at = now()
  where id = coalesce(new.project_id, old.project_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists project_stages_sync_progress on public.project_stages;
create trigger project_stages_sync_progress
after insert or update of status, weight or delete on public.project_stages
for each row execute function public.sync_project_progress();

-- Stage weights must sum to 100 where stages are configured.
create or replace function public.validate_project_stage_weights()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_total numeric;
begin
  select coalesce(sum(weight), 0) into v_total
  from public.project_stages
  where project_id = coalesce(new.project_id, old.project_id);
  if v_total > 100.01 then
    raise exception 'Project stage weights cannot exceed 100 percent';
  end if;
  return coalesce(new, old);
end;
$$;
drop trigger if exists project_stages_validate_weights on public.project_stages;
create trigger project_stages_validate_weights
after insert or update of weight or delete on public.project_stages
for each row execute function public.validate_project_stage_weights();

-- Indexes for operational lists and financial joins.
create index if not exists enquiries_business_status_received_idx on public.enquiries (business_id, status, received_at desc);
create index if not exists clients_business_status_idx on public.clients (business_id, status);
create index if not exists projects_business_status_deadline_idx on public.projects (business_id, status, deadline);
create index if not exists project_stages_project_position_idx on public.project_stages (project_id, position);
create index if not exists tasks_business_project_due_idx on public.tasks (business_id, project_id, due_date);
create index if not exists meetings_business_start_idx on public.meetings (business_id, start_at);
create index if not exists invoices_business_status_due_idx on public.invoices (business_id, status, due_date);
create index if not exists payments_business_date_idx on public.payments (business_id, payment_date desc);
create index if not exists expenses_business_date_idx on public.expenses (business_id, expense_date desc);
create index if not exists invoice_payments_payment_idx on public.invoice_payments (payment_id);
create index if not exists activity_logs_business_created_idx on public.activity_logs (business_id, created_at desc);

-- Seed the Aqua business and role matrix safely and once.
insert into public.businesses (name, slug, default_currency)
values ('Aqua Capricorn Creatives', 'aqua-capricorn-creatives', 'ZAR')
on conflict (slug) do nothing;

insert into public.business_settings (business_id)
select id from public.businesses where slug = 'aqua-capricorn-creatives'
on conflict (business_id) do nothing;

insert into public.role_permissions (
  business_id, role_name, can_manage_business, can_manage_members,
  can_manage_inquiries, can_manage_projects, can_manage_clients, can_manage_finance
)
select b.id, r.role_name, r.can_manage_business, r.can_manage_members,
       r.can_manage_inquiries, r.can_manage_projects, r.can_manage_clients, r.can_manage_finance
from public.businesses b
cross join (
  values
    ('owner', true, true, true, true, true, true),
    ('administrator', true, true, true, true, true, true),
    ('operator', false, false, true, true, true, false),
    ('finance', false, false, false, false, true, true),
    ('viewer', false, false, false, false, false, false)
) r(role_name, can_manage_business, can_manage_members, can_manage_inquiries, can_manage_projects, can_manage_clients, can_manage_finance)
where b.slug = 'aqua-capricorn-creatives'
on conflict (business_id, role_name) do nothing;

insert into public.business_members (business_id, user_id, role_name, status)
select b.id, u.id, 'owner', 'active'
from public.businesses b
join auth.users u on lower(u.email) in (
  'thorisommekwa68@gmail.com',
  'dkdrougs@gmail.com'
)
where b.slug = 'aqua-capricorn-creatives'
on conflict (business_id, user_id) do update set role_name = 'owner', status = 'active';

insert into public.profiles (id, display_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', u.email)
from auth.users u
join public.business_members bm on bm.user_id = u.id
on conflict (id) do nothing;

-- Enable RLS on all business-owned tables.
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.role_permissions enable row level security;
alter table public.business_members enable row level security;
alter table public.business_services enable row level security;
alter table public.business_settings enable row level security;
alter table public.clients enable row level security;
alter table public.client_contacts enable row level security;
alter table public.enquiries enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.project_stage_notes enable row level security;
alter table public.project_milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.deliverables enable row level security;
alter table public.documents enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.invoice_payments enable row level security;
alter table public.expenses enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles are private except for the owner and business members.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
for select to authenticated using (id = auth.uid());
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Business and membership policies.
drop policy if exists "Members can view businesses" on public.businesses;
create policy "Members can view businesses" on public.businesses
for select to authenticated using (public.is_active_business_member(id));

drop policy if exists "Members can view role permissions" on public.role_permissions;
create policy "Members can view role permissions" on public.role_permissions
for select to authenticated using (public.is_active_business_member(business_id));

drop policy if exists "Members can view business members" on public.business_members;
create policy "Members can view business members" on public.business_members
for select to authenticated using (public.is_active_business_member(business_id));

-- Generic policies for operational tables.
do $$
declare
  v_table text;
begin
  foreach v_table in array array[
    'business_services','business_settings','clients','client_contacts','enquiries',
    'quotations','quotation_items','projects','project_stages','project_stage_notes',
    'project_milestones','tasks','meetings','deliverables','documents','invoices',
    'invoice_items','payments','invoice_payments','expenses','activity_logs'
  ] loop
    execute format('drop policy if exists "Members read %1$s" on public.%1$s', v_table);
    execute format('create policy "Members read %1$s" on public.%1$s for select to authenticated using (public.is_active_business_member(business_id))', v_table);
    execute format('drop policy if exists "Members insert %1$s" on public.%1$s', v_table);
    execute format('create policy "Members insert %1$s" on public.%1$s for insert to authenticated with check (public.is_active_business_member(business_id))', v_table);
    execute format('drop policy if exists "Members update %1$s" on public.%1$s', v_table);
    execute format('create policy "Members update %1$s" on public.%1$s for update to authenticated using (public.is_active_business_member(business_id)) with check (public.is_active_business_member(business_id))', v_table);
    execute format('drop policy if exists "Members delete %1$s" on public.%1$s', v_table);
    execute format('create policy "Members delete %1$s" on public.%1$s for delete to authenticated using (public.is_active_business_member(business_id))', v_table);
  end loop;
end $$;

-- Finance tables require explicit finance permission.
do $$
declare
  v_table text;
begin
  foreach v_table in array array[
    'quotations','invoice_items','invoices','payments','invoice_payments','expenses'
  ] loop
    execute format('drop policy if exists "Members read %1$s" on public.%1$s', v_table);
    execute format('drop policy if exists "Members insert %1$s" on public.%1$s', v_table);
    execute format('drop policy if exists "Members update %1$s" on public.%1$s', v_table);
    execute format('drop policy if exists "Members delete %1$s" on public.%1$s', v_table);
    execute format('create policy "Finance users read %1$s" on public.%1$s for select to authenticated using (public.has_business_permission(business_id, ''manage_finance''))', v_table);
    execute format('create policy "Finance users insert %1$s" on public.%1$s for insert to authenticated with check (public.has_business_permission(business_id, ''manage_finance''))', v_table);
    execute format('create policy "Finance users update %1$s" on public.%1$s for update to authenticated using (public.has_business_permission(business_id, ''manage_finance'')) with check (public.has_business_permission(business_id, ''manage_finance''))', v_table);
  end loop;
end $$;

revoke all on function public.accept_enquiry_as_project(uuid,text,uuid,text,text,numeric,char,date,date,text,numeric,text) from public, anon;
grant execute on function public.accept_enquiry_as_project(uuid,text,uuid,text,text,numeric,char,date,date,text,numeric,text) to authenticated;
revoke all on function public.allocate_invoice_payment(uuid,uuid,numeric) from public, anon;
grant execute on function public.allocate_invoice_payment(uuid,uuid,numeric) to authenticated;

grant usage on schema public to anon, authenticated;
