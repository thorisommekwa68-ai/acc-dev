# Testing Report

## Automated checks completed

- JavaScript syntax checked with `node --check` for `app.js` and `service.js`.
- Git whitespace validation passed.
- Repository branch and working tree reviewed.

## Manual verification required

- Apply the migration only in a Supabase staging project first.
- Verify public `intake_requests` submissions.
- Verify founder sign-in and session restoration.
- Verify responsive desktop, tablet and mobile navigation.
- Verify each inquiry filter and acceptance workflow.
- Verify only one project is created when acceptance is repeated.
- Verify weighted project progress after stage changes.
- Verify invoice partial-payment allocation and currency checks.
- Verify unauthenticated and cross-business RLS boundaries.

## Known migration dependency

No database migration was executed during implementation. The frontend intentionally shows migration-required warnings and retains the existing legacy data view until Supabase tables are available.
