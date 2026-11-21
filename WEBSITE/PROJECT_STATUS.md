# Aqua Capricorn Creatives — BOS Redevelopment Status

## Active dashboard

`index.html` now serves the current BOS dashboard, with Inquiries, Project Logging, Clients, and Finances navigation. The older dashboard markup is no longer the active entry page.

## Baseline audit

The original app is static HTML/CSS/vanilla JavaScript using Supabase Auth and two RLS-protected tables. Existing JSON record shapes, auth/data flows, service-site dependencies, and limitations are documented in [ARCHITECTURE.md](./ARCHITECTURE.md). No database records or production migrations were modified during the audit.

## Current functionality

- Responsive branded dashboard and founder Supabase authentication.
- Inquiry filters/details and an acceptance workflow that creates a project through a database function.
- Multi-project list and schedule/Gantt views, editable project budgets and timelines, and project-linked task and meeting management.
- Client directory and financial records views.
- Relational tables are used when migration 002 is applied; the app retains a legacy-data fallback when they are unavailable.

## Validation and deployment

JavaScript syntax and Git whitespace checks pass. Live Supabase workflows, migration verification in staging, and responsive browser testing remain to be completed.

Keep founder authentication restrictions, RLS policies, the shared public-site config, and the public enquiry flow intact. The relational migrations are additive and must not overwrite or delete existing records.
