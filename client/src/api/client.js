import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token ?? null;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function clearAuthToken() {
  setAuthToken(null);
}

// auth-failure subscribers
const authFailureSubscribers = new Set();

export function onAuthFailure(fn) {
  authFailureSubscribers.add(fn);
  return () => authFailureSubscribers.delete(fn);
}

function emitAuthFailure() {
  authFailureSubscribers.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore subscriber errors */
    }
  });
}

// attach token from memory (fast & avoids stale reads)
client.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// central response handling + normalize errors
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status ?? 0;
    const message =
      err.response?.data?.message ?? err.message ?? "Unknown error";

    const normalized = new Error(message);

    normalized.status = status;
    normalized.isAuthError = status === 401 || status === 403;
    normalized.original = err;

    if (normalized.isAuthError) emitAuthFailure();

    return Promise.reject(normalized);
  },
);

export default client;
