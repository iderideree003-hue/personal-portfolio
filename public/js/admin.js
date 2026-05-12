// === AUTH ===
async function checkAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    showAdmin();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('admin-view').classList.add('hidden');
}

function showAdmin() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('admin-view').classList.remove('hidden');
  loadProjects();
  loadSkills();
  loadContacts();
}

// LOGIN
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = 'И-мэйл эсвэл нууц үг буруу байна';
  } else {
    showAdmin();
  }
});

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', async () => {
  await db.auth.signOut();
  showLogin();
});

// === TABS ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// === PROJECTS ===
async function loadProjects() {
  const container = document.getElementById('projects-table');
  const { data, error } = await db.from('projects').select('*').order('created_at', { ascending: false });

  if (error) { container.innerHTML = '<p class="empty">Алдаа: ' + error.message + '</p>'; return; }
  if (!data.length) { container.innerHTML = '<p class="empty">Төсөл алга</p>'; return; }

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Гарчиг</th><th>Тайлбар</th><th>Технологи</th><th>Үйлдэл</th></tr>
      </thead>
      <tbody>
        ${data.map(p => `
          <tr>
            <td><strong>${escapeHtml(p.title)}</strong></td>
            <td>${escapeHtml((p.description || '').slice(0, 80))}${(p.description || '').length > 80 ? '...' : ''}</td>
            <td>${(p.technologies || []).join(', ')}</td>
            <td class="action-btns">
              <button class="btn-edit" onclick="editProject('${p.id}')">Засах</button>
              <button class="btn-delete" onclick="deleteProject('${p.id}')">Устгах</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const tech = document.getElementById('project-tech').value
    .split(',').map(t => t.trim()).filter(Boolean);

  const payload = {
    title: document.getElementById('project-title').value.trim(),
    description: document.getElementById('project-description').value.trim() || null,
    image_url: document.getElementById('project-image').value.trim() || null,
    project_url: document.getElementById('project-url').value.trim() || null,
    github_url: document.getElementById('project-github').value.trim() || null,
    technologies: tech,
  };

  let error;
  if (id) {
    ({ error } = await db.from('projects').update(payload).eq('id', id));
  } else {
    ({ error } = await db.from('projects').insert(payload));
  }

  if (error) { alert('Алдаа: ' + error.message); return; }

  resetProjectForm();
  loadProjects();
});

window.editProject = async (id) => {
  const { data, error } = await db.from('projects').select('*').eq('id', id).single();
  if (error) return;

  document.getElementById('project-id').value = data.id;
  document.getElementById('project-title').value = data.title || '';
  document.getElementById('project-description').value = data.description || '';
  document.getElementById('project-image').value = data.image_url || '';
  document.getElementById('project-url').value = data.project_url || '';
  document.getElementById('project-github').value = data.github_url || '';
  document.getElementById('project-tech').value = (data.technologies || []).join(', ');

  document.getElementById('project-submit').textContent = 'Шинэчлэх';
  document.getElementById('project-cancel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteProject = async (id) => {
  if (!confirm('Энэ төслийг устгах уу?')) return;
  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) { alert('Алдаа: ' + error.message); return; }
  loadProjects();
};

document.getElementById('project-cancel').addEventListener('click', resetProjectForm);

function resetProjectForm() {
  document.getElementById('project-form').reset();
  document.getElementById('project-id').value = '';
  document.getElementById('project-submit').textContent = 'Нэмэх';
  document.getElementById('project-cancel').classList.add('hidden');
}

// === SKILLS ===
async function loadSkills() {
  const container = document.getElementById('skills-table');
  const { data, error } = await db.from('skills').select('*').order('created_at', { ascending: true });

  if (error) { container.innerHTML = '<p class="empty">Алдаа: ' + error.message + '</p>'; return; }
  if (!data.length) { container.innerHTML = '<p class="empty">Ур чадвар алга</p>'; return; }

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Нэр</th><th>Ангилал</th><th>Түвшин</th><th>Үйлдэл</th></tr>
      </thead>
      <tbody>
        ${data.map(s => `
          <tr>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td>${escapeHtml(s.category || '')}</td>
            <td>${s.level || 0}%</td>
            <td class="action-btns">
              <button class="btn-edit" onclick="editSkill('${s.id}')">Засах</button>
              <button class="btn-delete" onclick="deleteSkill('${s.id}')">Устгах</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('skill-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('skill-id').value;

  const payload = {
    name: document.getElementById('skill-name').value.trim(),
    category: document.getElementById('skill-category').value.trim() || null,
    level: parseInt(document.getElementById('skill-level').value) || 0,
  };

  let error;
  if (id) {
    ({ error } = await db.from('skills').update(payload).eq('id', id));
  } else {
    ({ error } = await db.from('skills').insert(payload));
  }

  if (error) { alert('Алдаа: ' + error.message); return; }

  resetSkillForm();
  loadSkills();
});

window.editSkill = async (id) => {
  const { data, error } = await db.from('skills').select('*').eq('id', id).single();
  if (error) return;

  document.getElementById('skill-id').value = data.id;
  document.getElementById('skill-name').value = data.name || '';
  document.getElementById('skill-category').value = data.category || '';
  document.getElementById('skill-level').value = data.level || 0;

  document.getElementById('skill-submit').textContent = 'Шинэчлэх';
  document.getElementById('skill-cancel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteSkill = async (id) => {
  if (!confirm('Энэ ур чадварыг устгах уу?')) return;
  const { error } = await db.from('skills').delete().eq('id', id);
  if (error) { alert('Алдаа: ' + error.message); return; }
  loadSkills();
};

document.getElementById('skill-cancel').addEventListener('click', resetSkillForm);

function resetSkillForm() {
  document.getElementById('skill-form').reset();
  document.getElementById('skill-id').value = '';
  document.getElementById('skill-submit').textContent = 'Нэмэх';
  document.getElementById('skill-cancel').classList.add('hidden');
}

// === CONTACTS ===
async function loadContacts() {
  const container = document.getElementById('contacts-table');
  const { data, error } = await db.from('contacts').select('*').order('created_at', { ascending: false });

  if (error) { container.innerHTML = '<p class="empty">Алдаа: ' + error.message + '</p>'; return; }
  if (!data.length) { container.innerHTML = '<p class="empty">Мессеж алга</p>'; return; }

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Нэр</th><th>И-мэйл</th><th>Мессеж</th><th>Огноо</th><th>Үйлдэл</th></tr>
      </thead>
      <tbody>
        ${data.map(c => `
          <tr class="${c.is_read ? '' : 'unread'}">
            <td><strong>${escapeHtml(c.name)}</strong></td>
            <td><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></td>
            <td>${escapeHtml(c.message)}</td>
            <td>${new Date(c.created_at).toLocaleString('mn-MN')}</td>
            <td class="action-btns">
              ${c.is_read ? '' : `<button class="btn-edit" onclick="markRead('${c.id}')">Уншсан</button>`}
              <button class="btn-delete" onclick="deleteContact('${c.id}')">Устгах</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

window.markRead = async (id) => {
  const { error } = await db.from('contacts').update({ is_read: true }).eq('id', id);
  if (error) { alert('Алдаа: ' + error.message); return; }
  loadContacts();
};

window.deleteContact = async (id) => {
  if (!confirm('Энэ мессежийг устгах уу?')) return;
  const { error } = await db.from('contacts').delete().eq('id', id);
  if (error) { alert('Алдаа: ' + error.message); return; }
  loadContacts();
};

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Эхлүүлэх
checkAuth();
