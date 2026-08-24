// "/api" works through the vite dev proxy - a production build has no
// proxy, so docker points this at the api container's host-mapped port
const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "sway_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Something went wrong");
  }

  return json.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
};

export { TOKEN_KEY };
