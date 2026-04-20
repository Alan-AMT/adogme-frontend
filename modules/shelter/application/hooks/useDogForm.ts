// modules/shelter/application/hooks/useDogForm.ts
// Archivo 176 — Estado multi-paso del formulario de perro.
//
// Modos:
//   Crear  → useDogForm()           — draft key = "shelter-dog-form-new"
//   Editar → useDogForm(dogId)      — pre-rellena desde servicio, draft key = "shelter-dog-form-{id}"
//
// Pasos (0-based):
//   0 Datos básicos   · 1 Personalidad  · 2 Cuidados
//   3 Salud           · 4 Fotos         · 5 Revisión
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  DogSize,
  DogSex,
  EnergyLevel,
  FurLength,
  PersonalityTag,
  Vaccination,
} from "@/modules/shared/domain/Dog";
import type {
  DogCreateData,
  DogUpdateData,
} from "../../infrastructure/IShelterService";
import { shelterService } from "../../infrastructure/ShelterServiceFactory";

// ─── Definición de pasos ──────────────────────────────────────────────────────

export const DOG_FORM_STEPS = [
  { id: 0, label: "Datos básicos" },
  { id: 1, label: "Personalidad" },
  { id: 2, label: "Cuidados" },
  { id: 3, label: "Salud" },
  { id: 4, label: "Fotos" },
  { id: 5, label: "Revisión" },
] as const;

export type DogFormStep = (typeof DOG_FORM_STEPS)[number]["id"];

// ─── Tipo del formulario ──────────────────────────────────────────────────────
// Incluye todos los campos editables por el refugio (espejo de DogCreateData sin refugioId)

export interface DogFormData {
  // Step 0 — Datos básicos
  nombre: string;
  refugioNombre?: string;
  refugioId: string;
  refugioLogo?: string;
  edad: number;
  raza: string;
  raza2: string;
  tamano: DogSize | "";
  sexo: DogSex | "";
  nivelEnergia: EnergyLevel | "";
  descripcion: string;

  // Step 1 — Personalidad
  personalidad: PersonalityTag[];
  aptoNinos: boolean;
  aptoPerros: boolean;
  aptoGatos: boolean;

  // Step 2 — Cuidados
  castrado: boolean;
  necesitaJardin: boolean;
  pesoKg: number | undefined;

  // Step 3 — Salud
  estaVacunado: boolean;
  estaDesparasitado: boolean;
  largoPelaje: FurLength;
  salud: string;
  vacunas: Vaccination[];

  // Step 4 — Fotos
  foto: string; // URL principal
  fotos: string[]; // galería completa
}

const FORM_DEFAULTS: DogFormData = {
  nombre: "",
  refugioId: "",
  refugioLogo: "",
  refugioNombre: "",
  edad: 0,
  raza: "",
  raza2: "",
  tamano: "",
  sexo: "",
  nivelEnergia: "",
  descripcion: "",
  personalidad: [],
  aptoNinos: false,
  aptoPerros: false,
  aptoGatos: false,
  castrado: false,
  necesitaJardin: false,
  pesoKg: undefined,
  estaVacunado: false,
  estaDesparasitado: false,
  largoPelaje: "corto",
  salud: "",
  vacunas: [],
  foto: "",
  fotos: [],
};

// ─── Validadores por paso ────────────────────────────────────────────────────

function validateStep(step: number, data: DogFormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!data.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!data.raza.trim()) e.raza = "La raza es requerida";
    if (!data.edad || data.edad <= 0) e.edad = "Ingresa la edad en meses";
    if (!data.tamano) e.tamano = "Selecciona el tamaño";
    if (!data.sexo) e.sexo = "Selecciona el sexo";
    if (!data.nivelEnergia) e.nivelEnergia = "Selecciona el nivel de energía";
    if (!data.descripcion.trim()) e.descripcion = "Agrega una descripción";
  }
  if (step === 4) {
    if (!data.foto.trim()) e.foto = "Debes agregar al menos una foto principal";
  }
  return e;
}

// ─── Persistencia localStorage ────────────────────────────────────────────────

function draftKey(dogId: string | undefined) {
  return `shelter-dog-form-${dogId ?? "new"}`;
}

function loadDraft(dogId: string | undefined): DogFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(dogId));
    return raw ? (JSON.parse(raw) as DogFormData) : null;
  } catch {
    return null;
  }
}

function saveDraftToStorage(dogId: string | undefined, data: DogFormData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(draftKey(dogId), JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function removeDraft(dogId: string | undefined) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(draftKey(dogId));
  } catch {
    /* ignore */
  }
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export interface UseDogFormReturn {
  // Estado
  currentStep: DogFormStep;
  formData: DogFormData;
  errors: Record<string, string>;
  isDraft: boolean;
  isSubmitting: boolean;
  submitError: string | null;

  // Acciones de navegación
  nextStep: () => boolean; // retorna false si hay errores de validación
  prevStep: () => void;
  goToStep: (step: DogFormStep) => void;

  // Acciones de datos
  update: <K extends keyof DogFormData>(
    field: K,
    value: DogFormData[K],
  ) => void;
  updateMany: (partial: Partial<DogFormData>) => void;
  saveDraft: () => void;
  clearDraft: () => void;

  // Submit
  submit: () => Promise<void>;
}

export function useDogForm(dogId?: string): UseDogFormReturn {
  const [currentStep, setCurrentStep] = useState<DogFormStep>(0);
  const [formData, setFormData] = useState<DogFormData>(FORM_DEFAULTS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initializedRef = useRef(false);

  // ── Inicialización ───────────────────────────────────────────────────────────
  // 1. Si hay draft en localStorage → usarlo
  // 2. Si es modo edición y no hay draft → cargar desde el servicio

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const draft = loadDraft(dogId);
    if (draft) {
      setFormData(draft);
      setIsDraft(true);
      return;
    }

    if (dogId) {
      shelterService
        .getDogById(dogId)
        .then((dog) => {
          if (!dog) return;
          setFormData({
            nombre: dog.nombre,
            refugioNombre: dog.refugioNombre,
            refugioLogo: dog.refugioLogo,
            refugioId: dog.refugioId,
            edad: dog.edad,
            raza: dog.raza,
            raza2: dog.raza2 ?? "",
            tamano: dog.tamano,
            sexo: dog.sexo,
            nivelEnergia: dog.nivelEnergia,
            descripcion: dog.descripcion,
            personalidad: dog.personalidad ?? [],
            aptoNinos: dog.aptoNinos,
            aptoPerros: dog.aptoPerros,
            aptoGatos: dog.aptoGatos,
            castrado: dog.castrado,
            necesitaJardin: dog.necesitaJardin,
            pesoKg: dog.pesoKg,
            estaVacunado: dog.estaVacunado,
            estaDesparasitado: dog.estaDesparasitado,
            largoPelaje: dog.largoPelaje,
            salud: dog.salud,
            vacunas: dog.vacunas ?? [],
            foto: dog.foto ?? "",
            fotos: dog.fotos ?? (dog.foto ? [dog.foto] : []),
          });
        })
        .catch(() => {
          /* silencioso: usa defaults */
        });
    }
  }, [dogId]);

  // ── Actualizar un campo ───────────────────────────────────────────────────────

  const update = useCallback(
    <K extends keyof DogFormData>(field: K, value: DogFormData[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        // Auto-guardar draft al modificar (silencioso)
        saveDraftToStorage(dogId, next);
        setIsDraft(true);
        return next;
      });
      // Limpiar error del campo cuando el usuario lo modifica
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    [dogId],
  );

  const updateMany = useCallback(
    (partial: Partial<DogFormData>) => {
      setFormData((prev) => {
        const next = { ...prev, ...partial };
        saveDraftToStorage(dogId, next);
        setIsDraft(true);
        return next;
      });
    },
    [dogId],
  );

  // ── Navegación ────────────────────────────────────────────────────────────────

  const nextStep = useCallback((): boolean => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    if (currentStep < DOG_FORM_STEPS.length - 1) {
      setCurrentStep((prev) => (prev + 1) as DogFormStep);
    }
    return true;
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    setErrors({});
    if (currentStep > 0) setCurrentStep((prev) => (prev - 1) as DogFormStep);
  }, [currentStep]);

  const goToStep = useCallback((step: DogFormStep) => {
    setErrors({});
    setCurrentStep(step);
  }, []);

  // ── Draft ────────────────────────────────────────────────────────────────────

  const saveDraft = useCallback(() => {
    saveDraftToStorage(dogId, formData);
    setIsDraft(true);
  }, [dogId, formData]);

  const clearDraft = useCallback(() => {
    removeDraft(dogId);
    setIsDraft(false);
    setFormData(FORM_DEFAULTS);
    setCurrentStep(0);
    setErrors({});
  }, [dogId]);

  // ── Submit ───────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    // Validar paso 0 (básicos) y paso 4 (fotos) como mínimo
    const step0Errors = validateStep(0, formData);
    const step4Errors = validateStep(4, formData);
    const allErrors = { ...step0Errors, ...step4Errors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Llevar al primer paso con error
      if (Object.keys(step0Errors).length > 0) setCurrentStep(0);
      else setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (dogId) {
        // Modo edición
        const updateData: DogUpdateData = {
          nombre: formData.nombre,
          edad: formData.edad,
          refugioLogo: formData.refugioLogo,
          refugioNombre: formData.refugioNombre,
          raza: formData.raza,
          raza2: formData.raza2 || undefined,
          tamano: formData.tamano || undefined,
          sexo: formData.sexo || undefined,
          nivelEnergia: formData.nivelEnergia || undefined,
          descripcion: formData.descripcion,
          foto: formData.foto || undefined,
          fotos: formData.fotos,
          estaVacunado: formData.estaVacunado,
          estaDesparasitado: formData.estaDesparasitado,
          largoPelaje: formData.largoPelaje,
          salud: formData.salud,
          personalidad: formData.personalidad,
          aptoNinos: formData.aptoNinos,
          aptoPerros: formData.aptoPerros,
          aptoGatos: formData.aptoGatos,
          castrado: formData.castrado,
          necesitaJardin: formData.necesitaJardin,
          pesoKg: formData.pesoKg,
          vacunas: formData.vacunas,
          refugioId: formData.refugioId,
        };
        await shelterService.updateDog(dogId, updateData);
      } else {
        // Modo crear — los campos vacíos no son posibles aquí por la validación
        const createData: DogCreateData = {
          refugioId: formData.refugioId,
          nombre: formData.nombre,
          edad: formData.edad,
          raza: formData.raza,
          raza2: formData.raza2 || undefined,
          tamano: formData.tamano as DogSize,
          sexo: formData.sexo as DogSex,
          nivelEnergia: formData.nivelEnergia as EnergyLevel,
          descripcion: formData.descripcion,
          foto: formData.foto || undefined,
          fotos: formData.fotos,
          estaVacunado: formData.estaVacunado,
          estaDesparasitado: formData.estaDesparasitado,
          largoPelaje: formData.largoPelaje,
          salud: formData.salud,
          personalidad: formData.personalidad,
          aptoNinos: formData.aptoNinos,
          aptoPerros: formData.aptoPerros,
          aptoGatos: formData.aptoGatos,
          castrado: formData.castrado,
          necesitaJardin: formData.necesitaJardin,
          pesoKg: formData.pesoKg,
          vacunas: formData.vacunas,
          refugioNombre: formData.refugioNombre,
          refugioLogo: formData.refugioLogo,
        };
        await shelterService.createDog(createData);
      }

      // Limpiar draft tras submit exitoso
      removeDraft(dogId);
      setIsDraft(false);
    } catch (e: unknown) {
      setSubmitError((e as Error).message ?? "Error al guardar el perro");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, [dogId, formData]);

  return {
    currentStep,
    formData,
    errors,
    isDraft,
    isSubmitting,
    submitError,
    nextStep,
    prevStep,
    goToStep,
    update,
    updateMany,
    saveDraft,
    clearDraft,
    submit,
  };
}
