# Entity Relationship Overview

```text
auth.users
  |
  +-- profiles
  +-- business_members --> businesses
                               |
                               +-- role_permissions
                               +-- business_settings
                               +-- business_services
                               +-- clients --> client_contacts
                               |          `--> projects
                               |
                               +-- enquiries --> projects
                               |
                               +-- projects --> project_stages --> project_stage_notes
                               |          +--> project_milestones
                               |          +--> tasks
                               |          +--> meetings
                               |          +--> deliverables
                               |          +--> expenses
                               |          `--> quotations / invoices
                               |
                               +-- invoices --> invoice_items
                               |          `--> invoice_payments <-- payments
                               |
                               `--> activity_logs
```

Primary keys use UUIDs. Operational records are owned by `business_id`. Existing `intake_requests` are linked to `enquiries` by `legacy_intake_id`.
