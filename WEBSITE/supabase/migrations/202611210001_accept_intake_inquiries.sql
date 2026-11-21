-- Allow the BOS to accept public intake requests that have not yet been linked
-- to a relational enquiry.
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
  v_enquiry_id uuid;
  v_reference text;
  v_intake public.intake_requests%rowtype;
begin
  select e.id, e.business_id
  into v_enquiry_id, v_business_id
  from public.enquiries e
  where (e.id = p_enquiry_id or e.legacy_intake_id = p_enquiry_id)
    and public.has_business_permission(e.business_id, 'manage_inquiries')
  order by (e.id = p_enquiry_id) desc
  limit 1;

  if v_business_id is null then
    select * into v_intake
    from public.intake_requests
    where id = p_enquiry_id;

    if not found then
      raise exception 'Inquiry not found or access denied';
    end if;

    select bm.business_id into v_business_id
    from public.business_members bm
    where bm.user_id = auth.uid()
      and bm.status = 'active'
      and public.has_business_permission(bm.business_id, 'manage_inquiries')
    order by bm.joined_at
    limit 1;

    if v_business_id is null then
      raise exception 'Inquiry not found or access denied';
    end if;

    v_reference := 'ENQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    insert into public.enquiries (
      business_id, reference, client_id, contact_name, email, telephone,
      requested_service, description, source, status, legacy_intake_id, received_at
    ) values (
      v_business_id, v_reference, p_client_id, v_intake.name, v_intake.email, v_intake.phone,
      coalesce(v_intake.services[1], v_intake.category, 'Other'),
      coalesce(v_intake.message, v_intake.details ->> 'message'),
      case when v_intake.kind = 'onboarding' then 'Service onboarding form' else 'Website contact form' end,
      'New', v_intake.id, v_intake.created_at
    )
    on conflict (legacy_intake_id) do update
      set legacy_intake_id = excluded.legacy_intake_id
    returning id, business_id into v_enquiry_id, v_business_id;

    if not public.has_business_permission(v_business_id, 'manage_inquiries') then
      raise exception 'Inquiry not found or access denied';
    end if;
  end if;

  if p_budget is null or p_budget < 0 then
    raise exception 'Budget must be zero or greater';
  end if;
  if p_initial_expenditure_estimate is null or p_initial_expenditure_estimate < 0 then
    raise exception 'Initial expenditure estimate must be zero or greater';
  end if;

  select pr.id into v_project_id
  from public.projects pr
  where pr.inquiry_id = v_enquiry_id;

  if v_project_id is not null then
    return v_project_id;
  end if;

  v_reference := 'PRJ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.projects (
    business_id, client_id, inquiry_id, name, reference, service_category,
    description, requirements, budget, initial_expenditure_estimate, currency,
    status, start_date, deadline, progress, notes
  ) values (
    v_business_id, p_client_id, v_enquiry_id, btrim(p_project_name), v_reference, p_service_category,
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
  where id = v_enquiry_id;

  insert into public.activity_logs (business_id, user_id, entity_type, entity_id, action, details)
  values (v_business_id, auth.uid(), 'project', v_project_id, 'created_from_enquiry',
    jsonb_build_object('inquiry_id', v_enquiry_id));

  return v_project_id;
end;
$$;
