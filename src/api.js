const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  return request('/projects?_sort=id&_order=desc');
}

export async function getProjectById(id) {
  return request(`/projects/${id}`);
}

export async function createProject(project) {
  return request('/projects', { method: 'POST', body: JSON.stringify(project) });
}

export async function updateProject(id, updates) {
  return request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' });
}
