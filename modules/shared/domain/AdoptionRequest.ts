// modules/shared/domain/AdoptionRequest.ts
// Entidad SolicitudAdopcion — basada en tabla SolicitudAdopcion del diagrama ER
// Tabla: id, adoptante_id, perro_id, refugio_id, fecha, estado, comentarios

// ─── Estados ─────────────────────────────────────────────────────────────────

export type RequestStatus =
  | 'pending'     // recién enviada, sin revisar
  | 'in_review'   // el refugio la está evaluando
  | 'approved'    // aprobada — en proceso de entrega
  | 'rejected'    // rechazada por el refugio
  | 'cancelled'   // cancelada por el adoptante

// ─── Información de vivienda (paso del formulario) ───────────────────────────

export type HousingType = 'casa' | 'departamento' | 'casa_campo' | 'otro'

export interface HousingInfo {
  tipo: HousingType
  esPropietario: boolean       // true = dueño, false = arrendatario
  tieneJardin: boolean
  tamanoJardinM2?: number
  tieneRejaOCerca: boolean
  fotosVivienda: string[]      // URLs de fotos subidas
  permiteAnimales?: boolean    // si es arrendatario
}

// ─── Datos del formulario completo (4 pasos) ─────────────────────────────────

export interface AdoptionFormData {
  // Paso 1 — ¿Por qué este perro?
  motivacion: string
  experienciaPrevia: boolean
  descripcionExperiencia?: string

  // Paso 2 — Tu hogar
  vivienda: HousingInfo

  // Paso 3 — Tu estilo de vida
  horasEnCasa: number          // promedio diario
  actividadFisica: 'sedentario' | 'moderado' | 'activo' | 'muy_activo'
  conviveConNinos: boolean     // ¿hay niños en el hogar?
  edadesNinos?: number[]       // edades si hay niños
  conviveConMascotas: boolean
  descripcionMascotas?: string

  // Paso 4 — Compromisos
  aceptaVisitaPrevia: boolean  // acepta visita al hogar antes de aprobar
  aceptaTerminos: boolean
  comentariosAdicionales?: string
}

// ─── Historial de cambios de estado ──────────────────────────────────────────

export interface StatusChange {
  id: number
  solicitudId: number
  estadoAnterior: RequestStatus
  estadoNuevo: RequestStatus
  cambiadoPor: number          // userId (admin o shelter)
  rol: 'shelter' | 'admin'
  comentario?: string
  fecha: string                // ISO datetime
}

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface AdoptionRequest {
  id: number
  adoptanteId: number          // FK → Adoptante
  perroId: number              // FK → Perro
  refugioId: number            // FK → Refugio
  fecha: string                // ISO date — del diagrama
  estado: RequestStatus        // del diagrama
  comentarios: string          // del diagrama (texto libre del adoptante)

  // Campos enriquecidos
  formulario: AdoptionFormData
  historial: StatusChange[]

  // Datos relacionados (joins — para mostrar en UI)
  perroNombre?: string
  perroFoto?: string
  perroSlug?: string
  refugioNombre?: string
  adoptanteNombre?: string
  adoptanteCorreo?: string
}

// ─── Versión reducida para listas ────────────────────────────────────────────

export type AdoptionRequestListItem = Pick<
  AdoptionRequest,
  | 'id'
  | 'adoptanteId'
  | 'perroId'
  | 'refugioId'
  | 'fecha'
  | 'estado'
  | 'perroNombre'
  | 'perroFoto'
  | 'refugioNombre'
  | 'adoptanteNombre'
>
