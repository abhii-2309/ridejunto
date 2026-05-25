import { apiFetch, clearToken, setToken } from "./api";

export async function registerUser(payload) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setToken(data.token);
  return data;
}

export async function loginUser(payload) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setToken(data.token);
  return data;
}

export async function fetchMe() {
  return apiFetch("/auth/me");
}

export async function logoutUser() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}
