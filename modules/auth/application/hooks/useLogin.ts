// modules/auth/application/hooks/useLogin.ts
// ─────────────────────────────────────────────────────────────────────────────
// Application hook for the login form.
// Decouples logic from UI: the component only consumes state and handlers.
//
// FLOW:
//   1. User submits email + password
//   2. authService.login() calls the API and updates authStore
//   3. Redirect based on role:
//       applicant → /mis-solicitudes (or ?redirect= from protected route)
//       shelter   → /refugio/dashboard
//       admin     → /admin
//   4. If error is SHELTER_PENDING → isPendingShelter=true (special UI)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { authService } from "@/modules/auth/infrastructure/AuthServiceFactory";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

// ── Redirect by role ─────────────────────────────────────────────────────────

function getPostLoginUrl(role: string, redirectParam: string | null): string {
  if (redirectParam) {
    return decodeURIComponent(redirectParam);
  }
  if (role === "admin") return "/admin";
  if (role === "shelter") return "/refugio/dashboard";
  if (role === "applicant") return "/mis-solicitudes";
  return "/";
}

// ── Hook types ───────────────────────────────────────────────────────────────

export interface UseLoginState {
  correo: string;
  password: string;
  showPass: boolean;
  recordar: boolean;
  loading: boolean;
  error: string;
  isPendingShelter: boolean;
}

export interface UseLoginActions {
  setCorreo: (v: string) => void;
  setPassword: (v: string) => void;
  toggleShowPass: () => void;
  setRecordar: (v: boolean) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  clearError: () => void;
}

export type UseLoginReturn = UseLoginState & UseLoginActions;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPendingShelter, setIsPendingShelter] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): string {
    if (!correo.trim()) return "El correo electrónico es requerido.";
    if (!/\S+@\S+\.\S+/.test(correo.trim()))
      return "El correo electrónico no es válido.";
    if (!password) return "La contraseña es requerida.";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    return "";
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsPendingShelter(false);

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      // AuthService updates authStore internally (setUser + setTokens)
      const res = await authService.login({
        email: correo.trim(),
        password,
      });

      const redirectParam = searchParams.get("redirect");
      if (redirectParam) {
        router.push(getPostLoginUrl(res.user.role, redirectParam));
        router.refresh();
      } else {
        router.push("/");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar sesión.";

      if (msg.startsWith("SHELTER_PENDING")) {
        setIsPendingShelter(true);
        setError(msg.replace(/^SHELTER_PENDING:\s*/, ""));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    correo,
    setCorreo,
    password,
    setPassword,
    showPass,
    toggleShowPass: () => setShowPass((v) => !v),
    recordar,
    setRecordar,
    loading,
    error,
    isPendingShelter,
    handleSubmit,
    clearError: () => {
      setError("");
      setIsPendingShelter(false);
    },
  };
}
