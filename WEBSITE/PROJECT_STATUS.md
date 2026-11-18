# Aqua Capricorn Creatives — Project Status

## Current implementation

- `index.html` is the private BOS entry point and uses Supabase Auth.
- `service.html` is the public company page; its contact and onboarding forms submit to the same Supabase project.
- Website submissions appear in the authenticated BOS CRM enquiry list.
- BOS records and public intake submissions use PostgreSQL RLS policies from `supabase/migrations/202611180001_initial_schema.sql`.
- Cloudflare Pages serves the static `WEBSITE` directory; deploy instructions are in `README.md`.

## Deployment prerequisites

Before deploying, configure the Supabase project URL and anon/public key in `supabase-config.js`, run the SQL migration, and create/confirm the two founder accounts. The static site does not require or accept a Supabase service-role key.

The site source can be built and served by Cloudflare Pages, but live authentication and database requests require the operator's configured Supabase project and founder accounts.
