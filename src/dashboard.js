import { getProjects } from './api.js';
import { renderPage, renderLoading, showToast } from './ui.js';

export async function renderDashboard({ session, navigateTo }) {
  renderLoading();

  try {
    const projects = await getProjects();
    const assigned = projects.filter((project) => project.assignedTo === session.id);
    const active = projects.filter((project) => project.status === 'In Progress');
    const finished = projects.filter((project) => project.status === 'Completed');

    const content = session.role === 'manager'
      ? `
        <section class="dashboard-grid">
          <div class="stat-card"><h2>${projects.length}</h2><p>Total projects</p></div>
          <div class="stat-card"><h2>${active.length}</h2><p>Active projects</p></div>
          <div class="stat-card"><h2>${finished.length}</h2><p>Completed projects</p></div>
          <div class="welcome-card">
            <h2>Welcome, ${session.name}</h2>
            <p>Use the Projects view to manage deliveries and update team assignments.</p>
          </div>
        </section>
      `
      : `
        <section class="dashboard-grid">
          <div class="stat-card"><h2>${assigned.length}</h2><p>Assigned projects</p></div>
          <div class="list-card">
            <h3>Your project status</h3>
            <ul>
              ${assigned.map((project) => `<li><strong>${project.name}</strong> • ${project.status}</li>`).join('')}
            </ul>
          </div>
          <div class="welcome-card">
            <h2>Hello, ${session.name}</h2>
            <p>Review your assigned items and update progress when needed.</p>
          </div>
        </section>
      `;

    renderPage(content);
  } catch (error) {
    showToast('Unable to load metrics. Please try again.', 'error');
    renderPage('<section class="message message--error">Dashboard could not be loaded.</section>');
  }
}
