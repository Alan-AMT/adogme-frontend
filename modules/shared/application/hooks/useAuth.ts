// modules/shared/application/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Read-only auth state hook with computed role checks.
// For auth actions (login, register), use the dedicated hooks (useLogin, etc.)
// or call authService directly.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useCallback } from "react";
import type { ShelterUser } from "../../domain/User";
import { useAuthStore } from "../../infrastructure/store/authStore";
import { authService } from "@/modules/auth/infrastructure/AuthServiceFactory";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleLogout = useCallback(async () => {
    await authService.logout();
  }, []);

  return {
    // State
    user,
    token,
    isAuthenticated,

    // Role checks
    isApplicant: user?.role === "applicant",
    isShelter: user?.role === "shelter",
    isAdmin: user?.role === "admin",

    // Shelter-specific checks
    isShelterApproved:
      user?.role === "shelter"
        ? (user as ShelterUser).shelterStatus === "approved"
        : false,

    isShelterPending:
      user?.role === "shelter"
        ? (user as ShelterUser).shelterStatus === "pending"
        : false,

    shelterId:
      user?.role === "shelter" ? (user as ShelterUser).shelterId : null,

    // Actions
    logout: handleLogout,
  };
}
