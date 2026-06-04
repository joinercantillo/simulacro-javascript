import { getProjects, getProjectById, createProject, updateProject, deleteProject } from './api.js';
import { renderPage, renderLoading, showToast } from './ui.js';

const STATUS_OPTIONS = ['In Progress', 'Completed', 'Pending'];

function buildProjectCard(project, session) {
  const actions = session.role === 'manager'
    ? `<button class="btn btn--small" data-action="edit" data-id="${project.id}">Edit</button>
       <button class="btn btn--small btn--danger" data-action="delete" data-id="${project.id}">Delete</button>`
    : '';

  return `
    <article class="project-card">
      <div>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <span class="chip">${project.status}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn--link" data-action="detail" data-id="${project.id}">Details</button>
        ${actions}
      </div>
    </article>
  `;
}

export async function renderProjects({ session, navigateTo }) {
  renderLoading();
  try {
    const projects = await getProjects();
    const visibleProjects = session.role === 'manager'
      ? projects
      : projects.filter((project) => project.assignedTo === session.id);

    const stats = visibleProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    renderPage(`
      <section>
        <div class="page-header">
          <div>
            <h1>Projects</h1>
            <p>${visibleProjects.length} projects visible</p>
          </div>
          <div class="project-summary">
            <span>In Progress: ${stats['In Progress'] || 0}</span>
            <span>Completed: ${stats.Completed || 0}</span>
            <span>Pending: ${stats.Pending || 0}</span>
          </div>
        </div>
        <div class="projects-grid">
          ${visibleProjects.map((project) => buildProjectCard(project, session)).join('')}
        </div>
      </section>
    `);

    attachProjectEvents(session, navigateTo);
  } catch (error) {
    showToast('Could not load projects.', 'error');
    renderPage('<section class="message message--error">Projects are not available.</section>');
  }
}

function attachProjectEvents(session, navigateTo) {
  document.querySelectorAll('[data-action="detail"]').forEach((button) => {
    button.addEventListener('click', () => navigateTo(`projects/detail/${button.dataset.id}`));
  });

  document.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => navigateTo(`projects/edit/${button.dataset.id}`));
  });

  document.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('Delete this project?')) return;
      await deleteProject(button.dataset.id);
      showToast('Project deleted successfully.', 'success');
      navigateTo('projects');
    });
  });
}

export async function renderProjectDetail({ session, navigateTo }) {
  renderLoading();
  const id = window.location.hash.split('/')[3];
  try {
    const project = await getProjectById(id);
    if (session.role === 'collaborator' && project.assignedTo !== session.id) {
      showToast('Access denied to this project.', 'error');
      navigateTo('projects');
      return;
    }

    const editButton = session.role === 'manager' || project.assignedTo === session.id
      ? `<button class="btn btn--primary" id="status-update">Update status</button>`
      : '';

    renderPage(`
      <section class="detail-card">
        <h2>${project.name}</h2>
        <p>${project.description}</p>
        <dl>
          <dt>Status</dt><dd>${project.status}</dd>
          <dt>Responsible ID</dt><dd>${project.assignedTo}</dd>
          <dt>Created</dt><dd>${project.createdAt}</dd>
        </dl>
        <div class="detail-actions">
          <button class="btn btn--secondary" id="back-btn">Back</button>
          ${editButton}
        </div>
      </section>
    `);

    document.getElementById('back-btn').addEventListener('click', () => navigateTo('projects'));
    if (document.getElementById('status-update')) {
      document.getElementById('status-update').addEventListener('click', () => navigateTo(`projects/edit/${project.id}`));
    }
  } catch (error) {
    showToast('Could not open project detail.', 'error');
    navigateTo('projects');
  }
}

export async function renderProjectForm({ session, navigateTo }) {
  renderLoading();
  const hash = window.location.hash;
  const isEdit = hash.includes('edit');
  const projectId = isEdit ? hash.split('/')[3] : null;

  try {
    const project = isEdit ? await getProjectById(projectId) : null;
    const isAllowedEdit = !isEdit || session.role === 'manager' || project?.assignedTo === session.id;
    if (isEdit && !isAllowedEdit) {
      showToast('You cannot modify this project.', 'error');
      navigateTo('projects');
      return;
    }

    renderPage(`
      <section class="form-card">
        <h1>${isEdit ? 'Edit project' : 'Create new project'}</h1>
        <form id="project-form" class="form-grid">
          <label>Name<input name="name" type="text" value="${project?.name || ''}" required /></label>
          <label>Description<textarea name="description" rows="4" required>${project?.description || ''}</textarea></label>
          <label>Status
            <select name="status" required>
              ${STATUS_OPTIONS.map((status) => `<option value="${status}" ${project?.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </label>
          <label>Responsible ID<input name="assignedTo" type="number" value="${project?.assignedTo || ''}" required /></label>
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">${isEdit ? 'Save' : 'Create'}</button>
            <button type="button" class="btn btn--secondary" id="cancel-btn">Cancel</button>
          </div>
        </form>
      </section>
    `);

    document.getElementById('cancel-btn').addEventListener('click', () => navigateTo('projects'));
    document.getElementById('project-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.target;
      const data = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        status: form.status.value,
        assignedTo: Number(form.assignedTo.value),
        createdAt: project?.createdAt || new Date().toLocaleDateString(),
      };

      try {
        if (isEdit) {
          await updateProject(projectId, data);
          showToast('Project updated successfully.', 'success');
        } else {
          await createProject(data);
          showToast('Project created successfully.', 'success');
        }
        navigateTo('projects');
      } catch (error) {
        showToast('Failed to save project. Please check the inputs.', 'error');
      }
    });
  } catch (error) {
    showToast('Unable to load project form.', 'error');
    navigateTo('projects');
  }
}
