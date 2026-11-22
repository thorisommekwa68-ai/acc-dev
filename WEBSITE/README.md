# Aqua Capricorn Creatives

This static site has two pages that share one Supabase project:

- `index.html` — private founder Business Operating System (BOS)
- `service.html` — public services page with contact and service-enquiry dialogs

Website form submissions are stored in Supabase and appear in the BOS CRM enquiry list. BOS sign-in and business records use Supabase Auth and PostgreSQL Row Level Security (RLS).

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the audited baseline data model and integration flows, and [PROJECT_STATUS.md](./PROJECT_STATUS.md) for redevelopment progress.

## Configure Supabase

1. Create a Supabase project.
2. In **Project Settings → API**, copy the project URL and the **publishable** key (or legacy anon/public key) into `supabase-config.js`. Never put a secret or `service_role` key in this website.
3. If this project has not yet been initialized, run `supabase/migrations/202611180001_initial_schema.sql`.
4. To enable the current relational BOS workflows, first test and then run, in order, `supabase/migrations/202611180002_bos_relational_redesign.sql`, `supabase/migrations/202611180003_fix_membership_rls_helper.sql`, `supabase/migrations/202611210001_accept_intake_inquiries.sql`, `supabase/migrations/202611210002_project_management_foundation.sql`, and `supabase/migrations/202611220001_design_project_workflow.sql`. The final migration configures five 20%-weighted design tasks, task status progress, and database-calculated project completion. These migrations preserve existing intake and legacy BOS records; do not run against production without review and a backup.
5. Create and confirm the two founder users in **Authentication → Users**:
   - `thorisommekwa68@gmail.com`
   - `dkdrougs@gmail.com`
6. Disable public sign-ups in the Supabase Auth provider settings; create BOS users manually.
7. In **Authentication → URL Configuration**, set the production site URL and add the Cloudflare Pages domain (and any custom domain) to the allowed redirect URLs.

The migration allows anyone to submit a service enquiry but restricts enquiry reads and BOS data to the two founder email addresses above. The public form uses the configured Supabase publishable key; it must not be blocked based on its project URL or key value. Do not remove the RLS policies or expose a service-role key.

If a public enquiry does not appear in Supabase, confirm migration `202611180001_initial_schema.sql` has been run and that the form displays its success confirmation. A failed insert displays the Supabase error in the form instead; migration `202611180003_fix_membership_rls_helper.sql` does not create or grant access to `intake_requests`.

The BOS opens on Home, where a five-second, manually scrollable carousel shows upcoming meetings, the next two tasks, and recent activity. Open Projects to select an entire project workspace, switch its five weighted design tasks between Gantt and list views, update task status, schedule project meetings, and review project history. CRM groups customers and prospects and records one-off or recurring relationships; Finances shows revenue trend and revenue by service.

## Deploy with Cloudflare Pages

Create a Pages project connected to this GitHub repository and use:

- Production branch: `main`
- Build command: leave empty
- Build output directory: `WEBSITE`

The BOS and services page will then be available at `https://<your-domain>/` and `https://<your-domain>/service.html`. The legacy `/services.html` path redirects to `/service.html`. For local testing, serve the repository's `WEBSITE` directory with a static web server; opening the HTML files directly (`file://`) is not supported by Supabase Auth.

## Data notes

The browser stores only interface preferences locally. Enquiries, clients, projects, tasks, meetings, messages, and financial transactions are read from and written to Supabase. Accounts are provisioned in Supabase; there are no demo passwords or public sign-up flow.
