-- Project management enhancement: weighted tasks, allocations, progress history,
-- meeting lifecycle and actual-completion tracking. Additive and reversible.

alter table public.projects
  add column if not exists actual_completion_date date;

alter table public.project_stages
  add column if not exists active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

alter table public.tasks
  add column if not exists stage_id uuid references public.project_stages(id) on delete restrict,
  add column if not exists weight numeric(5,2) not null default 0
    check (weight between 0 and 100),
  add column if not exists progress numeric(5,2) not null default 0
    check (progress between 0 and 100),
  add column if not exists position integer not null default 0;

create table if not exists public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  allocation_share numeric(5,2) not null default 100
    check (allocation_share between 0 and 100),
  created_at timestamptz not null default now(),
  unique (task_id, user_id)
);

create table if not exists public.task_progress_history (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  previous_progress numeric(5,2) not null check (previous_progress between 0 and 100),
  new_progress numeric(5,2) not null check (new_progress between 0 and 100),
  progress_change numeric(7,2) generated always as (new_progress - previous_progress) stored,
  created_at timestamptz not null default now()
);

alter table public.meetings
  add column if not exists status text not null default 'Scheduled'
    check (status in ('Scheduled', 'Completed', 'Cancelled')),
  add column if not exists cancelled_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.meeting_attendees (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  attendee_name text,
  created_at timestamptz not null default now(),
  unique (meeting_id, user_id),
  check (user_id is not null or length(trim(coalesce(attendee_name, ''))) > 0)
);

create index if not exists tasks_project_stage_position_idx
  on public.tasks(project_id, stage_id, position);
create index if not exists task_assignments_user_task_idx
  on public.task_assignments(user_id, task_id);
create index if not exists task_progress_history_task_created_idx
  on public.task_progress_history(task_id, created_at desc);
create index if not exists meeting_attendees_meeting_idx
  on public.meeting_attendees(meeting_id);

alter table public.task_assignments enable row level security;
alter table public.task_progress_history enable row level security;
alter table public.meeting_attendees enable row level security;

do $$
declare v_table text;
begin
  foreach v_table in array array['task_assignments','task_progress_history','meeting_attendees'] loop
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

-- Replace the status-only project progress cache with weighted task/stage logic.
create or replace function public.calculate_stage_progress(p_stage_id uuid)
returns numeric
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select case
    when coalesce(sum(t.weight), 0) = 0 then 0
    when abs(coalesce(sum(t.weight), 0) - 100) > 0.01 then 0
    else round(coalesce(sum(t.weight * t.progress) / 100, 0), 2)
  end
  from public.tasks t
  where t.stage_id = p_stage_id
$$;

create or replace function public.calculate_project_progress(p_project_id uuid)
returns numeric
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select case
    when coalesce(sum(ps.weight), 0) = 0 then 0
    when abs(coalesce(sum(ps.weight), 0) - 100) > 0.01 then 0
    else round(coalesce(sum(ps.weight * public.calculate_stage_progress(ps.id)) / 100, 0), 2)
  end
  from public.project_stages ps
  where ps.project_id = p_project_id and ps.active = true
$$;

create or replace function public.validate_task_weight()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare v_total numeric;
begin
  if new.stage_id is null then
    return new;
  end if;
  select coalesce(sum(weight), 0) into v_total
  from public.tasks
  where stage_id = new.stage_id and id <> new.id;
  if v_total + coalesce(new.weight, 0) > 100.01 then
    raise exception 'Task weights in a stage cannot exceed 100 percent';
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_validate_weight on public.tasks;
create trigger tasks_validate_weight
before insert or update of weight, stage_id on public.tasks
for each row execute function public.validate_task_weight();

create or replace function public.sync_task_progress()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_project_id uuid;
begin
  v_project_id := coalesce(new.project_id, old.project_id);
  if tg_op = 'UPDATE' and coalesce(old.progress, 0) <> coalesce(new.progress, 0) then
    insert into public.task_progress_history
      (business_id, task_id, actor_user_id, previous_progress, new_progress)
    values
      (coalesce(new.business_id, old.business_id), coalesce(new.id, old.id), auth.uid(),
       coalesce(old.progress, 0), coalesce(new.progress, 0));
  end if;
  update public.projects
  set progress = public.calculate_project_progress(v_project_id), updated_at = now()
  where id = v_project_id;
  return coalesce(new, old);
end;
$$;

drop trigger if exists tasks_sync_progress on public.tasks;
create trigger tasks_sync_progress
after insert or update of progress, weight, stage_id or delete on public.tasks
for each row execute function public.sync_task_progress();

create or replace function public.validate_stage_weights()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare v_total numeric;
begin
  select coalesce(sum(weight), 0) into v_total
  from public.project_stages
  where project_id = coalesce(new.project_id, old.project_id) and active = true;
  if v_total > 100.01 then
    raise exception 'Project stage weights cannot exceed 100 percent';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists project_stages_validate_weights on public.project_stages;
create trigger project_stages_validate_weights
after insert or update of weight, active or delete on public.project_stages
for each row execute function public.validate_stage_weights();

-- Task completion remains progress/status consistent.
create or replace function public.normalize_task_completion()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if new.progress >= 100 then
    new.progress := 100;
    new.status := 'Completed';
  elsif new.status = 'Completed' then
    new.progress := 100;
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_normalize_completion on public.tasks;
create trigger tasks_normalize_completion
before insert or update of progress, status on public.tasks
for each row execute function public.normalize_task_completion();

create or replace function public.normalize_project_completion()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if new.status = 'Completed' then
    new.actual_completion_date := coalesce(new.actual_completion_date, current_date);
  elsif old.status = 'Completed' and new.status <> 'Completed' then
    new.actual_completion_date := null;
  end if;
  return new;
end;
$$;

drop trigger if exists projects_normalize_completion on public.projects;
create trigger projects_normalize_completion
before insert or update of status, progress on public.projects
for each row execute function public.normalize_project_completion();
