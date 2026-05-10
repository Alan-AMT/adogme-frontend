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

// ─── Request interceptor — proactive token refresh ───────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") return config;

    const token = window.__authToken;
    const exp = window.__authTokenExp;

    if (token && exp && Math.floor(Date.now() / 1000) >= exp) {
      try {
        const newToken = await performTokenRefresh();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch {
        // performTokenRefresh already handled logout + redirect
      }
    } else if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Shared token refresh ────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

async function performTokenRefresh(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const accessToken =
      typeof window !== "undefined" ? window.__authToken : undefined;
    const refreshToken =
      typeof window !== "undefined" ? window.__refreshToken : undefined;

    const res = await axios.post(
      API_ENDPOINTS.AUTH.REFRESH,
      { accessToken, refreshToken },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
      },
    );

    const newToken: string = res.data.accessToken;
    const newRefresh: string = res.data.refreshToken;

    const { useAuthStore } = await import("../store/authStore");
    useAuthStore.getState().setTokens(newToken, newRefresh);

    refreshQueue.forEach(({ resolve }) => resolve(newToken));
    refreshQueue = [];

    return newToken;
  } catch (err) {
    refreshQueue.forEach(({ reject }) => reject(err));
    refreshQueue = [];

    const { useAuthStore } = await import("../store/authStore");
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login?session=expired";
    }

    throw err;
  } finally {
    isRefreshing = false;
  }
}

// ─── Response interceptor — 401 fallback refresh ─────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 — safety-net refresh (clock drift, server-side revocation)
    // Skip refresh for auth endpoints (login, register) — a 401 there is a real credential error
    const isAuthEndpoint =
      original.url?.includes("/auth-ms/user/login") ||
      original.url?.includes("/auth-ms/adopter") ||
      original.url?.includes("/auth-ms/shelter");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const newToken = await performTokenRefresh();
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        return Promise.reject(error);
      }
    }

    // 403 — Forbidden (let the caller handle it)
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
    __authTokenExp?: number;
  }
}
