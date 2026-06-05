import { initRouter, navigateTo } from './router.js';
import { getSession, logout, login } from './auth.js';
import { renderLogin, renderApp, getTheme, applyTheme } from './ui.js';

const session = getSession();

function bootstrap() {
  applyTheme(getTheme());

  if (!session) {
    renderLogin(handleLogin);
    return;
  }

  renderApp(session, handleLogout, navigateTo);
  initRouter(session, handleLogout, navigateTo);
}

async function handleLogin(credentials) {
  try {
    const user = await login(credentials.email, credentials.password);
    renderApp(user, handleLogout, navigateTo);
    initRouter(user, handleLogout, navigateTo);
  } catch (error) {
    renderLogin(handleLogin, error.message);
  }
}

function handleLogout() {
  logout();
  window.location.hash = '#/login';
  renderLogin(handleLogin, 'You have logged out successfully.');
}

bootstrap();
