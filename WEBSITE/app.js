const STORAGE_KEY = 'aqua-capricorn-bos-state';
const USERS = [
  {
    name: 'Thoriso Mmekwa',
    email: 'thorisommekwa68@gmail.com',
    role: 'Creative Lead'
  },
  {
    name: 'Rorisang Montsho',
    email: 'dkdrougs@gmail.com',
    role: 'Technical Lead'
  }
];

const state = loadState();
const supabaseConfig = window.AQUA_SUPABASE_CONFIG;
const supabaseConfigured = Boolean(
  supabaseConfig?.url &&
  supabaseConfig?.publishableKey &&
  !supabaseConfig.url.includes('YOUR_PROJECT_ID') &&
  !supabaseConfig.publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY') &&
  typeof window.supabase?.createClient === 'function'
);
const supabaseClient = supabaseConfigured
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;
const navDefinitions = [
  { key: 'project_logging', label: 'Projects', icon: 'folder-kanban', group: 'Operational navigation' },
  { key: 'clients', label: 'CRM', icon: 'users', group: 'Operational navigation' },
  { key: 'finances', label: 'Finances', icon: 'wallet', group: 'Operational navigation' }
];
if (state.activeNav !== 'dashboard' && !navDefinitions.some((item) => item.key === state.activeNav)) {
  state.activeNav = 'dashboard';
}
let homeCarouselTimer = null;
let sidebarClockTimer = null;

const modalCatalog = {
  'create-project': {
    title: 'Create project',
    fields: [
      { name: 'projectName', label: 'Project name', type: 'text', placeholder: 'New client project', required: true },
      { name: 'clientId', label: 'Client', type: 'client-select' },
      { name: 'serviceCategory', label: 'Service category', type: 'select', options: ['App Development', 'Website Development', 'Automation', 'Design and Branding', 'Graphic Design', 'Digital Services', 'Other'] },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'projectValue', label: 'Budget (ZAR)', type: 'number', placeholder: '45000', min: '0', step: '0.01' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planning', 'Active', 'On hold', 'Completed', 'Cancelled'] },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'deadline', label: 'Deadline', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'create-task': {
    title: 'Create task',
    fields: [
      { name: 'taskTitle', label: 'Task title', type: 'text', placeholder: 'Prepare discovery notes', required: true },
      { name: 'projectId', label: 'Project', type: 'project-select' },
      { name: 'assignee', label: 'Assignee', type: 'select', options: ['Thoriso', 'Rorisang'] },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Normal', 'High', 'Critical'] },
      { name: 'status', label: 'Status', type: 'select', options: ['Not started', 'In progress', 'Blocked', 'Completed'] },
      { name: 'dueDate', label: 'Due date', type: 'date' }
    ]
  },
  'schedule-meeting': {
    title: 'Schedule meeting',
    fields: [
      { name: 'meetingTitle', label: 'Meeting title', type: 'text', placeholder: 'Weekly project sync', required: true },
      { name: 'projectId', label: 'Project', type: 'project-select' },
      { name: 'meetingDate', label: 'Date', type: 'date', required: true },
      { name: 'meetingTime', label: 'Time', type: 'time', required: true },
      { name: 'description', label: 'Agenda / notes', type: 'textarea' },
      { name: 'attendees', label: 'Attendees', type: 'text', placeholder: 'Thoriso, Rorisang' }
    ]
  },
  'add-client': {
    title: 'Add client',
    fields: [
      { name: 'businessName', label: 'Business name', type: 'text', placeholder: 'Greenline Trading' },
      { name: 'contactPerson', label: 'Contact person', type: 'text', placeholder: 'Lerato' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@company.co.za' },
      { name: 'telephone', label: 'Telephone', type: 'tel', placeholder: '+27 00 000 0000' },
      { name: 'industry', label: 'Industry', type: 'text', placeholder: 'Professional services' }
    ]
  },
  'create-quotation': {
    title: 'Create quotation',
    fields: [
      { name: 'clientName', label: 'Client', type: 'text', placeholder: 'Business name' },
      { name: 'quotationValue', label: 'Value (ZAR)', type: 'number', placeholder: '22000' },
      { name: 'status', label: 'Status', type: 'select', options: ['Quotation sent', 'Accepted', 'Pending'] }
    ]
  },
  'record-payment': {
    title: 'Record payment',
    fields: [
      { name: 'invoiceRef', label: 'Invoice reference', type: 'text', placeholder: 'INV-1003' },
      { name: 'amount', label: 'Amount (ZAR)', type: 'number', placeholder: '8000' },
      { name: 'receivedDate', label: 'Received date', type: 'date' }
    ]
  },
  'add-expense': {
    title: 'Add expense',
    fields: [
      { name: 'expenseName', label: 'Expense', type: 'text', placeholder: 'Domain renewal' },
      { name: 'expenseAmount', label: 'Amount (ZAR)', type: 'number', placeholder: '1200' },
      { name: 'expenseDate', label: 'Date', type: 'date' }
    ]
  },
  'send-message': {
    title: 'Send message',
    fields: [
      { name: 'messageTo', label: 'To', type: 'select', options: ['Thoriso', 'Rorisang', 'General'] },
      { name: 'messageText', label: 'Message', type: 'textarea', placeholder: 'Share an update...' }
    ]
  },
  'create-inquiry': {
    title: 'Create inquiry',
    fields: [
      { name: 'contactName', label: 'Client or contact name', type: 'text', placeholder: 'Client name' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'client@example.com' },
      { name: 'telephone', label: 'Telephone', type: 'text', placeholder: 'Phone number' },
      { name: 'requestedService', label: 'Requested service', type: 'select', options: ['App Development','Website Development','Automation','Design and Branding','Graphic Design','Digital Services','Other'] },
      { name: 'description', label: 'Inquiry details', type: 'textarea', placeholder: 'Describe the request' }
    ]
  },
  'create-invoice': {
    title: 'Create invoice',
    fields: [
      { name: 'clientId', label: 'Client record ID', type: 'text', placeholder: 'UUID from client records' },
      { name: 'projectId', label: 'Project record ID', type: 'text', placeholder: 'Optional UUID' },
      { name: 'total', label: 'Invoice total (ZAR)', type: 'number', placeholder: '25000' },
      { name: 'dueDate', label: 'Due date', type: 'date' }
    ]
  }
};

function loadState() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    console.warn('Interface preferences could not be loaded:', error);
  }
  return {
    currentUser: null,
    activeNav: 'dashboard',
    expandedNavGroup: Object.prototype.hasOwnProperty.call(saved, 'expandedNavGroup')
      ? saved.expandedNavGroup
      : undefined,
    enquiries: [],
    clients: [],
    projects: [],
    tasks: [],
    meetings: [],
    messages: [],
    notifications: [],
    documents: [],
    stages: [],
    invoices: [],
    payments: [],
    expenses: [],
    assignments: [],
    progressHistory: [],
    profiles: [],
    selectedProjectId: null,
    projectTaskView: 'gantt',
    showProjectCalendar: false,
    selectedTaskId: null,
    ganttScale: 'monthly',
    ganttVisibleStart: null,
    ganttVisibleEnd: null,
    relationTablesAvailable: false,
    projectWorkflowAvailable: false,
    migrationRequired: false,
    loading: false,
    finances: {
      acceptedProjectValue: 0,
      paymentsReceived: 0,
      outstandingBalances: 0,
      pendingQuotations: 0,
      invoicesIssued: 0,
      expenses: 0,
      netCashPosition: 0
    },
    errorMessage: ''
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    activeNav: state.activeNav,
    expandedNavGroup: state.expandedNavGroup
  }));
}

function getCurrentUser() {
  return state.currentUser ? USERS.find((user) => user.email === state.currentUser) || null : null;
}

function isFounderEmail(email) {
  return USERS.some((user) => user.email.toLowerCase() === email?.toLowerCase());
}

function showAppError(message = '') {
  state.errorMessage = message;
  const messageNode = document.getElementById('app-message');
  if (!messageNode) return;
  messageNode.textContent = message;
  messageNode.classList.toggle('hidden', !message);
}

async function loadBOSData() {
  state.loading = true;
  state.projectWorkflowAvailable = false;
  const [recordsResult, intakeResult] = await Promise.all([
    supabaseClient.from('bos_records').select('record_type, data, created_at').order('created_at'),
    supabaseClient.from('intake_requests').select('*').order('created_at', { ascending: false })
  ]);
  if (recordsResult.error) throw recordsResult.error;
  if (intakeResult.error) throw intakeResult.error;

  const recordTypes = {
    clients: 'clients',
    projects: 'projects',
    tasks: 'tasks',
    meetings: 'meetings',
    messages: 'messages',
    documents: 'documents',
    notifications: 'notifications'
  };
  Object.entries(recordTypes).forEach(([recordType, stateKey]) => {
    state[stateKey] = recordsResult.data
      .filter((record) => record.record_type === recordType)
      .map((record) => record.data);
  });

  state.enquiries = recordsResult.data
    .filter((record) => record.record_type === 'enquiries')
    .map((record) => ({
      ...record.data,
      status: String(record.data.status || 'New').toLowerCase() === 'qualified' ? 'Under review' : record.data.status
    }));
  state.enquiries.unshift(...intakeResult.data.map((request) => ({
    id: request.id,
    legacyIntakeId: request.id,
    client: request.business_name || request.name,
    business: request.business_name || request.name,
    contactName: request.name,
    email: request.email,
    phone: request.phone || '',
    industry: request.industry || request.category || 'General',
    services: request.services?.length ? request.services : [request.category || 'General enquiry'],
    requestedService: request.services?.[0] || request.category || 'General enquiry',
    source: request.kind === 'onboarding' ? 'Service onboarding form' : 'Website contact form',
    assignedTo: 'Unassigned',
    status: 'New',
    date: request.created_at.slice(0, 10),
    receivedAt: request.created_at,
    details: request.details,
    message: request.message || request.details?.message || ''
  })));

  const relationalQueries = await Promise.allSettled([
    supabaseClient.from('enquiries').select('*, client:clients(*)').order('received_at', { ascending: false }),
    supabaseClient.from('projects').select('*, client:clients(*)').order('created_at', { ascending: false }),
    supabaseClient.from('project_stages').select('*').order('position'),
    supabaseClient.from('tasks').select('*').order('due_date'),
    supabaseClient.from('meetings').select('*').order('start_at'),
    supabaseClient.from('clients').select('*').order('created_at', { ascending: false }),
    supabaseClient.from('invoices').select('*').order('issue_date', { ascending: false }),
    supabaseClient.from('payments').select('*').order('payment_date', { ascending: false }),
    supabaseClient.from('expenses').select('*').order('expense_date', { ascending: false }),
    supabaseClient.from('task_assignments').select('*'),
    supabaseClient.from('task_progress_history').select('*').order('created_at', { ascending: false }),
    supabaseClient.from('profiles').select('*'),
    supabaseClient.from('meeting_attendees').select('*')
  ]);

  const coreQueries = relationalQueries.slice(0, 9);
  const enhancementQueries = relationalQueries.slice(9);
  state.relationTablesAvailable = coreQueries.every((result) => result.status === 'fulfilled' && !result.value.error);
  state.projectEnhancementsAvailable = enhancementQueries.every((result) => result.status === 'fulfilled' && !result.value.error);
  state.migrationRequired = !state.relationTablesAvailable;

  if (state.relationTablesAvailable) {
    const [relEnquiries, relProjects, relStages, relTasks, relMeetings, relClients, relInvoices, relPayments, relExpenses] =
      relationalQueries.map((result) => result.value.data || []);
    state.enquiries = [
      ...relEnquiries.map((item) => ({
        id: item.id,
        reference: item.reference,
        client: item.client?.name || item.contact_name,
        clientId: item.client_id,
        contactName: item.contact_name,
        email: item.email,
        phone: item.telephone,
        requestedService: item.requested_service,
        services: item.requested_service ? [item.requested_service] : [],
        source: item.source,
        status: item.status,
        date: item.received_at?.slice(0, 10),
        receivedAt: item.received_at,
        message: item.description,
        legacyIntakeId: item.legacy_intake_id
      })),
      ...state.enquiries.filter((item) => !item.legacyIntakeId || !relEnquiries.some((row) => row.legacy_intake_id === item.legacyIntakeId))
    ];
    state.projects = relProjects.map((item) => ({
      id: item.id,
      name: item.name,
      reference: item.reference,
      client: item.client?.name || 'Unassigned client',
      clientId: item.client_id,
      inquiryId: item.inquiry_id,
      status: item.status,
      progress: Number(item.progress || 0),
      value: Number(item.budget || 0),
      serviceCategory: item.service_category,
      description: item.description,
      dueDate: item.deadline,
      startDate: item.start_date,
      notes: item.notes,
      currency: item.currency,
      actualCompletionDate: item.actual_completion_date || null
    }));
    if (state.projectEnhancementsAvailable) {
      const [, , , , , , , , , relAssignments, relHistory, relProfiles, relMeetingAttendees] = relationalQueries.map((result) => result.value?.data || []);
      state.assignments = relAssignments || [];
      state.progressHistory = relHistory || [];
      state.profiles = relProfiles || [];
      state.meetingAttendees = relMeetingAttendees || [];
    }
    state.projectWorkflowAvailable = relStages.length > 0 && relStages.every((stage) =>
      Object.prototype.hasOwnProperty.call(stage, 'progress')
    );
    state.stages = relStages.map((stage) => ({
      ...stage,
      progress: Number(stage.progress || 0),
      weight: Number(stage.weight || 0)
    }));
    state.tasks = relTasks.map((item) => ({
      id: item.id,
      title: item.title,
      projectId: item.project_id,
      stageId: item.stage_id,
      assigneeId: item.assignee_id,
      assignee: item.assignee_id ? 'Assigned user' : 'Unassigned',
      priority: item.priority,
      status: item.progress >= 100 ? 'Completed' : item.status,
      dueDate: item.due_date,
      startDate: item.start_date,
      description: item.description,
      notes: item.notes,
      weight: Number(item.weight || 0),
      progress: Number(item.progress || 0),
      position: Number(item.position || 0)
    }));
    state.meetings = relMeetings.map((item) => {
      const localStart = toLocalDateTimeInputValue(item.start_at);
      const [date, time] = localStart.split('T');
      const meetingDetails = parseMeetingDescription(item.description);
      return {
        id: item.id,
        projectId: item.project_id,
        title: item.title,
        date,
        time,
        attendees: meetingDetails.attendees,
        description: meetingDetails.description
      };
    });
    state.clients = relClients.map((item) => ({
      id: item.id,
      businessName: item.business_name || item.name,
      contactPerson: item.name,
      email: item.email,
      phone: item.telephone,
      location: '',
      industry: '',
      status: item.status,
      clientType: item.client_type,
      notes: item.internal_notes,
      firstAcquiredAt: item.first_acquired_at,
      subscriptionStatus: item.subscription_status
    }));
    state.invoices = relInvoices;
    state.payments = relPayments;
    state.expenses = relExpenses;
  }

  const paymentsReceived = state.relationTablesAvailable
    ? state.payments.filter((payment) => payment.status !== 'Reversed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
    : recordsResult.data
        .filter((record) => record.record_type === 'financial_transactions' && record.data.kind === 'payment')
        .reduce((sum, record) => sum + Number(record.data.amount || 0), 0);
  const projectExpenditure = state.relationTablesAvailable
    ? state.expenses.filter((expense) => expense.project_id).reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    : 0;
  const allExpenses = state.relationTablesAvailable
    ? state.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    : recordsResult.data
        .filter((record) => record.record_type === 'financial_transactions' && record.data.kind === 'expense')
        .reduce((sum, record) => sum + Number(record.data.amount || 0), 0);
  const outstandingBalances = state.relationTablesAvailable
    ? state.invoices
        .filter((invoice) => invoice.status !== 'Paid' && invoice.status !== 'Cancelled')
        .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0)
    : 0;

  state.finances = {
    acceptedProjectValue: state.projects.reduce((sum, project) => sum + Number(project.value || 0), 0),
    paymentsReceived,
    outstandingBalances,
    pendingQuotations: 0,
    invoicesIssued: state.relationTablesAvailable
      ? state.invoices.filter((invoice) => invoice.status !== 'Cancelled').reduce((sum, invoice) => sum + Number(invoice.total || 0), 0)
      : 0,
    expenses: allExpenses,
    projectExpenditure,
    netCashPosition: paymentsReceived - allExpenses
  };
  state.loading = false;
}

async function refreshBOSData() {
  if (!getCurrentUser()) return;
  try {
    await loadBOSData();
    showAppError();
  } catch (error) {
    state.loading = false;
    showAppError(`Could not refresh BOS data: ${error.message}`);
  }
  render();
}

async function addBOSRecord(recordType, data) {
  const { error } = await supabaseClient
    .from('bos_records')
    .insert({ record_type: recordType, data });
  if (error) throw error;
}

async function getCurrentBusinessId() {
  const { data, error } = await supabaseClient
    .from('business_members')
    .select('business_id')
    .eq('user_id', (await supabaseClient.auth.getUser()).data.user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.business_id) throw new Error('No active business membership was found.');
  return data.business_id;
}

async function loadForSession(session) {
  const email = session?.user?.email || null;
  if (!email) {
    state.currentUser = null;
    render();
    return;
  }
  if (!isFounderEmail(email)) {
    state.currentUser = null;
    await supabaseClient.auth.signOut();
    setAuthMessage('This account is not authorized to use the Business Operating System.', 'error');
    render();
    return;
  }
  state.currentUser = email;
  try {
    await loadBOSData();
    showAppError();
  } catch (error) {
    showAppError(`Could not load BOS data: ${error.message}`);
  }
  render();
}

function setAuthMessage(message, type = 'error') {
  const authMessage = document.getElementById('auth-message');
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
}

function renderSidebar() {
  const navContainer = document.getElementById('sidebar-nav');
  if (!navContainer) return;

  const profile = document.getElementById('sidebar-profile');
  if (profile) {
    profile.innerHTML = `
      <button class="home-nav-button ${state.activeNav === 'dashboard' ? 'active' : ''}" type="button" data-home-nav>
        <span class="nav-icon" aria-hidden="true">HM</span><span>HOME</span>
      </button>
    `;
  }

  updateSidebarClock();
  navContainer.innerHTML = navDefinitions.map((item) => `
    <button class="nav-item ${state.activeNav === item.key ? 'active' : ''}" type="button" data-nav="${item.key}">
      <span class="nav-icon" aria-hidden="true">${item.icon === 'folder-kanban' ? 'PJ' : item.icon === 'users' ? 'CRM' : 'FN'}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  navContainer.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', async () => {
      state.activeNav = button.dataset.nav;
      if (state.activeNav !== 'project_logging') {
        state.selectedProjectId = null;
        state.showProjectCalendar = false;
      } else {
        state.showProjectCalendar = false;
      }
      saveState();
      if (state.activeNav === 'dashboard' || state.activeNav === 'clients') await refreshBOSData();
      else render();
    });
  });
  profile?.querySelector('[data-home-nav]')?.addEventListener('click', () => {
    state.activeNav = 'dashboard';
    state.selectedProjectId = null;
    saveState();
    render();
  });
}

function updateSidebarClock() {
  const clock = document.getElementById('sidebar-clock');
  if (!clock) return;
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(now);
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(now);
  clock.innerHTML = `<span>(+2) SOUTH AFRICAN STANDARD TIME · 24HRS</span><strong>${time}</strong><span>${date}</span>`;
  if (!sidebarClockTimer) sidebarClockTimer = window.setInterval(updateSidebarClock, 30000);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function getPageTitle() {
  const label = navDefinitions.find((item) => item.key === state.activeNav)?.label || 'Home';
  document.getElementById('page-title').textContent = label;
}

function renderDashboard() {
  const user = getCurrentUser();
  const firstName = user?.name.split(' ')[0];
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(new Date()));
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = getLocalDateKey();
  const newInquiries = state.enquiries.filter((item) =>
    ['new', 'new enquiry', 'under review'].includes(String(item.status || '').toLowerCase())
  );
  const outstandingProjects = state.projects.filter((project) =>
    !['completed', 'cancelled'].includes(String(project.status || '').toLowerCase())
  );
  const upcomingMeetings = state.meetings
    .filter((meeting) => `${meeting.date || ''}T${meeting.time || '00:00'}` >= `${today}T00:00`)
    .sort((left, right) => `${left.date || ''}T${left.time || ''}`.localeCompare(`${right.date || ''}T${right.time || ''}`))
    .slice(0, 4);
  const designProcessTasks = state.stages
    .filter((stage) => stage.active !== false && stage.status !== 'Completed')
    .map((stage) => ({
      title: stage.name,
      projectId: stage.project_id,
      dueDate: state.projects.find((project) => String(project.id) === String(stage.project_id))?.dueDate || '',
      status: stage.status || 'Not started',
      progress: Number(stage.progress || 0)
    }));
  const allOpenTasks = [...state.tasks, ...designProcessTasks]
    .filter((task) => !['completed', 'done'].includes(String(task.status || '').toLowerCase()))
    .sort((left, right) => String(left.dueDate || '9999-12-31').localeCompare(String(right.dueDate || '9999-12-31')));
  const upcomingTasks = allOpenTasks
    .filter((task) => !task.dueDate || task.dueDate >= today)
    .slice(0, 2);
  const attentionTasks = allOpenTasks
    .filter((task) => task.dueDate && task.dueDate <= today);
  const recentInquiries = state.enquiries
    .slice()
    .sort((left, right) => String(right.receivedAt || right.date || '').localeCompare(String(left.receivedAt || left.date || '')))
    .slice(0, 5);
  const carouselSlides = [
    `
      <section class="home-slide" aria-label="Upcoming meetings">
        <div class="slide-heading"><div><p class="eyebrow">Your calendar</p><h4>Upcoming meetings</h4></div><span class="slide-count">${upcomingMeetings.length}</span></div>
        <div class="slide-list">
          ${upcomingMeetings.length ? upcomingMeetings.map((meeting) => {
            const project = state.projects.find((item) => String(item.id) === String(meeting.projectId));
            return `<div class="slide-list-item">
              <div><strong>${escapeHTML(meeting.title)}</strong><span>${escapeHTML(meeting.date || 'Date not set')} · ${escapeHTML(meeting.time || '')}${project ? ` · ${escapeHTML(project.name)}` : ''}</span></div>
              ${project ? `<button type="button" class="text-link" data-open-project="${escapeHTML(project.id)}">Open project</button>` : ''}
            </div>`;
          }).join('') : '<div class="empty-state">No upcoming meetings.</div>'}
        </div>
        <button type="button" class="ghost-btn small-btn slide-link" data-open-project-calendar>Open project calendar</button>
      </section>
    `,
    `
      <section class="home-slide" aria-label="Today's tasks">
        <div class="slide-heading"><div><p class="eyebrow">Keep work moving</p><h4>Today’s tasks</h4></div><span class="slide-count">${upcomingTasks.length}</span></div>
        <div class="slide-list">
          ${upcomingTasks.length ? upcomingTasks.map((task) => {
            const project = state.projects.find((item) => String(item.id) === String(task.projectId));
            return `<div class="slide-list-item">
              <div><button type="button" class="text-link task-title-link" ${project ? `data-open-project="${escapeHTML(project.id)}"` : 'data-open-task-manager'}>${escapeHTML(task.title)}</button><span>${task.dueDate ? `Due ${escapeHTML(task.dueDate)}` : 'No due date'} · ${escapeHTML(task.status || 'Not started')}</span></div>
              ${project ? `<button type="button" class="text-link project-link" data-open-project="${escapeHTML(project.id)}">${escapeHTML(project.name)}</button>` : '<span class="muted-label">No project</span>'}
            </div>`;
          }).join('') : '<div class="empty-state">No upcoming tasks.</div>'}
        </div>
        <button type="button" class="ghost-btn small-btn slide-link" data-open-task-manager>Open task manager</button>
      </section>
    `,
    `
      <section class="home-slide" aria-label="Recent activity">
        <div class="slide-heading"><div><p class="eyebrow">Latest updates</p><h4>Recent activity</h4></div><span class="slide-count">${recentInquiries.length}</span></div>
        <div class="slide-list">
          ${recentInquiries.length ? recentInquiries.slice(0, 3).map((item) => `<div class="slide-list-item">
            <div><strong>${escapeHTML(item.client || item.contactName || 'New inquiry')}</strong><span>${escapeHTML(item.requestedService || item.services?.join(', ') || 'General inquiry')} · ${escapeHTML(item.date || '')}</span></div>
            <span class="status-pill">${escapeHTML(item.status || 'New')}</span>
          </div>`).join('') : '<div class="empty-state">No recent activity yet.</div>'}
        </div>
        <button type="button" class="ghost-btn small-btn slide-link" data-nav-jump="clients">Open CRM</button>
      </section>
    `
  ];

  return `
    ${state.migrationRequired ? `
      <div class="app-warning">
        <strong>Database migration required</strong>
        <span>The relational modules are unavailable until the redesign migration is reviewed and applied in Supabase.</span>
      </div>
    ` : ''}
    <section class="home-hero panel">
      <div class="hero-greeting"><p class="eyebrow">Aqua Capricorn Creatives · Business overview</p><h3>${greeting}, ${escapeHTML(firstName || 'there')}</h3></div>
      <div class="home-carousel">
        <div class="carousel-track" id="home-carousel-track">${carouselSlides.join('')}</div>
        <div class="carousel-controls" role="group" aria-label="Dashboard slides">
          ${carouselSlides.map((_, index) => `<button type="button" class="carousel-dot ${index === 0 ? 'active' : ''}" aria-label="Show slide ${index + 1}" aria-pressed="${index === 0}" data-carousel-goto="${index}"></button>`).join('')}
        </div>
      </div>
    </section>
    <div class="kpi-grid">
      <button class="kpi-card kpi-button" type="button" data-nav-jump="clients">
        <span class="kpi-label">New Inquiries</span><span class="kpi-value">${newInquiries.length}</span><span class="kpi-delta positive">Awaiting review</span>
      </button>
      <button class="kpi-card kpi-button" type="button" data-nav-jump="project_logging" data-project-filter="Active">
        <span class="kpi-label">Outstanding Projects</span><span class="kpi-value">${outstandingProjects.length}</span><span class="kpi-delta positive">Active work</span>
      </button>
      <button class="kpi-card kpi-button" type="button" data-nav-jump="finances">
        <span class="kpi-label">Cash Received</span><span class="kpi-value">${formatCurrency(state.finances.paymentsReceived)}</span><span class="kpi-delta positive">Recorded payments</span>
      </button>
      <button class="kpi-card kpi-button" type="button" data-nav-jump="finances">
        <span class="kpi-label">Outstanding</span><span class="kpi-value">${formatCurrency(state.finances.outstandingBalances)}</span><span class="kpi-delta warning">Invoice balances</span>
      </button>
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-header"><h3>Recent inquiries</h3><button class="ghost-btn small-btn" type="button" data-nav-jump="clients">View all</button></div>
        <div class="list-stack">
          ${recentInquiries.length ? recentInquiries.map((item) => `
            <button class="list-item list-button" type="button" data-open-inquiry="${escapeHTML(item.id)}">
              <div><strong>${escapeHTML(item.client || item.contactName)}</strong><div class="muted-label">${escapeHTML(item.requestedService || item.services?.join(', ') || 'General enquiry')}</div></div>
              <span class="status-pill status-${escapeHTML(String(item.status || 'new').toLowerCase().replace(/\s+/g, '-'))}">${escapeHTML(item.status || 'New')}</span>
            </button>
          `).join('') : '<div class="empty-state">No inquiries received.</div>'}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><h3>Active project timelines</h3><button class="ghost-btn small-btn" type="button" data-nav-jump="project_logging">View projects</button></div>
        ${renderFullGantt()}
      </section>
    </div>

    <section class="panel attention-panel">
      <div class="panel-header"><h3>Outstanding work</h3><span class="muted-label">${attentionTasks.length} overdue or due today</span></div>
      ${attentionTasks.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Task</th><th>Deadline</th><th>Status</th><th>Progress</th></tr></thead><tbody>${attentionTasks.slice(0, 8).map((task) => `
        <tr><td>${escapeHTML(task.title)}</td><td>${escapeHTML(task.dueDate)}</td><td>${escapeHTML(task.status)}</td><td>${escapeHTML(state.projects.find((project) => project.id === task.projectId)?.progress ?? 0)}%</td></tr>
      `).join('')}</tbody></table></div>` : '<div class="empty-state">No overdue work or tasks scheduled for today.</div>'}
    </section>
  `;
}

function setupHomeCarousel() {
  if (homeCarouselTimer) window.clearInterval(homeCarouselTimer);
  const track = document.getElementById('home-carousel-track');
  if (!track) return;
  const dots = [...document.querySelectorAll('[data-carousel-goto]')];
  let activeIndex = 0;
  const showSlide = (index) => {
    activeIndex = (index + dots.length) % dots.length;
    track.scrollTo({ left: activeIndex * track.clientWidth, behavior: 'smooth' });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
      dot.setAttribute('aria-pressed', String(dotIndex === activeIndex));
    });
  };
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.carouselGoto))));
  track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    if (index !== activeIndex) {
      activeIndex = index;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === activeIndex);
        dot.setAttribute('aria-pressed', String(dotIndex === activeIndex));
      });
    }
  }, { passive: true });
  homeCarouselTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
}

function parseDateValue(value) {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getGanttRange(projects = state.projects) {
  const dates = projects.flatMap((project) => [parseDateValue(project.startDate), parseDateValue(project.dueDate)])
    .concat(state.tasks.flatMap((task) => [parseDateValue(task.startDate), parseDateValue(task.dueDate)]))
    .filter(Boolean);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let start = dates.length ? new Date(Math.min(...dates.map((date) => date.getTime()))) : new Date(today);
  let end = dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date(today);
  start.setDate(start.getDate() - 7); end.setDate(end.getDate() + 14);
  if (end <= start) end = new Date(start.getTime() + 30 * 86400000);
  return { start, end };
}

function ganttPosition(startValue, endValue, range) {
  const start = parseDateValue(startValue) || range.start;
  const end = parseDateValue(endValue) || start;
  const duration = Math.max(1, range.end - range.start);
  const left = Math.max(0, Math.min(100, ((start - range.start) / duration) * 100));
  const rawWidth = ((end - start) / duration) * 100;
  return { left, width: Math.max(1.2, Math.min(100 - left, rawWidth || 1.2)) };
}

function calculateProjectProgress(projectId) {
  const projectStages = state.stages.filter((stage) => String(stage.project_id) === String(projectId) && stage.active !== false);
  if (!projectStages.length) return 0;
  const stageWeightTotal = projectStages.reduce((sum, stage) => sum + Number(stage.weight || 0), 0);
  if (Math.abs(stageWeightTotal - 100) > 0.01) return 0;
  const total = projectStages.reduce((sum, stage) =>
    sum + Number(stage.weight || 0) * Number(stage.progress || 0) / 100, 0);
  return Math.round(total * 100) / 100;
}

function renderFullGantt(projectId = null) {
  const projects = projectId ? state.projects.filter((project) => String(project.id) === String(projectId)) : state.projects;
  if (!projects.length) return '<div class="empty-state">No project timelines configured.</div>';
  const range = getGanttRange(projects);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const currentPosition = ((today - range.start) / (range.end - range.start)) * 100;

  return `
    <div class="gantt-toolbar">
      <div class="gantt-view-title">${projectId ? 'Project timeline' : 'Organisation master timeline'}</div>
      <div class="gantt-scale" aria-label="Timeline scale">
        ${['daily','weekly','monthly'].map((item) => `<button type="button" class="${state.ganttScale === item ? 'active' : ''}" data-gantt-scale="${item}">${item[0].toUpperCase() + item.slice(1)}</button>`).join('')}
      </div>
    </div>
    <div class="gantt-scroll">
      <div class="gantt-canvas" aria-label="Date-positioned Gantt chart">
        <div class="gantt-header"><span>Project / task</span><span>${escapeHTML(range.start.toLocaleDateString('en-ZA'))} – ${escapeHTML(range.end.toLocaleDateString('en-ZA'))}</span></div>
        ${projects.map((project) => {
          const projectTasks = state.tasks.filter((task) => String(task.projectId) === String(project.id));
          const projectPosition = ganttPosition(project.startDate, project.dueDate, range);
          const progress = calculateProjectProgress(project.id);
          return `
            <div class="gantt-project-row">
              <button type="button" class="gantt-project-label" data-open-project="${escapeHTML(project.id)}"><strong>${escapeHTML(project.name)}</strong><small>${escapeHTML(project.status)} · ${progress}%</small></button>
              <div class="gantt-track gantt-track-large" title="${escapeHTML(project.name)}: ${progress}% complete">
                ${currentPosition >= 0 && currentPosition <= 100 ? `<span class="gantt-now" style="left:${currentPosition}%"></span>` : ''}
                <button type="button" class="gantt-bar gantt-project-bar ${String(project.status).toLowerCase() === 'completed' ? 'complete' : project.dueDate && project.dueDate < getLocalDateKey() ? 'overdue' : 'active'}" data-open-project="${escapeHTML(project.id)}" style="left:${projectPosition.left}%;width:${projectPosition.width}%" title="${escapeHTML(project.name)} · ${escapeHTML(project.startDate || 'No start')} to ${escapeHTML(project.dueDate || 'No deadline')} · ${progress}%"><span style="width:${progress}%"></span></button>
              </div>
            </div>
            ${projectTasks.map((task) => {
              const taskPosition = ganttPosition(task.startDate, task.dueDate, range);
              const overdue = task.status !== 'Completed' && task.dueDate && task.dueDate < getLocalDateKey();
              return `<div class="gantt-task-row ${state.selectedTaskId === task.id ? 'selected' : ''}">
                <button type="button" class="gantt-task-label" data-open-task="${escapeHTML(task.id)}" data-project-id="${escapeHTML(project.id)}"><span>${escapeHTML(task.title)}</span><small>${task.progress}% · ${escapeHTML(task.assignee)}</small></button>
                <div class="gantt-track gantt-task-track">
                  ${currentPosition >= 0 && currentPosition <= 100 ? `<span class="gantt-now" style="left:${currentPosition}%"></span>` : ''}
                  <button type="button" class="gantt-bar gantt-task-bar ${task.status === 'Completed' ? 'complete' : overdue ? 'overdue' : 'active'}" data-open-task="${escapeHTML(task.id)}" data-project-id="${escapeHTML(project.id)}" style="left:${taskPosition.left}%;width:${taskPosition.width}%" title="${escapeHTML(task.title)} · ${escapeHTML(task.startDate || 'No start')} to ${escapeHTML(task.dueDate || 'No deadline')} · ${task.progress}%"><span style="width:${task.progress}%"></span></button>
                </div>
              </div>`;
            }).join('')}
          `;
        }).join('')}
      </div>
    </div>`;
}

function getLocalDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

function toLocalDateTimeInputValue(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function parseMeetingDescription(value) {
  const description = String(value || '');
  const attendeeLine = description.match(/^Attendees:\s*(.*)$/m);
  return {
    attendees: attendeeLine?.[1] ? attendeeLine[1].split(',').map((name) => name.trim()).filter(Boolean) : [],
    description: attendeeLine ? description.replace(attendeeLine[0], '').trim() : description
  };
}

function renderMyWorkspace() {
  const firstName = getCurrentUser()?.name.split(' ')[0];
  const myTasks = state.tasks.filter((task) => task.assignee === firstName);
  const myProjects = state.projects.filter((project) => project.manager === firstName);
  const myMeetings = state.meetings.filter((meeting) =>
    (meeting.attendees || []).some((attendee) => attendee === firstName || attendee === getCurrentUser()?.name)
  );
  return `
    <div class="two-col">
      <section class="panel">
        <div class="panel-header"><h3>My tasks</h3><span class="muted-label">${myTasks.length} assigned</span></div>
        ${myTasks.length ? `<div class="list-stack">${myTasks.map((task) => {
          const status = String(task.status || 'To do');
          return `
            <div class="list-item">
              <div><strong>${escapeHTML(task.title)}</strong><div class="muted-label">Due ${escapeHTML(task.dueDate)}</div></div>
              <span class="status-pill status-${escapeHTML(status.toLowerCase().replace(/\s+/g, '-'))}">${escapeHTML(status)}</span>
            </div>
          `;
        }).join('')}</div>` : '<div class="empty-state">No tasks are assigned to you yet.</div>'}
      </section>
      <section class="panel">
        <div class="panel-header"><h3>My projects</h3><span class="muted-label">${myProjects.length} active</span></div>
        ${myProjects.length ? `<div class="list-stack">${myProjects.map((project) => `
          <div class="list-item">
            <div><strong>${escapeHTML(project.name)}</strong><div class="muted-label">${escapeHTML(project.client)}</div></div>
            <span class="status-pill status-progress">${escapeHTML(project.status)}</span>
          </div>
        `).join('')}</div>` : '<div class="empty-state">No projects are assigned to you yet.</div>'}
      </section>
      <section class="panel">
        <div class="panel-header"><h3>My upcoming meetings</h3><span class="muted-label">${myMeetings.length} scheduled</span></div>
        ${myMeetings.length ? `<div class="calendar-list">${myMeetings.map((meeting) => `
          <div class="calendar-item"><strong>${escapeHTML(meeting.title)}</strong><span class="muted-label">${escapeHTML(meeting.date)} · ${escapeHTML(meeting.time)}</span></div>
        `).join('')}</div>` : '<div class="empty-state">No upcoming meetings include you.</div>'}
      </section>
      <section class="panel">
        <div class="panel-header"><h3>Team notifications</h3><span class="muted-label">${state.notifications.filter((item) => !item.read).length} unread</span></div>
        ${state.notifications.length ? `<div class="list-stack">${state.notifications.slice(0, 5).map((item) => `
          <div class="list-item"><div><strong>${escapeHTML(item.title)}</strong><div class="muted-label">${escapeHTML(item.detail)}</div></div><span class="badge ${item.read ? 'status-archived' : 'status-new'}">${item.read ? 'Read' : 'New'}</span></div>
        `).join('')}</div>` : '<div class="empty-state">You are all caught up.</div>'}
      </section>
    </div>
  `;
}

function renderDailyPriorities() {
  const today = getLocalDateKey();
  const priorities = state.tasks
    .filter((task) => !['completed', 'done'].includes(String(task.status || '').toLowerCase()))
    .filter((task) =>
      (task.dueDate && task.dueDate <= today) ||
      ['critical', 'high'].includes(String(task.priority || '').toLowerCase())
    )
    .sort((left, right) => String(left.dueDate || '9999-12-31').localeCompare(String(right.dueDate || '9999-12-31')));

  return `
    <section class="task-panel">
      <div class="panel-header"><h3>Daily priorities</h3><span class="muted-label">${priorities.length} items need attention</span></div>
      ${priorities.length ? `<div class="table-wrap"><table class="table">
        <thead><tr><th>Priority</th><th>Task</th><th>Assignee</th><th>Status</th><th>Due</th></tr></thead>
        <tbody>${priorities.map((task) => `
          <tr>
            <td>${escapeHTML(task.priority)}</td>
            <td>${escapeHTML(task.title)}</td>
            <td>${escapeHTML(task.assignee)}</td>
            <td>${escapeHTML(task.status)}</td>
            <td>${escapeHTML(task.dueDate || 'Not set')}</td>
          </tr>
        `).join('')}</tbody>
      </table></div>` : '<div class="empty-state">No overdue or high-priority tasks. You are clear for today.</div>'}
    </section>
  `;
}

function renderNotifications() {
  return `
    <section class="panel">
      <div class="panel-header"><h3>Notifications</h3><span class="muted-label">${state.notifications.filter((item) => !item.read).length} unread</span></div>
      ${state.notifications.length ? `<div class="list-stack">${state.notifications.map((item) => `
        <div class="list-item">
          <div><strong>${escapeHTML(item.title)}</strong><div class="muted-label">${escapeHTML(item.detail)}</div></div>
          <span class="badge ${item.read ? 'status-archived' : 'status-new'}">${item.read ? 'Read' : 'Unread'}</span>
        </div>
      `).join('')}</div>` : '<div class="empty-state">No notifications yet.</div>'}
    </section>
  `;
}

function renderCRM() {
  const projectPayments = (project) => state.payments
    .filter((payment) => String(payment.project_id || '') === String(project.id) && payment.status !== 'Reversed')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const customerSpend = (client) => {
    const projectIds = new Set(state.projects.filter((project) =>
      String(project.clientId || '') === String(client.id) || project.client === client.businessName
    ).map((project) => String(project.id)));
    return state.payments
      .filter((payment) => payment.status !== 'Reversed' && (
        String(payment.client_id || '') === String(client.id) ||
        projectIds.has(String(payment.project_id || ''))
      ))
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  };
  const customers = state.clients.map((client) => ({ kind: 'customer', client }));
  const potentials = state.enquiries
    .filter((enquiry) => !state.clients.some((client) =>
      (enquiry.clientId && String(enquiry.clientId) === String(client.id)) ||
      (enquiry.email && client.email && enquiry.email.toLowerCase() === client.email.toLowerCase())
    ))
    .map((enquiry) => ({ kind: 'potential', enquiry }));
  const crmRows = [...customers, ...potentials];
  const totalSpend = state.clients.reduce((sum, client) => sum + customerSpend(client), 0);
  const serviceGroups = new Map();
  state.clients.forEach((client) => {
    const projects = state.projects.filter((project) =>
      String(project.clientId || '') === String(client.id) || project.client === client.businessName
    );
    projects.forEach((project) => {
      const service = project.serviceCategory || 'Uncategorized';
      const group = serviceGroups.get(service) || [];
      group.push({ client, project, revenue: projectPayments(project) });
      serviceGroups.set(service, group);
    });
  });

  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational inquiry migration not applied</strong><span>Legacy and public inquiries remain visible. Customer revenue and relationship data require the relational migration.</span></div>' : ''}
    <div class="table-panel">
      <div class="panel-header">
        <div><p class="eyebrow">Customer relationships</p><h3>CRM</h3></div>
        <div class="topbar-actions">
          <button class="ghost-btn small-btn" type="button" data-refresh-bos>Refresh</button>
          <button class="primary-btn small-btn" type="button" data-quick-action="create-inquiry">Add inquiry</button>
          <button class="ghost-btn small-btn" type="button" data-quick-action="add-client">Add customer</button>
        </div>
      </div>
      <div class="kpi-grid client-analytics">
        <div class="kpi-card"><span class="kpi-label">Customer service spend</span><span class="kpi-value">${formatCurrency(totalSpend)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Customers</span><span class="kpi-value">${customers.length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Potential customers</span><span class="kpi-value">${potentials.length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Recurring customers</span><span class="kpi-value">${state.clients.filter((client) => ['Recurring', 'Subscription'].includes(client.clientType)).length}</span></div>
      </div>
      <div class="toolbar">
        <input id="crm-search" type="search" placeholder="Search name, contact, email or service" />
        <select id="crm-filter"><option value="">All contacts</option><option value="customer">Customers only</option><option value="potential">Potential customers only</option></select>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Business / contact</th><th>Contact details</th><th>Product / service</th>
              <th>Relationship</th><th>Spent on services</th><th>Record</th>
            </tr>
          </thead>
          <tbody>
            ${crmRows.length ? crmRows.map(({ kind, client, enquiry }) => {
              const record = client || enquiry;
              const projects = client ? state.projects.filter((project) =>
                String(project.clientId || '') === String(client.id) || project.client === client.businessName
              ) : [];
              const serviceNames = client
                ? [...new Set(projects.map((project) => project.serviceCategory).filter(Boolean))].join(', ') || 'No project recorded'
                : enquiry.requestedService || enquiry.services?.join(', ') || 'General inquiry';
              const spent = client ? customerSpend(client) : 0;
              const name = client?.businessName || enquiry.client || enquiry.contactName || 'Unknown';
              const contact = client?.contactPerson || enquiry.contactName || name;
              return `<tr data-crm-row data-crm-kind="${kind}" data-crm-search="${escapeHTML(`${name} ${contact} ${record.email || ''} ${serviceNames}`)}">
                <td><strong>${escapeHTML(name)}</strong><br><span class="muted-label">${escapeHTML(kind === 'customer' ? client.status || 'Active' : enquiry.status || 'New')}</span></td>
                <td>${escapeHTML(contact)}<br><a class="muted-label" href="mailto:${escapeHTML(record.email || '')}">${escapeHTML(record.email || 'No email')}</a><br><span class="muted-label">${escapeHTML(client?.phone || enquiry?.phone || 'No phone')}</span></td>
                <td>${escapeHTML(serviceNames)}</td>
                <td>${kind === 'customer' ? escapeHTML(client.clientType || 'One-off') : 'Potential'}</td>
                <td>${kind === 'customer' ? formatCurrency(spent) : '—'}</td>
                <td>${kind === 'customer'
                  ? `<button type="button" class="ghost-btn small-btn" data-open-client="${escapeHTML(client.id)}">Open</button>`
                  : `<button type="button" class="ghost-btn small-btn" data-open-inquiry="${escapeHTML(enquiry.id)}">Open inquiry</button>
                    ${['Accepted', 'Archived', 'Declined'].includes(enquiry.status) ? '' : `<button type="button" class="primary-btn small-btn" data-accept-inquiry="${escapeHTML(enquiry.id)}">Accept</button>`}`}</td>
              </tr>`;
            }).join('') : '<tr><td colspan="6"><div class="empty-state">No customers or potential customers yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
      <section class="service-client-groups">
        <div class="panel-header"><h3>Customers by service</h3><span class="muted-label">Revenue shown is recorded payments</span></div>
        ${serviceGroups.size ? [...serviceGroups.entries()].map(([service, rows]) => `
          <details class="service-group">
            <summary><strong>${escapeHTML(service)}</strong><span>${rows.length} project${rows.length === 1 ? '' : 's'}</span><b>${formatCurrency(rows.reduce((sum, row) => sum + row.revenue, 0))}</b></summary>
            <div class="list-stack">${rows.map(({ client, project, revenue }) => `<div class="list-item">
              <button type="button" class="text-link" data-open-client="${escapeHTML(client.id)}">${escapeHTML(client.businessName)}</button>
              <span class="muted-label">${escapeHTML(project.name)}</span><strong>${formatCurrency(revenue)}</strong>
            </div>`).join('')}</div>
          </details>
        `).join('') : '<div class="empty-state">Service groupings will appear when customers have projects.</div>'}
      </section>
    </div>
  `;
}

function renderClients() {
  return renderCRM();
}

function renderProjects() {
  const selectedProject = state.projects.find((project) => String(project.id) === String(state.selectedProjectId));
  if (selectedProject) return renderProjectWindow(selectedProject);
  if (state.showProjectCalendar) return renderProjectCalendar();
  const pastProjects = state.projects.filter((project) =>
    ['completed', 'cancelled'].includes(String(project.status || '').toLowerCase())
  );
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational project migration not applied</strong><span>Legacy project records remain visible. Stage, task and Gantt operations require the redesign migration.</span></div>' : ''}
    <div class="table-panel">
      <div class="panel-header">
        <h3>Projects</h3>
        <div class="topbar-actions"><button class="ghost-btn small-btn" type="button" data-project-calendar-view>Project calendar</button>
          <button class="primary-btn small-btn" type="button" data-quick-action="create-project">Create project</button></div>
      </div>
      <div class="toolbar">
        <input type="search" id="project-search" placeholder="Search project or client" />
        <select id="project-filter">
          <option value="">All statuses</option>
          ${['Planning','Active','On hold','Completed','Cancelled','Overdue'].map((status)=>`<option>${status}</option>`).join('')}
        </select>
        <div class="view-switcher">
          <button type="button" data-project-view="list">List</button>
          <button class="active" type="button" data-project-view="gantt">Gantt</button>
        </div>
      </div>
      <div id="project-list-view" class="hidden">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Project</th>
              <th>Client</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Value</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            ${state.projects.length ? state.projects.map((project) => `
              <tr data-project-row data-project-status="${escapeHTML(project.status || '')}" data-project-search="${escapeHTML(`${project.reference || ''} ${project.name || ''} ${project.client || ''}`)}">
                <td>${escapeHTML(project.reference || String(project.id).slice(0, 8).toUpperCase())}</td>
                <td><strong>${escapeHTML(project.name)}</strong><br><span class="muted-label">${escapeHTML(project.serviceCategory || '')}</span></td>
                <td>${escapeHTML(project.client)}</td>
                <td>${escapeHTML(project.dueDate || 'Not set')}</td>
                <td><span class="status-pill">${escapeHTML(project.status || 'Planning')}</span></td>
                <td>
                  <div class="muted-label">${calculateProjectProgress(project.id)}%</div>
                  <div class="progress-bar"><span class="progress-fill" style="width: ${calculateProjectProgress(project.id)}%"></span></div>
                </td>
                <td>${formatCurrency(project.value)}</td>
                <td><button class="ghost-btn small-btn" type="button" data-open-project="${escapeHTML(project.id)}">Open</button></td>
              </tr>
            `).join('') : '<tr><td colspan="8"><div class="empty-state">No projects yet. Accept an inquiry or create a project to begin.</div></td></tr>'}
          </tbody>
        </table>
      </div>
      </div>
      <div id="project-gantt-view">
        <div class="gantt-full">${renderFullGantt()}</div>
      </div>
      <details class="project-history">
        <summary>Project history <span>${pastProjects.length} completed or cancelled</span></summary>
        ${pastProjects.length ? `<div class="list-stack">${pastProjects.map((project) => `
          <div class="list-item">
            <div><strong>${escapeHTML(project.name)}</strong><div class="muted-label">${escapeHTML(project.client)} · ${escapeHTML(project.status)}</div></div>
            <span class="muted-label">${formatCurrency(project.value)}</span>
            <button type="button" class="ghost-btn small-btn" data-open-project="${escapeHTML(project.id)}">Open history</button>
          </div>
        `).join('')}</div>` : '<div class="empty-state">Completed and cancelled projects will be available here.</div>'}
      </details>
    </div>
  `;
}

function renderProjectCalendar() {
  const meetings = state.meetings
    .slice()
    .sort((left, right) => `${left.date || ''}T${left.time || ''}`.localeCompare(`${right.date || ''}T${right.time || ''}`));
  return `
    <section class="calendar-panel">
      <div class="panel-header">
        <div><p class="eyebrow">Projects</p><h3>Project calendar</h3></div>
        <div class="topbar-actions">
          <button type="button" class="ghost-btn small-btn" data-project-calendar-back>All projects</button>
          <button type="button" class="primary-btn small-btn" data-quick-action="schedule-meeting">Schedule meeting</button>
        </div>
      </div>
      ${meetings.length ? `<div class="calendar-list">${meetings.map((meeting) => {
        const project = state.projects.find((item) => String(item.id) === String(meeting.projectId));
        return `<div class="calendar-item">
          <div><strong>${escapeHTML(meeting.title)}</strong><div class="muted-label">${escapeHTML(meeting.date || '')} · ${escapeHTML(meeting.time || '')}</div>
            <div class="muted-label">${project ? escapeHTML(project.name) : 'No linked project'}${meeting.attendees?.length ? ` · ${escapeHTML(meeting.attendees.join(', '))}` : ''}</div>
          </div>
          <div class="topbar-actions">
            ${project ? `<button type="button" class="ghost-btn small-btn" data-open-project="${escapeHTML(project.id)}">Open project</button>` : ''}
            <button type="button" class="ghost-btn small-btn" data-edit-meeting="${escapeHTML(meeting.id)}">Edit</button>
          </div>
        </div>`;
      }).join('')}</div>` : '<div class="empty-state">No meetings are scheduled yet.</div>'}
    </section>
  `;
}

function renderProjectWindow(project) {
  const stages = state.stages
    .filter((stage) => String(stage.project_id) === String(project.id) && stage.active !== false)
    .sort((left, right) => Number(left.position) - Number(right.position));
  const meetings = state.meetings
    .filter((meeting) => String(meeting.projectId) === String(project.id))
    .sort((left, right) => `${left.date || ''}T${left.time || ''}`.localeCompare(`${right.date || ''}T${right.time || ''}`));
  const progress = calculateProjectProgress(project.id);
  const incompleteWorkflow = !state.projectWorkflowAvailable || stages.length !== 5 || stages.some((stage) => Number(stage.weight) !== 20);
  const renderStageStatus = (stage) => {
    const statuses = [
      { status: 'Not started', progress: 0, label: 'Not started' },
      { status: 'Planning', progress: 33.33, label: 'Planning' },
      { status: 'In progress', progress: 66.66, label: 'In progress' },
      { status: 'Completed', progress: 100, label: 'Complete' }
    ];
    return `<div class="stage-status-controls" role="group" aria-label="${escapeHTML(stage.name)} status">
      ${statuses.map((item) => `<button type="button" class="${stage.status === item.status ? 'active' : ''}" data-stage-progress="${escapeHTML(stage.id)}" data-stage-status="${item.status}" data-progress="${item.progress}" aria-pressed="${stage.status === item.status}" ${state.projectWorkflowAvailable ? '' : 'disabled'}>
        <span>${item.label}</span><small>${item.progress}%</small>
      </button>`).join('')}
    </div>`;
  };
  const stageRows = stages.map((stage, index) => {
    const start = Math.max(0, (index / 5) * 100);
    const task = `
      <div class="project-stage-row">
        <div class="stage-task-label"><span class="stage-number">${index + 1}</span><div><strong>${escapeHTML(stage.name)}</strong><small>Task weight ${Number(stage.weight).toFixed(0)}% · ${Number(stage.progress).toFixed(2)}% complete</small></div></div>
        <div class="stage-task-content">
          ${state.projectTaskView === 'gantt' ? `<div class="stage-gantt-track" aria-label="${escapeHTML(stage.name)} timeline">
            <button type="button" class="stage-gantt-bar ${stage.status === 'Completed' ? 'complete' : ''}" data-stage-progress="${escapeHTML(stage.id)}" data-stage-status="Completed" data-progress="100" style="left:${start}%;width:20%" title="${escapeHTML(stage.name)} · ${Number(stage.progress).toFixed(2)}% complete" ${state.projectWorkflowAvailable ? '' : 'disabled'}><span style="width:${Number(stage.progress)}%"></span></button>
          </div>` : `<div class="stage-list-progress"><div class="progress-bar"><span class="progress-fill" style="width:${Number(stage.progress)}%"></span></div><strong>${Number(stage.progress).toFixed(2)}%</strong></div>`}
          ${renderStageStatus(stage)}
        </div>
      </div>`;
    return task;
  }).join('');
  const pastProjects = state.projects.filter((item) =>
    String(item.id) !== String(project.id) && ['completed', 'cancelled'].includes(String(item.status || '').toLowerCase())
  );

  return `
    <div class="project-workspace">
      <div class="project-workspace-toolbar">
        <button type="button" class="ghost-btn small-btn" data-project-back>← All projects</button>
        <div class="topbar-actions">
          <button type="button" class="ghost-btn small-btn" data-edit-project="${escapeHTML(project.id)}">Edit project</button>
          <button type="button" class="primary-btn small-btn" data-schedule-project-meeting="${escapeHTML(project.id)}">Schedule meeting</button>
        </div>
      </div>
      <section class="project-overview panel">
        <div class="project-overview-heading">
          <div><p class="eyebrow">${escapeHTML(project.serviceCategory || 'Design project')}</p><h3>${escapeHTML(project.name)}</h3><span class="muted-label">${escapeHTML(project.client)} · ${escapeHTML(project.status)}${project.dueDate ? ` · Due ${escapeHTML(project.dueDate)}` : ''}</span></div>
          <div class="project-progress-summary"><strong>${progress.toFixed(2)}%</strong><span>Project complete</span></div>
        </div>
        <div class="progress-bar"><span class="progress-fill" style="width:${progress}%"></span></div>
        ${project.description ? `<p class="project-description">${escapeHTML(project.description)}</p>` : ''}
      </section>
      ${incompleteWorkflow ? '<div class="app-warning"><strong>Design workflow needs setup</strong><span>Apply migration 202611220001 to create and normalize the five weighted project tasks before updating their progress.</span></div>' : ''}
      <section class="panel project-task-panel">
        <div class="panel-header"><div><p class="eyebrow">Weighted design process</p><h3>Project tasks</h3></div><div class="view-switcher compact-switcher" role="group" aria-label="Project task display">
          <button type="button" data-stage-view="gantt" class="${state.projectTaskView === 'gantt' ? 'active' : ''}">Gantt</button>
          <button type="button" data-stage-view="list" class="${state.projectTaskView === 'list' ? 'active' : ''}">List</button>
        </div></div>
        <div class="project-stage-header"><span>Task · 20% each</span><span>${state.projectTaskView === 'gantt' ? 'Project timeline' : 'Progress and status'}</span></div>
        ${stageRows || '<div class="empty-state">The five design tasks are not configured for this project.</div>'}
        <div class="project-weight-total"><strong>Total project weight</strong><span>${stages.reduce((sum, stage) => sum + Number(stage.weight || 0), 0).toFixed(0)}% · ${progress.toFixed(2)}% complete</span></div>
      </section>
      <section id="project-meetings" class="panel project-meetings-panel">
        <div class="panel-header"><div><p class="eyebrow">Project calendar</p><h3>Meetings</h3></div><button type="button" class="primary-btn small-btn" data-schedule-project-meeting="${escapeHTML(project.id)}">Schedule meeting</button></div>
        ${meetings.length ? `<div class="calendar-list">${meetings.map((meeting) => `<div class="calendar-item">
          <div><strong>${escapeHTML(meeting.title)}</strong><div class="muted-label">${escapeHTML(meeting.date || '')} · ${escapeHTML(meeting.time || '')}</div>${meeting.description ? `<div class="meeting-notes">${escapeHTML(meeting.description)}</div>` : ''}</div>
          <span class="status-pill">${escapeHTML((meeting.attendees || []).join(', ') || 'No attendees')}</span>
        </div>`).join('')}</div>` : '<div class="empty-state">No meetings are scheduled for this project yet.</div>'}
      </section>
      <details class="project-history">
        <summary>Past projects <span>${pastProjects.length} archived projects</span></summary>
        ${pastProjects.length ? `<div class="list-stack">${pastProjects.map((item) => `<div class="list-item">
          <div><strong>${escapeHTML(item.name)}</strong><div class="muted-label">${escapeHTML(item.client)} · ${escapeHTML(item.status)}</div></div>
          <span>${formatCurrency(item.value)}</span><button type="button" class="ghost-btn small-btn" data-open-project="${escapeHTML(item.id)}">Open</button>
        </div>`).join('')}</div>` : '<div class="empty-state">No past projects yet.</div>'}
      </details>
    </div>
  `;
}

function renderTasks() {
  return `
    <div class="task-panel">
      <div class="panel-header">
        <h3>Task management</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="create-task">Create task</button>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            ${state.tasks.map((task) => `
              <tr>
                <td>${task.title}</td>
                <td>${task.assignee}</td>
                <td>${task.priority}</td>
                <td><span class="status-pill status-${task.status.toLowerCase().replace(/\s+/g, '-')}">${task.status}</span></td>
                <td>${task.dueDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCalendar() {
  return `
    <div class="calendar-panel">
      <div class="panel-header">
        <h3>Meeting calendar</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="schedule-meeting">Schedule meeting</button>
      </div>
      <div class="calendar-list">
        ${state.meetings.map((meeting) => `
          <div class="calendar-item">
            <div>
              <strong>${escapeHTML(meeting.title)}</strong>
              <div class="muted-label">${escapeHTML(meeting.date)} • ${escapeHTML(meeting.time)}</div>
            </div>
            <span class="status-pill status-qualified">${(meeting.attendees || []).length} attendees</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderMessages() {
  return `
    <div class="message-panel">
      <div class="panel-header">
        <h3>Team messages</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="send-message">Send message</button>
      </div>
      <div class="message-box">
        ${state.messages.map((message) => `
          <div class="message-item">
            <strong>${message.user}</strong>
            <div>${message.text}</div>
            <span>${message.time}</span>
          </div>
        `).join('')}
      </div>
      <div class="message-input">
        <input id="message-input" type="text" placeholder="Type your message here..." />
        <button class="primary-btn small-btn" type="button" id="send-message-inline">Send</button>
      </div>
    </div>
  `;
}

function renderFinancial() {
  const monthBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return { key, label: new Intl.DateTimeFormat('en-ZA', { month: 'short' }).format(date), amount: 0 };
  });
  state.payments.filter((payment) => payment.status !== 'Reversed').forEach((payment) => {
    const date = String(payment.payment_date || payment.date || '').slice(0, 7);
    const bucket = monthBuckets.find((item) => item.key === date);
    if (bucket) bucket.amount += Number(payment.amount || 0);
  });
  const maxMonthlyRevenue = Math.max(1, ...monthBuckets.map((item) => item.amount));
  const projectIds = new Set(state.projects.map((project) => String(project.id)));
  const serviceRevenue = new Map();
  let unallocatedRevenue = 0;
  state.payments.filter((payment) => payment.status !== 'Reversed').forEach((payment) => {
    const project = state.projects.find((item) => String(item.id) === String(payment.project_id || ''));
    if (project && projectIds.has(String(project.id))) {
      const service = project.serviceCategory || 'Uncategorized';
      serviceRevenue.set(service, (serviceRevenue.get(service) || 0) + Number(payment.amount || 0));
    } else {
      unallocatedRevenue += Number(payment.amount || 0);
    }
  });
  const pastProjects = state.projects.filter((project) =>
    ['completed', 'cancelled'].includes(String(project.status || '').toLowerCase())
  );
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational finance migration not applied</strong><span>Legacy payment and expense records remain visible. Invoice and payment allocation require the redesign migration.</span></div>' : ''}
    <div class="finance-panel">
      <div class="panel-header">
        <h3>Finances</h3>
        <span class="muted-label">ZAR</span>
      </div>
      <section class="finance-trend" aria-label="Revenue trend over the last six months">
        <div class="panel-header"><div><p class="eyebrow">Financial trend</p><h3>Revenue received</h3></div><strong>${formatCurrency(state.finances.paymentsReceived)}</strong></div>
        <div class="trend-bars">${monthBuckets.map((item) => `<div class="trend-column" title="${item.label}: ${formatCurrency(item.amount)}">
          <strong>${formatCurrency(item.amount)}</strong><span class="trend-bar" style="height:${Math.max(4, item.amount / maxMonthlyRevenue * 100)}%"></span><small>${escapeHTML(item.label)}</small>
        </div>`).join('')}</div>
      </section>
      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Revenue received</span><span class="kpi-value">${formatCurrency(state.finances.paymentsReceived)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Outstanding invoices</span><span class="kpi-value">${formatCurrency(state.finances.outstandingBalances)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Project expenditure</span><span class="kpi-value">${formatCurrency(state.finances.projectExpenditure)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Net cash position</span><span class="kpi-value">${formatCurrency(state.finances.netCashPosition)}</span></div>
      </div>
      <div class="toolbar">
        <button class="primary-btn small-btn" type="button" data-quick-action="record-payment">Record payment</button>
        <button class="ghost-btn small-btn" type="button" data-quick-action="add-expense">Add expense</button>
        ${state.relationTablesAvailable ? '<button class="ghost-btn small-btn" type="button" data-quick-action="create-invoice">Create invoice</button>' : ''}
      </div>
      <div class="dashboard-grid">
        <section class="panel">
          <div class="panel-header"><h3>Payments</h3><span class="muted-label">${state.payments.length} records</span></div>
          ${state.payments.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>${state.payments.slice(0,10).map((payment)=>`<tr><td>${escapeHTML(payment.reference)}</td><td>${escapeHTML(payment.payment_date || payment.date || '')}</td><td>${formatCurrency(payment.amount)}</td><td>${escapeHTML(payment.status || 'Recorded')}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">No payments recorded.</div>'}
        </section>
        <section class="panel">
          <div class="panel-header"><h3>Invoices</h3><span class="muted-label">${state.invoices.length} records</span></div>
          ${state.invoices.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Due</th><th>Total</th><th>Status</th></tr></thead><tbody>${state.invoices.slice(0,10).map((invoice)=>`<tr><td>${escapeHTML(invoice.reference)}</td><td>${escapeHTML(invoice.due_date || '')}</td><td>${formatCurrency(invoice.total)}</td><td>${escapeHTML(invoice.status)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">No invoices issued.</div>'}
        </section>
      </div>
      <section class="panel attention-panel">
        <div class="panel-header"><h3>Expenditure</h3><span class="muted-label">${formatCurrency(state.finances.expenses)} total</span></div>
        ${state.expenses.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Reference</th><th>Category</th><th>Date</th><th>Amount</th></tr></thead><tbody>${state.expenses.slice(0,12).map((expense)=>`<tr><td>${escapeHTML(expense.reference)}</td><td>${escapeHTML(expense.category)}</td><td>${escapeHTML(expense.expense_date || '')}</td><td>${formatCurrency(expense.amount)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">No expenditure recorded.</div>'}
      </section>
      <section class="panel attention-panel service-revenue">
        <div class="panel-header"><h3>Revenue by service</h3><span class="muted-label">Recorded payments linked to projects</span></div>
        ${serviceRevenue.size || unallocatedRevenue ? `<div class="finance-list">
          ${[...serviceRevenue.entries()].sort((left, right) => right[1] - left[1]).map(([service, amount]) => `<div class="finance-item"><strong>${escapeHTML(service)}</strong><span>${formatCurrency(amount)}</span></div>`).join('')}
          ${unallocatedRevenue ? `<div class="finance-item"><strong>Unallocated payments</strong><span>${formatCurrency(unallocatedRevenue)}</span></div>` : ''}
        </div>` : '<div class="empty-state">Service revenue will appear as payments are linked to projects.</div>'}
      </section>
      <section class="panel attention-panel">
        <div class="panel-header"><h3>Project history</h3><span class="muted-label">${pastProjects.length} completed or cancelled</span></div>
        ${pastProjects.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Project</th><th>Client</th><th>Service</th><th>Contract value</th><th>Payments received</th></tr></thead><tbody>${pastProjects.map((project) => {
          const received = state.payments.filter((payment) =>
            String(payment.project_id || '') === String(project.id) && payment.status !== 'Reversed'
          ).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
          return `<tr><td><strong>${escapeHTML(project.name)}</strong><br><span class="muted-label">${escapeHTML(project.status)}</span></td><td>${escapeHTML(project.client)}</td><td>${escapeHTML(project.serviceCategory || 'Uncategorized')}</td><td>${formatCurrency(project.value)}</td><td>${formatCurrency(received)}</td></tr>`;
        }).join('')}</tbody></table></div>` : '<div class="empty-state">Past project financial summaries will appear here.</div>'}
      </section>
    </div>
  `;
}

function renderFiles() {
  return `
    <div class="table-panel">
      <div class="panel-header">
        <h3>Files & documents</h3>
        <button class="ghost-btn small-btn" type="button">Upload</button>
      </div>
      <div class="document-list">
        ${state.documents.map((doc) => `
          <div class="document-item">
            <div>
              <strong>${doc.name}</strong>
              <div class="muted-label">${doc.type} • ${doc.owner}</div>
            </div>
            <span class="muted-label">${doc.date}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="form-panel">
      <div class="panel-header">
        <h3>Business settings</h3>
      </div>
      <div class="field">
        <label>Company name</label>
        <input type="text" value="Aqua Capricorn Creatives" />
      </div>
      <div class="field">
        <label>Default currency</label>
        <select>
          <option selected>ZAR</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>
      <div class="field">
        <label>Timezone</label>
        <input type="text" value="Africa/Johannesburg" />
      </div>
    </div>
  `;
}

function renderModulePlaceholder() {
  const currentModule = navDefinitions.find((item) => item.key === state.activeNav);
  return `
    <section class="module-placeholder">
      <p class="eyebrow">${escapeHTML(currentModule?.group || 'Business operations')}</p>
      <h3>${escapeHTML(currentModule?.label || 'Module')}</h3>
      <p>This module is being prepared for the BOS redevelopment.</p>
    </section>
  `;
}

function openProjectEditModal(projectId) {
  const project = state.projects.find((item) => String(item.id) === String(projectId));
  if (!project) return;

  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('modal-form');
  const clientOptions = [
    '<option value="">Unassigned client</option>',
    ...state.clients.map((client) => `
      <option value="${escapeHTML(client.id)}" ${String(client.id) === String(project.clientId || '') ? 'selected' : ''}>
        ${escapeHTML(client.businessName || client.contactPerson || 'Client')}
      </option>
    `)
  ].join('');
  const categories = ['App Development', 'Website Development', 'Automation', 'Design and Branding', 'Graphic Design', 'Digital Services', 'Other'];
  const statuses = ['Planning', 'Active', 'On hold', 'Completed', 'Cancelled'];
  const projectTasks = state.tasks.filter((task) => String(task.projectId) === String(project.id));
  const projectMeetings = state.meetings.filter((meeting) => String(meeting.projectId) === String(project.id));

  title.textContent = `Manage project: ${project.name}`;
  form.innerHTML = `
    <div class="field-row">
      <div class="field"><label for="project-name">Project name</label><input id="project-name" name="projectName" required maxlength="200" value="${escapeHTML(project.name)}" /></div>
      <div class="field"><label for="project-client">Client</label><select id="project-client" name="clientId">${clientOptions}</select></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="project-category">Service category</label><select id="project-category" name="serviceCategory">${categories.map((category) => `<option ${category === project.serviceCategory ? 'selected' : ''}>${category}</option>`).join('')}</select></div>
      <div class="field"><label for="project-status">Status</label><select id="project-status" name="status">${statuses.map((status) => `<option ${status === project.status ? 'selected' : ''}>${status}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label for="project-description">Description</label><textarea id="project-description" name="description">${escapeHTML(project.description || '')}</textarea></div>
    <div class="field-row">
      <div class="field"><label for="project-budget">Budget (${escapeHTML(project.currency || 'ZAR')})</label><input id="project-budget" name="budget" type="number" min="0" step="0.01" required value="${escapeHTML(project.value ?? 0)}" /></div>
      <div class="field"><label for="project-start-date">Start date</label><input id="project-start-date" name="startDate" type="date" value="${escapeHTML(project.startDate || '')}" /></div>
      <div class="field"><label for="project-deadline">Deadline</label><input id="project-deadline" name="deadline" type="date" value="${escapeHTML(project.dueDate || '')}" /></div>
    </div>
    <div class="field"><label for="project-notes">Notes</label><textarea id="project-notes" name="notes">${escapeHTML(project.notes || '')}</textarea></div>
    <section class="project-linked-records">
      <div class="panel-header"><h4>Tasks</h4><button type="button" class="ghost-btn small-btn" id="add-project-task">Add task</button></div>
      ${projectTasks.length ? `<div class="list-stack">${projectTasks.map((task) => `
        <div class="list-item">
          <div><strong>${escapeHTML(task.title)}</strong><div class="muted-label">${escapeHTML(task.status || 'Not started')} · Due ${escapeHTML(task.dueDate || 'Not set')}</div></div>
          <button type="button" class="ghost-btn small-btn" data-edit-task="${escapeHTML(task.id)}">Edit</button>
        </div>
      `).join('')}</div>` : '<div class="empty-state">No tasks are linked to this project.</div>'}
    </section>
    <section class="project-linked-records">
      <div class="panel-header"><h4>Meetings</h4><button type="button" class="ghost-btn small-btn" id="add-project-meeting">Schedule</button></div>
      ${projectMeetings.length ? `<div class="list-stack">${projectMeetings.map((meeting) => `
        <div class="list-item">
          <div><strong>${escapeHTML(meeting.title)}</strong><div class="muted-label">${escapeHTML(meeting.date || '')} ${escapeHTML(meeting.time || '')}</div></div>
          <button type="button" class="ghost-btn small-btn" data-edit-meeting="${escapeHTML(meeting.id)}">Edit</button>
        </div>
      `).join('')}</div>` : '<div class="empty-state">No meetings are linked to this project.</div>'}
    </section>
    <div class="form-actions">
      <button type="button" class="ghost-btn small-btn" id="cancel-modal">Close</button>
      <button type="submit" class="primary-btn small-btn">Save project</button>
    </div>
  `;
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');
  document.getElementById('cancel-modal').addEventListener('click', closeModal);
  document.getElementById('add-project-task').addEventListener('click', () => {
    closeModal();
    openModal('create-task', null, { projectId: project.id });
  });
  document.getElementById('add-project-meeting').addEventListener('click', () => {
    closeModal();
    openModal('schedule-meeting', null, { projectId: project.id });
  });
  form.querySelectorAll('[data-edit-task]').forEach((button) => {
    button.addEventListener('click', () => {
      const task = projectTasks.find((item) => String(item.id) === button.dataset.editTask);
      if (!task) return;
      closeModal();
      openModal('create-task', task);
    });
  });
  form.querySelectorAll('[data-edit-meeting]').forEach((button) => {
    button.addEventListener('click', () => {
      const meeting = projectMeetings.find((item) => String(item.id) === button.dataset.editMeeting);
      if (!meeting) return;
      closeModal();
      openModal('schedule-meeting', meeting);
    });
  });

  form.onsubmit = async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const values = Object.fromEntries(new FormData(form).entries());
    const selectedClient = state.clients.find((client) => String(client.id) === String(values.clientId));
    try {
      if (state.relationTablesAvailable) {
        const { data, error } = await supabaseClient.from('projects').update({
          client_id: values.clientId || null,
          name: values.projectName.trim(),
          service_category: values.serviceCategory,
          description: values.description.trim() || null,
          budget: Number(values.budget),
          status: values.status,
          start_date: values.startDate || null,
          deadline: values.deadline || null,
          notes: values.notes.trim() || null
        }).eq('id', project.id).select('id').maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Could not find the saved project to update.');
      } else {
        const updatedProject = {
          ...project,
          name: values.projectName.trim(),
          client: selectedClient?.businessName || 'Unassigned client',
          clientId: values.clientId || null,
          serviceCategory: values.serviceCategory,
          description: values.description.trim(),
          status: values.status,
          progress: 0,
          manager: getCurrentUser()?.name.split(' ')[0] || 'Founder',
          value: Number(values.budget || 0),
          startDate: values.startDate,
          dueDate: values.deadline,
          notes: values.notes.trim()
        };
        const { data, error } = await supabaseClient.from('bos_records')
          .update({ data: updatedProject })
          .eq('record_type', 'projects')
          .eq('data->>id', project.id)
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Could not find the saved project record to update.');
      }
      closeModal();
      await loadBOSData();
      render();
    } catch (error) {
      showAppError(`Could not update the project: ${error.message}`);
      submit.disabled = false;
    }
  };
}

function openProjectDetails(projectId) {
  const project = state.projects.find((item) => String(item.id) === String(projectId));
  if (!project) return;
  state.activeNav = 'project_logging';
  state.selectedProjectId = project.id;
  state.showProjectCalendar = false;
  state.projectTaskView = 'gantt';
  saveState();
  render();
}

function openClientDetails(clientId) {
  const client = state.clients.find((item) => String(item.id) === String(clientId));
  if (!client) return;
  const projects = state.projects.filter((project) =>
    String(project.clientId || '') === String(client.id) || project.client === client.businessName
  );
  const projectIds = new Set(projects.map((project) => String(project.id)));
  const paid = state.payments.filter((payment) =>
    payment.status !== 'Reversed' && (
      String(payment.client_id || '') === String(client.id) ||
      projectIds.has(String(payment.project_id || ''))
    )
  ).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('modal-form');
  title.textContent = `Customer: ${client.businessName || client.contactPerson}`;
  form.innerHTML = `
    <dl class="detail-list">
      <dt>Contact</dt><dd>${escapeHTML(client.contactPerson || 'Not set')}</dd>
      <dt>Email</dt><dd>${client.email ? `<a href="mailto:${escapeHTML(client.email)}">${escapeHTML(client.email)}</a>` : 'Not set'}</dd>
      <dt>Telephone</dt><dd>${escapeHTML(client.phone || 'Not set')}</dd>
      <dt>Location</dt><dd>${escapeHTML(client.location || 'Not set')}</dd>
      <dt>Industry</dt><dd>${escapeHTML(client.industry || 'Not set')}</dd>
      <dt>Total paid</dt><dd><strong>${formatCurrency(paid)}</strong></dd>
    </dl>
    <div class="field"><label for="client-relationship">Relationship type</label><select id="client-relationship" name="clientType">
      ${['One-off', 'Recurring'].map((type) => `<option ${type === (client.clientType === 'Recurring' ? 'Recurring' : 'One-off') ? 'selected' : ''}>${type}</option>`).join('')}
    </select></div>
    <section class="project-linked-records"><h4>Projects and services</h4>
      ${projects.length ? `<div class="list-stack">${projects.map((project) => `<div class="list-item">
        <div><strong>${escapeHTML(project.name)}</strong><div class="muted-label">${escapeHTML(project.serviceCategory || 'Uncategorized')} · ${escapeHTML(project.status)}</div></div>
        <span>${formatCurrency(project.value)}</span>
      </div>`).join('')}</div>` : '<div class="empty-state">No projects are linked to this customer yet.</div>'}
    </section>
    <div class="form-actions"><button type="button" class="ghost-btn small-btn" id="cancel-modal">Close</button><button type="submit" class="primary-btn small-btn">Save relationship</button></div>
  `;
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');
  document.getElementById('cancel-modal').addEventListener('click', closeModal);
  form.onsubmit = async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const clientType = new FormData(form).get('clientType');
    try {
      if (state.relationTablesAvailable) {
        const { data, error } = await supabaseClient.from('clients')
          .update({ client_type: clientType }).eq('id', client.id).select('id').maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Could not find the saved customer to update.');
      } else {
        const updated = { ...client, clientType };
        const { data, error } = await supabaseClient.from('bos_records').update({ data: updated })
          .eq('record_type', 'clients').eq('data->>id', client.id).select('id').maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Could not find the saved customer to update.');
      }
      closeModal();
      await loadBOSData();
      render();
    } catch (error) {
      showAppError(`Could not update the customer: ${error.message}`);
      submit.disabled = false;
    }
  };
}

async function updateProjectStage(stageId, status, progress) {
  if (!state.relationTablesAvailable) {
    showAppError('Apply the relational project workflow migration before updating task progress.');
    return;
  }
  try {
    const { data, error } = await supabaseClient.from('project_stages')
      .update({ status, progress: Number(progress) })
      .eq('id', stageId)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Could not find the selected project task.');
    await loadBOSData();
    render();
  } catch (error) {
    showAppError(`Could not update task progress: ${error.message}`);
  }
}

function openInquiryDetails(inquiryId) {
  const inquiry = state.enquiries.find((item) => String(item.id) === String(inquiryId));
  if (!inquiry) return;
  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('modal-form');
  title.textContent = 'Inquiry details';
  form.innerHTML = `
    <dl class="detail-list">
      <dt>Reference</dt><dd>${escapeHTML(inquiry.reference || String(inquiry.id).slice(0, 8).toUpperCase())}</dd>
      <dt>Client / contact</dt><dd>${escapeHTML(inquiry.client || inquiry.contactName || 'Unknown')}</dd>
      <dt>Email</dt><dd>${escapeHTML(inquiry.email || 'Not provided')}</dd>
      <dt>Telephone</dt><dd>${escapeHTML(inquiry.phone || 'Not provided')}</dd>
      <dt>Requested service</dt><dd>${escapeHTML(inquiry.requestedService || inquiry.services?.join(', ') || 'General enquiry')}</dd>
      <dt>Source</dt><dd>${escapeHTML(inquiry.source || 'Unknown')}</dd>
      <dt>Received</dt><dd>${escapeHTML(inquiry.date || inquiry.receivedAt || 'Unknown')}</dd>
      <dt>Status</dt><dd>${escapeHTML(inquiry.status || 'New')}</dd>
    </dl>
    ${inquiry.message ? `<div class="field"><label>Original message</label><div class="detail-message">${escapeHTML(inquiry.message)}</div></div>` : ''}
    <div class="form-actions">
      <button type="button" class="ghost-btn small-btn" id="cancel-modal">Close</button>
      ${['Accepted','Archived','Declined'].includes(inquiry.status) ? '' : `<button type="button" class="primary-btn small-btn" id="accept-inquiry-from-detail">Accept inquiry</button>`}
    </div>
  `;
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');
  document.getElementById('cancel-modal').addEventListener('click', closeModal);
  document.getElementById('accept-inquiry-from-detail')?.addEventListener('click', () => openAcceptanceWorkflow(inquiry.id));
}

function bindTableFilters() {
  const bind = (searchId, filterId, rowSelector, searchAttribute, filterAttribute) => {
    const search = document.getElementById(searchId);
    const filter = document.getElementById(filterId);
    if (!search && !filter) return;
    const apply = () => {
      const query = (search?.value || '').trim().toLowerCase();
      const selected = filter?.value || '';
      document.querySelectorAll(rowSelector).forEach((row) => {
        const searchText = (row.getAttribute(searchAttribute) || '').toLowerCase();
        const filterText = (row.getAttribute(filterAttribute) || '').toLowerCase();
        row.classList.toggle('hidden', Boolean(query && !searchText.includes(query)) || Boolean(selected && !filterText.includes(selected.toLowerCase())));
      });
    };
    search?.addEventListener('input', apply);
    filter?.addEventListener('change', apply);
  };
  bind('inquiry-search','inquiry-filter','[data-inquiry-row]','data-inquiry-search','data-inquiry-status');
  bind('project-search','project-filter','[data-project-row]','data-project-search','data-project-status');
  const search = document.getElementById('crm-search');
  const filter = document.getElementById('crm-filter');
  const applyCRMFilters = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const selected = filter?.value || '';
    document.querySelectorAll('[data-crm-row]').forEach((row) => {
      row.classList.toggle('hidden',
        Boolean(query && !(row.dataset.crmSearch || '').toLowerCase().includes(query)) ||
        Boolean(selected && row.dataset.crmKind !== selected)
      );
    });
  };
  search?.addEventListener('input', applyCRMFilters);
  filter?.addEventListener('change', applyCRMFilters);
}

function renderWorkspace() {
  const workspace = document.getElementById('workspace-content');
  if (!workspace) return;

  const viewMap = {
    dashboard: renderDashboard,
    clients: renderCRM,
    project_logging: renderProjects,
    finances: renderFinancial
  };

  const selectedView = viewMap[state.activeNav] || renderModulePlaceholder;
  workspace.innerHTML = selectedView();
  setupHomeCarousel();

  document.querySelectorAll('[data-quick-action]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.dataset.quickAction);
    });
  });

  document.querySelector('[data-refresh-bos]')?.addEventListener('click', refreshBOSData);

  document.querySelectorAll('[data-view-client]').forEach((link) => {
    link.addEventListener('click', () => {
      state.activeNav = 'clients';
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-nav-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeNav = button.dataset.navJump;
      if (state.activeNav !== 'project_logging') {
        state.selectedProjectId = null;
        state.showProjectCalendar = false;
      } else {
        state.showProjectCalendar = false;
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-open-inquiry]').forEach((button) => {
    button.addEventListener('click', () => openInquiryDetails(button.dataset.openInquiry));
  });
  document.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.openProject) openProjectDetails(button.dataset.openProject);
      else if (button.dataset.openTaskManager) {
        state.activeNav = 'project_logging';
        render();
      }
    });
  });
  document.querySelectorAll('[data-open-task]').forEach((button) => {
    button.addEventListener('click', () => openProjectDetails(button.dataset.projectId));
  });
  document.querySelectorAll('[data-open-client]').forEach((button) => {
    button.addEventListener('click', () => openClientDetails(button.dataset.openClient));
  });
  document.querySelectorAll('[data-accept-inquiry]').forEach((button) => {
    button.addEventListener('click', () => openAcceptanceWorkflow(button.dataset.acceptInquiry));
  });

  document.querySelectorAll('[data-open-project-calendar]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeNav = 'project_logging';
      state.selectedProjectId = null;
      state.showProjectCalendar = true;
      saveState();
      render();
    });
  });
  document.querySelector('[data-project-calendar-view]')?.addEventListener('click', () => {
    state.showProjectCalendar = true;
    state.selectedProjectId = null;
    render();
  });
  document.querySelector('[data-project-calendar-back]')?.addEventListener('click', () => {
    state.showProjectCalendar = false;
    render();
  });
  document.querySelectorAll('[data-edit-meeting]').forEach((button) => {
    const meeting = state.meetings.find((item) => String(item.id) === String(button.dataset.editMeeting));
    if (meeting) button.addEventListener('click', () => openModal('schedule-meeting', meeting));
  });

  document.querySelector('[data-open-task-manager]')?.addEventListener('click', () => {
    const today = getLocalDateKey();
    const task = [...state.tasks, ...state.stages.map((stage) => ({
      projectId: stage.project_id,
      dueDate: state.projects.find((project) => String(project.id) === String(stage.project_id))?.dueDate,
      status: stage.status
    }))]
      .filter((item) => item.projectId && !['completed', 'done'].includes(String(item.status || '').toLowerCase()))
      .sort((left, right) => String(left.dueDate || '9999-12-31').localeCompare(String(right.dueDate || '9999-12-31')))
      .find((item) => !item.dueDate || item.dueDate >= today);
    state.activeNav = 'project_logging';
    state.selectedProjectId = task?.projectId || null;
    state.projectTaskView = 'list';
    saveState();
    render();
  });

  document.querySelectorAll('[data-stage-view]').forEach((button) => {
    button.addEventListener('click', () => {
      state.projectTaskView = button.dataset.stageView;
      render();
    });
  });
  document.querySelectorAll('[data-stage-progress]').forEach((button) => {
    button.addEventListener('click', () => updateProjectStage(
      button.dataset.stageProgress,
      button.dataset.stageStatus,
      button.dataset.progress
    ));
  });
  document.querySelectorAll('[data-edit-project]').forEach((button) => {
    button.addEventListener('click', () => openProjectEditModal(button.dataset.editProject));
  });
  document.querySelectorAll('[data-schedule-project-meeting]').forEach((button) => {
    button.addEventListener('click', () => openModal('schedule-meeting', null, { projectId: button.dataset.scheduleProjectMeeting }));
  });
  document.querySelector('[data-project-back]')?.addEventListener('click', () => {
    state.selectedProjectId = null;
    saveState();
    render();
  });

  document.querySelectorAll('[data-project-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-project-view]').forEach((item) => item.classList.toggle('active', item === button));
      document.getElementById('project-list-view')?.classList.toggle('hidden', button.dataset.projectView !== 'list');
      document.getElementById('project-gantt-view')?.classList.toggle('hidden', button.dataset.projectView !== 'gantt');
    });
  });

  bindTableFilters();

  const inlineMessageBtn = document.getElementById('send-message-inline');
  if (inlineMessageBtn) {
    inlineMessageBtn.addEventListener('click', async () => {
      const field = document.getElementById('message-input');
      const text = field?.value.trim();
      if (!text) return;
      const message = {
        user: getCurrentUser()?.name.split(' ')[0] || 'Founder',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      inlineMessageBtn.disabled = true;
      try {
        await addBOSRecord('messages', message);
        state.messages.push(message);
        render();
      } catch (error) {
        showAppError(`Could not send message: ${error.message}`);
        inlineMessageBtn.disabled = false;
      }
    });
  }
}

function render() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    return;
  }

  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  getPageTitle();
  renderSidebar();
  renderWorkspace();
  showAppError(state.errorMessage);
};

function openModal(actionKey, existingRecord = null, defaults = {}) {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('modal-form');
  const definition = modalCatalog[actionKey];
  if (!modalBackdrop || !definition) return;

  const isEditing = Boolean(existingRecord?.id);
  const values = {
    ...defaults,
    ...(actionKey === 'create-project' ? {
      projectName: existingRecord?.name,
      clientId: existingRecord?.clientId,
      serviceCategory: existingRecord?.serviceCategory,
      description: existingRecord?.description,
      projectValue: existingRecord?.value,
      status: existingRecord?.status,
      startDate: existingRecord?.startDate,
      deadline: existingRecord?.dueDate,
      notes: existingRecord?.notes
    } : {}),
    ...(actionKey === 'create-task' ? {
      taskTitle: existingRecord?.title,
      projectId: existingRecord?.projectId,
      assignee: existingRecord?.assignee === 'Rorisang' ? 'Rorisang' : 'Thoriso',
      priority: existingRecord?.priority === 'Urgent' ? 'Critical' : existingRecord?.priority === 'Medium' ? 'Normal' : existingRecord?.priority,
      status: existingRecord?.status === 'To do' ? 'Not started' : existingRecord?.status,
      dueDate: existingRecord?.dueDate
    } : {}),
    ...(actionKey === 'schedule-meeting' ? {
      meetingTitle: existingRecord?.title,
      projectId: existingRecord?.projectId,
      meetingDate: existingRecord?.date,
      meetingTime: existingRecord?.time,
      description: existingRecord?.description,
      attendees: existingRecord?.attendees?.join(', ')
    } : {})
  };
  modalTitle.textContent = isEditing ? `Edit ${definition.title.toLowerCase()}` : definition.title;
  modalForm.innerHTML = `
    ${definition.fields.map((field) => {
      const value = values[field.name] ?? '';
      const required = field.required ? ' required' : '';
      const fieldContent = field.type === 'textarea'
        ? `<textarea name="${field.name}" placeholder="${escapeHTML(field.placeholder || '')}"${required}>${escapeHTML(value)}</textarea>`
        : field.type === 'select' || field.type === 'project-select' || field.type === 'client-select'
          ? `<select name="${field.name}"${required}>${
            field.type === 'project-select'
              ? `<option value="">No project</option>${state.projects.map((project) => `<option value="${escapeHTML(project.id)}" ${String(project.id) === String(value) ? 'selected' : ''}>${escapeHTML(project.name)}</option>`).join('')}`
              : field.type === 'client-select'
                ? `<option value="">Unassigned client</option>${state.clients.map((client) => `<option value="${escapeHTML(client.id)}" ${String(client.id) === String(value) ? 'selected' : ''}>${escapeHTML(client.businessName || client.contactPerson || 'Client')}</option>`).join('')}`
                : field.options.map((option) => `<option value="${escapeHTML(option)}" ${option === value ? 'selected' : ''}>${escapeHTML(option)}</option>`).join('')
          }</select>`
          : `<input type="${field.type}" name="${field.name}" placeholder="${escapeHTML(field.placeholder || '')}" value="${escapeHTML(value)}"${field.min ? ` min="${field.min}"` : ''}${field.step ? ` step="${field.step}"` : ''}${required} />`;

      return `
        <div class="field">
          <label>${escapeHTML(field.label)}</label>
          ${fieldContent}
        </div>
      `;
    }).join('')}
    <div class="form-actions">
      <button type="button" class="ghost-btn small-btn" id="cancel-modal">Cancel</button>
      <button type="submit" class="primary-btn small-btn">Save</button>
    </div>
  `;

  modalBackdrop.classList.remove('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  document.getElementById('cancel-modal').addEventListener('click', () => closeModal());

  modalForm.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(modalForm);
    const values = Object.fromEntries(formData.entries());
    const submitButton = modalForm.querySelector('[type="submit"]');
    submitButton.disabled = true;

    try {
      const id = crypto.randomUUID();
      const founder = getCurrentUser()?.name.split(' ')[0] || 'Founder';
      let recordType;
      let record;
      switch (actionKey) {
        case 'create-project':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const projectReference = `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            const { error: projectError } = await supabaseClient.from('projects').insert({
              business_id: businessId,
              client_id: values.clientId || null,
              name: values.projectName.trim(),
              reference: projectReference,
              service_category: values.serviceCategory,
              description: values.description.trim() || null,
              budget: Number(values.projectValue || 0),
              currency: 'ZAR',
              status: values.status,
              start_date: values.startDate || null,
              deadline: values.deadline || null,
              notes: values.notes.trim() || null
            });
            if (projectError) throw projectError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          const projectClient = state.clients.find((client) => String(client.id) === String(values.clientId));
          recordType = 'projects';
          record = {
            id, name: values.projectName.trim(), client: projectClient?.businessName || 'Unassigned client',
            clientId: values.clientId || null,
            serviceCategory: values.serviceCategory,
            description: values.description.trim(),
            status: values.status,
            progress: 0,
            manager: getCurrentUser()?.name.split(' ')[0] || 'Founder',
            value: Number(values.projectValue || 0),
            startDate: values.startDate,
            dueDate: values.deadline,
            notes: values.notes.trim()
          };
          break;
        case 'create-task':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const taskPayload = {
              project_id: values.projectId || null,
              title: values.taskTitle,
              due_date: values.dueDate || null,
              status: values.status,
              priority: values.priority === 'Normal' ? 'Medium' : values.priority === 'Critical' ? 'Urgent' : values.priority
            };
            const { data: savedTask, error: taskError } = isEditing
              ? await supabaseClient.from('tasks').update(taskPayload).eq('id', existingRecord.id).select('id').maybeSingle()
              : await supabaseClient.from('tasks').insert({ ...taskPayload, business_id: businessId });
            if (taskError) throw taskError;
            if (isEditing && !savedTask) throw new Error('Could not find the saved task to update.');
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'tasks';
          record = {
            id: existingRecord?.id || id,
            title: values.taskTitle.trim(),
            projectId: values.projectId || '',
            assignee: values.assignee, priority: values.priority,
            status: values.status, dueDate: values.dueDate
          };
          break;
        case 'schedule-meeting':
          const meetingStart = new Date(`${values.meetingDate}T${values.meetingTime}`).toISOString();
          const attendeeNames = values.attendees.split(',').map((item) => item.trim()).filter(Boolean);
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const meetingPayload = {
              project_id: values.projectId || null,
              title: values.meetingTitle.trim(),
              start_at: meetingStart,
              description: [
                values.description.trim(),
                attendeeNames.length ? `Attendees: ${attendeeNames.join(', ')}` : ''
              ].filter(Boolean).join('\n\n') || null
            };
            const { data: savedMeeting, error: meetingError } = isEditing
              ? await supabaseClient.from('meetings').update(meetingPayload).eq('id', existingRecord.id).select('id').maybeSingle()
              : await supabaseClient.from('meetings').insert({ ...meetingPayload, business_id: businessId });
            if (meetingError) throw meetingError;
            if (isEditing && !savedMeeting) throw new Error('Could not find the saved meeting to update.');
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'meetings';
          record = {
            id: existingRecord?.id || id,
            projectId: values.projectId || '',
            title: values.meetingTitle.trim(), date: values.meetingDate,
            time: values.meetingTime,
            attendees: attendeeNames
          };
          break;
        case 'add-client':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const { error: clientError } = await supabaseClient.from('clients').insert({
              business_id: businessId,
              name: values.contactPerson || values.businessName,
              business_name: values.businessName,
              client_type: 'One-off',
              email: values.email || null,
              telephone: values.telephone || null,
              status: 'Active',
              internal_notes: 'Recently added via BOS.'
            });
            if (clientError) throw clientError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'clients';
          record = {
            id, businessName: values.businessName, contactPerson: values.contactPerson,
            email: values.email, phone: values.telephone || '', location: 'TBD',
            industry: values.industry, website: '',
            notes: 'Recently added via BOS module.'
          };
          break;
        case 'create-quotation':
          recordType = 'enquiries';
          record = {
            id, client: values.clientName, business: values.clientName,
            email: 'unknown@company.co.za', phone: 'N/A',
            industry: 'General', services: ['Quotation'],
            source: 'Internal quotation', assignedTo: founder,
            status: 'qualified', date: new Date().toISOString().slice(0, 10)
          };
          break;
        case 'record-payment':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const { error: paymentError } = await supabaseClient.from('payments').insert({
              business_id: businessId,
              reference: values.invoiceRef,
              amount: Number(values.amount || 0),
              currency: 'ZAR',
              payment_method: 'Recorded manually',
              payment_date: values.receivedDate,
              status: 'Recorded'
            });
            if (paymentError) throw paymentError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'financial_transactions';
          record = { id, kind: 'payment', amount: Number(values.amount || 0), reference: values.invoiceRef, date: values.receivedDate };
          break;
        case 'add-expense':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const { error: expenseError } = await supabaseClient.from('expenses').insert({
              business_id: businessId,
              reference: `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
              description: values.expenseName,
              category: 'Other',
              amount: Number(values.expenseAmount || 0),
              currency: 'ZAR',
              expense_date: values.expenseDate,
              payment_status: 'Recorded'
            });
            if (expenseError) throw expenseError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'financial_transactions';
          record = { id, kind: 'expense', amount: Number(values.expenseAmount || 0), description: values.expenseName, date: values.expenseDate };
          break;
        case 'send-message':
          recordType = 'messages';
          record = { id, user: founder, text: values.messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          break;
        case 'create-inquiry':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const inquiryReference = `ENQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            const { error: enquiryError } = await supabaseClient.from('enquiries').insert({
              business_id: businessId,
              reference: inquiryReference,
              contact_name: values.contactName.trim(),
              email: values.email || null,
              telephone: values.telephone || null,
              requested_service: values.requestedService,
              description: values.description || null,
              source: 'Manual',
              status: 'New'
            });
            if (enquiryError) throw enquiryError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'enquiries';
          record = {
            id, client: values.contactName, contactName: values.contactName,
            business: values.contactName, email: values.email,
            phone: values.telephone, services: [values.requestedService],
            requestedService: values.requestedService, source: 'Manual',
            status: 'New', assignedTo: founder,
            date: new Date().toISOString().slice(0, 10), message: values.description
          };
          break;
        case 'create-invoice':
          if (!state.relationTablesAvailable) throw new Error('Apply the relational redesign migration before creating invoices.');
          const invoiceReference = `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
          const { error: invoiceError } = await supabaseClient.from('invoices').insert({
            business_id: await getCurrentBusinessId(),
            client_id: values.clientId,
            project_id: values.projectId || null,
            reference: invoiceReference,
            status: 'Issued',
            currency: 'ZAR',
            issue_date: new Date().toISOString().slice(0, 10),
            due_date: values.dueDate,
            subtotal: Number(values.total || 0),
            tax_total: 0,
            total: Number(values.total || 0)
          });
          if (invoiceError) throw invoiceError;
          closeModal();
          await loadBOSData();
          render();
          return;
        default:
          return;
      }

      if (isEditing) {
        const { data, error } = await supabaseClient.from('bos_records')
          .update({ data: record })
          .eq('record_type', recordType)
          .eq('data->>id', existingRecord.id)
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Could not find the saved record to update.');
      } else {
        await addBOSRecord(recordType, record);
      }
      showAppError();
      closeModal();
      await loadBOSData();
      render();
    } catch (error) {
      showAppError(`Could not save this item: ${error.message}`);
      submitButton.disabled = false;
    }
  };
}

async function openAcceptanceWorkflow(inquiryId) {
  if (!state.relationTablesAvailable) {
    showAppError('The inquiry-to-project workflow requires the relational redesign migration in Supabase.');
    return;
  }
  const inquiry = state.enquiries.find((item) => String(item.id) === String(inquiryId));
  if (!inquiry) {
    showAppError('Could not find the selected inquiry.');
    return;
  }

  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('modal-form');
  title.textContent = 'Accept inquiry and create project';
  form.innerHTML = `
    <div class="acceptance-summary">
      <strong>${escapeHTML(inquiry.client || inquiry.contactName || 'Client')}</strong>
      <span class="muted-label">${escapeHTML(inquiry.requestedService || inquiry.services?.join(', ') || 'General enquiry')}</span>
    </div>
    <div class="field-row">
      <div class="field"><label>Project name</label><input name="projectName" required value="${escapeHTML(`${inquiry.client || inquiry.contactName || 'New'} project`)}" /></div>
      <div class="field"><label>Service category</label><select name="serviceCategory">${['App Development','Website Development','Automation','Design and Branding','Graphic Design','Digital Services','Other'].map((item)=>`<option ${item === (inquiry.requestedService || '') ? 'selected' : ''}>${item}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Project description</label><textarea name="description" required>${escapeHTML(inquiry.message || '')}</textarea></div>
    <div class="field-row">
      <div class="field"><label>Agreed project price (ZAR)</label><input name="budget" type="number" min="0" step="0.01" required /></div>
      <div class="field"><label>Currency</label><select name="currency"><option>ZAR</option><option>USD</option><option>EUR</option></select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Expected start date</label><input name="startDate" type="date" /></div>
      <div class="field"><label>Project deadline</label><input name="deadline" type="date" required /></div>
    </div>
    <div class="field"><label>Additional requirements</label><textarea name="requirements"></textarea></div>
    <div class="field-row">
      <div class="field"><label>Initial expenditure estimate (ZAR)</label><input name="expenditureEstimate" type="number" min="0" step="0.01" value="0" /></div>
      <div class="field"><label>Project notes</label><input name="notes" /></div>
    </div>
    <div class="form-actions">
      <button type="button" class="ghost-btn small-btn" id="cancel-modal">Cancel</button>
      <button type="submit" class="primary-btn small-btn">Accept and create project</button>
    </div>
  `;
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');
  document.getElementById('cancel-modal').addEventListener('click', closeModal);

  form.onsubmit = async (event) => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const values = Object.fromEntries(new FormData(form).entries());
      const businessId = await getCurrentBusinessId();
      let clientId = inquiry.clientId || null;
      if (!clientId) {
        const existing = state.clients.find((client) =>
          client.email && inquiry.email && client.email.toLowerCase() === inquiry.email.toLowerCase()
        );
        if (existing) {
          clientId = existing.id;
        } else {
          const { data: client, error: clientError } = await supabaseClient
            .from('clients')
            .insert({
              business_id: businessId,
              name: inquiry.contactName || inquiry.client || 'Unknown contact',
              business_name: inquiry.client || inquiry.contactName || null,
              email: inquiry.email || null,
              telephone: inquiry.phone || null,
              status: 'Active',
              acquisition_source: inquiry.source || 'Inquiry'
            })
            .select('id')
            .single();
          if (clientError) throw clientError;
          clientId = client.id;
        }
      }
      const { data: projectId, error } = await supabaseClient.rpc('accept_enquiry_as_project', {
        p_enquiry_id: inquiry.id,
        p_project_name: values.projectName.trim(),
        p_client_id: clientId,
        p_service_category: values.serviceCategory,
        p_description: values.description.trim(),
        p_budget: Number(values.budget),
        p_currency: values.currency,
        p_start_date: values.startDate || null,
        p_deadline: values.deadline,
        p_requirements: values.requirements || null,
        p_initial_expenditure_estimate: Number(values.expenditureEstimate || 0),
        p_notes: values.notes || null
      });
      if (error) throw error;
      closeModal();
      await loadBOSData();
      state.activeNav = 'project_logging';
      saveState();
      showAppError();
      render();
    } catch (error) {
      showAppError(`Could not accept the inquiry: ${error.message}`);
      submit.disabled = false;
    }
  };
}

function closeModal() {
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (!modalBackdrop) return;
  modalBackdrop.classList.add('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

async function handleLogin(event) {
  event.preventDefault();
  if (!supabaseClient) {
    setAuthMessage('Supabase is unavailable. Check the project URL, publishable key, and Supabase client script.', 'error');
    return;
  }

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!isFounderEmail(email)) {
    setAuthMessage('This account is not authorized to use the Business Operating System.', 'error');
    return;
  }

  const submitButton = document.querySelector('#login-form [type="submit"]');
  submitButton.disabled = true;
  setAuthMessage('Signing in…', 'info');
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setAuthMessage('Login successful. Loading your BOS…', 'success');
  } catch (error) {
    setAuthMessage(`Could not sign in: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
  }
}

async function logout() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showAppError(`Could not log out: ${error.message}`);
    return;
  }
  state.currentUser = null;
  render();
}

function bindGlobalActions() {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  document.getElementById('brand-dashboard')?.addEventListener('click', () => {
    state.activeNav = 'dashboard';
    saveState();
    render();
  });
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeModal();
  });
}

function refreshBOSWhenVisible() {
  if (document.visibilityState === 'hidden' || !getCurrentUser()) return;
  refreshBOSData();
}

async function initializeAuth() {
  if (!supabaseClient) {
    setAuthMessage('Supabase is not configured. Check supabase-config.js and the Supabase client script.', 'error');
    return;
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event !== 'INITIAL_SESSION') {
      window.setTimeout(() => loadForSession(session), 0);
    }
  });

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    await loadForSession(data.session);
  } catch (error) {
    setAuthMessage(`Could not check your Supabase session: ${error.message}`, 'error');
  }
}

bindGlobalActions();
render();
window.addEventListener('focus', refreshBOSWhenVisible);
document.addEventListener('visibilitychange', refreshBOSWhenVisible);
initializeAuth();
