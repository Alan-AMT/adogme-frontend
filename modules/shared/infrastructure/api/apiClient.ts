// modules/shared/infrastructure/api/apiClient.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios instance for production API calls.
// In mock mode (NEXT_PUBLIC_USE_MOCK=true) this client is not used —
// MockServices return data directly without HTTP.
// ─────────────────────────────────────────────────────────────────────────────

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_ENDPOINTS } from "./endpoints";

// ─── Base instance ───────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
  },
  withCredentials: true,
});

// ─── Request interceptor — attach token ──────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = window.__authToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 refresh ──────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 — Token expired: attempt refresh once
    // Skip for login endpoint (invalid credentials → just reject)
    // const isLoginRequest = original.url?.includes(API_ENDPOINTS.AUTH.LOGIN);
    const requestUrl: string = original.url ? original.url : "";
    const urlRequireToken = [
      String(API_ENDPOINTS.SHELTERS.UPDATE),
      String(API_ENDPOINTS.DOGS.CREATE),
      String(API_ENDPOINTS.DOGS.DELETE),
      String(API_ENDPOINTS.DOGS.UPDATE),
    ].includes(requestUrl);
    if (error.response?.status === 401 && !original._retry && urlRequireToken) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const storedRefresh =
          typeof window !== "undefined" ? window.__refreshToken : undefined;
        const res = await axios.post(
          API_ENDPOINTS.AUTH.REFRESH,
          {},
          {
            withCredentials: true,
            headers: storedRefresh
              ? { Authorization: `Bearer ${storedRefresh}` }
              : {},
          },
        );
        const newToken: string = res.data.accessToken ?? res.data.token;
        const newRefresh: string | undefined = res.data.refreshToken;

        // Sync Zustand store (dynamic import to avoid circular deps)
        const { useAuthStore } = await import("../store/authStore");
        const store = useAuthStore.getState();
        store.setTokens(newToken, newRefresh ?? store.refreshToken ?? "");

        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        // Refresh failed → clear session and redirect to login
        const { useAuthStore } = await import("../store/authStore");
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login?session=expired";
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 — Forbidden
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    // 5xx — Server error
    if (error.response?.status && error.response.status >= 500) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("api:server-error", {
            detail: { status: error.response.status },
          }),
        );
      }
    }

    return Promise.reject(error);
  },
);

export { apiClient };

// ─── Global window types ─────────────────────────────────────────────────────

declare global {
  interface Window {
    __authToken?: string;
    __refreshToken?: string;
  }
}
