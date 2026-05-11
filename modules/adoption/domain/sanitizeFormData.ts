// modules/adoption/domain/sanitizeFormData.ts
// Filtra un JSON arbitrario (posiblemente de una versión vieja del formulario)
// dejando solo los campos que el AdoptionFormData actual conoce. Pasa los
// valores tal cual — la validación zod ya corre en cada step.

import type { AdoptionFormData } from "../../shared/domain/AdoptionRequest";

// true  → campo escalar permitido (cualquier valor pasa)
// array → campo objeto anidado; solo sus claves listadas pasan
const ALLOWED: {
  [K in keyof AdoptionFormData]: true | readonly string[];
} = {
  nombreCompleto: true,
  edad: true,
  telefono: true,
  correo: true,
  ocupacion: true,
  direccion: true,
  redesSociales: true,
  vivienda: [
    "tipo",
    "tenencia",
    "permiteAnimales",
    "tieneJardin",
    "tamanoJardinM2",
    "tieneRejaOCerca",
    "fotosVivienda",
  ],
  entorno: ["quienesViven", "todosDeAcuerdo", "hayNinos", "hayAlergicos"],
  rutina: [
    "horasSolo",
    "dondePermaneceSolo",
    "dondeDormiria",
    "actividadFisica",
    "actividadesPlaneadas",
  ],
  mascotasActuales: [
    "tiene",
    "cuantasYCuales",
    "edades",
    "estanEsterilizadas",
    "descripcionConvivencia",
  ],
  experienciaPrevia: ["tuvo", "quePaso"],
  motivacion: true,
  siMudanza: true,
  siComportamientoNoEsperado: true,
  situacionesParaDevolver: true,
  capacidadEconomica: true,
  cuidadosMedicos: true,
  aceptaAlimentacionVeterinaria: true,
  aceptaNoAbandono: true,
  aceptaContactarRefugio: true,
  aceptaSeguimiento: true,
  aceptaInfoVeridica: true,
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function sanitizeFormData(raw: unknown): Partial<AdoptionFormData> {
  if (!isPlainObject(raw)) return {};

  const out: Record<string, unknown> = {};

  for (const [key, spec] of Object.entries(ALLOWED) as [
    keyof AdoptionFormData,
    true | readonly string[],
  ][]) {
    if (!(key in raw)) continue;
    const value = raw[key];

    if (spec === true) {
      if (value !== undefined) out[key] = value;
      continue;
    }

    if (!isPlainObject(value)) continue;

    const nested: Record<string, unknown> = {};
    for (const nestedKey of spec) {
      if (nestedKey in value && value[nestedKey] !== undefined) {
        nested[nestedKey] = value[nestedKey];
      }
    }
    if (Object.keys(nested).length > 0) {
      out[key] = nested;
    }
  }

  return out as Partial<AdoptionFormData>;
}
