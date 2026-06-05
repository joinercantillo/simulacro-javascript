const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STORAGE_KEY = 'project-manager-projects';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Corporate website redesign and UX improvements.',
    status: 'In Progress',
    assignedTo: 2,
    assignedToFirstName: 'Ana',
    assignedToLastName: 'García',
    createdAt: '2026-05-15',
  },
  {
    id: 2,
    name: 'Backend API Stabilization',
    description: 'Refactor API error handling and performance.',
    status: 'Pending',
    assignedTo: 2,
    assignedToFirstName: 'Ana',
    assignedToLastName: 'García',
    createdAt: '2026-05-18',
  },
  {
    id: 3,
    name: 'Deployment Pipeline',
    description: 'Implement CI/CD for staging and production.',
    status: 'Completed',
    assignedTo: 1,
    assignedToFirstName: 'Carlos',
    assignedToLastName: 'Ruiz',
    createdAt: '2026-05-10',
  },
];

function isNetworkError(error) {
  return [
    'Failed to fetch',
    'NetworkError',
    'ECONNREFUSED',
    'Network request failed',
  ].some((phrase) => error.message.includes(phrase));
}

function loadLocalProjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_PROJECTS));
  return [...FALLBACK_PROJECTS];
}

function saveLocalProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Server error');
  }

  return response.json();
}

export async function getUserByCredentials(email, password) {
  const users = await request(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  return users[0] || null;
}

export async function getProjects() {
  try {
    return await request('/projects?_sort=id&_order=desc');
  } catch (error) {
    if (isNetworkError(error)) {
      return loadLocalProjects().sort((a, b) => b.id - a.id);
    }
    throw error;
  }
}

export async function getProjectById(id) {
  try {
    return await request(`/projects/${id}`);
  } catch (error) {
    if (isNetworkError(error)) {
      return loadLocalProjects().find((project) => String(project.id) === String(id));
    }
    throw error;
  }
}

export async function createProject(project) {
  try {
    return await request('/projects', { method: 'POST', body: JSON.stringify(project) });
  } catch (error) {
    if (isNetworkError(error)) {
      const projects = loadLocalProjects();
      const nextId = projects.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const newProject = { ...project, id: nextId };
      projects.unshift(newProject);
      saveLocalProjects(projects);
      return newProject;
    }
    throw error;
  }
}

export async function updateProject(id, updates) {
  try {
    return await request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  } catch (error) {
    if (isNetworkError(error)) {
      const projects = loadLocalProjects();
      const index = projects.findIndex((project) => String(project.id) === String(id));
      if (index === -1) throw new Error('Project not found');
      const updated = { ...projects[index], ...updates };
      projects[index] = updated;
      saveLocalProjects(projects);
      return updated;
    }
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    return await request(`/projects/${id}`, { method: 'DELETE' });
  } catch (error) {
    if (isNetworkError(error)) {
      const projects = loadLocalProjects().filter((project) => String(project.id) !== String(id));
      saveLocalProjects(projects);
      return { success: true };
    }
    throw error;
  }
}
