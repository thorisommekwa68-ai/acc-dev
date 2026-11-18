# Aqua Capricorn Creatives — BOS Redevelopment Status

## Branch and production protection

Redevelopment is isolated on `bos-redevelopment`. Production `main` remains unchanged. Do not configure production Cloudflare Pages to deploy this branch until the complete redevelopment has passed integration and security checks.

## Baseline audit

The original app is static HTML/CSS/vanilla JavaScript using Supabase Auth and two RLS-protected tables. Existing JSON record shapes, auth/data flows, service-site dependencies, and limitations are documented in [ARCHITECTURE.md](./ARCHITECTURE.md). No database records or production migrations were modified during the audit.

## Redevelopment progress

- Design tokens and responsive app shell: implemented on the development branch.
- Six-section navigation: implemented, with clear placeholders for modules whose functionality is still pending.
- Command Centre: overview remains available; personal workspace, daily priorities, and notifications are wired to the current data model.
- Business Development, expanded Project Operations, Communication, Financial Management, and Administration modules: not yet implemented.

## Validation and deployment

JavaScript syntax and Git whitespace checks are run during each implementation phase. Live Supabase workflows and responsive browser testing remain to be completed before the branch is ready for production.

Keep Supabase auth restrictions, RLS policies, shared public-site config, and the public enquiry flow intact. Database changes must use additive migrations and must not overwrite existing records.
