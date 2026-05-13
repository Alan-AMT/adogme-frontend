// modules/shared/domain/AdoptionRequest.ts
// Entidad SolicitudAdopcion — basada en tabla SolicitudAdopcion del diagrama ER
// Tabla: id, adoptante_id, perro_id, refugio_id, fecha, estado, comentarios

// ─── Estados ─────────────────────────────────────────────────────────────────

export type RequestStatus =
  | "pending" // recién enviada, sin revisar
  | "in_review" // el refugio la está evaluando
  | "approved" // aprobada — en proceso de entrega
  | "rejected" // rechazada por el refugio
  | "cancelled"; // cancelada por el adoptante

// ─── Información de vivienda (paso del formulario) ───────────────────────────

export type HousingType = "casa" | "departamento" | "casa_campo" | "otro";
export type Tenencia = "propia" | "rentada";
export type LugarDormir =
  | "dentro_casa"
  | "patio_jardin"
  | "area_designada"
  | "otro";
export type ActividadFisica =
  | "sedentario"
  | "moderado"
  | "activo"
  | "muy_activo";
export type ActividadConPerro =
  | "caminatas"
  | "senderismo"
  | "juegos"
  | "correr"
  | "compania_tranquila"
  | "otro";

export interface HousingInfo {
  tipo: HousingType;
  tenencia: Tenencia;
  permiteAnimales?: boolean; // requerido si tenencia === 'rentada'
  tieneJardin: boolean;
  tamanoJardinM2?: number; // requerido si tieneJardin === true
  tieneRejaOCerca?: boolean; // requerido si tieneJardin === true
}

export interface EntornoHogar {
  quienesViven: string; // textarea corto
  todosDeAcuerdo: boolean;
  hayNinos: boolean;
  hayAlergicos: boolean;
}

export interface RutinaInfo {
  horasSolo: number; // 0-24
  dondePermaneceSolo: string; // textarea corto
  dondeDormiria: LugarDormir;
  actividadFisica: ActividadFisica;
  actividadesPlaneadas: ActividadConPerro[]; // multi, al menos 1
}

export interface MascotasActuales {
  tiene: boolean;
  cuantasYCuales?: string; // requerido si tiene
  edades?: string; // requerido si tiene
  estanEsterilizadas?: boolean; // requerido si tiene
  descripcionConvivencia?: string; // requerido si tiene
}

export interface ExperienciaPrevia {
  tuvo: boolean;
  quePaso?: string; // requerido si tuvo (textarea libre)
}

// ─── Datos del formulario completo (6 pasos) ─────────────────────────────────

export interface AdoptionFormData {
  // Step 1 — Información Personal
  nombreCompleto: string;
  edad: number;
  telefono: string;
  correo: string;
  ocupacion: string;
  direccion: string;
  redesSociales?: string;

  // Step 2 — Vivienda
  vivienda: HousingInfo;
  entorno: EntornoHogar;

  // Step 3 — Rutina
  rutina: RutinaInfo;

  // Step 4 — Mascotas y experiencia
  mascotasActuales: MascotasActuales;
  experienciaPrevia: ExperienciaPrevia;

  // Step 5 — Responsabilidad
  motivacion: string; // max 600
  siMudanza: string;
  siComportamientoNoEsperado: string;
  situacionesParaDevolver: string;
  capacidadEconomica: boolean; // debe ser true para enviar
  cuidadosMedicos: string;

  // Step 6 — Confirmaciones (todas deben ser true)
  aceptaAlimentacionVeterinaria: boolean;
  aceptaNoAbandono: boolean;
  aceptaContactarRefugio: boolean;
  aceptaSeguimiento: boolean;
  aceptaInfoVeridica: boolean;
}

// ─── Configuración de los pasos del formulario ────────────────────────────────

export const ADOPTION_STEPS = [
  { id: 0, label: "Datos", title: "Información personal" },
  { id: 1, label: "Vivienda", title: "Tu hogar y entorno" },
  { id: 2, label: "Rutina", title: "Rutina y estilo de vida" },
  { id: 3, label: "Mascotas", title: "Mascotas y experiencia" },
  { id: 4, label: "Compromiso", title: "Responsabilidad y compromiso" },
  { id: 5, label: "Confirmación", title: "Confirmaciones finales" },
] as const;

export type AdoptionStepId = (typeof ADOPTION_STEPS)[number]["id"];

// ─── Historial de cambios de estado (FE counterpart de ApplicationReview) ────

export interface StatusChange {
  id: string;
  applicationId: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  note: string | null;
  createdAt: string; // ISO datetime
}

// ─── Entidad completa ─────────────────────────────────────────────────────────

export interface AdoptionRequest {
  id: string;
  adoptanteId: string; // FK → Adoptante
  perroId: string; // FK → Perro
  refugioId: string; // FK → Refugio
  fecha: string; // ISO date — del diagrama
  estado: RequestStatus; // del diagrama

  // Campos enriquecidos
  formulario: AdoptionFormData;
  formVersion: number;
  compatibilityScore: number | null;
  revisiones: StatusChange[];
  images: string[]; // URLs públicas de las fotos de vivienda (subidas tras crear la solicitud)

  // Datos relacionados (joins — para mostrar en UI)
  perroNombre?: string;
  perroFoto?: string | null;
  refugioNombre?: string;
  refugioLogo?: string | null;
  adoptanteNombre?: string;
}

// ─── Resultado paginado genérico ─────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// ─── Versión reducida para listas ────────────────────────────────────────────

export type AdoptionRequestListItem = Pick<
  AdoptionRequest,
  | "id"
  | "fecha"
  | "estado"
  | "perroNombre"
  | "perroFoto"
  | "refugioNombre"
  | "adoptanteNombre"
>;
