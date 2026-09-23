const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const getTasks = () => request("/tasks");

export const addTask = (title, dueDate) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });

export const updateTask = (id, fields) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });

export const toggleTask = (id) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify({}) });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
