// modules/adoption/components/steps/PetsExperienceStep.tsx
// Paso 3 — Mascotas actuales y experiencia previa
"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import type { AdoptionFormData } from "@/modules/shared/domain/AdoptionRequest";
import { Input, Textarea, YesNoRadio } from "@/modules/shared/components/ui";

export default function PetsExperienceStep() {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<AdoptionFormData>();

  const tieneMascotas = useWatch({ control, name: "mascotasActuales.tiene" });
  const tuvoExperiencia = useWatch({ control, name: "experienciaPrevia.tuvo" });

  return (
    <div className="w-full">
      {/* Mascotas actuales */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">pets</span>
          Mascotas actuales
        </p>

        <Controller
          control={control}
          name="mascotasActuales.tiene"
          render={({ field, fieldState }) => (
            <YesNoRadio
              label="¿Actualmente tienes otras mascotas?"
              required
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                if (!val) {
                  setValue("mascotasActuales.cuantasYCuales", "");
                  setValue("mascotasActuales.edades", "");
                  setValue("mascotasActuales.estanEsterilizadas", undefined);
                  setValue("mascotasActuales.descripcionConvivencia", "");
                  clearErrors("mascotasActuales.cuantasYCuales");
                  clearErrors("mascotasActuales.edades");
                  clearErrors("mascotasActuales.estanEsterilizadas");
                  clearErrors("mascotasActuales.descripcionConvivencia");
                }
              }}
              error={fieldState.error?.message}
            />
          )}
        />

        {tieneMascotas && (
          <div className="mt-4 flex flex-col gap-4">
            <Textarea
              label="¿Cuántas y cuáles?"
              required
              rows={2}
              placeholder="Ej. 1 perra mestiza y 2 gatos"
              error={errors.mascotasActuales?.cuantasYCuales?.message}
              {...register("mascotasActuales.cuantasYCuales")}
            />

            <Input
              label="¿Qué edad tienen?"
              required
              placeholder="Ej. 3 años, 5 años y 1 año"
              error={errors.mascotasActuales?.edades?.message}
              {...register("mascotasActuales.edades")}
            />

            <Controller
              control={control}
              name="mascotasActuales.estanEsterilizadas"
              render={({ field, fieldState }) => (
                <YesNoRadio
                  label="¿Están esterilizadas?"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Textarea
              label="Describe cómo conviven entre ellas"
              required
              rows={3}
              placeholder="Ej. Se llevan bien, juegan y comen por separado..."
              error={errors.mascotasActuales?.descripcionConvivencia?.message}
              {...register("mascotasActuales.descripcionConvivencia")}
            />
          </div>
        )}
      </div>

      {/* Experiencia previa */}
      <div className="af-section min-h-48">
        <p className="af-section-title">
          <span className="material-symbols-outlined">history</span>
          Experiencia previa
        </p>

        <Controller
          control={control}
          name="experienciaPrevia.tuvo"
          render={({ field, fieldState }) => (
            <YesNoRadio
              label="¿Has tenido mascotas anteriormente?"
              required
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                if (!val) {
                  setValue("experienciaPrevia.quePaso", "");
                  clearErrors("experienciaPrevia.quePaso");
                }
              }}
              error={fieldState.error?.message}
            />
          )}
        />

        {tuvoExperiencia && (
          <div className="mt-4">
            <Textarea
              label="¿Qué pasó con ellas?"
              required
              rows={4}
              maxLength={500}
              placeholder="Cuéntanos honestamente qué pasó con tus mascotas anteriores..."
              helperText="Sé honesto — esto le da contexto al refugio"
              error={errors.experienciaPrevia?.quePaso?.message}
              {...register("experienciaPrevia.quePaso")}
            />
          </div>
        )}

        {tuvoExperiencia === false && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <span
              className="material-symbols-outlined text-amber-500 flex-shrink-0 mt-0.5"
              style={{
                fontSize: 20,
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20",
              }}
            >
              lightbulb
            </span>
            <div>
              <p className="text-sm font-[700] text-amber-800">
                ¡No hay problema!
              </p>
              <p className="text-[13px] font-[500] text-amber-700 mt-0.5 leading-relaxed">
                No tener experiencia previa no es una limitante. El refugio te
                brindará orientación y seguimiento durante todo el proceso de
                adopción.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
