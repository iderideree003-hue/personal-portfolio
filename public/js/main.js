// === SKILLS ачаалах ===
async function loadSkills() {
  const container = document.getElementById('skills-list');
  const { data, error } = await db
    .from('skills')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    container.innerHTML = '<p class="status error">Алдаа гарлаа</p>';
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p class="loading">Одоогоор ур чадвар нэмэгдээгүй байна.</p>';
    return;
  }

  container.innerHTML = data.map(s => `
    <div class="skill-card">
      <h3>${escapeHtml(s.name)}</h3>
      <p style="color:#888;font-size:0.85rem">${escapeHtml(s.category || '')}</p>
      <div class="skill-bar">
        <div class="skill-bar-fill" style="width:${s.level || 0}%"></div>
      </div>
    </div>
  `).join('');
}

// === PROJECTS ачаалах ===
async function loadProjects() {
  const container = document.getElementById('projects-list');
  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p class="status error">Алдаа гарлаа</p>';
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p class="loading">Одоогоор төсөл нэмэгдээгүй байна.</p>';
    return;
  }

  container.innerHTML = data.map(p => `
    <div class="project-card">
      ${p.image_url ? `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}" />` : ''}
      <div class="project-card-content">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description || '')}</p>
        <div class="project-tags">
          ${(p.technologies || []).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-links">
          ${p.project_url ? `<a href="${escapeHtml(p.project_url)}" target="_blank">Үзэх →</a>` : ''}
          ${p.github_url ? `<a href="${escapeHtml(p.github_url)}" target="_blank">GitHub →</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// === CONTACT FORM ===
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('contact-status');
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  status.textContent = 'Илгээж байна...';
  status.className = 'status';

  const { error } = await db.from('contacts').insert({
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
  });

  if (error) {
    status.textContent = 'Алдаа: ' + error.message;
    status.className = 'status error';
  } else {
    status.textContent = 'Амжилттай илгээгдлээ! Баярлалаа 🙌';
    status.className = 'status success';
    e.target.reset();
  }

  btn.disabled = false;
});

// XSS-аас хамгаалах helper
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
loadSkills();
loadProjects();
