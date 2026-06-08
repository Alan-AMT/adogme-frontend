// modules/auth/application/hooks/useRegister.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hook de aplicación para el formulario de registro multi-paso.
// Maneja: role, step, datos de cada paso, validación, submit final.
//
// PASOS:
//   Adoptante: [1] Datos → [2] Contraseña → [3] Dirección → submit
//   Refugio:   [1] Datos → [2] Contraseña → [3] Datos refugio → submit
//
// USO:
//   const reg = useRegister()
//   // Step 1: reg.data.nombre, reg.data.correo, reg.data.telefono
//   // Step 2: reg.data.password, reg.data.confirmar
//   // Step 3 (adoptante): reg.data.alcaldia, .colonia, .calle, .numExt, .numInt, .cp
//   // Step 3 (refugio): reg.data.refNombre, .refAlcaldia, .refUbicacion, etc.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { authService } from "@/modules/auth/infrastructure/AuthServiceFactory";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";

// ── Tipos ──────────────────────────────────────────────────────────────────────

export type RegisterRole = "applicant" | "shelter";
export type RegisterStep = 1 | 2 | 3;

/** Todos los campos posibles — campos opcionales según role/step */
export interface RegisterFormData {
  // Step 1 — compartido
  nombre: string;
  correo: string;
  telefono: string;

  // Step 2 — compartido
  password: string;
  confirmar: string;

  // Step 3 — adoptante
  direccion: string;
  cp: string;

  // Step 3 — refugio
  refNombre: string;
  refAlcaldia: string;
  refUbicacion: string;
  refTelefono: string;
  refCorreo: string;
  refHorario: string;
  refWebsite: string;
  refDescripcion: string;

  // Confirmaciones
  aceptaTerminos: boolean;
}

const INITIAL_DATA: RegisterFormData = {
  nombre: "",
  correo: "",
  telefono: "",
  password: "",
  confirmar: "",
  direccion: "",
  cp: "",
  refNombre: "",
  refAlcaldia: "",
  refUbicacion: "",
  refTelefono: "",
  refCorreo: "",
  refHorario: "",
  refWebsite: "",
  refDescripcion: "",
  aceptaTerminos: false,
};

export interface UseRegisterReturn {
  // Config del formulario
  role: RegisterRole;
  step: RegisterStep;
  steps: { id: string; label: string }[];

  // Datos
  data: RegisterFormData;
  update: <K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K],
  ) => void;

  // Estado
  loading: boolean;
  error: string;
  success: boolean;

  // Password strength
  passwordStrength: { pct: number; label: string; color: string };

  // Navegación y submit
  setRole: (r: RegisterRole) => void;
  handleNext: (e: FormEvent) => void;
  handleBack: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPasswordStrength(p: string): {
  pct: number;
  label: string;
  color: string;
} {
  if (!p) return { pct: 0, label: "", color: "#e4e4e7" };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return (
    [
      { pct: 20, label: "Muy débil", color: "#ef4444" },
      { pct: 40, label: "Débil", color: "#f97316" },
      { pct: 65, label: "Regular", color: "#eab308" },
      { pct: 85, label: "Buena", color: "#22c55e" },
      { pct: 100, label: "Excelente", color: "#16a34a" },
    ][s] ?? { pct: 20, label: "Muy débil", color: "#ef4444" }
  );
}

const ADOPTANTE_STEPS = [
  { id: "perfil", label: "Perfil" },
  { id: "password", label: "Contraseña" },
  { id: "direccion", label: "Dirección" },
];
const REFUGIO_STEPS = [
  { id: "datos", label: "Datos" },
  { id: "password", label: "Contraseña" },
  { id: "refugio", label: "Refugio" },
];

// ── Validaciones por paso ─────────────────────────────────────────────────────

const NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_CODE_RE = /^\d{5}$/;
const SHELTER_NAME_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,'&()/-]{3,80}$/;
const ADDRESS_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,#'°º/-]{8,160}$/;
const SCHEDULE_RE =
  /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,:;()/-]{3,80}$/;

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("52")
    ? digits.slice(2)
    : digits;
}

function isValidMxPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^\d{10}$/.test(normalized) && !/^(\d)\1{9}$/.test(normalized);
}

function isValidOptionalEmail(email: string): boolean {
  return !email.trim() || EMAIL_RE.test(email.trim());
}

function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );
    return ["http:", "https:"].includes(parsed.protocol) && !!parsed.hostname;
  } catch {
    return false;
  }
}

function validateStep1(d: RegisterFormData): string {
  const nombre = d.nombre.trim();
  const correo = d.correo.trim();

  if (!nombre) return "El nombre completo es requerido.";
  if (!NAME_RE.test(nombre))
    return "Ingresa nombre y apellido, usando solo letras y separadores válidos.";
  if (!correo) return "El correo electrónico es requerido.";
  if (!EMAIL_RE.test(correo))
    return "El correo electrónico no es válido.";
  if (!d.telefono.trim()) return "El teléfono es requerido.";
  if (!isValidMxPhone(d.telefono))
    return "El teléfono debe tener 10 dígitos válidos.";
  return "";
}

function validateStep2(d: RegisterFormData): string {
  if (!d.password) return "La contraseña es requerida.";
  if (d.password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(d.password))
    return "La contraseña debe incluir al menos una letra mayúscula.";
  if (!/[a-z]/.test(d.password))
    return "La contraseña debe incluir al menos una letra minúscula.";
  if (!/\d/.test(d.password))
    return "La contraseña debe incluir al menos un número.";
  if (!/[^A-Za-z0-9]/.test(d.password))
    return "La contraseña debe incluir al menos un carácter especial.";
  if (d.password !== d.confirmar) return "Las contraseñas no coinciden.";
  return "";
}

function validateStep3Adoptante(d: RegisterFormData): string {
  if (!d.direccion.trim()) return "La dirección es requerida.";
  if (!ADDRESS_RE.test(d.direccion.trim()))
    return "La dirección contiene caracteres no válidos o es demasiado corta.";
  if (!POSTAL_CODE_RE.test(d.cp.trim()))
    return "El código postal debe tener 5 dígitos.";
  if (!d.aceptaTerminos)
    return "Debes aceptar los términos y condiciones para continuar.";
  return "";
}

function validateStep3Refugio(d: RegisterFormData): string {
  if (!d.refNombre.trim()) return "El nombre del refugio es requerido.";
  if (!SHELTER_NAME_RE.test(d.refNombre.trim()))
    return "El nombre del refugio contiene caracteres no válidos.";
  if (!d.refAlcaldia) return "Selecciona la alcaldía del refugio.";
  if (!d.refUbicacion.trim()) return "La dirección del refugio es requerida.";
  if (!ADDRESS_RE.test(d.refUbicacion.trim()))
    return "La dirección del refugio contiene caracteres no válidos o es demasiado corta.";
  if (d.refTelefono.trim() && !isValidMxPhone(d.refTelefono))
    return "El teléfono del refugio debe tener 10 dígitos válidos.";
  if (!isValidOptionalEmail(d.refCorreo))
    return "El correo del refugio no es válido.";
  if (!isValidOptionalUrl(d.refWebsite))
    return "La página web del refugio no es válida.";
  if (d.refHorario.trim() && !SCHEDULE_RE.test(d.refHorario.trim()))
    return "El horario contiene caracteres no válidos.";
  if (!d.refDescripcion.trim())
    return "La descripción del refugio es requerida.";
  if (d.refDescripcion.trim().length < 30)
    return "La descripción del refugio debe tener al menos 30 caracteres.";
  if (!d.aceptaTerminos)
    return "Debes aceptar los términos y condiciones para continuar.";
  return "";
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRegister(): UseRegisterReturn {
  const router = useRouter();

  const [role, setRoleState] = useState<RegisterRole>("applicant");
  const [step, setStep] = useState<RegisterStep>(1);
  const [data, setData] = useState<RegisterFormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const steps = role === "applicant" ? ADOPTANTE_STEPS : REFUGIO_STEPS;

  // ── update: actualiza un campo del form ────────────────────────────────────
  const update = useCallback(
    <K extends keyof RegisterFormData>(
      key: K,
      value: RegisterFormData[K],
    ) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // ── setRole: cambia el rol y resetea el formulario ─────────────────────────
  function setRole(r: RegisterRole) {
    setRoleState(r);
    setStep(1);
    setError("");
  }

  // ── handleNext: valida el paso actual y avanza ─────────────────────────────
  function handleNext(e: FormEvent) {
    e.preventDefault();
    setError("");
    const err =
      step === 1 ? validateStep1(data) : step === 2 ? validateStep2(data) : "";
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => (s + 1) as RegisterStep);
  }

  // ── handleBack: retrocede un paso ─────────────────────────────────────────
  function handleBack() {
    setError("");
    setStep((s) => (s - 1) as RegisterStep);
  }

  // ── handleSubmit: valida paso 3 y llama al servicio ───────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const err =
      role === "applicant"
        ? validateStep3Adoptante(data)
        : validateStep3Refugio(data);

    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      if (role === "applicant") {
        await authService.register({
          name: data.nombre.trim(),
          email: data.correo.trim(),
          phone: normalizePhone(data.telefono),
          password: data.password,
          address: data.direccion.trim(),
          postalCode: data.cp.trim(),
        });
        router.push("mi-match");
        router.refresh();
      } else {
        await authService.registerShelter({
          name: data.nombre.trim(),
          email: data.correo.trim(),
          phone: normalizePhone(data.telefono),
          password: data.password,
          shelterName: data.refNombre.trim(),
          description: data.refDescripcion.trim(),
          shelterPhone: data.refTelefono
            ? normalizePhone(data.refTelefono)
            : undefined,
          shelterEmail: data.refCorreo.trim() || undefined,
          shelterWebsite: data.refWebsite.trim() || undefined,
          municipality: data.refAlcaldia,
          fullAddress: data.refUbicacion.trim(),
          schedule: data.refHorario.trim() || undefined,
        });
      }
      setSuccess(true);
      // Adoptante → verificar email; refugio → estado pendiente
      // El componente decide la UI de éxito según el role
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error ? err.message : "Error al crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    role,
    step,
    steps,
    data,
    update,
    loading,
    error,
    success,
    passwordStrength: getPasswordStrength(data.password),
    setRole,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
