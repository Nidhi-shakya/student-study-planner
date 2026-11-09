let defaultUsers = [
  { name: 'Gaura Shakya', username: 'nidhi123', course: 'MCA 3rd Sem', password: '2005' },
  { name: 'Gaura Shakya', username: 'gaura', course: 'MCA 3rd Sem', password: '2005' },
  { name: 'Gaura Shakya', username: 'student', course: 'MCA 3rd Sem', password: '123' }
];

let baseSubjects = [
  'CAP774 Styling and Shell Scripting',
  'CAP646 Full Stack Web Development',
  'CAP470 Cloud Computing',
  'CAP500 IKS'
];

let savedCustomSubjects = JSON.parse(localStorage.getItem('study_custom_subjects')) || [];
let predefinedSubjects = Array.from(new Set([...baseSubjects, ...savedCustomSubjects]));

let defaultStudyPlan = [
  { id: 101, userId: 'nidhi123', title: 'Implement Responsive Layouts with CSS Flexbox and Grid', subject: 'CAP774 Styling and Shell Scripting', date: '2026-11-14', hours: 2.5, priority: 'High', status: 'In Progress', notes: 'Master container properties, align-items, justify-content, and responsive media queries.' },
  { id: 102, userId: 'nidhi123', title: 'Write Bash Shell Scripts for File Backup and Process Automation', subject: 'CAP774 Styling and Shell Scripting', date: '2026-11-10', hours: 2.0, priority: 'High', status: 'Completed', notes: 'Practice conditional if-else statements, while loops, and command line arguments.' },
  { id: 103, userId: 'nidhi123', title: 'Build RESTful CRUD Operations with Client-Side LocalStorage', subject: 'CAP646 Full Stack Web Development', date: '2026-11-12', hours: 3.0, priority: 'High', status: 'Pending', notes: 'Implement input validation, dynamic DOM rendering, and JSON data management.' },
  { id: 104, userId: 'nidhi123', title: 'Design User Authentication and State Management Session Workflow', subject: 'CAP646 Full Stack Web Development', date: '2026-11-09', hours: 1.5, priority: 'Medium', status: 'Completed', notes: 'Verify login and registration form validation and user state isolation.' },
  { id: 105, userId: 'nidhi123', title: 'Configure Cloud Virtual Machines and Storage Buckets', subject: 'CAP470 Cloud Computing', date: '2026-11-18', hours: 2.0, priority: 'Medium', status: 'In Progress', notes: 'Study cloud virtualization, hypervisors, and infrastructure as a service.' },
  { id: 106, userId: 'nidhi123', title: 'Analyze Microservices and Containerization Deployment Models', subject: 'CAP470 Cloud Computing', date: '2026-11-08', hours: 2.5, priority: 'High', status: 'Pending', notes: 'Review Docker containers, service scaling, and cloud architecture patterns.' },
  { id: 107, userId: 'nidhi123', title: 'Summarize Ancient Indian Mathematics and Astronomical Computing Systems', subject: 'CAP500 IKS', date: '2026-11-20', hours: 1.5, priority: 'Medium', status: 'Pending', notes: 'Read contributions of Aryabhata, Brahmagupta, and binary mathematics foundations.' },
  { id: 108, userId: 'nidhi123', title: 'Prepare Presentation on Traditional Indian Town Planning and Architecture', subject: 'CAP500 IKS', date: '2026-11-22', hours: 1.0, priority: 'Low', status: 'Completed', notes: 'Analyze Indus Valley drainage architecture and traditional resource planning.' }
];

let users = JSON.parse(localStorage.getItem('study_users')) || defaultUsers;

let savedTasks = JSON.parse(localStorage.getItem('study_tasks'));
let tasks = [];

if (savedTasks && savedTasks.length > 0 && savedTasks.some(t => t.subject && t.subject.includes('CAP774 Styling'))) {
  tasks = savedTasks;
} else {
  tasks = [...defaultStudyPlan];
  localStorage.setItem('study_tasks', JSON.stringify(tasks));
}

let currentUser = JSON.parse(localStorage.getItem('study_session')) || null;
let activeFilterSubject = 'all';

window.onload = function() {
  if (currentUser) {
    showDashboard();
  } else {
    showAuth();
  }
};

function showAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginBtn = document.getElementById('loginTabBtn');
  const regBtn = document.getElementById('registerTabBtn');
  const msg = document.getElementById('authMessage');

  msg.className = 'alert-box hidden';

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginBtn.classList.add('active');
    regBtn.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginBtn.classList.remove('active');
    regBtn.classList.add('active');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUsername').value.trim().toLowerCase();
  const course = document.getElementById('regCourse').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('authMessage');

  if (password.length < 4) {
    msg.textContent = 'Password must be at least 4 characters';
    msg.className = 'alert-box error';
    return;
  }

  const existing = users.find(u => u.username.toLowerCase() === username);
  if (existing) {
    msg.textContent = 'Username already registered. Please sign in.';
    msg.className = 'alert-box error';
    return;
  }

  users.push({ name, username, course, password });
  localStorage.setItem('study_users', JSON.stringify(users));

  msg.textContent = 'Registration completed. Sign in with your username.';
  msg.className = 'alert-box success';
  document.getElementById('registerForm').reset();
  showAuthTab('login');
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('authMessage');

  const user = users.find(u => u.username.toLowerCase() === username && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('study_session', JSON.stringify(currentUser));
    document.getElementById('loginForm').reset();
    showDashboard();
  } else {
    msg.textContent = 'Invalid username or password';
    msg.className = 'alert-box error';
  }
}

function logout() {
  if (confirm('Log out from your study planner?')) {
    currentUser = null;
    localStorage.removeItem('study_session');
    showAuth();
  }
}

function showAuth() {
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
  showAuthTab('login');
}

function showDashboard() {
  document.getElementById('authSection').classList.add('hidden');
  document.getElementById('dashboardSection').classList.remove('hidden');

  document.getElementById('userNameDisplay').textContent = currentUser.name;
  document.getElementById('userCourseDisplay').textContent = currentUser.course;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('userAvatar').textContent = initials;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];

  populateSubjectDropdowns();
  renderSubjectCards();
  renderPriorityAlerts();
  displayTasks();
  updateMetrics();
}

function openSubjectModal() {
  document.getElementById('newSubjectInput').value = '';
  document.getElementById('subjectModal').classList.remove('hidden');
  document.getElementById('newSubjectInput').focus();
}

function closeSubjectModal() {
  document.getElementById('subjectModal').classList.add('hidden');
}

function handleAddNewSubject(e) {
  e.preventDefault();
  const rawSubject = document.getElementById('newSubjectInput').value.trim();

  if (!rawSubject) {
    alert('Please enter a valid subject name');
    return;
  }

  if (predefinedSubjects.some(s => s.toLowerCase() === rawSubject.toLowerCase())) {
    alert('This subject already exists in your list');
    return;
  }

  predefinedSubjects.push(rawSubject);
  savedCustomSubjects.push(rawSubject);
  localStorage.setItem('study_custom_subjects', JSON.stringify(savedCustomSubjects));

  closeSubjectModal();
  populateSubjectDropdowns();
  renderSubjectCards();

  document.getElementById('taskSubject').value = rawSubject;
  document.getElementById('taskTitle').focus();
  window.scrollTo({ top: 580, behavior: 'smooth' });
}

function populateSubjectDropdowns() {
  const select = document.getElementById('taskSubject');
  const filter = document.getElementById('filterSubject');

  const userSubjects = new Set(predefinedSubjects);
  const currentUname = currentUser.username.toLowerCase();

  tasks.filter(t => t.userId.toLowerCase() === currentUname).forEach(t => {
    if (t.subject) userSubjects.add(t.subject);
  });

  const subjectArray = Array.from(userSubjects);

  select.innerHTML = subjectArray.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

  filter.innerHTML = '<option value="all">All Subjects</option>' +
    subjectArray.map(s => {
      const code = s.split(' ')[0];
      return `<option value="${escapeHtml(s)}">${escapeHtml(code)}</option>`;
    }).join('');

  if (activeFilterSubject !== 'all') {
    filter.value = activeFilterSubject;
  }
}

function getDaysDiff(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function renderPriorityAlerts() {
  const alertSection = document.getElementById('priorityAlertSection');
  const alertList = document.getElementById('priorityAlertList');
  const currentUname = currentUser.username.toLowerCase();

  const userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname && t.status !== 'Completed');

  const urgentTasks = userTasks.filter(t => {
    const days = getDaysDiff(t.date);
    return t.priority === 'High' || days <= 2;
  });

  if (urgentTasks.length === 0) {
    alertSection.classList.add('hidden');
    return;
  }

  alertSection.classList.remove('hidden');
  document.getElementById('alertHeadingText').textContent = urgentTasks.length + ' High Priority / Urgent Deadline Alert(s) Detected';

  alertList.innerHTML = urgentTasks.map(t => {
    const days = getDaysDiff(t.date);
    let statusText = '';
    if (days < 0) {
      statusText = 'OVERDUE by ' + Math.abs(days) + ' day(s)';
    } else if (days === 0) {
      statusText = 'Due Today';
    } else {
      statusText = days + ' day(s) remaining';
    }

    return `
      <div class="alert-item-line">
        <span><strong>${escapeHtml(t.subject)}</strong>: ${escapeHtml(t.title)} (Priority: ${t.priority})</span>
        <span>Till: ${t.date} (${statusText})</span>
      </div>
    `;
  }).join('');
}

function renderSubjectCards() {
  const grid = document.getElementById('subjectCardsGrid');
  const currentUname = currentUser.username.toLowerCase();
  const userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname);

  const cardsHtml = predefinedSubjects.map(subject => {
    const subjectTasks = userTasks.filter(t => t.subject === subject);
    const total = subjectTasks.length;
    const pending = subjectTasks.filter(t => t.status !== 'Completed').length;

    const pendingDates = subjectTasks
      .filter(t => t.status !== 'Completed')
      .map(t => t.date)
      .sort();

    let nextDueText = 'All caught up';
    if (pendingDates.length > 0) {
      const days = getDaysDiff(pendingDates[0]);
      if (days < 0) {
        nextDueText = 'Overdue (' + pendingDates[0] + ')';
      } else if (days === 0) {
        nextDueText = 'Due Today (' + pendingDates[0] + ')';
      } else {
        nextDueText = pendingDates[0] + ' (' + days + 'd left)';
      }
    }

    const shortCode = subject.split(' ')[0];
    const isSelected = activeFilterSubject === subject;

    return `
      <div class="subject-card ${isSelected ? 'is-active' : ''}" onclick="filterBySubjectCard('${escapeHtml(subject)}')">
        <div>
          <div class="subject-card-code">${escapeHtml(shortCode)}</div>
          <div class="subject-card-title">${escapeHtml(subject)}</div>
        </div>
        <div>
          <div class="subject-card-meta">
            <span>Total Tasks: ${total}</span>
            <span style="color:${pending > 0 ? 'crimson' : 'forestgreen'}; font-weight:bold;">Pending: ${pending}</span>
          </div>
          <div class="subject-card-deadline">
            <span>Next Till Date: ${nextDueText}</span>
          </div>
          <button type="button" class="btn btn-sm btn-outline" style="width:100%; margin-top:8px;" onclick="event.stopPropagation(); selectSubjectForAdd('${escapeHtml(subject)}')">
            + Add To This Subject
          </button>
        </div>
      </div>
    `;
  }).join('');

  const addCardHtml = `
    <div class="add-subject-card" onclick="openSubjectModal()">
      <div class="add-subject-title">+ Add New Subject</div>
      <div class="add-subject-desc">Create another subject card</div>
    </div>
  `;

  grid.innerHTML = cardsHtml + addCardHtml;
}

function filterBySubjectCard(subject) {
  if (activeFilterSubject === subject) {
    activeFilterSubject = 'all';
  } else {
    activeFilterSubject = subject;
  }
  document.getElementById('filterSubject').value = activeFilterSubject;
  renderSubjectCards();
  displayTasks();
  window.scrollTo({ top: 580, behavior: 'smooth' });
}

function selectSubjectForAdd(subject) {
  const sel = document.getElementById('taskSubject');
  sel.value = subject;
  document.getElementById('taskTitle').focus();
  window.scrollTo({ top: 580, behavior: 'smooth' });
}

function saveStudyItem(e) {
  e.preventDefault();

  const editId = document.getElementById('editItemId').value;
  const subject = document.getElementById('taskSubject').value;
  const title = document.getElementById('taskTitle').value.trim();
  const date = document.getElementById('taskDueDate').value;
  const hours = parseFloat(document.getElementById('taskHours').value) || 1;
  const priority = document.getElementById('taskPriority').value;
  const status = document.getElementById('taskStatus').value;
  const notes = document.getElementById('taskNotes').value.trim();

  if (editId) {
    const task = tasks.find(t => t.id === Number(editId));
    if (task) {
      task.subject = subject;
      task.title = title;
      task.date = date;
      task.hours = hours;
      task.priority = priority;
      task.status = status;
      task.notes = notes;
    }
  } else {
    const newTask = {
      id: Date.now(),
      userId: currentUser.username.toLowerCase(),
      subject: subject,
      title: title,
      date: date,
      hours: hours,
      priority: priority,
      status: status,
      notes: notes
    };
    tasks.unshift(newTask);
  }

  localStorage.setItem('study_tasks', JSON.stringify(tasks));
  cancelEdit();
  populateSubjectDropdowns();
  renderSubjectCards();
  renderPriorityAlerts();
  displayTasks();
  updateMetrics();
}

function displayTasks() {
  const list = document.getElementById('taskList');
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const filterSubject = document.getElementById('filterSubject').value;
  const filterStatus = document.getElementById('filterStatus').value;
  const filterPriority = document.getElementById('filterPriority').value;
  const sortBy = document.getElementById('sortBy').value;

  activeFilterSubject = filterSubject;

  const currentUname = currentUser.username.toLowerCase();
  let userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname);

  if (filterSubject !== 'all') {
    userTasks = userTasks.filter(t => t.subject === filterSubject);
  }

  if (filterStatus !== 'all') {
    userTasks = userTasks.filter(t => t.status === filterStatus);
  }

  if (filterPriority !== 'all') {
    userTasks = userTasks.filter(t => t.priority === filterPriority);
  }

  if (search) {
    userTasks = userTasks.filter(t => 
      t.title.toLowerCase().includes(search) || 
      t.subject.toLowerCase().includes(search) ||
      (t.notes && t.notes.toLowerCase().includes(search))
    );
  }

  if (sortBy === 'studyFirst') {
    userTasks.sort((a, b) => {
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;

      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;

      const rank = { High: 3, Medium: 2, Low: 1 };
      return rank[b.priority] - rank[a.priority];
    });
  } else if (sortBy === 'dateAsc') {
    userTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'dateDesc') {
    userTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'priority') {
    const rank = { High: 3, Medium: 2, Low: 1 };
    userTasks.sort((a, b) => rank[b.priority] - rank[a.priority]);
  } else if (sortBy === 'hours') {
    userTasks.sort((a, b) => b.hours - a.hours);
  }

  document.getElementById('taskCountStatus').textContent = 'Showing ' + userTasks.length + ' task' + (userTasks.length === 1 ? '' : 's');

  if (userTasks.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:35px; color:gray; background:white; border:1px solid lightgray; border-radius:6px;">No study tasks found matching the criteria. Use the form on the left to add what to learn.</div>';
    return;
  }

  let uncompletedRank = 0;

  list.innerHTML = userTasks.map(t => {
    const isCompleted = t.status === 'Completed';
    const days = getDaysDiff(t.date);
    const isOverdue = !isCompleted && days < 0;
    const statusClass = t.status.toLowerCase().replace(' ', '');

    let rankBadge = '';
    let isFirstStudy = false;

    if (isCompleted) {
      rankBadge = '<span class="rank-badge rank-regular">Completed</span>';
    } else {
      uncompletedRank++;
      if (uncompletedRank === 1) {
        isFirstStudy = true;
        rankBadge = '<span class="rank-badge rank-first">Study First #1</span>';
      } else if (uncompletedRank === 2) {
        rankBadge = '<span class="rank-badge rank-next">Study Next #2</span>';
      } else {
        rankBadge = '<span class="rank-badge rank-regular">Study #' + uncompletedRank + '</span>';
      }
    }

    let countdownBadge = '';
    if (isCompleted) {
      countdownBadge = '<span class="pill pill-status-completed">Completed</span>';
    } else if (days < 0) {
      countdownBadge = '<span class="pill pill-overdue">OVERDUE BY ' + Math.abs(days) + ' DAY(S)</span>';
    } else if (days === 0) {
      countdownBadge = '<span class="pill pill-countdown" style="color:darkred; border-color:crimson;">DUE TODAY - STUDY FIRST</span>';
    } else {
      countdownBadge = '<span class="pill pill-countdown">' + days + ' day(s) left</span>';
    }

    const isHighAlert = !isCompleted && (t.priority === 'High' || days <= 2);

    return `
      <div class="task-card status-${statusClass} ${isFirstStudy ? 'is-first' : ''}">
        <div class="task-main-col">
          <input type="checkbox" class="status-check" ${isCompleted ? 'checked' : ''} onchange="toggleCheck(${t.id})">
          <div class="task-info">
            <div class="task-top-badges">
              ${rankBadge}
              <span class="subject-pill">${escapeHtml(t.subject)}</span>
              ${isHighAlert ? '<span class="pill pill-priority-high">PRIORITY ALERT</span>' : ''}
            </div>

            <div class="task-title-line">
              ${escapeHtml(t.title || t.topic)}
            </div>

            <div class="badge-row">
              <span class="pill pill-date">Till Date: ${t.date}</span>
              ${countdownBadge}
              <span class="pill pill-hours">${t.hours} hrs</span>
              <span class="pill pill-priority-${t.priority.toLowerCase()}">Priority: ${t.priority}</span>
              <span class="pill pill-status-${statusClass}">${t.status}</span>
            </div>

            ${t.notes ? `<div class="task-notes-block">Notes: ${escapeHtml(t.notes)}</div>` : ''}
          </div>
        </div>
        <div class="task-action-btns">
          <button class="btn btn-sm btn-outline" onclick="editTask(${t.id})">Edit</button>
          <button class="btn btn-sm btn-outline text-danger" onclick="deleteTask(${t.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleCheck(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = (task.status === 'Completed') ? 'Pending' : 'Completed';
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
    renderSubjectCards();
    renderPriorityAlerts();
    displayTasks();
    updateMetrics();
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById('editItemId').value = task.id;

    const select = document.getElementById('taskSubject');
    if (![...select.options].some(o => o.value === task.subject)) {
      predefinedSubjects.push(task.subject);
      populateSubjectDropdowns();
    }
    select.value = task.subject;

    document.getElementById('taskTitle').value = task.title || task.topic;
    document.getElementById('taskDueDate').value = task.date;
    document.getElementById('taskHours').value = task.hours;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskNotes').value = task.notes || '';

    document.getElementById('formHeading').textContent = 'Update Study Task';
    document.getElementById('saveTaskBtn').textContent = 'Update Task';
    document.getElementById('cancelEditBtn').classList.remove('hidden');

    window.scrollTo({ top: 580, behavior: 'smooth' });
  }
}

function cancelEdit() {
  document.getElementById('editItemId').value = '';
  document.getElementById('studyForm').reset();
  document.getElementById('formHeading').textContent = 'Add What To Study in Subject';
  document.getElementById('saveTaskBtn').textContent = 'Add To Study List';
  document.getElementById('cancelEditBtn').classList.add('hidden');
}

function deleteTask(id) {
  if (confirm('Permanently remove this study topic?')) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
    populateSubjectDropdowns();
    renderSubjectCards();
    renderPriorityAlerts();
    displayTasks();
    updateMetrics();
  }
}

function clearCompleted() {
  const currentUname = currentUser.username.toLowerCase();
  const userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname);
  const completedCount = userTasks.filter(t => t.status === 'Completed').length;

  if (completedCount === 0) {
    alert('No completed tasks to clear.');
    return;
  }

  if (confirm('Clear ' + completedCount + ' completed task(s)?')) {
    tasks = tasks.filter(t => !(t.userId.toLowerCase() === currentUname && t.status === 'Completed'));
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
    renderSubjectCards();
    renderPriorityAlerts();
    displayTasks();
    updateMetrics();
  }
}

function resetDefaultStudyPlan() {
  if (confirm('Reset your study plan to the clean 4 courses with default study topics?')) {
    const currentUname = currentUser.username.toLowerCase();
    tasks = tasks.filter(t => t.userId.toLowerCase() !== currentUname);

    defaultStudyPlan.forEach(item => {
      tasks.push({
        ...item,
        id: Date.now() + Math.floor(Math.random() * 1000),
        userId: currentUname
      });
    });

    localStorage.setItem('study_tasks', JSON.stringify(tasks));
    activeFilterSubject = 'all';
    populateSubjectDropdowns();
    renderSubjectCards();
    renderPriorityAlerts();
    displayTasks();
    updateMetrics();
  }
}

function updateMetrics() {
  const currentUname = currentUser.username.toLowerCase();
  const userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname);
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.status === 'Completed').length;
  const progress = userTasks.filter(t => t.status === 'In Progress').length;
  const pending = userTasks.filter(t => t.status === 'Pending').length;
  const hours = userTasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statProgress').textContent = progress;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statHours').textContent = hours.toFixed(1);

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  document.getElementById('progressPercent').textContent = percent + '%';
  document.getElementById('progressBar').style.width = percent + '%';
}

function exportDataJSON() {
  const currentUname = currentUser.username.toLowerCase();
  const userTasks = tasks.filter(t => t.userId.toLowerCase() === currentUname);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userTasks, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', currentUser.username + '_study_plan.json');
  dlAnchor.click();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
