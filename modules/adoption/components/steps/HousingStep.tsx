// modules/adoption/components/steps/HousingStep.tsx
// Paso 1 — Vivienda y entorno
"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import type {
  AdoptionFormData,
  HousingType,
  Tenencia,
} from "@/modules/shared/domain/AdoptionRequest";
import {
  FileUpload,
  Input,
  RadioGroup,
  Textarea,
  YesNoRadio,
} from "@/modules/shared/components/ui";
import type { RadioGroupOption } from "@/modules/shared/components/ui";

const TIPO_OPTIONS: RadioGroupOption<HousingType>[] = [
  { value: "casa", label: "Casa", icon: "home" },
  { value: "departamento", label: "Departamento", icon: "apartment" },
  { value: "casa_campo", label: "Casa de campo", icon: "cottage" },
  { value: "otro", label: "Otro", icon: "more_horiz" },
];

const TENENCIA_OPTIONS: RadioGroupOption<Tenencia>[] = [
  { value: "propia", label: "Propia" },
  { value: "rentada", label: "Rentada" },
];

export default function HousingStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdoptionFormData>();

  const tenencia = useWatch({ control, name: "vivienda.tenencia" });
  const tieneJardin = useWatch({ control, name: "vivienda.tieneJardin" });

  return (
    <div>
      {/* Tipo de vivienda */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">home</span>
          Tipo de vivienda
        </p>

        <Controller
          control={control}
          name="vivienda.tipo"
          render={({ field, fieldState }) => (
            <RadioGroup
              label="¿En qué tipo de vivienda vives?"
              required
              value={field.value}
              onChange={field.onChange}
              options={TIPO_OPTIONS}
              error={fieldState.error?.message}
              layout="grid"
              variant="card"
            />
          )}
        />

        <div className="mt-4">
          <Controller
            control={control}
            name="vivienda.tenencia"
            render={({ field, fieldState }) => (
              <RadioGroup
                label="¿La vivienda es propia o rentada?"
                required
                value={field.value}
                onChange={field.onChange}
                options={TENENCIA_OPTIONS}
                error={fieldState.error?.message}
                layout="inline"
              />
            )}
          />
        </div>

        {tenencia === "rentada" && (
          <div className="mt-4">
            <Controller
              control={control}
              name="vivienda.permiteAnimales"
              render={({ field, fieldState }) => (
                <YesNoRadio
                  label="¿Tu arrendador permite tener animales?"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* Espacio y seguridad */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">yard</span>
          Espacio y seguridad
        </p>

        <Controller
          control={control}
          name="vivienda.tieneJardin"
          render={({ field, fieldState }) => (
            <YesNoRadio
              label="¿Tienes jardín, patio o área exterior?"
              required
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {tieneJardin && (
          <div className="af-field-grid af-field-grid--2 mt-4">
            <Input
              label="Tamaño aproximado (m²)"
              type="number"
              min={1}
              required
              placeholder="Ej. 30"
              error={errors.vivienda?.tamanoJardinM2?.message}
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 17 }}
                >
                  straighten
                </span>
              }
              {...register("vivienda.tamanoJardinM2", { valueAsNumber: true })}
            />
            <Controller
              control={control}
              name="vivienda.tieneRejaOCerca"
              render={({ field, fieldState }) => (
                <YesNoRadio
                  label="¿El área exterior está protegida con barda, reja o cerca?"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* Entorno del hogar */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">groups</span>
          Entorno del hogar
        </p>

        <Textarea
          label="¿Quiénes viven contigo?"
          required
          rows={3}
          placeholder="Ej. Vivo con mi pareja y un hijo de 8 años"
          error={errors.entorno?.quienesViven?.message}
          {...register("entorno.quienesViven")}
        />

        <div className="mt-4 flex flex-col gap-4">
          <Controller
            control={control}
            name="entorno.todosDeAcuerdo"
            render={({ field, fieldState }) => (
              <YesNoRadio
                label="¿Todos los miembros del hogar están de acuerdo con la adopción?"
                required
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="entorno.hayNinos"
            render={({ field, fieldState }) => (
              <YesNoRadio
                label="¿Hay niños en casa?"
                required
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="entorno.hayAlergicos"
            render={({ field, fieldState }) => (
              <YesNoRadio
                label="¿Alguna persona en casa es alérgica a los animales?"
                required
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Fotos opcionales */}
      <div className="af-section">
        <p className="af-section-title">
          <span className="material-symbols-outlined">photo_library</span>
          Fotos de tu hogar
          <span className="text-[#9ca3af] font-[500] text-[12px] ml-1">
            (opcional)
          </span>
        </p>
        <p className="af-section-hint">
          Adjunta fotos del hogar y los espacios donde estará el perro — pueden
          agilizar la revisión de tu solicitud.
        </p>

        <Controller
          control={control}
          name="vivienda.fotosVivienda"
          render={({ field }) => (
            <FileUpload
              label="Subir fotos (máx. 5 imágenes, 5 MB c/u)"
              accept={["image/*"]}
              maxFiles={5}
              maxSizeMB={5}
              showPreview
              onFilesChange={(files) => {
                const urls = files.map((f) => URL.createObjectURL(f));
                field.onChange(urls);
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
