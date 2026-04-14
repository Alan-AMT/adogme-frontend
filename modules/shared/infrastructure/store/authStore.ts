// modules/shared/infrastructure/store/authStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state — Zustand
// This store holds state only. Auth actions (login, register) go through
// AuthService which updates this store via getState().
// Used by: Navbar, layouts, useAuth hook, apiClient
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { create } from "zustand";
import type { Adoptante, Administrador, ShelterUser } from "../../domain/User";
import {
  clearTokenCookies,
  clearWindowTokens,
  decodeUserFromToken,
  getRefreshTokenFromCookie,
  getTokenFromCookie,
  setRefreshTokenCookie,
  setTokenCookie,
  setWindowTokens,
} from "../auth/tokenManager";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthUser = Adoptante | ShelterUser | Administrador;

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setTokens: (accessToken, refreshToken) => {
    setTokenCookie(accessToken);
    setRefreshTokenCookie(refreshToken);
    setWindowTokens(accessToken, refreshToken);
    set({ token: accessToken, refreshToken });
  },

  logout: () => {
    clearTokenCookies();
    clearWindowTokens();
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const token = getTokenFromCookie();
    if (!token) return;

    const user = decodeUserFromToken(token);
    if (!user) {
      clearTokenCookies();
      return;
    }

    const refreshToken = getRefreshTokenFromCookie();
    setWindowTokens(token, refreshToken ?? undefined);
    set({ user, token, refreshToken, isAuthenticated: true });
  },
}));
