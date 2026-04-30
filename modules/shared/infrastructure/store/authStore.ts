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
  clearEnrichmentStorage,
  clearShelterSessionCookie,
  clearTokenCookies,
  clearWindowTokens,
  decodeUserFromToken,
  getRefreshTokenFromCookie,
  getShelterProfileCache,
  getShelterSessionCookie,
  getUserProfileCache,
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
  hydrate: () => Promise<void>;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
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
    const { user } = get();
    if (user?.id) clearEnrichmentStorage(user.id);
    clearShelterSessionCookie();
    clearTokenCookies();
    clearWindowTokens();
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: async () => {
    // Phase 1 — identity (always synchronous, no network)
    const token = getTokenFromCookie();
    if (!token) return;

    const user = decodeUserFromToken(token);
    if (!user) {
      clearTokenCookies();
      return;
    }

    const refreshToken = getRefreshTokenFromCookie();
    setWindowTokens(token, refreshToken ?? undefined);

    // Set base identity immediately so UI is not blocked
    set({ user, token, refreshToken, isAuthenticated: true });

    // Phase 2 — restore enrichment from storage (no network)
    let enriched: AuthUser = { ...user } as AuthUser;
    // let enriched: AuthUser = { ...user, id: user.sub } as AuthUser;
    let needsFetch = false;

    if (user.role === "shelter") {
      const shelterSession = getShelterSessionCookie();
      const shelterProfile = getShelterProfileCache(user.id);

      if (shelterSession && shelterProfile) {
        enriched = {
          ...enriched,
          ...(shelterSession as Partial<ShelterUser>),
          ...(shelterProfile as Partial<ShelterUser>),
        } as ShelterUser;
      } else {
        needsFetch = true;
      }
    }

    if (user.role === "applicant") {
      const profile = getUserProfileCache(user.id);
      if (profile) {
        enriched = {
          ...enriched,
          ...(profile as Partial<Adoptante>),
        } as Adoptante;
      } else {
        needsFetch = true;
      }
    }

    if (!needsFetch) {
      set({ user: enriched });
      return;
    }

    // Phase 3 — fallback fetch (auth token is in cookie so request is authenticated)
    try {
      const { enrichUser } = await import("../auth/enrichUser");
      const fullyEnriched = await enrichUser(enriched);
      set({ user: fullyEnriched });
    } catch {
      // Silent failure — user is authenticated with base identity only
    }
  },
}));
