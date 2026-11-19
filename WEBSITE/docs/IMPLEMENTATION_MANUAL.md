# Aqua Capricorn BOS Implementation Manual

## 1. Review and apply the database migration

1. Open `WEBSITE/supabase/migrations/202611180002_bos_relational_redesign.sql`.
2. Review the complete SQL.
3. Open the Supabase project dashboard.
4. Choose **SQL Editor**.
5. Create a new query.
6. Copy the complete migration file and paste it into the editor.
7. Click **Run**.
8. Do not run it in production until a staging test has passed.
9. Run `202611180003_fix_membership_rls_helper.sql` after migration 002. It is safe to run whether migration 002 is newly applied or was already applied.

Confirm the new tables under **Table Editor**. Confirm RLS is enabled on each business-owned table and confirm policies are visible under the table policy view.

## 2. Confirm authentication and memberships

Keep public sign-ups disabled. Ensure the founder users exist under **Authentication → Users**:

- `thorisommekwa68@gmail.com`
- `dkdrougs@gmail.com`

Confirm `business_members` contains both users with `owner` role and `active` status.

## 3. Test locally

From the repository root:

```bash
cd WEBSITE
python3 -m http.server 4173
```

Open `http://localhost:4173/`. Supabase Auth requires a browser HTTP origin rather than `file://`.

## 4. Commit and push

Review changes, then commit and push the development branch:

```bash
git status
git add WEBSITE
git commit -m "Redesign BOS around core business modules"
git push origin bos-redevelopment
```

The repository's existing `Co-authored-by` commit convention should be used for agent-authored commits.

## 5. Deploy

Do not change the production Cloudflare Pages branch until Supabase migration and browser tests pass. The `WEBSITE` directory remains the Cloudflare Pages output directory and no build command is required.

## 6. Roll back frontend changes

Identify the previous commit and return to it only with an explicitly reviewed Git operation:

```bash
git --no-pager log --oneline -5
git switch bos-redevelopment
git revert <commit-id>
git push origin bos-redevelopment
```

Do not drop database tables as rollback. Preserve relational records and restore frontend code separately.

## 7. Common errors

- **Supabase table not found:** apply migration `202611180002_bos_relational_redesign.sql`.
- **No active business membership:** confirm the Supabase user exists in `business_members`.
- **RLS blocks access:** confirm active status and role permissions.
- **Inquiry acceptance is blocked:** confirm an active membership and apply the migration.
- **Public form fails:** preserve the original `intake_requests` insert policy and publishable key.
