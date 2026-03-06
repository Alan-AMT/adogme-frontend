// modules/shared/domain/LifestyleProfile.ts
// Cuestionario, Pregunta y Recomendacion — basado en el diagrama ER
//
// Tabla Cuestionario: id, adoptante_id, fecha, descripcion, version, completado
// Tabla Pregunta:     id, cuestionario_id, texto, tipo, opciones, respuesta
// Tabla Recomendacion: id, adoptante_id, perro_id, fecha, cuestionario_id,
//                      compatibilidad, fechaGeneracion

// ─── Tipos de pregunta ────────────────────────────────────────────────────────

export type QuestionType =
  | 'single_choice'  // una sola opción (radio)
  | 'multi_choice'   // múltiples opciones (checkboxes)
  | 'scale'          // escala numérica 1-5
  | 'boolean'        // sí / no
  | 'text'           // respuesta libre

// ─── Pregunta del cuestionario ────────────────────────────────────────────────
// Tabla: texto, tipo, opciones (text), respuesta (text)

export interface QuizQuestion {
  id: number
  cuestionarioId: number
  texto: string
  tipo: QuestionType
  opciones: string[]        // JSON parseado del campo `opciones` (text en BD)
  respuesta: string | null  // JSON serializado de la respuesta (text en BD)
  orden: number
  categoria: QuizCategory
  esRequerida: boolean
}

// ─── Categorías de preguntas del quiz ────────────────────────────────────────

export type QuizCategory =
  | 'estilo_vida'       // actividad física, horas en casa
  | 'vivienda'          // tipo de hogar, jardín
  | 'experiencia'       // experiencia previa con perros
  | 'convivencia'       // niños, otras mascotas
  | 'preferencias'      // tamaño, energía preferida
  | 'compromisos'       // tiempo, veterinario, entrenamiento

// ─── Respuestas del quiz (lo que el adoptante llena) ─────────────────────────

export interface LifestyleQuizAnswers {
  // Estilo de vida
  actividadFisica: 'sedentario' | 'moderado' | 'activo' | 'muy_activo'
  horasEnCasaDiarias: number       // 0-24
  horasLibresParaPerro: number     // horas al día dedicadas al perro

  // Vivienda
  tipoVivienda: 'casa' | 'departamento' | 'casa_campo' | 'otro'
  tieneJardin: boolean
  tamanoEspacio: 'pequeño' | 'mediano' | 'grande'

  // Experiencia
  experienciaPrevia: boolean
  tiposPerrosAnteriores?: string[] // razas o tamaños que ha tenido

  // Convivencia
  conviveConNinos: boolean
  edadMenorNino?: number
  conviveConMascotas: boolean
  tiposMascotas?: ('perros' | 'gatos' | 'otros')[]

  // Preferencias
  tamanoPreferido: ('pequeño' | 'mediano' | 'grande' | 'gigante' | 'sin_preferencia')[]
  energiaPreferida: 'baja' | 'moderada' | 'alta' | 'sin_preferencia'
  sexoPreferido: 'macho' | 'hembra' | 'sin_preferencia'
  edadPreferida: ('cachorro' | 'joven' | 'adulto' | 'senior' | 'sin_preferencia')[]

  // Compromisos
  presupuestoMensualMXN: number
  disponibilidadEntrenamiento: boolean
  aceptaPerroConNecesidadesEspeciales: boolean
}

// ─── Cuestionario (tabla completa) ───────────────────────────────────────────

export interface Cuestionario {
  id: number
  adoptanteId: number
  fecha: string           // ISO date
  descripcion: string     // descripción o título del cuestionario
  version: string         // versión del formulario (para migraciones futuras)
  completado: boolean
  preguntas: QuizQuestion[]
  respuestas?: LifestyleQuizAnswers  // objeto parseado cuando está completado
}

// ─── Recomendación individual ─────────────────────────────────────────────────
// Tabla Recomendacion: adoptante_id, perro_id, fecha, cuestionario_id,
//                      compatibilidad, fechaGeneracion

export interface DogRecommendation {
  id: number
  adoptanteId: number     // FK → Adoptante
  perroId: number         // FK → Perro
  cuestionarioId: number  // FK → Cuestionario
  fecha: string           // ISO date
  compatibilidad: number  // float 0-1 en BD → usamos 0-100 en FE
  fechaGeneracion: string // ISO datetime

  // Datos enriquecidos — razones del match (generadas por ML)
  razonesMatch: MatchReason[]

  // Datos del perro (join — para mostrar la card)
  perroNombre?: string
  perroFoto?: string
  perroRaza?: string
  perroEdad?: number
  perroTamano?: string
  refugioNombre?: string
  refugioSlug?: string
}

export interface MatchReason {
  categoria: 'actividad' | 'espacio' | 'experiencia' | 'convivencia' | 'tamaño' | 'energia' | 'preferencias'
  texto: string     // ej: "Su nivel de energía coincide con tu estilo activo"
  esPositivo: boolean
}

// ─── Respuesta del servicio ML ────────────────────────────────────────────────

export interface MLRecommendationResponse {
  adoptanteId: number
  cuestionarioId: number
  recomendaciones: DogRecommendation[]
  resumen: string         // texto generado: "Basado en tu perfil, priorizamos perros medianos..."
  totalEvaluados: number  // cuántos perros se procesaron para el ranking
  fechaGeneracion: string // ISO datetime
  version: string         // versión del modelo ML
}
