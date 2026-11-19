-- Avoid RLS recursion when membership policies call this helper.
-- Safe to apply after 202611180002, including when that migration was already run.
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
