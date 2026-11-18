# PROJECT: AQUA CAPRICORN CREATIVES — BUSINESS OPERATING SYSTEM (BOS)

## 1. ROLE AND OBJECTIVE

Act as a senior software architect, full-stack developer, database engineer, UI/UX designer and systems integration specialist.

Your task is to build an internal Business Operating System for Aqua Capricorn Creatives.

This is not a public-facing website.

It is a private, authenticated business management platform designed for two co-founders:

1. Thoriso Mmekwa — Creative Direction and Graphic Design.
2. Rorisang Montsho — IT and Software Development.

The platform must provide:

- Personalised founder dashboards.
- Business-wide financial overview.
- Client relationship management.
- Project management.
- Task management.
- Interactive Gantt charts.
- Meeting calendar.
- Internal messaging.
- Notifications.
- File and document management.
- Database-backed activity tracking.
- Role-based permissions.

The platform must be modular, scalable, responsive and easy to maintain.

Do not build a collection of disconnected mockup pages.

Build one interconnected application with a central database and consistent business logic.

## 2. TECHNICAL STACK

Preferred architecture:

Frontend:
- HTML, CSS and JavaScript, or the existing framework if one is already established.
- Responsive component-based interface.
- Reusable UI components.

Database:
- Supabase PostgreSQL.

Authentication:
- Supabase Auth.

Realtime:
- Supabase Realtime for messaging, notifications and relevant dashboard updates.

File storage:
- Supabase Storage.

Hosting:
- Cloudflare Pages.

Backend:
- Supabase Edge Functions or Cloudflare Workers where appropriate.

Version control:
- GitHub.

Use free-tier-compatible tools wherever possible.

Do not introduce unnecessary paid services.

Before making changes, inspect the existing project and determine whether the internal application should be implemented in the existing architecture or as a separate application directory.

## 3. AUTHENTICATION AND USER MANAGEMENT

Create a private login system.

Only authorised users should access the management platform.

Initial authorised users:

USER 1:
Name: Thoriso Mmekwa
Email: thorisommekwa68@gmail.com
Role: Creative Lead

USER 2:
Name: Rorisang Montsho
Email: dkdrougs@gmail.com
Role: Technical Lead

Do not create hardcoded passwords.

Implement secure authentication through Supabase Auth.

Provide:

- Login.
- Logout.
- Password reset.
- Session management.
- User profiles.
- Profile settings.
- Account status.
- Role-based permissions.

Do not expose the management dashboard to unauthenticated visitors.

Do not implement open public registration.

New users must be invited or authorised by an administrator.

Implement Row Level Security for sensitive data.

IMPORTANT:

Personalised dashboards must be determined by the authenticated user's database profile, not by manually hardcoding the founder's name in frontend code.

Both founders must have access to shared business information according to their permissions.

## 4. APPLICATION LAYOUT

Create a professional management interface.

Use a three-part layout:

A. LEFT SIDEBAR

Permanent collapsible navigation.

Navigation sections:

OVERVIEW
- Dashboard.
- My Workspace.
- Notifications.

BUSINESS MANAGEMENT
- CRM / Enquiries.
- Clients.
- Quotations.
- Projects.
- Services.

PROJECT OPERATIONS
- Task Management.
- Gantt Chart.
- Meeting Calendar.
- Team Messages.
- Files and Documents.

FINANCIAL MANAGEMENT
- Revenue Overview.
- Invoices.
- Payments.
- Expenses.
- Financial Reports.

ADMINISTRATION
- Team Members.
- Permissions.
- Business Settings.
- System Activity.

B. CENTRAL WORKSPACE

This is where the selected module is displayed.

The workspace must adapt to the selected navigation item.

C. RIGHT CONTEXT PANEL

A collapsible panel containing:

- Upcoming meetings.
- Today's deadlines.
- Notifications.
- Team activity.
- Quick actions.
- Recent messages.

Make the right panel optional on smaller screens.

## 5. PERSONAL DASHBOARDS

Build two personalised dashboard configurations.

### THORISO DASHBOARD

Default greeting:

"Welcome back, Thoriso."

Role:
Creative Lead.

Primary responsibilities:

- Graphic design.
- Brand identity.
- Creative direction.
- Visual communication.
- Website design.
- UI/UX.
- Client presentations.

Dashboard widgets:

1. Accepted project value.
2. Payments received.
3. Outstanding balances.
4. New enquiries.
5. Active projects.
6. My tasks today.
7. Overdue tasks.
8. Upcoming meetings.
9. Creative project progress.
10. Recent team messages.
11. Pending approvals.
12. Recent notifications.

Show tasks assigned to the authenticated user.

### RORISANG DASHBOARD

Default greeting:

"Welcome back, Rorisang."

Role:
Technical Lead.

Primary responsibilities:

- Software development.
- Backend development.
- Database management.
- System integrations.
- Business automation.
- Testing and debugging.
- Technical implementation.

Dashboard widgets:

1. Active technical projects.
2. Assigned development tasks.
3. Pending integrations.
4. Database and backend assignments.
5. Testing tasks.
6. Overdue tasks.
7. Upcoming deadlines.
8. Upcoming meetings.
9. Technical issues.
10. Recent team messages.
11. Pending approvals.
12. Notifications.

Both founders should retain access to the same shared business dashboard and financial information according to their permissions.

Create a dashboard configuration system so widgets can eventually be rearranged, enabled or disabled.

## 6. BUSINESS FINANCIAL DASHBOARD

Create a dedicated financial overview.

Display:

- Total accepted project value.
- Actual payments received.
- Outstanding client balances.
- Pending quotations.
- Total invoices issued.
- Total expenses.
- Net cash position.

Provide date filters:

- Today.
- This week.
- This month.
- This quarter.
- This year.
- Custom date range.

Display financial charts:

- Monthly payments received.
- Accepted project value over time.
- Outstanding balances.
- Expenses over time.
- Project value by service category.

IMPORTANT FINANCIAL LOGIC:

Do not treat an accepted quotation as money received.

Maintain separate financial records for:

1. Accepted contract value.
2. Invoiced amount.
3. Payments received.
4. Outstanding balances.
5. Business expenses.

Use payment records as the source of truth for cash received.

Calculate project balances using invoice and payment records, avoiding double counting.

Provide currency configuration with ZAR as the default.

Do not present accounting revenue recognition or tax calculations as established accounting facts without the necessary accounting rules and data.

## 7. CRM AND ENQUIRY MANAGEMENT

Build a CRM module.

It must receive enquiries originating from the public website.

Display:

- Client name.
- Business name.
- Email.
- Phone.
- Industry.
- Requested services.
- Enquiry date.
- Enquiry source.
- Assigned founder.
- Status.

Enquiry pipeline:

NEW
REVIEWING
CONTACTED
QUALIFIED
QUOTATION SENT
ACCEPTED
DECLINED
CLOSED

Allow authorised users to:

- View enquiries.
- Edit records.
- Assign leads.
- Add internal notes.
- Contact clients.
- Change statuses.
- Create quotations.
- Convert accepted quotations into projects.

Include search, filters and sorting.

Implement duplicate enquiry detection where practical.

Do not automatically convert every enquiry into an active project.

## 8. CLIENT MANAGEMENT

Create a central client database.

Each client should have a profile containing:

- Client ID.
- Business name.
- Contact person.
- Email.
- Telephone.
- Location.
- Industry.
- Website.
- Client notes.
- Enquiry history.
- Quotations.
- Projects.
- Invoices.
- Payments.
- Documents.
- Communication history.

A client profile should act as the central record connecting all interactions with that client.

## 9. PROJECT MANAGEMENT

Create a dedicated project management module.

Each project should contain:

- Project ID.
- Project name.
- Client.
- Project description.
- Service category.
- Contract value.
- Start date.
- Expected completion date.
- Assigned team members.
- Project manager.
- Priority.
- Current status.
- Completion percentage.
- Milestones.
- Tasks.
- Documents.
- Comments.
- Financial records.

Project statuses:

- Planning.
- Not started.
- In progress.
- Under review.
- Awaiting client feedback.
- On hold.
- Completed.
- Cancelled.

Project overview should include:

- Progress indicator.
- Task completion.
- Upcoming deadlines.
- Overdue tasks.
- Team workload.
- Financial status.

Provide multiple project views:

- List view.
- Kanban board.
- Timeline view.
- Gantt chart.

## 10. TASK MANAGEMENT

Create a fully functional task management module.

Each task must contain:

- Task ID.
- Task title.
- Description.
- Related project.
- Assigned user.
- Created by.
- Priority.
- Status.
- Start date.
- Due date.
- Estimated hours.
- Actual hours.
- Dependencies.
- Attachments.
- Comments.
- Created timestamp.
- Updated timestamp.

Task statuses:

- Backlog.
- To do.
- In progress.
- Under review.
- Blocked.
- Completed.

Priority levels:

- Low.
- Normal.
- High.
- Critical.

Create:

- My Tasks.
- All Tasks.
- Today's Tasks.
- Upcoming Tasks.
- Overdue Tasks.
- Completed Tasks.

Allow tasks to be reassigned between founders.

When a task is assigned or reassigned, notify the relevant user.

## 11. GANTT CHART

Create a dedicated interactive Gantt chart.

The chart must display:

- Project timelines.
- Task timelines.
- Start dates.
- End dates.
- Milestones.
- Task dependencies.
- Assigned users.
- Completion percentages.
- Overdue tasks.

Features:

- Day, week and month views.
- Horizontal timeline navigation.
- Project filtering.
- Team member filtering.
- Task status filtering.
- Dependency visualisation.
- Drag-and-drop date adjustment.
- Automatic progress updates.
- Deadline warnings.

Use real database records.

Do not use static demonstration data in production.

Changing a task's dates on the Gantt chart must update the task record in the database.

Prevent invalid scheduling where task dependencies would be violated, or clearly warn the user.

## 12. MEETING CALENDAR

Create a shared internal meeting calendar.

Views:

- Month.
- Week.
- Day.
- Agenda.

Meeting fields:

- Meeting title.
- Description.
- Date.
- Start time.
- End time.
- Participants.
- Related project.
- Agenda.
- Location.
- Online meeting link.
- Meeting notes.
- Follow-up actions.

Allow both founders to:

- Create meetings.
- Edit meetings.
- Invite the other founder.
- View shared appointments.
- Cancel meetings.
- Add notes.
- Create follow-up tasks.

Use South African local time (Africa/Johannesburg).

Do not automatically assume external Google Calendar synchronisation is available.

Build the internal calendar first, then make external calendar integration a separate optional feature.

## 13. INTERNAL MESSAGING SYSTEM

Build a database-backed internal messaging module.

Channels:

- General.
- Announcements.
- Project discussions.
- Technical discussions.
- Creative discussions.

Features:

- Direct messages.
- Group messages.
- Project-specific channels.
- Message timestamps.
- Read/unread status.
- Message notifications.
- File attachments.
- Message search.
- Message editing.
- Message deletion with appropriate permissions.

Implement realtime messaging using Supabase Realtime.

Messages must be persistent.

A refresh must not erase conversation history.

Ensure that users cannot access conversations or files for which they lack permission.

## 14. NOTIFICATION CENTRE

Create a central notification system.

Notification events:

- New enquiry.
- New project assigned.
- Task assigned.
- Task reassigned.
- Task deadline approaching.
- Overdue task.
- New message.
- Meeting scheduled.
- Meeting updated.
- Quotation accepted.
- Payment recorded.
- Project milestone completed.

Allow users to:

- Mark notifications as read.
- View unread notifications.
- Open the related project or task.
- Configure notification preferences.

Use realtime updates where appropriate.

Do not generate duplicate notifications for the same event.

## 15. FILES AND DOCUMENT MANAGEMENT

Create a shared document management module.

Organise documents by:

- Client.
- Project.
- Category.
- Uploading user.
- Date.

Support:

- Project briefs.
- Design files.
- Images.
- PDFs.
- Quotations.
- Invoices.
- Meeting documents.
- Technical documentation.

Use Supabase Storage.

Store file metadata and permissions in PostgreSQL.

Implement appropriate file access policies.

Do not expose private client documents through public URLs.

## 16. DATABASE ARCHITECTURE

Create a relational PostgreSQL database.

Recommended tables:

AUTHENTICATION:
- profiles
- roles
- permissions

CRM:
- clients
- enquiries
- enquiry_notes
- quotations
- quotation_items

PROJECT MANAGEMENT:
- projects
- project_members
- tasks
- task_dependencies
- milestones
- task_comments

COLLABORATION:
- channels
- channel_members
- messages
- message_reads
- meetings
- meeting_attendees
- meeting_notes

FINANCE:
- invoices
- invoice_items
- payments
- expenses

FILES:
- documents
- document_permissions

SYSTEM:
- notifications
- activity_logs
- dashboard_preferences
- business_settings

Use UUID primary keys.

Use foreign keys and suitable indexes.

Use timestamps for record creation and updates.

Use appropriate constraints.

Implement database migrations and maintain a clear schema.

Avoid storing the same information unnecessarily in multiple tables.

Use appropriate numeric precision for financial values.

Store timestamps consistently and display them in Africa/Johannesburg time.

## 17. ROLE-BASED SECURITY

Implement secure Row Level Security.

Initial users:

- Thoriso Mmekwa.
- Rorisang Montsho.

Both founders can access shared business operations.

Implement explicit permissions for:

- Financial management.
- User administration.
- Business settings.
- Client data.
- Project records.
- Documents.

Do not rely on frontend visibility controls as security.

Enforce permissions in the database and backend.

Do not expose service-role keys in frontend code.

Do not expose database credentials.

All sensitive operations must be validated server-side.

## 18. DASHBOARD QUICK ACTIONS

Create a quick-action menu containing:

- Create project.
- Create task.
- Schedule meeting.
- Add client.
- Create quotation.
- Record payment.
- Add expense.
- Send message.

Each action must open an appropriate functional form or modal.

Do not create decorative buttons without working actions.

## 19. REACTIVE DASHBOARD WINDOWS

Build compact widgets that update as the underlying database changes.

Required widgets:

1. My Tasks Today.
2. Upcoming Meetings.
3. New Enquiries.
4. Recent Messages.
5. Project Progress.
6. Overdue Tasks.
7. Financial Summary.
8. Recent Activity.
9. Team Workload.
10. Quick Actions.

Widgets must be reusable and configurable.

Avoid excessive dashboard clutter.

Allow the right-hand contextual panel to collapse.

Use loading states, empty states and error states.

## 20. ACTIVITY LOGGING

Record important actions:

- Project created.
- Project updated.
- Task assigned.
- Task completed.
- Quotation accepted.
- Payment recorded.
- Meeting created.
- Document uploaded.
- User permissions changed.

Activity logs should include:

- User.
- Action.
- Related record.
- Timestamp.
- Relevant metadata.

Protect activity logs against unauthorised modification.

## 21. DESIGN SYSTEM

Use the Aqua Capricorn Creatives visual identity.

Colours:

- Navy #071B33.
- Secondary navy #102D4A.
- Cyan #36B9C8.
- Gold #D6AD62.
- White #FFFFFF.
- Light background #E9EFF5.

Design direction:

- Modern SaaS dashboard.
- Professional enterprise interface.
- Minimalist.
- Clean typography.
- Responsive.
- Clear visual hierarchy.
- Consistent spacing.
- Restrained animation.
- Functional data visualisations.

The interface must feel like a serious internal business application.

Avoid making every component a card.

Use tables, charts, panels, drawers, modals and contextual navigation appropriately.

Support desktop and mobile screens.

## 22. IMPLEMENTATION PHASES

Do not attempt to implement the entire platform in one uncontrolled operation.

PHASE 1:
Project audit, architecture and database design.

PHASE 2:
Authentication, user profiles and role-based access.

PHASE 3:
Main dashboard and navigation.

PHASE 4:
CRM, clients and quotations.

PHASE 5:
Project management and task management.

PHASE 6:
Gantt chart and meeting calendar.

PHASE 7:
Internal messaging and notifications.

PHASE 8:
Financial dashboard and payment tracking.

PHASE 9:
Document management and activity logs.

PHASE 10:
Testing, security review and deployment.

At each phase:

- Implement the required functionality.
- Test the functionality.
- Verify database interactions.
- Resolve errors.
- Document completed work.
- Preserve existing working features.

## 23. ACCEPTANCE CRITERIA

The application is not complete until:

1. Thoriso can securely log in.
2. Rorisang can securely log in.
3. Each founder sees a personalised dashboard.
4. Both founders can access shared projects.
5. Tasks can be assigned and reassigned.
6. Tasks can be tracked to completion.
7. The Gantt chart displays actual project data.
8. Meetings can be created and viewed.
9. Internal messages persist in the database.
10. Notifications work.
11. New website enquiries appear in the CRM.
12. Accepted quotations can generate projects.
13. Project values and payments are calculated separately.
14. Financial records can be viewed according to permissions.
15. Files are securely stored.
16. The application works on mobile and desktop.
17. Database access is secured.
18. All primary actions work.
19. The system survives page refreshes and new sessions.
20. The application can be deployed using the documented infrastructure.

## 24. FINAL DELIVERABLE

Produce:

- Functional internal business management application.
- Database schema and migrations.
- Authentication configuration.
- Row Level Security policies.
- Reusable frontend components.
- Functional dashboard.
- CRM module.
- Project management module.
- Gantt chart.
- Meeting calendar.
- Internal messaging.
- Financial management.
- Notification centre.
- README documentation.
- Deployment instructions.
- Testing report.

Never claim that an integration works unless it has actually been tested.

Do not use fake production data.

Use clearly labelled seed data only for development and testing.

Build this as the foundation of Aqua Capricorn Creatives' internal operating infrastructure.

PROJECT NAME:

AQUA CAPRICORN — BUSINESS OPERATING SYSTEM

SLOGAN:

REVOLUTIONIZING THE DIGITAL EVOLUTION.