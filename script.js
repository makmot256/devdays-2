  const input    = document.getElementById('task-input');
  const addBtn   = document.getElementById('add-btn');
  const list     = document.getElementById('task-list');
  const empty    = document.getElementById('empty-state');
  const stats    = document.getElementById('stats');
  const clearBtn = document.getElementById('clear-btn');
  const dateEl   = document.getElementById('date-label');

  // Date label
  dateEl.textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

  let tasks = JSON.parse(localStorage.getItem('journal-tasks') || '[]');
  let filter = 'all';

  function save() {
  localStorage.setItem('journal-tasks', JSON.stringify(tasks));
}

  function updateStats() {
  const done   = tasks.filter(t => t.done).length;
  const total  = tasks.length;
  const active = total - done;
  stats.textContent = total === 0
  ? ''
  : `${active} remaining · ${done} done`;
  clearBtn.disabled = done === 0;
}

  function visibleTasks() {
  if (filter === 'active') return tasks.filter(t => !t.done);
  if (filter === 'done')   return tasks.filter(t => t.done);
  return tasks;
}

  function render() {
  list.innerHTML = '';
  const visible = visibleTasks();

  empty.classList.toggle('visible', visible.length === 0);

  visible.forEach(task => {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;
  li.innerHTML = `
          <label class="check-wrap">
            <input type="checkbox" ${task.done ? 'checked' : ''} aria-label="Mark done" />
            <span class="check-box"></span>
          </label>
          <span class="task-text">${escapeHtml(task.text)}</span>
          <button class="delete-btn" aria-label="Delete task">✕</button>
        `;

  li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
  const t = tasks.find(t => t.id === task.id);
  t.done = !t.done;
  save();
  render();
  updateStats();
});

  li.querySelector('.delete-btn').addEventListener('click', () => {
  li.classList.add('removing');
  li.addEventListener('animationend', () => {
  tasks = tasks.filter(t => t.id !== task.id);
  save();
  render();
  updateStats();
}, { once: true });
});

  list.appendChild(li);
});

  updateStats();
}

  function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = '';
  save();
  render();
}

  function escapeHtml(str) {
  return str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
}

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

  clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

  render();
