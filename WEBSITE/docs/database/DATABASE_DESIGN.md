# Database Design

## Architecture

The redesign is additive. Existing `bos_records` and `intake_requests` remain unchanged so legacy business records and public submissions are preserved. The migration creates relational entities for businesses, enquiries, clients, projects, stages, tasks, invoices, payments, expenses, and audit history.

## Core relationships

- A business owns clients, enquiries, projects, invoices, expenses and activities.
- A client can have many enquiries and projects.
- An enquiry can create at most one project through `projects.inquiry_id`.
- A project can have many stages, tasks, milestones, meetings and expenses.
- An invoice can receive allocations from multiple payments, and a payment can be allocated to multiple invoices.
- Project progress is the sum of completed stage weights.
- Financial values use `NUMERIC(14,2)` and an explicit three-letter currency.

## Legacy compatibility

Public inquiry submissions continue to insert into `intake_requests`. `enquiries.legacy_intake_id` is the safe link for converting or associating a legacy row. Legacy JSON in `bos_records` is not automatically rewritten. It should be interpreted manually or through a future reviewed data-conversion script.

## Accounting basis

The current UI does not assume that all invoices equal cash received. Cash received is derived from successful `payments`; outstanding receivables are invoice totals minus payment allocations. `business_settings.accounting_basis` identifies the configured reporting basis.
