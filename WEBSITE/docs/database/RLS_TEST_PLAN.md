# RLS Test Plan

| Test | Expected result |
|---|---|
| Anonymous select from `enquiries` | No rows |
| Anonymous insert to `intake_requests` | Allowed when bounded fields are valid |
| Authenticated unrelated user | No business rows |
| Suspended business member | No business rows |
| Active operator | Inquiry, project and client access where permitted |
| Finance-only or viewer role | Protected access follows role_permissions |
| Change a UUID in an API request | No cross-business record |
| Founder owner | All permitted records for the Aqua business |

Tests should be repeated in a staging Supabase project. Record table, policy, role, JWT user and observed result for each case.
