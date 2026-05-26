const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("ridejunto_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("ridejunto_token", token);
}

export function clearToken() {
  localStorage.removeItem("ridejunto_token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response"
  }));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
