# BOS Baseline Architecture Audit

This document records the application and database behavior observed before the redevelopment. It is a preservation reference, not a description of planned features.

## Runtime and deployment

- The application is static HTML, CSS, and vanilla JavaScript; there is no package manifest or build step.
- Cloudflare Pages serves the `WEBSITE` directory. `index.html` is the BOS and `service.html` is the public site.
- Both pages load Supabase JS v2 from jsDelivr and share `supabase-config.js`, which contains the project URL and browser publishable key.
- No service-role key is used by the browser.
- BOS UI preferences (`activeNav`, `contextVisible`) are stored in localStorage. Business data is loaded from Supabase; it is not seeded from localStorage.

## Existing state shapes

The in-memory BOS state currently contains:

- `enquiries`: `{ id, client, business, email, phone, industry, services[], source, assignedTo, status, date }`, with optional `details` and `message` for public submissions.
- `clients`: `{ id, businessName, contactPerson, email, phone, location, industry, website, notes }`.
- `projects`: `{ id, name, client, status, progress, manager, value, dueDate }`.
- `tasks`: `{ id, title, projectId, assignee, priority, status, dueDate }`.
- `meetings`: `{ id, title, date, time, attendees[] }`.
- `messages`: `{ id?, user, text, time }`.
- `notifications`: `{ title, detail, read }`.
- `documents`: `{ name, type, owner, date }`.
- `finances`: summary values for accepted project value, payments received, outstanding balances, pending quotations, invoices issued, expenses, and net cash position.

There is no longer a mock `seedState`; the active dashboard is backed by Supabase data, with a legacy record fallback for installations where the additive relational migration has not yet been applied.

## Supabase schema and access

The existing migration creates:

- `public.intake_requests`: UUID, kind (`contact` or `onboarding`), name/email, subject/category/message, business/contact metadata, `services text[]`, `details jsonb`, and `created_at`.
- `public.bos_records`: UUID, `record_type`, `data jsonb`, `created_by` (default `auth.uid()`), and `created_at`. Accepted types are clients, projects, tasks, meetings, messages, documents, notifications, enquiries, and financial transactions.

RLS is enabled on both tables. Anonymous and authenticated visitors may insert bounded intake requests. Only authenticated users whose JWT email matches one of the two founder addresses may read intake requests or read/write BOS records. The browser uses the publishable key; these RLS rules are the database boundary.

## Existing data flows

1. BOS initializes Supabase Auth, restores the session, checks the founder email allowlist, then loads `bos_records` and `intake_requests`.
2. The BOS maps JSON records into in-memory collections. Internal create flows insert JSON records. Message and financial quick actions also create JSON records.
3. Opening the CRM reloads BOS data so recently submitted public enquiries can appear.
4. `service.html` exposes a service enquiry dialog. `service.js` inserts contact enquiries into `intake_requests`; the public contact dialog contains contact details only.
5. Intake rows are mapped into the BOS enquiry view; public request data is not copied into the BOS table.

## Current limitations and dependencies to preserve

- The BOS and public site depend on the shared Supabase config and the intake schema/RLS policies.
- BOS data uses generic JSON records rather than relational tables. Existing rows must be preserved and any schema evolution must be additive or include a safe compatibility path.
- BOS actions currently implement inserts only; the database grants update/delete to founders, but current UI workflows do not implement general update/delete operations.
- The UI provides navigation for dashboard, CRM/enquiries, clients, projects, tasks, calendar, messages, financial overview, files, and settings. Some are display-only or placeholders (for example file upload).
- Finance summaries are incomplete: project value is summed, payment/expense records are summed, while pending quotation, invoice, and outstanding balance figures default to zero.
- No Supabase Realtime subscription is configured. Updates are observed on the next BOS data load.
