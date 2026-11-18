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
  { key: 'dashboard', label: 'Dashboard', group: 'Overview' },
  { key: 'crm', label: 'CRM / Enquiries', group: 'Business Management' },
  { key: 'clients', label: 'Clients', group: 'Business Management' },
  { key: 'projects', label: 'Projects', group: 'Business Management' },
  { key: 'tasks', label: 'Task Management', group: 'Project Operations' },
  { key: 'calendar', label: 'Meeting Calendar', group: 'Project Operations' },
  { key: 'messages', label: 'Messages', group: 'Project Operations' },
  { key: 'financial', label: 'Financial Overview', group: 'Financial Management' },
  { key: 'files', label: 'Files & Documents', group: 'Project Operations' },
  { key: 'settings', label: 'Business Settings', group: 'Administration' }
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
    enquiries: [],
    clients: [],
    projects: [],
    tasks: [],
    meetings: [],
    messages: [],
    notifications: [],
    documents: [],
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
    contextVisible: state.contextVisible
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
    .map((record) => record.data);
  state.enquiries.unshift(...intakeResult.data.map((request) => ({
    id: request.id,
    client: request.business_name || request.name,
    business: request.business_name || request.name,
    email: request.email,
    phone: request.phone || '',
    industry: request.industry || request.category || 'General',
    services: request.services?.length ? request.services : [request.category || 'General enquiry'],
    source: request.kind === 'onboarding' ? 'Service onboarding form' : 'Website contact form',
    assignedTo: 'Unassigned',
    status: 'new',
    date: request.created_at.slice(0, 10),
    details: request.details,
    message: request.message || request.details?.message || ''
  })));

  state.finances = {
    acceptedProjectValue: state.projects.reduce((sum, project) => sum + Number(project.value || 0), 0),
    paymentsReceived: 0,
    outstandingBalances: 0,
    pendingQuotations: 0,
    invoicesIssued: 0,
    expenses: 0,
    netCashPosition: 0
  };
  recordsResult.data
    .filter((record) => record.record_type === 'financial_transactions')
    .forEach(({ data }) => {
      if (data.kind === 'payment') state.finances.paymentsReceived += Number(data.amount || 0);
      if (data.kind === 'expense') state.finances.expenses += Number(data.amount || 0);
    });
  state.finances.netCashPosition = state.finances.paymentsReceived - state.finances.expenses;
}

async function addBOSRecord(recordType, data) {
  const { error } = await supabaseClient
    .from('bos_records')
    .insert({ record_type: recordType, data });
  if (error) throw error;
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

  const groups = {};
  navDefinitions.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });

  navContainer.innerHTML = Object.entries(groups).map(([groupLabel, items]) => `
    <div class="nav-group">
      <span class="nav-group-title">${groupLabel}</span>
      ${items.map((item) => `
        <button class="nav-item ${state.activeNav === item.key ? 'active' : ''}" type="button" data-nav="${item.key}">
          ${item.label}
        </button>
      `).join('')}
    </div>
  `).join('');

  navContainer.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', async () => {
      state.activeNav = button.dataset.nav;
      saveState();
      if (state.activeNav === 'crm') {
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
  const rows = [
    { label: 'Accepted project value', value: formatCurrency(state.finances.acceptedProjectValue), delta: 'From projects', tone: 'positive' },
    { label: 'Payments received', value: formatCurrency(state.finances.paymentsReceived), delta: 'Recorded payments', tone: 'positive' },
    { label: 'Outstanding balances', value: formatCurrency(state.finances.outstandingBalances), delta: 'Tracked in BOS', tone: 'warning' },
    { label: 'New enquiries', value: String(state.enquiries.length), delta: 'Website + BOS', tone: 'positive' }
  ];

  const greeting = user?.name ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Welcome back.';

  return `
    <div class="hero-row panel">
      <div>
        <p class="eyebrow">${user?.role || 'Founder'}</p>
        <h3>${greeting}</h3>
      </div>
      <div class="chip-group">
        <span class="badge status-qualified">${user?.role || 'board'}</span>
      </div>
    </div>
    <div class="kpi-grid">
      ${rows.map((item) => `
        <div class="kpi-card">
          <span class="kpi-label">${item.label}</span>
          <span class="kpi-value">${item.value}</span>
          <div class="kpi-delta ${item.tone}">${item.delta}</div>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-grid">
      <div class="panel">
        <div class="panel-header">
          <h3>Project progress</h3>
          <span class="muted-label">Q4 overview</span>
        </div>
        <div class="list-stack">
          ${state.projects.map((project) => `
            <div class="list-item">
              <div>
                <strong>${project.name}</strong>
                <div class="muted-label">${project.client}</div>
              </div>
              <div style="min-width: 120px;">
                <div class="muted-label">${project.progress}%</div>
                <div class="progress-bar"><span class="progress-fill" style="width: ${project.progress}%"></span></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>My tasks today</h3>
          <span class="muted-label">${state.tasks.length} active</span>
        </div>
        <div class="list-stack">
          ${state.tasks.map((task) => `
            <div class="list-item">
              <div>
                <strong>${task.title}</strong>
                <div class="muted-label">${task.assignee} • ${task.priority}</div>
              </div>
              <span class="status-pill status-${task.status.toLowerCase().replace(/\s+/g, '-') || 'progress'}">${task.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="two-col" style="margin-top: 18px;">
      <div class="panel">
        <div class="panel-header">
          <h3>Notifications</h3>
          <span class="muted-label">Live</span>
        </div>
        <div class="list-stack">
          ${state.notifications.map((item) => `
            <div class="list-item">
              <div>
                <strong>${item.title}</strong>
                <div class="muted-label">${item.detail}</div>
              </div>
              <span class="badge ${item.read ? 'status-archived' : 'status-new'}">${item.read ? 'Read' : 'Unread'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Recent messages</h3>
          <span class="muted-label">Team chat</span>
        </div>
        <div class="list-stack">
          ${state.messages.slice(-3).map((message) => `
            <div class="list-item">
              <div>
                <strong>${message.user}</strong>
                <div class="muted-label">${message.text}</div>
              </div>
              <span class="muted-label">${message.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderCRM() {
  return `
    <div class="table-panel">
      <div class="panel-header">
        <h3>CRM / Enquiries</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="create-project">Create project</button>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Industry</th>
              <th>Services</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Enquiry details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.enquiries.map((item) => {
              const onboardingDetails = Object.entries(item.details || {})
                .map(([label, value]) => `${label.replaceAll('_', ' ')}: ${value}`)
                .join('\n');
              const enquiryDetails = [item.message, onboardingDetails].filter(Boolean).join('\n\n');
              return `
                <tr>
                  <td>${escapeHTML(item.client)}<br><span class="muted-label">${escapeHTML(item.email)}</span></td>
                  <td>${escapeHTML(item.industry)}</td>
                  <td>${escapeHTML(item.services.join(', '))}</td>
                  <td><span class="status-pill status-${escapeHTML(item.status)}">${escapeHTML(item.status)}</span></td>
                  <td>${escapeHTML(item.assignedTo)}</td>
                  <td>${enquiryDetails ? `<details><summary>View</summary><p>${escapeHTML(enquiryDetails)}</p></details>` : '—'}</td>
                  <td><span class="action-link" data-view-client="${escapeHTML(item.client)}">View clients</span></td>
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
    <div class="table-panel">
      <div class="panel-header">
        <h3>Client database</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="add-client">Add client</button>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Industry</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${state.clients.map((client) => `
              <tr>
                <td>${client.businessName}<br><span class="muted-label">${client.id}</span></td>
                <td>${client.contactPerson}<br><span class="muted-label">${client.email}</span></td>
                <td>${client.location}</td>
                <td>${client.industry}</td>
                <td>${client.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProjects() {
  return `
    <div class="table-panel">
      <div class="panel-header">
        <h3>Projects</h3>
        <button class="primary-btn small-btn" type="button" data-quick-action="create-project">Create project</button>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${state.projects.map((project) => `
              <tr>
                <td>${project.id}</td>
                <td>${project.name}</td>
                <td>${project.client}</td>
                <td>${project.status}</td>
                <td>
                  <div class="muted-label">${project.progress}%</div>
                  <div class="progress-bar"><span class="progress-fill" style="width: ${project.progress}%"></span></div>
                </td>
                <td>${formatCurrency(project.value)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
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
    <div class="finance-panel">
      <div class="panel-header">
        <h3>Financial overview</h3>
        <span class="muted-label">ZAR</span>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Accepted value</span><span class="kpi-value">${formatCurrency(state.finances.acceptedProjectValue)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Payments received</span><span class="kpi-value">${formatCurrency(state.finances.paymentsReceived)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Outstanding balances</span><span class="kpi-value">${formatCurrency(state.finances.outstandingBalances)}</span></div>
        <div class="kpi-card"><span class="kpi-label">Net cash</span><span class="kpi-value">${formatCurrency(state.finances.netCashPosition)}</span></div>
      </div>
      <div class="finance-list" style="margin-top: 12px;">
        <div class="finance-item"><span>Pending quotations</span><strong>${formatCurrency(state.finances.pendingQuotations)}</strong></div>
        <div class="finance-item"><span>Total invoices issued</span><strong>${formatCurrency(state.finances.invoicesIssued)}</strong></div>
        <div class="finance-item"><span>Total expenses</span><strong>${formatCurrency(state.finances.expenses)}</strong></div>
      </div>
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
    crm: renderCRM,
    clients: renderClients,
    projects: renderProjects,
    tasks: renderTasks,
    calendar: renderCalendar,
    messages: renderMessages,
    financial: renderFinancial,
    files: renderFiles,
    settings: renderSettings
  };

  const selectedView = viewMap[state.activeNav] || renderDashboard;
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
          recordType = 'projects';
          record = {
            id, name: values.projectName, client: values.client,
            status: values.status, progress: 10, manager: founder,
            value: Number(values.projectValue || 0),
            dueDate: new Date(Date.now() + 1200000000).toISOString().slice(0, 10)
          };
          break;
        case 'create-task':
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
          recordType = 'financial_transactions';
          record = { id, kind: 'payment', amount: Number(values.amount || 0), reference: values.invoiceRef, date: values.receivedDate };
          break;
        case 'add-expense':
          recordType = 'financial_transactions';
          record = { id, kind: 'expense', amount: Number(values.expenseAmount || 0), description: values.expenseName, date: values.expenseDate };
          break;
        case 'send-message':
          recordType = 'messages';
          record = { id, user: founder, text: values.messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          break;
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
