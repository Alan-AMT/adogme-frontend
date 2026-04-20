// modules/shelter/components/ShelterDogFormView.tsx
// Archivo 183 — Orquestador multi-paso del formulario de perro.
//
// Modo crear: dogId = undefined  → useDogForm() → shelterService.createDog
// Modo editar: dogId = number   → useDogForm(dogId) → shelterService.updateDog
//
// Pasos (0-based):
//   0 Datos básicos · 1 Personalidad · 2 Cuidados
//   3 Salud         · 4 Fotos        · 5 Revisión
"use client";

import { useDogForm, DOG_FORM_STEPS } from "../application/hooks/useDogForm";
import { Stepper } from "@/modules/shared/components/ui/Stepper";
import { BasicDataStep } from "./dog-form-steps/BasicDataStep";
import { PersonalityStep } from "./dog-form-steps/PersonalityStep";
import { CareStep } from "./dog-form-steps/CareStep";
import { MedicalStep } from "./dog-form-steps/MedicalStep";
import { MediaStep } from "./dog-form-steps/MediaStep";
import { ReviewStep } from "./dog-form-steps/ReviewStep";
import "../styles/shelterDashboard.css";
import "../styles/shelterViews.css";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import { useEffect } from "react";

// ─── Pasos para el Stepper (id debe ser string) ───────────────────────────────

const STEPPER_STEPS = DOG_FORM_STEPS.map((s) => ({
  id: String(s.id),
  label: s.label,
}));

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ShelterDogFormView({ dogId }: { dogId?: string }) {
  const form = useDogForm(dogId);
  const { user, hydrate } = useAuthStore();
  useEffect(() => {
    if (user && user.role == "shelter") {
      if (user.shelterId) {
        form.formData.refugioNombre = user.shelterName;
        form.formData.refugioLogo = user.shelterLogo;
        form.formData.refugioId = user.shelterId!;
      } else
        hydrate().then(() => {
          form.formData.refugioNombre = user.shelterName;
          form.formData.refugioLogo = user.shelterLogo;
          form.formData.refugioId = user.shelterId!;
        });
    }
  }, []);
  const isEdit = dogId !== undefined;
  const isLast = form.currentStep === DOG_FORM_STEPS.length - 1;

  // Pasos "completados" = todos los anteriores al actual
  const completedSteps = Array.from({ length: form.currentStep }, (_, i) => i);

  // Props comunes para todos los pasos
  const stepProps = {
    formData: form.formData,
    errors: form.errors,
    update: form.update,
  };

  function handleNext() {
    form.nextStep(); // valida el paso actual; si hay errores, no avanza
  }

  return (
    <div className="sv-form">
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#fff5f5",
            border: "2px solid #ffe4e4",
            marginBottom: "0.75rem",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 28,
              color: "#ff6b6b",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {isEdit ? "edit" : "add_circle"}
          </span>
        </div>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 900,
            color: "#18181b",
            margin: 0,
          }}
        >
          {isEdit
            ? `Editando: ${form.formData.nombre || "perro"}`
            : "Registrar nuevo perro"}
        </h1>
        <p
          style={{
            fontSize: "0.82rem",
            color: "#71717a",
            fontWeight: 500,
            marginTop: "0.3rem",
          }}
        >
          {isEdit
            ? "Actualiza los datos del perro"
            : "Completa todos los pasos para publicar al perro"}
        </p>
        {form.isDraft && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#854d0e",
              background: "#fef9c3",
              padding: "0.2rem 0.65rem",
              borderRadius: 999,
              marginTop: "0.5rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 13 }}
            >
              save
            </span>
            Borrador guardado
          </span>
        )}
      </div>

      {/* ── Stepper ── */}
      <div style={{ marginBottom: "2rem" }}>
        <Stepper
          steps={STEPPER_STEPS}
          currentStep={form.currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* ── Paso activo ── */}
      {form.currentStep === 0 && <BasicDataStep {...stepProps} />}
      {form.currentStep === 1 && <PersonalityStep {...stepProps} />}
      {form.currentStep === 2 && <CareStep {...stepProps} />}
      {form.currentStep === 3 && <MedicalStep {...stepProps} />}
      {form.currentStep === 4 && <MediaStep {...stepProps} />}
      {form.currentStep === 5 && (
        <ReviewStep
          formData={form.formData}
          isSubmitting={form.isSubmitting}
          submitError={form.submitError}
          isDraft={form.isDraft}
          submit={form.submit}
          saveDraft={form.saveDraft}
        />
      )}

      {/* ── Barra de navegación (steps 0–4; step 5 tiene su propia barra) ── */}
      {!isLast && (
        <div className="sv-submit-bar">
          {/* Anterior */}
          {form.currentStep > 0 ? (
            <button
              type="button"
              className="sv-submit-bar__btn sv-submit-bar__btn--ghost"
              onClick={form.prevStep}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                arrow_back
              </span>
              Anterior
            </button>
          ) : (
            <div />
          )}

          {/* Siguiente */}
          <button
            type="button"
            className="sv-submit-bar__btn sv-submit-bar__btn--primary"
            onClick={handleNext}
          >
            {form.currentStep === DOG_FORM_STEPS.length - 2
              ? "Revisar"
              : "Siguiente"}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              arrow_forward
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
