# Implementation Plan

1. **Repository audit** — Complete. Existing static pages, shared Supabase config, founder authentication, legacy JSON/BOS tables and public inquiry flow are preserved.
2. **Database redesign** — Complete in migration `202611180002_bos_relational_redesign.sql`.
3. **Application foundation** — Complete: four operational sections, brand dashboard access, profile sidebar and responsive layouts.
4. **Inquiry workflow** — Complete UI and atomic database function. Manual application migration is required.
5. **Project workflow** — Complete project list, schedule/Gantt switcher and acceptance-created project stages.
6. **Clients** — Complete directory, relationship filters and historical value summaries.
7. **Finances** — Complete payment, expense, invoice and receivable views against relational tables, with legacy fallback.
8. **Validation and handover** — Automated syntax checks plus manual Supabase/browser verification remain.
