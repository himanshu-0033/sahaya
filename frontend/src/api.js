const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  signup: (name, email, password, role) =>
    request("/auth/signup", { method: "POST", body: { name, email, password, role } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  today: (token) => request("/checkins/today", { token }),
  submitCheckIn: (responses, token) => request("/checkins", { method: "POST", body: { responses }, token }),
  history: (token) => request("/checkins/history", { token }),
};
