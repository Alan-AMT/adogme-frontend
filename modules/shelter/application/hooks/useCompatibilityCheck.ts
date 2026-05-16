"use client";

import { useState, useCallback } from "react";
import { QUIZ_BLOCKS } from "@/modules/shared/domain/LifestyleProfile";
import type { QuizDraftState } from "@/modules/shared/domain/LifestyleProfile";
import {
  mapDraftToPayload,
  isBlockComplete,
} from "@/modules/recommendations/application/quizMapping";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type CompatibilityPhase = "quiz" | "result" | "error";

export type CompatibilityCategory =
  | "activity"
  | "housing"
  | "experience"
  | "care";

export interface CompatibilityReason {
  categoria: CompatibilityCategory;
  texto: string;
  esPositivo: boolean;
}

export interface CompatibilityResult {
  score: number;
  reasons: CompatibilityReason[];
}

export interface UseCompatibilityCheckReturn {
  draft: QuizDraftState;
  currentStep: number;
  totalSteps: number;
  phase: CompatibilityPhase;
  result: CompatibilityResult | null;
  isCalculating: boolean;
  error: string | null;
  canAdvance: boolean;
  isLastStep: boolean;
  setAnswer: <K extends keyof QuizDraftState>(
    key: K,
    value: QuizDraftState[K],
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculate: () => Promise<void>;
  reset: () => void;
}

// ─── Respuesta del ML ─────────────────────────────────────────────────────────

interface RawCompatibilityResponse {
  compatibility_score: number;
  user_vector?: [number, number, number, number];
  dog_vector?: [number, number, number, number];
}

// ─── Build reasons ────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<CompatibilityCategory, string> = {
  activity: "actividad",
  housing: "espacio",
  experience: "experiencia",
  care: "cuidados",
};

const DIMENSIONS: CompatibilityCategory[] = [
  "activity",
  "housing",
  "experience",
  "care",
];

function buildReasons(
  u: [number, number, number, number],
  d: [number, number, number, number],
): CompatibilityReason[] {
  return DIMENSIONS.map((cat, i) => {
    const esPositivo = Math.abs(u[i] - d[i]) < 1.5;
    return {
      categoria: cat,
      esPositivo,
      texto: esPositivo
        ? `El perfil de ${CATEGORY_LABELS[cat]} es compatible con este perro`
        : `Hay diferencia en ${CATEGORY_LABELS[cat]} — considera si se adapta al adoptante`,
    };
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = QUIZ_BLOCKS.length;

export function useCompatibilityCheck(
  dogId: string,
): UseCompatibilityCheckReturn {
  const [draft, setDraft] = useState<QuizDraftState>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<CompatibilityPhase>("quiz");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAnswer = useCallback(
    <K extends keyof QuizDraftState>(key: K, value: QuizDraftState[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const calculate = useCallback(async () => {
    setIsCalculating(true);
    setError(null);
    try {
      const payload = mapDraftToPayload(draft);
      console.log(payload);
      console.log(dogId);
      const { data } = await apiClient.post<RawCompatibilityResponse>(
        API_ENDPOINTS.ML.COMPATIBILITY_BY_DOG(dogId),
        payload,
        { timeout: 30_000, withCredentials: false },
      );
      const score = Math.round(data.compatibility_score * 100);
      const reasons =
        data.user_vector && data.dog_vector
          ? buildReasons(data.user_vector, data.dog_vector)
          : [];
      setResult({ score, reasons });
      setPhase("result");
    } catch {
      setError("No se pudo calcular la compatibilidad. Intenta de nuevo.");
      setPhase("error");
    } finally {
      setIsCalculating(false);
    }
  }, [dogId, draft]);

  const reset = useCallback(() => {
    setDraft({});
    setCurrentStep(0);
    setPhase("quiz");
    setResult(null);
    setError(null);
  }, []);

  return {
    draft,
    currentStep,
    totalSteps: TOTAL_STEPS,
    phase,
    result,
    isCalculating,
    error,
    canAdvance: isBlockComplete(currentStep, draft),
    isLastStep: currentStep === TOTAL_STEPS - 1,
    setAnswer,
    nextStep,
    prevStep,
    calculate,
    reset,
  };
}
