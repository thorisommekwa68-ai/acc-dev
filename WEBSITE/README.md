# Aqua Capricorn Creatives

This static site has two pages that share one Supabase project:

- `index.html` — private founder Business Operating System (BOS)
- `service.html` — public services page with contact and service-enquiry dialogs

Website form submissions are stored in Supabase and appear in the BOS CRM enquiry list. BOS sign-in and business records use Supabase Auth and PostgreSQL Row Level Security (RLS).

## Configure Supabase

1. Create a Supabase project.
2. In **Project Settings → API**, copy the project URL and the **anon/public** key into `supabase-config.js`. Never put a `service_role` key in this website.
3. Run `supabase/migrations/202611180001_initial_schema.sql` in the Supabase SQL Editor.
4. Create and confirm the two founder users in **Authentication → Users**:
   - `thorisommekwa68@gmail.com`
   - `dkdrougs@gmail.com`
5. Disable public sign-ups in the Supabase Auth provider settings; create BOS users manually.
6. In **Authentication → URL Configuration**, set the production site URL and add the Cloudflare Pages domain (and any custom domain) to the allowed redirect URLs.

The migration allows anyone to submit a service enquiry but restricts enquiry reads and BOS data to the two founder email addresses above. Do not remove the RLS policies or expose a service-role key.

## Deploy with Cloudflare Pages

Create a Pages project connected to this GitHub repository and use:

- Production branch: `main`
- Build command: leave empty
- Build output directory: `WEBSITE`

The two pages will then be available at `https://<your-domain>/` and `https://<your-domain>/service.html`. For local testing, serve the repository's `WEBSITE` directory with a static web server; opening the HTML files directly (`file://`) is not supported by Supabase Auth.

## Data notes

The browser stores only interface preferences locally. Enquiries, clients, projects, tasks, meetings, messages, and financial transactions are read from and written to Supabase. Accounts are provisioned in Supabase; there are no demo passwords or public sign-up flow.
