// modules/adoption/application/hooks/useAdoptionForm.ts
// Multi-paso con react-hook-form + persistencia de draft en localStorage.
//
// Diseño:
//   - useForm sin resolver, modo onSubmit. Validación manual por step usando
//     STEP_SCHEMAS[currentStep] (zod refinado).
//   - Submit valida con adoptionFormSchema completo y, si falla, navega al
//     primer step con errores.
//   - Draft persistido con clave versionada `adoption-draft-v2-{perroId}` y
//     debounce de 600ms. Restauración sync dentro de defaultValues.
//   - Auto-clear de errores al cambiar el valor de un campo.
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn, FieldPath } from "react-hook-form";

import type {
  AdoptionFormData,
  AdoptionRequest,
} from "../../../shared/domain/AdoptionRequest";
import { ADOPTION_STEPS } from "../../../shared/domain/AdoptionRequest";
import { STEP_SCHEMAS, adoptionFormSchema } from "../../domain/schemas";
import { adoptionService } from "../../infrastructure/AdoptionServiceFactory";
import { useAuthStore } from "../../../shared/infrastructure/store/authStore";

// ─── Tipos expuestos ──────────────────────────────────────────────────────────

export interface UseAdoptionFormOptions {
  perroId: string;
  refugioId: string;
  perroNombre?: string;
}

export interface UseAdoptionFormReturn {
  form: UseFormReturn<AdoptionFormData>;
  currentStep: number;
  totalSteps: number;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  submittedRequest: AdoptionRequest | null;
  savedAt: Date | null;
  formError: string | null;
  resetForm: () => void;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = ADOPTION_STEPS.length; // 6
const DEBOUNCE_MS = 600;

// Mapa: para cada step, qué campos top-level del form le pertenecen.
// Solo se usa para auto-clear de errores y para localizar el primer step
// con errores tras un submit completo. La validación real corre contra
// STEP_SCHEMAS[currentStep].
const STEP_FIELDS: (keyof AdoptionFormData)[][] = [
  [
    "nombreCompleto",
    "edad",
    "telefono",
    "correo",
    "ocupacion",
    "direccion",
    "redesSociales",
  ],
  ["vivienda", "entorno"],
  ["rutina"],
  ["mascotasActuales", "experienciaPrevia"],
  [
    "motivacion",
    "siMudanza",
    "siComportamientoNoEsperado",
    "situacionesParaDevolver",
    "capacidadEconomica",
    "cuidadosMedicos",
  ],
  [
    "aceptaAlimentacionVeterinaria",
    "aceptaNoAbandono",
    "aceptaContactarRefugio",
    "aceptaSeguimiento",
    "aceptaInfoVeridica",
  ],
];

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface DraftPayload {
  step: number;
  data: Partial<AdoptionFormData>;
  savedAt: string;
}

// Valores iniciales — arrays no-undefined para que CheckboxGroup tenga algo
// con qué hacer .includes() desde el primer render. El resto puede quedar
// undefined (RHF tolera Partial<>).
const INITIAL_VALUES: Partial<AdoptionFormData> = {
  vivienda: { fotosVivienda: [] } as Partial<
    AdoptionFormData["vivienda"]
  > as AdoptionFormData["vivienda"],
  rutina: { actividadesPlaneadas: [] } as Partial<
    AdoptionFormData["rutina"]
  > as AdoptionFormData["rutina"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readDraft(key: string): DraftPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.step === "number" &&
      parsed.data &&
      typeof parsed.savedAt === "string"
    ) {
      return parsed as DraftPayload;
    }
  } catch {
    // draft corrupto — lo ignoramos
  }
  return null;
}

function buildDefaults(draft: DraftPayload | null): Partial<AdoptionFormData> {
  if (!draft) return INITIAL_VALUES;
  return { ...INITIAL_VALUES, ...draft.data };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdoptionForm(
  options: UseAdoptionFormOptions,
): UseAdoptionFormReturn {
  const { perroId, refugioId } = options;

  const user = useAuthStore((s) => s.user);

  const draftKey = useMemo(() => `adoption-draft-v2-${perroId}`, [perroId]);

  // Lectura sync del draft — solo en el primer render.
  // (useState con initializer fn lo garantiza.)
  const initialDraftRef = useRef<DraftPayload | null>(null);
  const [defaults] = useState<Partial<AdoptionFormData>>(() => {
    const d = readDraft(draftKey);
    initialDraftRef.current = d;
    return buildDefaults(d);
  });

  const form = useForm<AdoptionFormData>({
    mode: "onSubmit",
    defaultValues: defaults as AdoptionFormData,
  });

  const [currentStep, setCurrentStep] = useState<number>(
    () => initialDraftRef.current?.step ?? 0,
  );
  const [savedAt, setSavedAt] = useState<Date | null>(() =>
    initialDraftRef.current ? new Date(initialDraftRef.current.savedAt) : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] =
    useState<AdoptionRequest | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Persistencia del draft (debounced) ────────────────────────────────────
  // Mantenemos currentStep en una ref para no reinscribir la suscripción
  // cada vez que cambia el step (eso aborta el watch en mitad del flujo).
  const stepRef = useRef(currentStep);
  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const sub = form.watch((values) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const payload: DraftPayload = {
          step: stepRef.current,
          data: values as Partial<AdoptionFormData>,
          savedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(draftKey, JSON.stringify(payload));
          setSavedAt(new Date(payload.savedAt));
        } catch {
          // quota excedida o storage deshabilitado — silencioso
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      sub.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [form, draftKey]);

  // ── Auto-clear de errores al editar un campo ──────────────────────────────
  useEffect(() => {
    const sub = form.watch((_v, info) => {
      if (info.type === "change" && info.name) {
        form.clearErrors(info.name as FieldPath<AdoptionFormData>);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // ── Helpers de validación ─────────────────────────────────────────────────

  /** Limpia los errores de todos los campos top-level de un step. */
  const clearStepErrors = useCallback(
    (step: number) => {
      const fields = STEP_FIELDS[step] ?? [];
      fields.forEach((f) => form.clearErrors(f as FieldPath<AdoptionFormData>));
    },
    [form],
  );

  /**
   * Mapea issues de zod → form.setError. zod entrega path como (string|number)[];
   * RHF acepta paths anidados con notación punto/índice. El cast a FieldPath
   * es manual porque los paths se construyen en runtime.
   */
  const applyZodIssues = useCallback(
    (issues: readonly { path: PropertyKey[]; message: string }[]) => {
      issues.forEach((issue) => {
        if (!issue.path.length) return;
        const path = issue.path
          .map((seg) => (typeof seg === "number" ? `${seg}` : String(seg)))
          .join(".") as FieldPath<AdoptionFormData>;
        form.setError(path, { type: "manual", message: issue.message });
      });
    },
    [form],
  );

  // ── Navegación ────────────────────────────────────────────────────────────

  const nextStep = useCallback(async (): Promise<boolean> => {
    setFormError(null);
    const values = form.getValues();
    const result = await STEP_SCHEMAS[currentStep].safeParseAsync(values);

    if (!result.success) {
      clearStepErrors(currentStep);
      applyZodIssues(result.error.issues);
      return false;
    }

    clearStepErrors(currentStep);
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    return true;
  }, [form, currentStep, clearStepErrors, applyZodIssues]);

  const prevStep = useCallback(() => {
    setFormError(null);
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= TOTAL_STEPS) return;
    // Solo permitimos retroceder o quedarse. Saltos hacia adelante deben pasar
    // por nextStep para validar los intermedios.
    setCurrentStep((s) => (step <= s ? step : s));
    setFormError(null);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  const submitForm = useCallback(async (): Promise<void> => {
    setFormError(null);

    if (!user) {
      setFormError("Debes iniciar sesión para enviar la solicitud");
      return;
    }

    const values = form.getValues();
    const parsed = await adoptionFormSchema.safeParseAsync(values);

    if (!parsed.success) {
      // Localiza el primer step con errores y navega allí.
      const firstStep = parsed.error.issues
        .map((i) => {
          const top = i.path[0];
          if (typeof top !== "string") return -1;
          return STEP_FIELDS.findIndex((fields) =>
            fields.includes(top as keyof AdoptionFormData),
          );
        })
        .filter((idx) => idx >= 0)
        .reduce<number | null>(
          (min, idx) => (min === null || idx < min ? idx : min),
          null,
        );

      // Limpia errores de todos los steps antes de re-aplicar (evita arrastre).
      STEP_FIELDS.forEach((_, i) => clearStepErrors(i));
      applyZodIssues(parsed.error.issues);

      if (firstStep !== null) setCurrentStep(firstStep);
      setFormError("Hay errores en el formulario, revisa los pasos marcados");
      return;
    }

    setIsSubmitting(true);
    try {
      // const request = await adoptionService.submit(
      //   {
      //     perroId,
      //     refugioId,
      //     comentarios: '',
      //     formulario:  parsed.data as AdoptionFormData,
      //   },
      //   user.id,
      // )

      const j = {
        data: {
          perroId,
          refugioId,
          comentarios: "",
          formulario: parsed.data as AdoptionFormData,
        },
        user: user.id,
      };

      console.log(JSON.stringify(j, null, 2));

      // Éxito — purgar draft y exponer la solicitud creada.
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          /* noop */
        }
      }
      setSavedAt(null);
      setSubmittedRequest(null);
      // setSubmittedRequest(request);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al enviar la solicitud";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form,
    user,
    perroId,
    refugioId,
    draftKey,
    clearStepErrors,
    applyZodIssues,
  ]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* noop */
      }
    }
    form.reset(INITIAL_VALUES as AdoptionFormData);
    setCurrentStep(0);
    setSubmittedRequest(null);
    setFormError(null);
    setSavedAt(null);
  }, [form, draftKey]);

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    isSubmitting,
    submittedRequest,
    savedAt,
    formError,
    resetForm,
  };
}
