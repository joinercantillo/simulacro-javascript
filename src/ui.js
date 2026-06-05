import { getSession } from './auth.js';

const app = document.getElementById('app');
let currentToastTimeout;
const THEME_KEY = 'project-manager-theme';

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme() {
  const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  return nextTheme;
}

function applyRandomLayout() {
  // Disabled random layout to keep navigation stable and accessible.
}

export function renderLogin(onSubmit, message = '') {
  app.innerHTML = `
    <main class="center-screen">
      <section class="card card--login">
        <div class="brand">
          <span class="brand-icon">P</span>
          <span>Project Manager</span>
        </div>
        <h1>Welcome back</h1>
        <p class="subtitle">Log in to manage projects, review team assignments, and update task status in a single dashboard.</p>
        ${message ? `<div class="message message--info">${message}</div>` : ''}
        <form id="login-form" class="form-grid">
          <label>Email<input type="email" name="email" placeholder="manager@test.com" required /></label>
          <label>Password<input type="password" name="password" placeholder="123456" required /></label>
          <button class="btn btn--primary" type="submit">Sign In</button>
        </form>
      </section>
    </main>
  `;

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    onSubmit({ email, password });
  });

  applyRandomLayout();
}

export function renderApp(session, onLogout, navigateTo) {
  const currentTheme = getTheme();
  const nav = `
    <header class="topbar">
      <div>
        <span class="brand"><span class="brand-icon">P</span>Internal Project Manager</span>
        <span class="tag">${session.role.toUpperCase()}</span>
      </div>
      <nav class="topnav" aria-label="Main navigation">
        <button type="button" class="nav-link" data-route="dashboard">Dashboard</button>
        <button type="button" class="nav-link" data-route="projects">Projects</button>
        ${session.role === 'manager' ? '<button type="button" class="nav-link" data-route="projects/new">New project</button>' : ''}
        <button type="button" class="nav-link" id="theme-toggle">${currentTheme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
        <button type="button" class="nav-link" id="logout-btn">Logout</button>
      </nav>
    </header>
    <main id="page-content" class="page-content"></main>
  `;

  app.innerHTML = `<div class="app-shell">${nav}</div>`;
  document.getElementById('logout-btn').addEventListener('click', onLogout);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const nextTheme = toggleTheme();
    document.getElementById('theme-toggle').textContent = nextTheme === 'dark' ? 'Light mode' : 'Dark mode';
  });
  document.querySelectorAll('.nav-link[data-route]').forEach((button) => {
    const route = button.dataset.route;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(route);
    });
  });

  applyRandomLayout();
}

export function renderPage(content) {
  const pageContent = document.getElementById('page-content');
  if (pageContent) {
    pageContent.innerHTML = content;
    applyRandomLayout();
  }
}

export function renderLoading(content = 'Loading...') {
  renderPage(`<section class="loader">${content}</section>`);
}

export function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  clearTimeout(currentToastTimeout);
  currentToastTimeout = setTimeout(() => toast.remove(), 3500);
}

export function getRoot() {
  return document.getElementById('page-content');
}

export function getCurrentUser() {
  return getSession();
}
