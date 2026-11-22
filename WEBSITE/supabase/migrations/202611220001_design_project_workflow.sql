-- Align project progress with the five weighted design-process tasks.
-- Existing project stages and records are retained and normalized in place.

alter table public.project_stages
  add column if not exists progress numeric(5,2) not null default 0
    check (progress between 0 and 100);

alter table public.project_stages
  drop constraint if exists project_stages_status_check;

update public.project_stages
set
  name = case position
    when 1 then 'Research'
    when 2 then 'Research Reporting'
    when 3 then 'Ideation'
    when 4 then 'Prototyping'
    when 5 then 'Test and Review'
  end,
  stage_key = case position
    when 1 then 'research'
    when 2 then 'research_reporting'
    when 3 then 'ideation'
    when 4 then 'prototyping'
    when 5 then 'test_and_review'
  end,
  weight = 20,
  progress = case status
    when 'Completed' then 100
    when 'In progress' then 66.66
    when 'Planning' then 33.33
    else 0
  end
where position between 1 and 5;

insert into public.project_stages
  (business_id, project_id, name, stage_key, weight, position, status, progress)
select
  project.business_id,
  project.id,
  design_stage.name,
  design_stage.stage_key,
  20,
  design_stage.position,
  'Not started',
  0
from public.projects project
cross join (values
  ('Research', 'research', 1),
  ('Research Reporting', 'research_reporting', 2),
  ('Ideation', 'ideation', 3),
  ('Prototyping', 'prototyping', 4),
  ('Test and Review', 'test_and_review', 5)
) as design_stage(name, stage_key, position)
where not exists (
  select 1
  from public.project_stages existing
  where existing.project_id = project.id
    and existing.position = design_stage.position
);

alter table public.project_stages
  add constraint project_stages_status_check
  check (status in ('Not started', 'Planning', 'In progress', 'Completed'));

create or replace function public.normalize_design_project_stage()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if new.position between 1 and 5 then
    new.name := case new.position
      when 1 then 'Research'
      when 2 then 'Research Reporting'
      when 3 then 'Ideation'
      when 4 then 'Prototyping'
      when 5 then 'Test and Review'
    end;
    new.stage_key := case new.position
      when 1 then 'research'
      when 2 then 'research_reporting'
      when 3 then 'ideation'
      when 4 then 'prototyping'
      when 5 then 'test_and_review'
    end;
    new.weight := 20;
  end if;

  if new.status = 'Completed' or new.progress >= 100 then
    new.status := 'Completed';
    new.progress := 100;
  elsif new.status = 'Planning' then
    new.progress := 33.33;
  elsif new.status = 'In progress' then
    new.progress := 66.66;
  else
    new.status := 'Not started';
    new.progress := 0;
  end if;

  return new;
end;
$$;

drop trigger if exists project_stages_normalize_design_process on public.project_stages;
create trigger project_stages_normalize_design_process
before insert or update of name, stage_key, position, weight, status, progress
on public.project_stages
for each row execute function public.normalize_design_project_stage();

create or replace function public.ensure_project_design_stages()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if not exists (
    select 1 from public.project_stages where project_id = new.id
  ) then
    insert into public.project_stages
      (business_id, project_id, name, stage_key, weight, position, status, progress)
    values
      (new.business_id, new.id, 'Research', 'research', 20, 1, 'Not started', 0),
      (new.business_id, new.id, 'Research Reporting', 'research_reporting', 20, 2, 'Not started', 0),
      (new.business_id, new.id, 'Ideation', 'ideation', 20, 3, 'Not started', 0),
      (new.business_id, new.id, 'Prototyping', 'prototyping', 20, 4, 'Not started', 0),
      (new.business_id, new.id, 'Test and Review', 'test_and_review', 20, 5, 'Not started', 0);
  end if;
  return new;
end;
$$;

drop trigger if exists projects_ensure_design_stages on public.projects;
create constraint trigger projects_ensure_design_stages
after insert on public.projects
deferrable initially deferred
for each row execute function public.ensure_project_design_stages();

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
    else round(coalesce(sum(ps.weight * ps.progress) / 100, 0), 2)
  end
  from public.project_stages ps
  where ps.project_id = p_project_id and ps.active = true
$$;

create or replace function public.sync_project_progress()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_project_id uuid;
  v_progress numeric;
begin
  v_project_id := coalesce(new.project_id, old.project_id);
  v_progress := public.calculate_project_progress(v_project_id);

  update public.projects
  set progress = v_progress,
      status = case
        when v_progress >= 100 then 'Completed'
        when status = 'Completed' and v_progress < 100 then 'Active'
        else status
      end,
      updated_at = now()
  where id = v_project_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists project_stages_sync_progress on public.project_stages;
create trigger project_stages_sync_progress
after insert or update of progress, weight, active or delete on public.project_stages
for each row execute function public.sync_project_progress();
