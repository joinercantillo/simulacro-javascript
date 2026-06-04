import { renderDashboard } from './dashboard.js';
import { renderProjects, renderProjectForm, renderProjectDetail } from './projects.js';
import { getSession, logout } from './auth.js';
import { showToast } from './ui.js';

const routes = {
  login: { render: null, private: false },
  dashboard: { render: renderDashboard, private: true },
  projects: { render: renderProjects, private: true },
  'projects/new': { render: renderProjectForm, private: true, managerOnly: true },
  'projects/edit': { render: renderProjectForm, private: true, managerOnly: true },
  'projects/detail': { render: renderProjectDetail, private: true },
};

function getRouteFromHash(hash) {
  const trimmed = hash.replace('#/', '').replace(/^\/?/, '');
  if (!trimmed) return 'dashboard';
  const parts = trimmed.split('/');
  if (parts[0] === 'projects' && parts[1] === 'new') return 'projects/new';
  if (parts[0] === 'projects' && parts[1] === 'edit') return 'projects/edit';
  if (parts[0] === 'projects' && parts[1] === 'detail') return 'projects/detail';
  return parts[0];
}

export function navigateTo(path) {
  window.location.hash = `#/${path}`;
}

export function initRouter(session, handleLogout, navigateToFn) {
  window.addEventListener('hashchange', () => handleRoute(session, navigateToFn));
  window.addEventListener('load', () => handleRoute(session, navigateToFn));
  handleRoute(session, navigateToFn);
}

async function handleRoute(session, navigateToFn) {
  const hash = window.location.hash || '#/dashboard';
  const routeName = getRouteFromHash(hash);
  const route = routes[routeName];

  if (!route) {
    navigateToFn('dashboard');
    return;
  }

  if (routeName === 'login') {
    if (getSession()) {
      navigateToFn('dashboard');
    }
    return;
  }

  if (route.private && !getSession()) {
    showToast('Please log in to continue.', 'warning');
    navigateToFn('login');
    return;
  }

  if (route.managerOnly && session.role !== 'manager') {
    showToast('Access denied: manager only.', 'error');
    navigateToFn('dashboard');
    return;
  }

  await route.render({ session, navigateTo: navigateToFn, handleLogout });
}
