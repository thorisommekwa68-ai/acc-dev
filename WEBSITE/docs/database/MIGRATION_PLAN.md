# Migration Plan

## Apply

1. Review `WEBSITE/supabase/migrations/202611180002_bos_relational_redesign.sql`.
2. Take a Supabase backup and verify the migration on a staging project first.
3. Open Supabase Dashboard → SQL Editor.
4. Paste the complete file and run it once.
5. Run `WEBSITE/supabase/migrations/202611180003_fix_membership_rls_helper.sql`.
6. Confirm new tables in Table Editor.
7. Confirm RLS is enabled and policies exist.
8. Confirm the Aqua business and founder memberships are present.

## Dependencies

Run this migration after `202611180001_initial_schema.sql`. The migration intentionally does not change or delete existing `bos_records` or `intake_requests`.

## Rollback

Do not roll back by dropping tables because that could destroy newly created business data. Revert the migration in a staging environment or disable RLS/policies only after taking a backup. Frontend rollback can use Git to return to the prior commit.
