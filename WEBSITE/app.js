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

const seedState = {
  currentUser: null,
  activeNav: 'dashboard',
  contextVisible: false,
  enquiries: [
    {
      id: 'ENQ-1042',
      client: 'Nandi Studio',
      business: 'Nandi Studio',
      email: 'hello@nandi.co.za',
      phone: '081 222 3344',
      industry: 'Beauty and personal care',
      services: ['Brand refresh', 'Website development'],
      source: 'Website form',
      assignedTo: 'Thoriso',
      status: 'new',
      date: '2026-11-18'
    },
    {
      id: 'ENQ-1051',
      client: 'Mango Logistics',
      business: 'Mango Logistics',
      email: 'ops@mangologistics.co.za',
      phone: '071 454 8951',
      industry: 'Construction and trades',
      services: ['Workflow automation', 'Order management'],
      source: 'Referral',
      assignedTo: 'Rorisang',
      status: 'qualified',
      date: '2026-11-14'
    },
    {
      id: 'ENQ-1054',
      client: 'Beau Bites',
      business: 'Beau Bites',
      email: 'hello@beaubites.co.za',
      phone: '083 370 9204',
      industry: 'Food and hospitality',
      services: ['Landing page', 'Brand identity'],
      source: 'Social media',
      assignedTo: 'Thoriso',
      status: 'reviewing',
      date: '2026-11-10'
    }
  ],
  clients: [
    {
      id: 'CL-201',
      businessName: 'Nandi Studio',
      contactPerson: 'Nandi Mokoena',
      email: 'hello@nandi.co.za',
      phone: '081 222 3344',
      location: 'Cape Town',
      industry: 'Beauty and personal care',
      website: 'https://nandi-studio.co.za',
      notes: 'Luxury beauty brand repositioning.'
    },
    {
      id: 'CL-204',
      businessName: 'Mango Logistics',
      contactPerson: 'Adebayo Mokoena',
      email: 'ops@mangologistics.co.za',
      phone: '071 454 8951',
      location: 'Johannesburg',
      industry: 'Construction and trades',
      website: 'https://mangologistics.co.za',
      notes: 'Operational systems upgrade.'
    }
  ],
  projects: [
    {
      id: 'PRJ-210',
      name: 'Nandi Studio rebrand',
      client: 'Nandi Studio',
      status: 'In progress',
      progress: 68,
      manager: 'Thoriso',
      value: 42000,
      dueDate: '2026-12-14'
    },
    {
      id: 'PRJ-214',
      name: 'Mango workflows',
      client: 'Mango Logistics',
      status: 'Under review',
      progress: 82,
      manager: 'Rorisang',
      value: 56000,
      dueDate: '2026-12-03'
    },
    {
      id: 'PRJ-218',
      name: 'Beau Bites launch site',
      client: 'Beau Bites',
      status: 'Planning',
      progress: 33,
      manager: 'Thoriso',
      value: 26000,
      dueDate: '2027-01-10'
    }
  ],
  tasks: [
    {
      id: 'TSK-331',
      title: 'Finalise Nandi brand deck',
      projectId: 'PRJ-210',
      assignee: 'Thoriso',
      priority: 'High',
      status: 'In progress',
      dueDate: '2026-11-20'
    },
    {
      id: 'TSK-336',
      title: 'Integrate customer enquiry pipeline',
      projectId: 'PRJ-214',
      assignee: 'Rorisang',
      priority: 'Critical',
      status: 'Blocked',
      dueDate: '2026-11-19'
    },
    {
      id: 'TSK-339',
      title: 'Prepare Beau Bites homepage wireframe',
      projectId: 'PRJ-218',
      assignee: 'Thoriso',
      priority: 'Normal',
      status: 'To do',
      dueDate: '2026-11-25'
    }
  ],
  meetings: [
    { id: 'MTG-11', title: 'Brand review', date: '2026-11-20', time: '10:00', attendees: ['Thoriso', 'Rorisang'] },
    { id: 'MTG-12', title: 'Client discovery session', date: '2026-11-22', time: '14:00', attendees: ['Thoriso', 'Rorisang', 'Nandi Studio'] },
    { id: 'MTG-13', title: 'Technical implementation check-in', date: '2026-11-24', time: '09:30', attendees: ['Rorisang'] }
  ],
  messages: [
    { user: 'Thoriso', text: 'Brand directions are ready for the customer review.', time: '09:15' },
    { user: 'Rorisang', text: 'The database schema for the enquiry pipeline is aligned.', time: '09:48' },
    { user: 'Thoriso', text: 'Let us schedule the design approvals for tomorrow morning.', time: '10:06' }
  ],
  notifications: [
    { title: 'New enquiry', detail: 'Nandi Studio enquiry received', read: false },
    { title: 'Task reassigned', detail: 'Customer enquiry pipeline moved to Rorisang', read: true },
    { title: 'Project milestone', detail: 'Nandi Studio rebrand moved to 68%', read: false }
  ],
  documents: [
    { name: 'Nandi Brand Brief.pdf', type: 'Project', owner: 'Thoriso', date: '2026-11-15' },
    { name: 'Tech Architecture Review.md', type: 'Technical', owner: 'Rorisang', date: '2026-11-12' },
    { name: 'Mango Invoice Q4.pdf', type: 'Finance', owner: 'Rorisang', date: '2026-11-11' }
  ],
  finances: {
    acceptedProjectValue: 126000,
    paymentsReceived: 84000,
    outstandingBalances: 42000,
    pendingQuotations: 18000,
    invoicesIssued: 98000,
    expenses: 24000,
    netCashPosition: 60000
  }
};

const state = loadState();
const supabaseConfig = window.AQUA_SUPABASE_CONFIG;
const supabaseConfigured = Boolean(
  supabaseConfig?.url &&
  supabaseConfig?.publishableKey &&
  !supabaseConfig.url.includes('YOUR_PROJECT_ID') &&
  !supabaseConfig.publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY')
);
const supabaseClient = supabaseConfigured
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;
const navDefinitions = [
  { key: 'inquiries', label: 'Inquiries', icon: 'inbox', group: 'Operational navigation' },
  { key: 'project_logging', label: 'Project Logging', icon: 'folder-kanban', group: 'Operational navigation' },
  { key: 'clients', label: 'Clients', icon: 'users', group: 'Operational navigation' },
  { key: 'finances', label: 'Finances', icon: 'wallet', group: 'Operational navigation' }
];

const modalCatalog = {
  'create-project': {
    title: 'Create project',
    fields: [
      { name: 'projectName', label: 'Project name', type: 'text', placeholder: 'New client project' },
      { name: 'client', label: 'Client', type: 'text', placeholder: 'Client or business name' },
      { name: 'projectValue', label: 'Contract value (ZAR)', type: 'number', placeholder: '45000' },
      { name: 'status', label: 'Status', type: 'select', options: ['Planning', 'Not started', 'In progress', 'Awaiting client feedback'] }
    ]
  },
  'create-task': {
    title: 'Create task',
    fields: [
      { name: 'taskTitle', label: 'Task title', type: 'text', placeholder: 'Prepare discovery notes' },
      { name: 'assignee', label: 'Assignee', type: 'select', options: ['Thoriso', 'Rorisang'] },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Normal', 'High', 'Critical'] },
      { name: 'dueDate', label: 'Due date', type: 'date' }
    ]
  },
  'schedule-meeting': {
    title: 'Schedule meeting',
    fields: [
      { name: 'meetingTitle', label: 'Meeting title', type: 'text', placeholder: 'Weekly project sync' },
      { name: 'meetingDate', label: 'Date', type: 'date' },
      { name: 'meetingTime', label: 'Time', type: 'time' },
      { name: 'attendees', label: 'Attendees', type: 'text', placeholder: 'Thoriso, Rorisang' }
    ]
  },
  'add-client': {
    title: 'Add client',
    fields: [
      { name: 'businessName', label: 'Business name', type: 'text', placeholder: 'Greenline Trading' },
      { name: 'contactPerson', label: 'Contact person', type: 'text', placeholder: 'Lerato' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'hello@company.co.za' },
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
    activeNav: saved.activeNav || 'dashboard',
    contextVisible: Boolean(saved.contextVisible),
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
    relationTablesAvailable: false,
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
    contextVisible: state.contextVisible,
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
    supabaseClient.from('clients').select('*').order('created_at', { ascending: false }),
    supabaseClient.from('invoices').select('*').order('issue_date', { ascending: false }),
    supabaseClient.from('payments').select('*').order('payment_date', { ascending: false }),
    supabaseClient.from('expenses').select('*').order('expense_date', { ascending: false })
  ]);

  state.relationTablesAvailable = relationalQueries.every((result) => result.status === 'fulfilled' && !result.value.error);
  state.migrationRequired = !state.relationTablesAvailable;

  if (state.relationTablesAvailable) {
    const [relEnquiries, relProjects, relStages, relTasks, relClients, relInvoices, relPayments, relExpenses] =
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
      currency: item.currency
    }));
    state.stages = relStages;
    state.tasks = relTasks.map((item) => ({
      id: item.id,
      title: item.title,
      projectId: item.project_id,
      assignee: item.assignee_id ? 'Assigned user' : 'Unassigned',
      priority: item.priority,
      status: item.status,
      dueDate: item.due_date,
      startDate: item.start_date,
      description: item.description,
      notes: item.notes
    }));
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
  const user = getCurrentUser();
  if (profile) {
    const initials = user?.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('') || 'AC';
    profile.innerHTML = `
      <span class="profile-avatar">${escapeHTML(initials)}</span>
      <span class="profile-copy"><strong>${escapeHTML(user?.name || 'Aqua Capricorn')}</strong><small>${escapeHTML(user?.role || 'Founder')}</small></span>
    `;
  }

  navContainer.innerHTML = navDefinitions.map((item) => `
    <button class="nav-item ${state.activeNav === item.key ? 'active' : ''}" type="button" data-nav="${item.key}">
      <span class="nav-icon" aria-hidden="true">${item.icon === 'inbox' ? 'IN' : item.icon === 'folder-kanban' ? 'PJ' : item.icon === 'users' ? 'CL' : 'FN'}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  navContainer.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', async () => {
      state.activeNav = button.dataset.nav;
      state.expandedNavGroup = navDefinitions.find((item) => item.key === state.activeNav)?.group || null;
      saveState();
      if (state.activeNav === 'inquiries' || state.activeNav === 'dashboard') {
        try {
          await loadBOSData();
          showAppError();
        } catch (error) {
          showAppError(`Could not refresh enquiries: ${error.message}`);
        }
      }
      render();
    });
  });
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
  const label = navDefinitions.find((item) => item.key === state.activeNav)?.label || 'Dashboard';
  document.getElementById('page-title').textContent = label;
}

function renderDashboard() {
  const user = getCurrentUser();
  const firstName = user?.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = getLocalDateKey();
  const newInquiries = state.enquiries.filter((item) =>
    ['new', 'new enquiry', 'under review'].includes(String(item.status || '').toLowerCase())
  );
  const outstandingProjects = state.projects.filter((project) =>
    !['completed', 'cancelled'].includes(String(project.status || '').toLowerCase())
  );
  const attentionTasks = state.tasks
    .filter((task) => !['completed', 'done'].includes(String(task.status || '').toLowerCase()))
    .filter((task) => task.dueDate && (task.dueDate <= today))
    .sort((left, right) => String(left.dueDate || '').localeCompare(String(right.dueDate || '')));
  const todayTasks = state.tasks.filter((task) => task.dueDate === today);
  const recentInquiries = state.enquiries
    .slice()
    .sort((left, right) => String(right.receivedAt || right.date || '').localeCompare(String(left.receivedAt || left.date || '')))
    .slice(0, 5);

  return `
    ${state.migrationRequired ? `
      <div class="app-warning">
        <strong>Database migration required</strong>
        <span>The relational modules are unavailable until the redesign migration is reviewed and applied in Supabase.</span>
      </div>
    ` : ''}
    <section class="hero-row panel">
      <div><p class="eyebrow">${escapeHTML(user?.role || 'Founder')}</p><h3>${greeting}, ${escapeHTML(firstName || 'there')}</h3></div>
      <button class="ghost-btn small-btn" type="button" data-nav-jump="project_logging">Open project calendar</button>
    </section>
    <div class="kpi-grid">
      <button class="kpi-card kpi-button" type="button" data-nav-jump="inquiries" data-inquiry-filter="New">
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
        <div class="panel-header"><h3>Recent inquiries</h3><button class="ghost-btn small-btn" type="button" data-nav-jump="inquiries">View all</button></div>
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
        <div class="view-switcher" role="tablist" aria-label="Work view">
          <button class="active" type="button" data-dashboard-view="schedule" role="tab">Schedule</button>
          <button type="button" data-dashboard-view="gantt" role="tab">Gantt</button>
        </div>
        <div id="dashboard-schedule">
          <div class="panel-header"><h3>Today’s work</h3><span class="muted-label">${todayTasks.length} scheduled</span></div>
          <div class="list-stack">
            ${todayTasks.length ? todayTasks.map((task) => `
              <div class="list-item"><div><strong>${escapeHTML(task.title)}</strong><div class="muted-label">${escapeHTML(task.projectId ? 'Linked project' : 'Unassigned work')}</div></div><span class="status-pill">${escapeHTML(task.status || 'Not started')}</span></div>
            `).join('') : '<div class="empty-state">No tasks are scheduled for today.</div>'}
          </div>
        </div>
        <div id="dashboard-gantt" class="hidden">${renderMiniGantt()}</div>
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

function renderMiniGantt() {
  const activeProjects = state.projects
    .filter((project) => !['Completed', 'Cancelled'].includes(project.status))
    .slice(0, 6);
  if (!activeProjects.length) return '<div class="empty-state">No active project timelines.</div>';
  return `
    <div class="mini-gantt" aria-label="Project Gantt overview">
      ${activeProjects.map((project) => `
        <div class="gantt-row">
          <strong>${escapeHTML(project.name)}</strong>
          <div class="gantt-track"><span style="width:${Math.min(100, Math.max(4, Number(project.progress || 0)))}%"></span></div>
          <span class="muted-label">${Number(project.progress || 0)}%</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFullGantt() {
  const projects = state.projects.slice(0, 12);
  if (!projects.length) return '<div class="empty-state">No project timelines configured.</div>';
  return `
    <div class="gantt-timeline" role="table" aria-label="Project Gantt chart">
      ${projects.map((project) => `
        <div class="gantt-project" role="row">
          <div class="gantt-project-name"><strong>${escapeHTML(project.name)}</strong><span class="muted-label">${escapeHTML(project.dueDate || 'No deadline')}</span></div>
          <div class="gantt-track gantt-track-large">
            <span style="width:${Math.min(100, Math.max(4, Number(project.progress || 0)))}%" title="${Number(project.progress || 0)}% complete"></span>
            ${project.dueDate ? '<i class="gantt-milestone" title="Project deadline"></i>' : ''}
          </div>
          <span class="muted-label">${Number(project.progress || 0)}%</span>
        </div>
      `).join('')}
    </div>
  `;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational inquiry migration not applied</strong><span>Public and legacy records remain visible below. Acceptance requires the redesign migration.</span></div>' : ''}
    <div class="table-panel">
      <div class="panel-header">
        <h3>Inquiries</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="create-inquiry">Add inquiry</button>
      </div>
      <div class="toolbar">
        <input id="inquiry-search" type="search" placeholder="Search name, email, service or reference" />
        <select id="inquiry-filter">
          <option value="">All statuses</option>
          ${['New','Contacted','Awaiting information','Under review','Accepted','Declined','Archived'].map((status) => `<option>${status}</option>`).join('')}
        </select>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Client / contact</th>
              <th>Requested service</th>
              <th>Received</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.enquiries.map((item) => {
              return `
                <tr data-inquiry-row data-inquiry-status="${escapeHTML(item.status || 'New')}" data-inquiry-search="${escapeHTML(`${item.reference || ''} ${item.client || ''} ${item.contactName || ''} ${item.email || ''} ${item.requestedService || item.services?.join(' ') || ''}`)}">
                  <td>${escapeHTML(item.reference || String(item.id).slice(0, 8).toUpperCase())}</td>
                  <td><strong>${escapeHTML(item.client || item.contactName || 'Unknown')}</strong><br><span class="muted-label">${escapeHTML(item.email || '')}</span></td>
                  <td>${escapeHTML(item.requestedService || item.services?.join(', ') || 'General enquiry')}</td>
                  <td>${escapeHTML(item.date || item.receivedAt?.slice(0, 10) || 'Unknown')}</td>
                  <td><span class="status-pill status-${escapeHTML(String(item.status || 'new').toLowerCase().replace(/\s+/g, '-'))}">${escapeHTML(item.status || 'New')}</span></td>
                  <td>
                    <button class="ghost-btn small-btn" type="button" data-open-inquiry="${escapeHTML(item.id)}">Open</button>
                    ${['Accepted','Archived','Declined'].includes(item.status) ? '' : `<button class="primary-btn small-btn" type="button" data-accept-inquiry="${escapeHTML(item.id)}">Accept</button>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderClients() {
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational client migration not applied</strong><span>Legacy client records remain visible. Commercial history and analytics require the redesign migration.</span></div>' : ''}
    <div class="table-panel">
      <div class="panel-header">
        <h3>Clients</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="add-client">Add client</button>
      </div>
      <div class="kpi-grid client-analytics">
        <div class="kpi-card"><span class="kpi-label">Total Clients</span><span class="kpi-value">${state.clients.length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Active</span><span class="kpi-value">${state.clients.filter((client) => (client.status || 'Active') === 'Active').length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Recurring / Subscription</span><span class="kpi-value">${state.clients.filter((client) => ['Recurring','Subscription'].includes(client.clientType)).length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Average Client Value</span><span class="kpi-value">${state.clients.length ? formatCurrency(state.projects.reduce((sum, project) => sum + Number(project.value || 0), 0) / state.clients.length) : formatCurrency(0)}</span></div>
      </div>
      <div class="toolbar">
        <input id="client-search" type="search" placeholder="Search client or email" />
        <select id="client-filter"><option value="">All relationships</option><option>One-off</option><option>Recurring</option><option>Subscription</option><option>Active</option><option>Inactive</option></select>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>Relationship</th>
              <th>Status</th>
              <th>Project value</th>
              <th>Payments received</th>
            </tr>
          </thead>
          <tbody>
            ${state.clients.length ? state.clients.map((client) => {
              const clientProjects = state.projects.filter((project) => project.clientId === client.id || project.client === client.businessName);
              const projectValue = clientProjects.reduce((sum, project) => sum + Number(project.value || 0), 0);
              const payments = state.payments.filter((payment) => payment.client_id === client.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
              return `
              <tr data-client-row data-client-search="${escapeHTML(`${client.businessName || ''} ${client.contactPerson || ''} ${client.email || ''}`)}" data-client-filter="${escapeHTML(`${client.clientType || ''} ${client.status || ''}`)}">
                <td><strong>${escapeHTML(client.businessName)}</strong><br><span class="muted-label">${escapeHTML(String(client.id).slice(0,8))}</span></td>
                <td>${escapeHTML(client.contactPerson || 'Not set')}<br><span class="muted-label">${escapeHTML(client.email || '')}</span></td>
                <td>${escapeHTML(client.clientType || 'One-off')}</td>
                <td>${escapeHTML(client.status || 'Active')}</td>
                <td>${formatCurrency(projectValue)}</td>
                <td>${formatCurrency(payments)}</td>
              </tr>
            `}).join('') : '<tr><td colspan="6"><div class="empty-state">No client records yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProjects() {
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational project migration not applied</strong><span>Legacy project records remain visible. Stage, task and Gantt operations require the redesign migration.</span></div>' : ''}
    <div class="table-panel">
      <div class="panel-header">
        <h3>Project Logging</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="create-project">Create project</button>
      </div>
      <div class="toolbar">
        <input type="search" id="project-search" placeholder="Search project or client" />
        <select id="project-filter">
          <option value="">All statuses</option>
          ${['Planning','Active','On hold','Completed','Cancelled','Overdue'].map((status)=>`<option>${status}</option>`).join('')}
        </select>
        <div class="view-switcher">
          <button class="active" type="button" data-project-view="list">List</button>
          <button type="button" data-project-view="gantt">Gantt</button>
        </div>
      </div>
      <div id="project-list-view">
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
                  <div class="muted-label">${project.progress}%</div>
                  <div class="progress-bar"><span class="progress-fill" style="width: ${project.progress}%"></span></div>
                </td>
                <td>${formatCurrency(project.value)}</td>
              </tr>
            `).join('') : '<tr><td colspan="7"><div class="empty-state">No projects yet. Accept an inquiry or create a project to begin.</div></td></tr>'}
          </tbody>
        </table>
      </div>
      </div>
      <div id="project-gantt-view" class="hidden">
        <div class="gantt-full">${renderFullGantt()}</div>
      </div>
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
              <strong>${meeting.title}</strong>
              <div class="muted-label">${meeting.date} • ${meeting.time}</div>
            </div>
            <span class="status-pill status-qualified">${meeting.attendees.length} attendees</span>
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
  return `
    ${state.migrationRequired ? '<div class="app-warning"><strong>Relational finance migration not applied</strong><span>Legacy payment and expense records remain visible. Invoice and payment allocation require the redesign migration.</span></div>' : ''}
    <div class="finance-panel">
      <div class="panel-header">
        <h3>Finances</h3>
        <span class="muted-label">ZAR</span>
      </div>
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
  bind('client-search','client-filter','[data-client-row]','data-client-search','data-client-filter');
}

function renderContextPanel() {
  const context = document.getElementById('context-content');
  if (!context) return;

  context.innerHTML = `
    <div class="context-box">
      <h4>Upcoming meetings</h4>
      <ul>
        ${state.meetings.slice(0, 3).map((m) => `<li>${m.title} — ${m.date}</li>`).join('')}
      </ul>
    </div>
    <div class="context-box">
      <h4>Today’s deadlines</h4>
      <ul>
        ${state.tasks.slice(0, 3).map((task) => `<li>${task.title} — ${task.dueDate}</li>`).join('')}
      </ul>
    </div>
    <div class="context-box">
      <h4>Recent activity</h4>
      <ul>
        <li>New enquiry received from Nandi Studio.</li>
        <li>Project value updated for Mango Logistics.</li>
        <li>Brand deck reviewed by founder team.</li>
      </ul>
    </div>
  `;
}

function renderWorkspace() {
  const workspace = document.getElementById('workspace-content');
  if (!workspace) return;

  const viewMap = {
    dashboard: renderDashboard,
    inquiries: renderCRM,
    clients: renderClients,
    project_logging: renderProjects,
    finances: renderFinancial
  };

  const selectedView = viewMap[state.activeNav] || renderModulePlaceholder;
  workspace.innerHTML = selectedView();

  document.querySelectorAll('[data-quick-action]').forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.dataset.quickAction);
    });
  });

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
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-open-inquiry]').forEach((button) => {
    button.addEventListener('click', () => openInquiryDetails(button.dataset.openInquiry));
  });
  document.querySelectorAll('[data-accept-inquiry]').forEach((button) => {
    button.addEventListener('click', () => openAcceptanceWorkflow(button.dataset.acceptInquiry));
  });

  document.querySelectorAll('[data-dashboard-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-dashboard-view]').forEach((item) => item.classList.toggle('active', item === button));
      document.getElementById('dashboard-schedule')?.classList.toggle('hidden', button.dataset.dashboardView !== 'schedule');
      document.getElementById('dashboard-gantt')?.classList.toggle('hidden', button.dataset.dashboardView !== 'gantt');
    });
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
  renderContextPanel();
  const contextPanel = document.getElementById('context-panel');
  const appShell = document.getElementById('app-shell');
  if (contextPanel) {
    contextPanel.classList.toggle('hidden', !state.contextVisible);
  }
  if (appShell) {
    appShell.classList.toggle('context-open', state.contextVisible);
  }
  const toggleContextBtn = document.getElementById('toggle-context');
  if (toggleContextBtn) {
    toggleContextBtn.textContent = state.contextVisible ? 'Hide panel' : 'Show panel';
    toggleContextBtn.setAttribute('aria-expanded', String(state.contextVisible));
  }
  showAppError(state.errorMessage);
};

function openModal(actionKey) {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalForm = document.getElementById('modal-form');
  const definition = modalCatalog[actionKey];
  if (!modalBackdrop || !definition) return;

  modalTitle.textContent = definition.title;
  modalForm.innerHTML = `
    ${definition.fields.map((field) => {
      const fieldContent = field.type === 'textarea'
        ? `<textarea name="${field.name}" placeholder="${field.placeholder || ''}"></textarea>`
        : field.type === 'select'
          ? `<select name="${field.name}">${field.options.map((option) => `<option value="${option}">${option}</option>`).join('')}</select>`
          : `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" />`;

      return `
        <div class="field">
          <label>${field.label}</label>
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
  document.getElementById('close-modal').addEventListener('click', () => closeModal());

  modalForm.addEventListener('submit', async (event) => {
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
              name: values.projectName,
              reference: projectReference,
              service_category: 'Other',
              budget: Number(values.projectValue || 0),
              currency: 'ZAR',
              status: values.status === 'In progress' ? 'Active' : 'Planning',
              deadline: null
            });
            if (projectError) throw projectError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'projects';
          record = {
            id, name: values.projectName, client: values.client,
            status: values.status, progress: 10, manager: founder,
            value: Number(values.projectValue || 0),
            dueDate: new Date(Date.now() + 1200000000).toISOString().slice(0, 10)
          };
          break;
        case 'create-task':
          if (state.relationTablesAvailable) {
            const businessId = await getCurrentBusinessId();
            const { error: taskError } = await supabaseClient.from('tasks').insert({
              business_id: businessId,
              title: values.taskTitle,
              due_date: values.dueDate || null,
              status: 'Not started',
              priority: values.priority === 'Normal' ? 'Medium' : values.priority === 'Critical' ? 'Urgent' : values.priority
            });
            if (taskError) throw taskError;
            closeModal();
            await loadBOSData();
            render();
            return;
          }
          recordType = 'tasks';
          record = {
            id, title: values.taskTitle, projectId: '',
            assignee: values.assignee, priority: values.priority,
            status: 'To do', dueDate: values.dueDate
          };
          break;
        case 'schedule-meeting':
          recordType = 'meetings';
          record = {
            id, title: values.meetingTitle, date: values.meetingDate,
            time: values.meetingTime,
            attendees: values.attendees.split(',').map((item) => item.trim()).filter(Boolean)
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
            email: values.email, phone: 'N/A', location: 'TBD',
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

      await addBOSRecord(recordType, record);
      if (recordType === 'projects') state.projects.push(record);
      if (recordType === 'tasks') state.tasks.push(record);
      if (recordType === 'meetings') state.meetings.push(record);
      if (recordType === 'clients') state.clients.push(record);
      if (recordType === 'enquiries') state.enquiries.push(record);
      if (recordType === 'messages') state.messages.push(record);
      if (recordType === 'financial_transactions') {
        if (record.kind === 'payment') state.finances.paymentsReceived += record.amount;
        if (record.kind === 'expense') state.finances.expenses += record.amount;
        state.finances.netCashPosition = state.finances.paymentsReceived - state.finances.expenses;
      }
      showAppError();
      closeModal();
      render();
    } catch (error) {
      showAppError(`Could not save this item: ${error.message}`);
      submitButton.disabled = false;
    }
  });
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
    setAuthMessage('Supabase is not configured. Update supabase-config.js before logging in.', 'error');
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
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage(error.message, 'error');
      return;
    }
    setAuthMessage('Login successful. Loading your BOS…', 'success');
  } catch (error) {
    setAuthMessage(`Could not sign in: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
  }
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showAppError(`Could not log out: ${error.message}`);
    return;
  }
  state.currentUser = null;
  render();
}

function bindGlobalActions() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }

  const brandDashboard = document.getElementById('brand-dashboard');
  if (brandDashboard) {
    brandDashboard.addEventListener('click', () => {
      state.activeNav = 'dashboard';
      saveState();
      render();
    });
  }

  const quickActionLaunch = document.getElementById('quick-action-launch');
  if (quickActionLaunch) {
    quickActionLaunch.addEventListener('click', () => openModal('create-project'));
  }

  const toggleContext = document.getElementById('toggle-context');
  if (toggleContext) {
    toggleContext.addEventListener('click', () => {
      state.contextVisible = !state.contextVisible;
      saveState();
      render();
    });
  }

  const collapseContext = document.getElementById('collapse-context');
  if (collapseContext) {
    collapseContext.addEventListener('click', () => {
      state.contextVisible = false;
      saveState();
      render();
    });
  }

  const closeModalButton = document.getElementById('close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (event) => {
      if (event.target === modalBackdrop) {
        closeModal();
      }
    });
  }
}

bindGlobalActions();
render();

async function initializeAuth() {
  if (!supabaseClient) {
    setAuthMessage('Set your Supabase project URL and anon key in supabase-config.js to enable sign-in.', 'error');
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

initializeAuth();
