# Repository Audit

## Architecture

- Static HTML/CSS/vanilla JavaScript application.
- `index.html` is the private BOS; `service.html` is the public services site.
- Supabase JS v2 is loaded from jsDelivr.
- Cloudflare Pages can serve `WEBSITE` directly without a build step.

## Working features preserved

- Supabase password authentication.
- Founder allowlist and RLS boundary.
- Public contact and onboarding submissions to `intake_requests`.
- Existing `bos_records` compatibility.
- Shared Supabase browser configuration.
- Public services page and inquiry form.

## Database dependencies

- The original migration is `202611180001_initial_schema.sql`.
- The relational redesign is additive migration `202611180002_bos_relational_redesign.sql`.
- The frontend detects whether relational tables are available and retains legacy display fallbacks.

## Files preserved

- `service.html`, `service.js`, `supabase-config.js`, public assets, original migration and public-site behavior.
