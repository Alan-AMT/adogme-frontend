// modules/adoption/components/steps/RoutineStep.tsx
// Paso 2 — Rutina y estilo de vida
"use client";

import { Controller, useFormContext } from "react-hook-form";

import type {
  ActividadConPerro,
  ActividadFisica,
  AdoptionFormData,
  LugarDormir,
} from "@/modules/shared/domain/AdoptionRequest";
import {
  CheckboxGroup,
  RadioGroup,
  RangeSlider,
  Textarea,
} from "@/modules/shared/components/ui";
import type {
  CheckboxGroupOption,
  RadioGroupOption,
} from "@/modules/shared/components/ui";

const DORMIR_OPTIONS: RadioGroupOption<LugarDormir>[] = [
  { value: "dentro_casa", label: "Dentro de casa", icon: "home" },
  { value: "patio_jardin", label: "Patio o jardín", icon: "yard" },
  { value: "area_designada", label: "Área designada", icon: "bed" },
  { value: "otro", label: "Otro", icon: "more_horiz" },
];

const ACTIVITY_OPTIONS: RadioGroupOption<ActividadFisica>[] = [
  {
    value: "sedentario",
    label: "Sedentario",
    icon: "weekend",
    description: "Prefiero el descanso, salidas cortas",
  },
  {
    value: "moderado",
    label: "Moderado",
    icon: "directions_walk",
    description: "Caminatas y actividad ocasional",
  },
  {
    value: "activo",
    label: "Activo",
    icon: "directions_run",
    description: "Ejercito varias veces por semana",
  },
  {
    value: "muy_activo",
    label: "Muy activo",
    icon: "fitness_center",
    description: "Deporte diario o actividad intensa",
  },
];

const ACTIVIDADES_OPTIONS: CheckboxGroupOption<ActividadConPerro>[] = [
  { value: "caminatas", label: "Caminatas", icon: "directions_walk" },
  { value: "senderismo", label: "Senderismo", icon: "hiking" },
  { value: "juegos", label: "Juegos", icon: "sports_baseball" },
  { value: "correr", label: "Correr", icon: "directions_run" },
  {
    value: "compania_tranquila",
    label: "Compañía tranquila",
    icon: "self_improvement",
  },
  { value: "otro", label: "Otro", icon: "more_horiz" },
];

export default function RoutineStep() {
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<AdoptionFormData>();

  return (
    <div>
      {/* Tiempo y compañía */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">schedule</span>
          Tiempo y compañía
        </p>

        <Controller
          control={control}
          name="rutina.horasSolo"
          render={({ field, fieldState }) => {
            const horas = typeof field.value === "number" ? field.value : 0;
            return (
              <div className="flex flex-col gap-2">
                <div className="af-hours-display">
                  <span className="af-hours-value">{horas}</span>
                  <div>
                    <p className="af-hours-label">
                      El perro permanecería solo {horas}{" "}
                      {horas === 1 ? "hora" : "horas"} al día
                    </p>
                    <p className="text-[12px] text-[#9ca3af] font-[500]">
                      0 = nunca queda solo
                    </p>
                  </div>
                </div>
                <RangeSlider
                  min={0}
                  max={24}
                  step={1}
                  value={horas}
                  onChange={field.onChange}
                  marks={[
                    { value: 0, label: "0 h" },
                    { value: 12, label: "12 h" },
                    { value: 24, label: "24 h" },
                  ]}
                />
                {fieldState.error?.message && (
                  <p className="af-yn__error mt-1">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 13 }}
                    >
                      error
                    </span>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        <div className="mt-4">
          <Textarea
            label="¿Dónde permanecería cuando no haya nadie en casa?"
            required
            rows={3}
            placeholder="Ej. Dentro de casa con acceso al patio"
            error={errors.rutina?.dondePermaneceSolo?.message}
            {...register("rutina.dondePermaneceSolo")}
          />
        </div>

        <div className="mt-4">
          <Controller
            control={control}
            name="rutina.dondeDormiria"
            render={({ field, fieldState }) => (
              <RadioGroup
                label="¿Dónde dormiría?"
                required
                value={field.value}
                onChange={field.onChange}
                options={DORMIR_OPTIONS}
                error={fieldState.error?.message}
                layout="grid"
              />
            )}
          />
        </div>
      </div>

      {/* Actividad */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">directions_run</span>
          Actividad
        </p>

        <Controller
          control={control}
          name="rutina.actividadFisica"
          render={({ field, fieldState }) => (
            <RadioGroup
              label="Nivel de actividad física"
              required
              value={field.value}
              onChange={field.onChange}
              options={ACTIVITY_OPTIONS}
              error={fieldState.error?.message}
              layout="grid"
              variant="card"
            />
          )}
        />

        <div className="mt-4">
          <Controller
            control={control}
            name="rutina.actividadesPlaneadas"
            render={({ field, fieldState }) => (
              <CheckboxGroup
                label="Actividades que planeas hacer con el perro"
                required
                min={1}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  clearErrors("rutina.actividadesPlaneadas");
                }}
                options={ACTIVIDADES_OPTIONS}
                error={fieldState.error?.message}
                layout="grid"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
