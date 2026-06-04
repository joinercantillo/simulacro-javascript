import { getSession } from './auth.js';

const app = document.getElementById('app');
let currentToastTimeout;

function shuffleItems(rootSelector) {
  const container = document.querySelector(rootSelector);
  if (!container) return;
  const items = Array.from(container.children).filter((item) => item.nodeType === 1);
  items.forEach((item) => {
    item.style.order = Math.floor(Math.random() * items.length);
    item.style.marginRight = `${6 + Math.random() * 8}px`;
    item.style.marginBottom = `${4 + Math.random() * 8}px`;
  });
}

function randomizeTextRhythm(rootSelector = '#page-content') {
  const elements = document.querySelectorAll(
    `${rootSelector} h1, ${rootSelector} h2, ${rootSelector} h3, ${rootSelector} p, ${rootSelector} li, ${rootSelector} dt, ${rootSelector} dd`
  );
  elements.forEach((el) => {
    const spacing = [0.75, 0.95, 1.1, 1.25, 1.45][Math.floor(Math.random() * 5)];
    el.style.marginBottom = `${spacing}rem`;
    if (Math.random() > 0.85) {
      el.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
    }
  });
}

function applyRandomLayout() {
  shuffleItems('.topnav');
  shuffleItems('.card-actions');
  shuffleItems('.detail-actions');
  shuffleItems('.form-actions');
  randomizeTextRhythm();
}

export function renderLogin(onSubmit, message = '') {
  app.innerHTML = `
    <main class="center-screen">
      <section class="card card--login">
        <h1>Project Manager</h1>
        <p class="subtitle">Internal project dashboard for manager and collaborator roles.</p>
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
  const nav = `
    <header class="topbar">
      <div>
        <span class="brand">Internal Project Manager</span>
        <span class="tag">${session.role.toUpperCase()}</span>
      </div>
      <nav class="topnav">
        <button type="button" class="nav-link" data-route="dashboard">Dashboard</button>
        <button type="button" class="nav-link" data-route="projects">Projects</button>
        ${session.role === 'manager' ? '<button type="button" class="nav-link" data-route="projects/new">New project</button>' : ''}
        <button type="button" class="nav-link" id="logout-btn">Logout</button>
      </nav>
    </header>
    <main id="page-content" class="page-content"></main>
  `;

  app.innerHTML = `<div class="app-shell">${nav}</div>`;
  document.getElementById('logout-btn').addEventListener('click', onLogout);
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.route));
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
