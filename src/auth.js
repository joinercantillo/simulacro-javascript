import { getUserByCredentials } from './api.js';

const SESSION_KEY = 'project-manager-session';
const FALLBACK_USERS = [
  {
    id: 1,
    name: 'Manager',
    email: 'manager@test.com',
    password: '123456',
    role: 'manager',
  },
  {
    id: 2,
    name: 'Collaborator',
    email: 'user@test.com',
    password: '123456',
    role: 'collaborator',
  },
];

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function isNetworkError(error) {
  return [
    'Failed to fetch',
    'NetworkError',
    'ECONNREFUSED',
    'Network request failed',
  ].some((phrase) => error.message.includes(phrase));
}

export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Please enter your email and password.');
  }

  try {
    const user = await getUserByCredentials(email, password);
    if (!user) {
      throw new Error('Invalid credentials. Please try again.');
    }

    setSession(user);
    return user;
  } catch (error) {
    if (isNetworkError(error)) {
      const fallbackUser = FALLBACK_USERS.find(
        (user) => user.email === email && user.password === password,
      );
      if (fallbackUser) {
        setSession(fallbackUser);
        return fallbackUser;
      }
    }

    throw error;
  }
}

export function isManager(user) {
  return user?.role === 'manager';
}
