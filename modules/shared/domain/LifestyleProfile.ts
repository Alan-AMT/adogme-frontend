// modules/shared/domain/LifestyleProfile.ts
// Dominio del cuestionario de match — basado en el contrato del microservicio ML.
//
// El cuestionario tiene 20 preguntas en 4 bloques de 5:
//   q1-q5   — Activity   (nivel de actividad y disposición física)
//   q6-q10  — Housing    (espacio físico y entorno)
//   q11-q15 — Experience (experiencia previa y disposición al entrenamiento)
//   q16-q20 — Care       (tiempo, recursos y compromiso de cuidados)
//
// Tipos:
//   - QuizDraftState   → estado interno del FE (incluye multi-select como arrays)
//   - QuizSubmitPayload → lo que se envía al ML (q1..q20 como enteros 1-5)
//
// Multi-select especiales:
//   q7  — espacio exterior  → toma el valor más alto seleccionado
//   q18 — plan ante emergencia → cuenta componentes marcados (capeado en 5)
//   q20 — plan al viajar    → toma el valor más alto seleccionado

// escala 1-5
export type QuizScale = 1 | 2 | 3 | 4 | 5

// ─── Categorías ──────────────────────────────────────────────────────────────

export type QuizCategory = 'activity' | 'housing' | 'experience' | 'care'


//esta es la estructura que se envia al ML, q1-q20 como ints de 1-5
//dependiendo de las respuestas del usuario, el FE mapea multi-selects a esta forma antes de enviar.

export interface QuizSubmitPayload {
  q1:  QuizScale; q2:  QuizScale; q3:  QuizScale; q4:  QuizScale; q5:  QuizScale
  q6:  QuizScale; q7:  QuizScale; q8:  QuizScale; q9:  QuizScale; q10: QuizScale
  q11: QuizScale; q12: QuizScale; q13: QuizScale; q14: QuizScale; q15: QuizScale
  q16: QuizScale; q17: QuizScale; q18: QuizScale; q19: QuizScale; q20: QuizScale
}

// Alias retrocompatible
export type LifestyleQuizAnswers = QuizSubmitPayload

// ─── Estado interno del FE (draft) ───────────────────────────────────────────
// Difiere del payload solo en los multi-select: guarda los IDs marcados por
// el usuario, y se mapean a 1-5 al momento de enviar al ML.

export interface QuizDraftState {
  // Bloque 1 — Activity (single)
  q1?:  QuizScale
  q2?:  QuizScale
  q3?:  QuizScale
  q4?:  QuizScale
  q5?:  QuizScale
  // Bloque 2 — Housing
  q6?:  QuizScale
  q7Selected?: Q7Option[]   // multi-select
  q8?:  QuizScale
  q9?:  QuizScale
  q10?: QuizScale
  // Bloque 3 — Experience (single, q13 es single estricto)
  q11?: QuizScale
  q12?: QuizScale
  q13?: QuizScale
  q14?: QuizScale
  q15?: QuizScale
  // Bloque 4 — Care
  q16?: QuizScale
  q17?: QuizScale
  q18Selected?: Q18Option[] // multi-select (cuenta componentes)
  q19?: QuizScale
  q20Selected?: Q20Option[] // multi-select
}

// ─── IDs de opciones para multi-select ───────────────────────────────────────

export type Q7Option =
  | 'ninguno'
  | 'balcon'
  | 'terraza'
  | 'patio'
  | 'jardin'

export type Q18Option =
  | 'vet_confianza'
  | 'ahorro_emergencia'
  | 'transporte_propio'
  | 'vet_urgencias_24h'

export type Q20Option =
  | 'solo_con_comida'
  | 'no_pensado'
  | 'vecino_casual'
  | 'familiar_guarderia'
  | 'designada_o_conmigo'

// ─── Catálogo declarativo de preguntas y opciones ────────────────────────────
// Esto se usa para renderizar el quiz y para mapear opciones → 1-5.

export interface QuizOption {
  value: QuizScale
  label: string
}

export interface SingleChoiceQuestion {
  id:        keyof QuizSubmitPayload
  category:  QuizCategory
  text:      string
  type:      'single'
  options:   QuizOption[]
}

export interface MultiChoiceQuestion {
  id:        'q7' | 'q18' | 'q20'
  category:  QuizCategory
  text:      string
  type:      'multi'
  hint?:     string
  options:   { id: string; label: string; weight: number }[]
  // mapping mode: 'highest' (toma weight más alto) o 'count' (cuenta marcados, capeado en 5)
  mapping:   'highest' | 'count'
}

export type QuizQuestionDef = SingleChoiceQuestion | MultiChoiceQuestion

// ─── Bloque 1 — Activity (q1-q5) ─────────────────────────────────────────────

const Q1: SingleChoiceQuestion = {
  id: 'q1', category: 'activity', type: 'single',
  text: '¿Cómo describirías tu nivel general de energía en el día?',
  options: [
    { value: 1, label: 'Muy bajo / sedentario' },
    { value: 2, label: 'Bajo' },
    { value: 3, label: 'Medio' },
    { value: 4, label: 'Alto' },
    { value: 5, label: 'Muy alto' },
  ],
}

const Q2: SingleChoiceQuestion = {
  id: 'q2', category: 'activity', type: 'single',
  text: '¿Cuánto tiempo podrías dedicar al día específicamente al perro (paseos + juegos)?',
  options: [
    { value: 1, label: 'Menos de 15 min' },
    { value: 2, label: '15-30 min' },
    { value: 3, label: '30-60 min' },
    { value: 4, label: '1-2 horas' },
    { value: 5, label: 'Más de 2 horas' },
  ],
}

const Q3: SingleChoiceQuestion = {
  id: 'q3', category: 'activity', type: 'single',
  text: '¿Disfrutas actividades intensas (correr, hiking, deportes) o prefieres tranquilidad?',
  options: [
    { value: 1, label: 'Solo tranquilidad' },
    { value: 2, label: 'Mayormente tranquilas' },
    { value: 3, label: 'Mezcla' },
    { value: 4, label: 'Mayormente intensas' },
    { value: 5, label: 'Solo intensas' },
  ],
}

const Q4: SingleChoiceQuestion = {
  id: 'q4', category: 'activity', type: 'single',
  text: '¿Saldrías a pasear al perro aunque estés cansado/a o el clima sea malo?',
  options: [
    { value: 1, label: 'No' },
    { value: 2, label: 'Solo si urge' },
    { value: 3, label: 'A veces' },
    { value: 4, label: 'Casi siempre' },
    { value: 5, label: 'Siempre' },
  ],
}

const Q5: SingleChoiceQuestion = {
  id: 'q5', category: 'activity', type: 'single',
  text: '¿Tu rutina actual te permite incluir actividad física diaria con el perro?',
  options: [
    { value: 1, label: 'No, mi agenda es rígida' },
    { value: 2, label: 'Poco' },
    { value: 3, label: 'A veces' },
    { value: 4, label: 'La mayor parte' },
    { value: 5, label: 'Totalmente flexible' },
  ],
}

// ─── Bloque 2 — Housing (q6-q10) ─────────────────────────────────────────────

const Q6: SingleChoiceQuestion = {
  id: 'q6', category: 'housing', type: 'single',
  text: '¿Cuál es el tamaño aproximado de tu vivienda?',
  options: [
    { value: 1, label: 'Departamento pequeño / estudio' },
    { value: 2, label: 'Departamento mediano' },
    { value: 3, label: 'Departamento grande o casa pequeña' },
    { value: 4, label: 'Casa mediana' },
    { value: 5, label: 'Casa grande' },
  ],
}

const Q7: MultiChoiceQuestion = {
  id: 'q7', category: 'housing', type: 'multi', mapping: 'highest',
  text: '¿Tienes espacio exterior privado donde el perro pueda estar?',
  hint: 'Marca todas las que apliquen — usaremos la mejor opción.',
  options: [
    { id: 'ninguno', label: 'Ninguno',        weight: 1 },
    { id: 'balcon',  label: 'Balcón',         weight: 2 },
    { id: 'terraza', label: 'Terraza',        weight: 3 },
    { id: 'patio',   label: 'Patio',          weight: 4 },
    { id: 'jardin',  label: 'Jardín amplio',  weight: 5 },
  ],
}

const Q8: SingleChoiceQuestion = {
  id: 'q8', category: 'housing', type: 'single',
  text: '¿Cómo describirías el ambiente de tu zona?',
  options: [
    { value: 1, label: 'Muy ruidoso / urbano denso' },
    { value: 2, label: 'Ruidoso' },
    { value: 3, label: 'Mixto' },
    { value: 4, label: 'Tranquilo' },
    { value: 5, label: 'Muy tranquilo / arbolado' },
  ],
}

const Q9: SingleChoiceQuestion = {
  id: 'q9', category: 'housing', type: 'single',
  text: '¿Cuántas personas conviven en tu hogar?',
  options: [
    { value: 1, label: 'Vivo solo/a' },
    { value: 2, label: '2 personas' },
    { value: 3, label: '3 personas' },
    { value: 4, label: '4 personas' },
    { value: 5, label: '5 o más' },
  ],
}

const Q10: SingleChoiceQuestion = {
  id: 'q10', category: 'housing', type: 'single',
  text: '¿Tu vivienda permite mascotas sin restricciones de tamaño o cantidad?',
  options: [
    { value: 1, label: 'No permite mascotas' },
    { value: 2, label: 'Solo permite mascotas pequeñas' },
    { value: 3, label: 'Tiene restricciones medias' },
    { value: 4, label: 'Pocas restricciones' },
    { value: 5, label: 'Sin restricciones' },
  ],
}

// ─── Bloque 3 — Experience (q11-q15) ─────────────────────────────────────────

const Q11: SingleChoiceQuestion = {
  id: 'q11', category: 'experience', type: 'single',
  text: '¿Cuántos perros has tenido o convivido en tu vida?',
  options: [
    { value: 1, label: 'Ninguno' },
    { value: 2, label: 'Uno' },
    { value: 3, label: 'Dos' },
    { value: 4, label: 'Tres' },
    { value: 5, label: 'Cuatro o más' },
  ],
}

const Q12: SingleChoiceQuestion = {
  id: 'q12', category: 'experience', type: 'single',
  text: '¿Qué tanto sabes identificar señales de comunicación canina (cola, orejas, postura)?',
  options: [
    { value: 1, label: 'Nada' },
    { value: 2, label: 'Poco' },
    { value: 3, label: 'Lo básico' },
    { value: 4, label: 'Bastante' },
    { value: 5, label: 'Mucho / lo estudio' },
  ],
}

const Q13: SingleChoiceQuestion = {
  id: 'q13', category: 'experience', type: 'single',
  text: 'Si tu perro tiene una conducta no deseada, ¿cómo la abordarías?',
  options: [
    { value: 1, label: 'Castigo físico' },
    { value: 2, label: 'Regaño fuerte' },
    { value: 3, label: 'Ignorar la conducta' },
    { value: 4, label: 'Redirección' },
    { value: 5, label: 'Refuerzo positivo / consultar profesional' },
  ],
}

const Q14: SingleChoiceQuestion = {
  id: 'q14', category: 'experience', type: 'single',
  text: '¿Acudirías a un entrenador o etólogo si tu perro tuviera problemas serios?',
  options: [
    { value: 1, label: 'No' },
    { value: 2, label: 'Solo en último caso' },
    { value: 3, label: 'Lo evaluaría' },
    { value: 4, label: 'Sí, lo intentaría' },
    { value: 5, label: 'Sí, sin dudarlo' },
  ],
}

const Q15: SingleChoiceQuestion = {
  id: 'q15', category: 'experience', type: 'single',
  text: '¿Cómo te sentirías manejando un perro con miedos, ansiedad o reactividad?',
  options: [
    { value: 1, label: 'Nada cómodo/a' },
    { value: 2, label: 'Incómodo/a' },
    { value: 3, label: 'Neutro' },
    { value: 4, label: 'Cómodo/a' },
    { value: 5, label: 'Muy cómodo/a — lo busco intencionalmente' },
  ],
}

// ─── Bloque 4 — Care (q16-q20) ───────────────────────────────────────────────

const Q16: SingleChoiceQuestion = {
  id: 'q16', category: 'care', type: 'single',
  text: '¿Cuántas horas al día pasaría el perro solo en casa?',
  options: [
    { value: 1, label: 'Más de 10 hrs' },
    { value: 2, label: '7-9 hrs' },
    { value: 3, label: '5-6 hrs' },
    { value: 4, label: '3-4 hrs' },
    { value: 5, label: '0-2 hrs' },
  ],
}

const Q17: SingleChoiceQuestion = {
  id: 'q17', category: 'care', type: 'single',
  text: '¿Cuánto presupuesto mensual destinarías al cuidado del perro?',
  options: [
    { value: 1, label: 'Mínimo / lo que sobre' },
    { value: 2, label: 'Bajo' },
    { value: 3, label: 'Medio' },
    { value: 4, label: 'Alto' },
    { value: 5, label: 'Sin restricción' },
  ],
}

const Q18: MultiChoiceQuestion = {
  id: 'q18', category: 'care', type: 'multi', mapping: 'count',
  text: '¿Qué componentes tienes preparados ante una emergencia médica del perro?',
  hint: 'Marca todas las que apliquen — cada componente suma capacidad de respuesta.',
  options: [
    { id: 'vet_confianza',     label: 'Veterinario de confianza',          weight: 1 },
    { id: 'ahorro_emergencia', label: 'Ahorro destinado para emergencias', weight: 1 },
    { id: 'transporte_propio', label: 'Transporte propio',                 weight: 1 },
    { id: 'vet_urgencias_24h', label: 'Veterinario de urgencias 24h identificado', weight: 1 },
  ],
}

const Q19: SingleChoiceQuestion = {
  id: 'q19', category: 'care', type: 'single',
  text: '¿Estarías dispuesto/a a adoptar a un perro con condición médica permanente?',
  options: [
    { value: 1, label: 'No' },
    { value: 2, label: 'Probablemente no' },
    { value: 3, label: 'Lo pensaría' },
    { value: 4, label: 'Sí, si es manejable' },
    { value: 5, label: 'Sí, sin importar la condición' },
  ],
}

const Q20: MultiChoiceQuestion = {
  id: 'q20', category: 'care', type: 'multi', mapping: 'highest',
  text: 'Cuando viajas o te ausentas, ¿qué opciones tienes para el cuidado del perro?',
  hint: 'Marca todas las que apliquen — usaremos la mejor opción disponible.',
  options: [
    { id: 'solo_con_comida',     label: 'Lo dejo solo con comida',                       weight: 1 },
    { id: 'no_pensado',          label: 'No lo he pensado',                              weight: 2 },
    { id: 'vecino_casual',       label: 'Vecino o conocido casual',                      weight: 3 },
    { id: 'familiar_guarderia',  label: 'Familiar / guardería',                          weight: 4 },
    { id: 'designada_o_conmigo', label: 'Persona designada de confianza o lo llevo conmigo', weight: 5 },
  ],
}

// ─── Catálogo agrupado por bloque (orden del FE) ─────────────────────────────

export const QUIZ_BLOCKS: { category: QuizCategory; label: string; subtitle: string; icon: string; questions: QuizQuestionDef[] }[] = [
  {
    category: 'activity',
    label:    'Actividad',
    subtitle: '¿Cómo es tu día a día?',
    icon:     'directions_run',
    questions: [Q1, Q2, Q3, Q4, Q5],
  },
  {
    category: 'housing',
    label:    'Hogar',
    subtitle: 'Cuéntanos sobre tu espacio',
    icon:     'home',
    questions: [Q6, Q7, Q8, Q9, Q10],
  },
  {
    category: 'experience',
    label:    'Experiencia',
    subtitle: 'Tu trayectoria con perros',
    icon:     'school',
    questions: [Q11, Q12, Q13, Q14, Q15],
  },
  {
    category: 'care',
    label:    'Cuidados',
    subtitle: 'Recursos y compromiso',
    icon:     'health_and_safety',
    questions: [Q16, Q17, Q18, Q19, Q20],
  },
]

// resultado de Ml para la tarjeta
export interface MatchReason {
  categoria: QuizCategory
  texto:     string
  esPositivo: boolean
}

export interface DogRecommendation {
  id:              number
  adoptanteId:     string
  perroId:         string
  cuestionarioId:  number
  fecha:           string
  compatibilidad:  number   // 0-100 (FE) — el ML devuelve 0-1 de similarity
  fechaGeneracion: string

  similarity?:     number 
  //mlScore?:        number
  predictedSpeed?: number
  speedLabel?:     string
  //userVector?:     [number, number, number, number]
  //dogVector?:      [number, number, number, number]

  razonesMatch:    MatchReason[]

  // Datos del perro (hidratado del CRUD)
  perroNombre?:    string
  perroFoto?:      string
  perroRaza?:      string
  perroEdad?:      number
  perroTamano?:    string
  refugioNombre?:  string
}

export interface MLRecommendationResponse {
  adoptanteId:     string
  cuestionarioId:  number
  recomendaciones: DogRecommendation[]
  resumen:         string
  totalEvaluados:  number
  fechaGeneracion: string
  version:         string
  userVector?:     [number, number, number, number]
}

// ─── Compatibilidad: tipos viejos del ER ─────────────────────────────────────
// Mantenidos por si el resto del código los referencia. No los uses en nuevo
// código — usa QUIZ_BLOCKS y QuizDraftState.

export type QuestionType = 'single_choice' | 'multi_choice' | 'scale' | 'boolean' | 'text'

export interface QuizQuestion {
  id:             number
  cuestionarioId: number
  texto:          string
  tipo:           QuestionType
  opciones:       string[]
  respuesta:      string | null
  orden:          number
  categoria:      QuizCategory
  esRequerida:    boolean
}

export interface Cuestionario {
  id:             number
  adoptanteId:    string
  fecha:          string
  descripcion:    string
  version:        string
  completado:     boolean
  preguntas:      QuizQuestion[]
  respuestas?:    QuizSubmitPayload
}
