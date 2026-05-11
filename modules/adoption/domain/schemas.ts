// modules/adoption/domain/schemas.ts
// Schemas zod para el formulario de adopción (6 pasos).
// Validación en español. Los tipos inferidos son estructuralmente
// compatibles con AdoptionFormData del dominio compartido.

import { z } from 'zod'

// ─── Mensajes ─────────────────────────────────────────────────────────────────

const REQUIRED = 'Este campo es obligatorio'
const MUST_ACCEPT = 'Debes aceptar para continuar'

// ─── Sub-schemas reutilizables ────────────────────────────────────────────────

const housingInfoSchema = z.object({
  tipo: z.enum(['casa', 'departamento', 'casa_campo', 'otro'], {
    error: REQUIRED,
  }),
  tenencia: z.enum(['propia', 'rentada'], { error: REQUIRED }),
  permiteAnimales: z.boolean().optional(),
  tieneJardin: z.boolean({ error: REQUIRED }),
  tamanoJardinM2: z
    .number({ error: 'Ingresa un número válido' })
    .positive('Debe ser mayor a 0')
    .optional(),
  tieneRejaOCerca: z.boolean().optional(),
})

const entornoSchema = z.object({
  quienesViven: z.string().min(1, REQUIRED),
  todosDeAcuerdo: z.boolean({ error: REQUIRED }),
  hayNinos: z.boolean({ error: REQUIRED }),
  hayAlergicos: z.boolean({ error: REQUIRED }),
})

const rutinaInfoSchema = z.object({
  horasSolo: z
    .number({ error: 'Ingresa un número válido' })
    .min(0, 'Mínimo 0 horas')
    .max(24, 'Máximo 24 horas'),
  dondePermaneceSolo: z.string().min(1, REQUIRED),
  dondeDormiria: z.enum(
    ['dentro_casa', 'patio_jardin', 'area_designada', 'otro'],
    { error: REQUIRED },
  ),
  actividadFisica: z.enum(
    ['sedentario', 'moderado', 'activo', 'muy_activo'],
    { error: REQUIRED },
  ),
  actividadesPlaneadas: z
    .array(
      z.enum([
        'caminatas',
        'senderismo',
        'juegos',
        'correr',
        'compania_tranquila',
        'otro',
      ]),
    )
    .min(1, 'Selecciona al menos una actividad'),
})

const mascotasActualesSchema = z.object({
  tiene: z.boolean({ error: REQUIRED }),
  cuantasYCuales: z.string().optional(),
  edades: z.string().optional(),
  estanEsterilizadas: z.boolean().optional(),
  descripcionConvivencia: z.string().optional(),
})

const experienciaPreviaSchema = z.object({
  tuvo: z.boolean({ error: REQUIRED }),
  quePaso: z.string().optional(),
})

// ─── Step schemas (raw, sin refinamientos) ───────────────────────────────────
// Mantenemos estos "crudos" para poder combinar con .extend() en
// adoptionFormSchema (zod 4 desaconseja chainear después de superRefine).

export const personalDataSchema = z.object({
  nombreCompleto: z.string().min(1, REQUIRED),
  edad: z
    .number({ error: 'Ingresa una edad válida' })
    .int('Debe ser un número entero')
    .min(18, 'Debes ser mayor de edad'),
  telefono: z.string().min(1, REQUIRED),
  correo: z.email('Correo inválido'),
  ocupacion: z.string().min(1, REQUIRED),
  direccion: z.string().min(1, REQUIRED),
  redesSociales: z.string().optional(),
})

export const housingSchema = z.object({
  vivienda: housingInfoSchema,
  entorno: entornoSchema,
})

export const routineSchema = z.object({
  rutina: rutinaInfoSchema,
})

export const petsExperienceSchema = z.object({
  mascotasActuales: mascotasActualesSchema,
  experienciaPrevia: experienciaPreviaSchema,
})

export const responsibilitySchema = z.object({
  motivacion: z
    .string()
    .min(10, 'Cuéntanos al menos 10 caracteres')
    .max(600, 'Máximo 600 caracteres'),
  siMudanza: z.string().min(1, REQUIRED),
  siComportamientoNoEsperado: z.string().min(1, REQUIRED),
  situacionesParaDevolver: z.string().min(1, REQUIRED),
  capacidadEconomica: z.literal(true, { error: MUST_ACCEPT }),
  cuidadosMedicos: z.string().min(1, REQUIRED),
})

export const confirmationsSchema = z.object({
  aceptaAlimentacionVeterinaria: z.literal(true, { error: MUST_ACCEPT }),
  aceptaNoAbandono: z.literal(true, { error: MUST_ACCEPT }),
  aceptaContactarRefugio: z.literal(true, { error: MUST_ACCEPT }),
  aceptaSeguimiento: z.literal(true, { error: MUST_ACCEPT }),
  aceptaInfoVeridica: z.literal(true, { error: MUST_ACCEPT }),
})

// ─── Refinamientos condicionales ──────────────────────────────────────────────
// Aplicados como funciones reutilizables — se inyectan tanto en los schemas
// "WithRefine" por paso como en el adoptionFormSchema final.

type HousingShape = z.infer<typeof housingSchema>
type PetsShape = z.infer<typeof petsExperienceSchema>

function refineHousing(data: HousingShape, ctx: z.RefinementCtx) {
  if (data.vivienda.tenencia === 'rentada' && data.vivienda.permiteAnimales === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['vivienda', 'permiteAnimales'],
      message: 'Indica si tu contrato permite animales',
    })
  }
  if (data.vivienda.tieneJardin) {
    if (data.vivienda.tamanoJardinM2 === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['vivienda', 'tamanoJardinM2'],
        message: 'Indica el tamaño del jardín',
      })
    }
    if (data.vivienda.tieneRejaOCerca === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['vivienda', 'tieneRejaOCerca'],
        message: 'Indica si tiene reja o cerca',
      })
    }
  }
}

function refinePetsExperience(data: PetsShape, ctx: z.RefinementCtx) {
  if (data.mascotasActuales.tiene) {
    if (!data.mascotasActuales.cuantasYCuales?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['mascotasActuales', 'cuantasYCuales'],
        message: REQUIRED,
      })
    }
    if (!data.mascotasActuales.edades?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['mascotasActuales', 'edades'],
        message: REQUIRED,
      })
    }
    if (data.mascotasActuales.estanEsterilizadas === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['mascotasActuales', 'estanEsterilizadas'],
        message: REQUIRED,
      })
    }
    if (!data.mascotasActuales.descripcionConvivencia?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['mascotasActuales', 'descripcionConvivencia'],
        message: REQUIRED,
      })
    }
  }

  if (data.experienciaPrevia.tuvo && !data.experienciaPrevia.quePaso?.trim()) {
    ctx.addIssue({
      code: 'custom',
      path: ['experienciaPrevia', 'quePaso'],
      message: 'Cuéntanos qué pasó',
    })
  }
}

// ─── Versiones refinadas (usadas para validar paso a paso) ────────────────────

export const housingSchemaWithRefine = housingSchema.superRefine(refineHousing)
export const petsExperienceSchemaWithRefine =
  petsExperienceSchema.superRefine(refinePetsExperience)

// Para los pasos que no necesitan refinamientos cross-field, exponemos
// el mismo schema bajo el sufijo "WithRefine" para mantener una API
// uniforme en STEP_SCHEMAS.
export const personalDataSchemaWithRefine = personalDataSchema
export const routineSchemaWithRefine = routineSchema
export const responsibilitySchemaWithRefine = responsibilitySchema
export const confirmationsSchemaWithRefine = confirmationsSchema

export const STEP_SCHEMAS = [
  personalDataSchemaWithRefine,
  housingSchemaWithRefine,
  routineSchemaWithRefine,
  petsExperienceSchemaWithRefine,
  responsibilitySchemaWithRefine,
  confirmationsSchemaWithRefine,
] as const

// ─── Schema completo ──────────────────────────────────────────────────────────
// Combinamos las shapes "crudas" con .extend() y aplicamos todos los
// refinamientos cross-field al final con superRefine.

export const adoptionFormSchema = personalDataSchema
  .extend(housingSchema.shape)
  .extend(routineSchema.shape)
  .extend(petsExperienceSchema.shape)
  .extend(responsibilitySchema.shape)
  .extend(confirmationsSchema.shape)
  .superRefine((data, ctx) => {
    refineHousing(data, ctx)
    refinePetsExperience(data, ctx)
  })

export type AdoptionFormSchema = z.infer<typeof adoptionFormSchema>
