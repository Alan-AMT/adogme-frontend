// modules/shared/infrastructure/auth/tokenManager.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for token storage (cookies + window globals).
// Used internally by authStore — external code should call store methods.
// ─────────────────────────────────────────────────────────────────────────────

import type { Adoptante, Administrador, ShelterUser } from "../../domain/User";

export type AuthUser = Adoptante | ShelterUser | Administrador;

// ─── Cookie helpers ──────────────────────────────────────────────────────────

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRefreshTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)refresh-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setTokenCookie(token: string): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `auth-token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function setRefreshTokenCookie(token: string): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `refresh-token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function clearTokenCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie =
    "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// ─── Window global helpers ───────────────────────────────────────────────────

export function setWindowTokens(
  accessToken: string,
  refreshToken?: string,
): void {
  if (typeof window === "undefined") return;
  window.__authToken = accessToken;
  if (refreshToken) window.__refreshToken = refreshToken;
}

export function clearWindowTokens(): void {
  if (typeof window === "undefined") return;
  window.__authToken = undefined;
  window.__refreshToken = undefined;
}

// ─── JWT / mock token decoding ───────────────────────────────────────────────

export function decodeUserFromToken(token: string): AuthUser | null {
  try {
    const segments = token.split(".");
    if (segments.length === 3) {
      // Real JWT: header.payload.signature — decode the payload
      const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      const payload = JSON.parse(atob(padded));
      return payload as AuthUser;
    }
    // Fallback: mock token (plain base64 JSON)
    const payload = JSON.parse(decodeURIComponent(escape(atob(token))));
    return payload as AuthUser;
  } catch {
    return null;
  }
}

// ─── Mock token builder (client-side, uses btoa) ─────────────────────────────

export function buildMockToken(user: AuthUser): string {
  const payload = {
    ...user,
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
