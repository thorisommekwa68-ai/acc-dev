# Aqua Capricorn Creatives — BOS Redevelopment Status

## Active dashboard

`index.html` serves the BOS with Home, Projects, CRM, and Finances navigation. Home is the landing view and its scrollable carousel shows upcoming meetings, tasks, and recent activity. The former right-side context panel has been removed.

## Baseline audit

The original app is static HTML/CSS/vanilla JavaScript using Supabase Auth and two RLS-protected tables. Existing JSON record shapes, auth/data flows, service-site dependencies, and limitations are documented in [ARCHITECTURE.md](./ARCHITECTURE.md). No database records or production migrations were modified during the audit.

## Current functionality

- Responsive branded dashboard and founder Supabase authentication.
- CRM filters for customers and prospects, client details, relationship type, and service grouping.
- Project workspaces with five 20%-weighted design tasks, Gantt/list views, four task progress states, project meetings, and project history.
- Financial trend and service-revenue summaries, alongside payment and expense records.
- Relational tables are used when migration 002 is applied; the app retains a legacy-data fallback when they are unavailable.

## Validation and deployment

JavaScript syntax, HTML/CSS structure, weighted-progress smoke tests, and Git whitespace checks pass. Apply migration `202611220001_design_project_workflow.sql` after the existing project foundation migration to enable persistent five-task progress. Live Supabase workflows, migration verification in staging, and responsive browser testing remain to be completed.

Keep founder authentication restrictions, RLS policies, the shared public-site config, and the public enquiry flow intact. The relational migrations are additive and must not overwrite or delete existing records.
