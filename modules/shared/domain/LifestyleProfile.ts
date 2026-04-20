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

// ─── Respuestas del quiz (20 preguntas, escala 1-5) ──────────────────────────
// Estructura exacta que espera el ML service en /predict/process-questionnaire
// El backend convierte estas respuestas a un vector de 4 dimensiones:
//   [activity_score, housing_score, experience_score, care_score]
//
// CATEGORÍA 1 — Estilo de vida y actividad (q1-q5)
//   Compara con: Age + MaturitySize del perro
//   q1: ¿Qué tan activo eres físicamente durante la semana?        1=Sedentario … 5=Muy activo
//   q2: ¿Con qué frecuencia podrías sacar a pasear a un perro?     1=Rara vez … 5=Varias veces al día
//   q3: ¿Qué tan importante es para ti hacer actividades al aire libre? 1=Nada … 5=Muy importante
//   q4: ¿Cuánto tiempo podrías dedicar diariamente al ejercicio con tu perro? 1=Menos de 15min … 5=Más de 2 horas
//   q5: ¿Qué tan cómodo te sientes con un perro muy enérgico?      1=Nada cómodo … 5=Muy cómodo
//
// CATEGORÍA 2 — Hogar y espacio (q6-q10)
//   Compara con: MaturitySize del perro
//   q6:  ¿Qué tipo de vivienda tienes?                             1=Depto pequeño … 5=Casa con jardín grande
//   q7:  ¿Tienes acceso a un espacio exterior donde el perro pueda moverse? 1=Sin acceso … 5=Jardín/parque propio
//   q8:  ¿Qué tan cómodo estás con perros grandes dentro del hogar? 1=Nada cómodo … 5=Muy cómodo
//   q9:  ¿Qué tan tranquilo o ruidoso es tu hogar normalmente?     1=Muy ruidoso … 5=Muy tranquilo
//   q10: ¿Cuántas personas viven en tu casa?                       1=Vivo solo … 5=Familia grande (5+)
//
// CATEGORÍA 3 — Experiencia y entrenamiento (q11-q15)
//   Compara con: Age (cachorros necesitan entrenamiento) + Health del perro
//   q11: ¿Has tenido perros antes?                                 1=Nunca … 5=Muchos años de experiencia
//   q12: ¿Qué tan cómodo te sientes entrenando a un perro?         1=Nada cómodo … 5=Muy experimentado
//   q13: ¿Cuánta paciencia tienes para enseñar comportamientos nuevos? 1=Poca … 5=Mucha
//   q14: ¿Estarías dispuesto a asistir a clases de entrenamiento?  1=No … 5=Definitivamente
//   q15: ¿Qué tan preparado te sientes para adaptarte a un perro rescatado? 1=Nada preparado … 5=Totalmente preparado
//
// CATEGORÍA 4 — Recursos y cuidados (q16-q20)
//   Compara con: Health + health_score + Fee del perro
//   q16: ¿Qué tan preparado estás para cubrir gastos veterinarios inesperados? 1=Nada preparado … 5=Totalmente preparado
//   q17: ¿Qué tan cómodo estás administrando medicación si fuera necesario? 1=Nada cómodo … 5=Muy cómodo
//   q18: ¿Cuánto podrías gastar mensualmente en el cuidado de tu perro? 1=Muy poco … 5=Sin restricción
//   q19: ¿Estarías dispuesto a pagar tratamientos médicos si el perro lo necesitara? 1=No … 5=Sin duda
//   q20: ¿Qué tan comprometido estás con mantener vacunas y cuidados preventivos? 1=Poco … 5=Totalmente comprometido

export type QuizScale = 1 | 2 | 3 | 4 | 5

export interface LifestyleQuizAnswers {
  // Categoría 1: Estilo de vida y actividad
  q1:  QuizScale
  q2:  QuizScale
  q3:  QuizScale
  q4:  QuizScale
  q5:  QuizScale
  // Categoría 2: Hogar y espacio
  q6:  QuizScale
  q7:  QuizScale
  q8:  QuizScale
  q9:  QuizScale
  q10: QuizScale
  // Categoría 3: Experiencia y entrenamiento
  q11: QuizScale
  q12: QuizScale
  q13: QuizScale
  q14: QuizScale
  q15: QuizScale
  // Categoría 4: Recursos y cuidados
  q16: QuizScale
  q17: QuizScale
  q18: QuizScale
  q19: QuizScale
  q20: QuizScale
}

// ─── Cuestionario (tabla completa) ───────────────────────────────────────────

export interface Cuestionario {
  id: number
  adoptanteId: string
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
  adoptanteId: string     // FK → Adoptante
  perroId: string         // FK → Perro
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
}

export interface MatchReason {
  categoria: 'actividad' | 'espacio' | 'experiencia' | 'cuidados' | 'convivencia' | 'tamaño' | 'energia' | 'preferencias'
  texto: string     // ej: "Su nivel de energía coincide con tu estilo activo"
  esPositivo: boolean
}

// ─── Respuesta del servicio ML ────────────────────────────────────────────────

export interface MLRecommendationResponse {
  adoptanteId: string
  cuestionarioId: number
  recomendaciones: DogRecommendation[]
  resumen: string         // texto generado: "Basado en tu perfil, priorizamos perros medianos..."
  totalEvaluados: number  // cuántos perros se procesaron para el ranking
  fechaGeneracion: string // ISO datetime
  version: string         // versión del modelo ML
}
