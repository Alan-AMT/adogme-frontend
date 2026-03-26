// modules/shared/mockData/recommendations.mock.ts
// Función de scoring determinista: mismas respuestas = mismos resultados
// No hay aleatoriedad — se calculan puntos por categoría

import type { LifestyleQuizAnswers, DogRecommendation, MatchReason } from '../domain/LifestyleProfile'
import type { Dog } from '../domain/Dog'
import { MOCK_DOGS } from './dogs.mock'

// ─── Pesos por categoría (suman 100) ─────────────────────────────────────────

const WEIGHTS = {
  energia:      25,  // nivel de energía del dueño vs perro
  espacio:      20,  // tamaño del hogar y jardín vs tamaño del perro
  experiencia:  15,  // experiencia previa vs necesidades del perro
  convivencia:  20,  // niños/mascotas en el hogar
  preferencias: 20,  // preferencias explícitas (tamaño, sexo, edad)
}

// ─── Scores por dimensión ─────────────────────────────────────────────────────

function scoreEnergia(answers: LifestyleQuizAnswers, dog: Dog): { score: number; razon: MatchReason } {
  const map: Record<string, number> = { sedentario: 1, moderado: 2, activo: 3, muy_activo: 4 }
  const dogMap: Record<string, number> = { baja: 1, moderada: 2, alta: 3, muy_alta: 4 }
  const dueño = map[answers.actividadFisica]
  const perro = dogMap[dog.nivelEnergia]
  const diff = Math.abs(dueño - perro)
  const score = diff === 0 ? 100 : diff === 1 ? 70 : diff === 2 ? 30 : 0
  const esPositivo = score >= 70
  return {
    score,
    razon: {
      categoria: 'energia',
      texto: esPositivo
        ? `Su nivel de energía (${dog.nivelEnergia}) coincide con tu estilo de vida ${answers.actividadFisica}`
        : `Su energía (${dog.nivelEnergia}) puede no coincidir con tu estilo ${answers.actividadFisica}`,
      esPositivo,
    },
  }
}

function scoreEspacio(answers: LifestyleQuizAnswers, dog: Dog): { score: number; razon: MatchReason } {
  const tieneJardin = answers.tieneJardin
  const espacio = answers.tamanoEspacio
  const necesitaJardin = dog.necesitaJardin
  const tamano = dog.tamano

  let score = 100
  if (necesitaJardin && !tieneJardin) score -= 50
  if (tamano === 'grande' && espacio === 'pequeño') score -= 30
  if (tamano === 'gigante' && espacio !== 'grande') score -= 40
  if (tamano === 'pequeño' && espacio === 'grande') score += 0 // no penaliza
  score = Math.max(0, Math.min(100, score))
  const esPositivo = score >= 60

  return {
    score,
    razon: {
      categoria: 'espacio',
      texto: esPositivo
        ? `Tu espacio es adecuado para un perro ${tamano}`
        : `Un perro ${tamano} ${necesitaJardin ? 'que necesita jardín' : ''} puede ser mucho para tu espacio`,
      esPositivo,
    },
  }
}

function scoreExperiencia(answers: LifestyleQuizAnswers, dog: Dog): { score: number; razon: MatchReason } {
  const tieneExp = answers.experienciaPrevia
  // Perros que requieren experiencia: Husky, Pitbull, alta energía
  const requiereExp = dog.nivelEnergia === 'muy_alta' || dog.raza.includes('Husky') || dog.raza.includes('Pitbull')
  let score = 100
  if (requiereExp && !tieneExp) score = 30
  if (!requiereExp && !tieneExp) score = 80
  const esPositivo = score >= 70

  return {
    score,
    razon: {
      categoria: 'experiencia',
      texto: esPositivo
        ? tieneExp ? 'Tu experiencia previa es un plus para este perro' : 'Este perro es ideal para nuevos dueños'
        : 'Este perro requiere experiencia previa con la raza',
      esPositivo,
    },
  }
}

function scoreConvivencia(answers: LifestyleQuizAnswers, dog: Dog): { score: number; razon: MatchReason } {
  let score = 100
  const razones: string[] = []
  let esPositivo = true

  if (answers.conviveConNinos && !dog.aptoNinos) {
    score -= 60
    razones.push('No se recomienda con niños')
    esPositivo = false
  } else if (answers.conviveConNinos && dog.aptoNinos) {
    razones.push('Apto para convivir con tus niños')
  }

  if (answers.conviveConMascotas) {
    const tienePerros = answers.tiposMascotas?.includes('perros')
    const tieneGatos = answers.tiposMascotas?.includes('gatos')
    if (tienePerros && !dog.aptoPerros) { score -= 25; esPositivo = false }
    if (tieneGatos && !dog.aptoGatos)  { score -= 25; esPositivo = false }
  }

  score = Math.max(0, score)

  return {
    score,
    razon: {
      categoria: 'convivencia',
      texto: esPositivo
        ? razones.length > 0 ? razones[0] : 'Compatible con tu entorno familiar'
        : razones[0] || 'Puede haber incompatibilidades con tu hogar',
      esPositivo,
    },
  }
}

function scorePreferencias(answers: LifestyleQuizAnswers, dog: Dog): { score: number; razon: MatchReason } {
  let score = 100
  const tamañoOk = answers.tamanoPreferido.includes('sin_preferencia') || answers.tamanoPreferido.includes(dog.tamano)
  const energiaOk = answers.energiaPreferida === 'sin_preferencia' || answers.energiaPreferida === dog.nivelEnergia
  const sexoOk    = answers.sexoPreferido    === 'sin_preferencia' || answers.sexoPreferido    === dog.sexo
  const edadOk    = answers.edadPreferida.includes('sin_preferencia') || answers.edadPreferida.includes(dog.edadCategoria)

  if (!tamañoOk) score -= 25
  if (!energiaOk) score -= 15
  if (!sexoOk)   score -= 10
  if (!edadOk)   score -= 20

  score = Math.max(0, score)
  const esPositivo = score >= 60

  return {
    score,
    razon: {
      categoria: 'preferencias',
      texto: esPositivo
        ? 'Coincide con tus preferencias de tamaño, energía y edad'
        : 'Algunos criterios de preferencia no coinciden exactamente',
      esPositivo,
    },
  }
}

// ─── Función principal de scoring ────────────────────────────────────────────

function scoreDog(answers: LifestyleQuizAnswers, dog: Dog, cuestionarioId: number): DogRecommendation {
  const energia     = scoreEnergia(answers, dog)
  const espacio     = scoreEspacio(answers, dog)
  const experiencia = scoreExperiencia(answers, dog)
  const convivencia = scoreConvivencia(answers, dog)
  const preferencias = scorePreferencias(answers, dog)

  const compatibilidad = Math.round(
    (energia.score     * WEIGHTS.energia      / 100) +
    (espacio.score     * WEIGHTS.espacio      / 100) +
    (experiencia.score * WEIGHTS.experiencia  / 100) +
    (convivencia.score * WEIGHTS.convivencia  / 100) +
    (preferencias.score * WEIGHTS.preferencias / 100)
  )

  return {
    id: dog.id * 1000 + cuestionarioId,
    adoptanteId: 101,
    perroId: dog.id,
    cuestionarioId,
    fecha: new Date().toISOString().split('T')[0],
    compatibilidad,
    fechaGeneracion: new Date().toISOString(),
    razonesMatch: [energia.razon, espacio.razon, experiencia.razon, convivencia.razon, preferencias.razon],
    perroNombre:   dog.nombre,
    perroFoto:     dog.foto,
    perroRaza:     dog.raza,
    perroEdad:     dog.edad,
    perroTamano:   dog.tamano,
    refugioNombre: dog.refugioNombre,
    refugioSlug:   dog.refugioSlug,
  }
}

// ─── Export principal ─────────────────────────────────────────────────────────

export const generateRecommendations = (
  answers: LifestyleQuizAnswers,
  cuestionarioId = 1,
  limit = 10
): DogRecommendation[] => {
  const disponibles = MOCK_DOGS.filter(d => d.estado === 'disponible')

  return disponibles
    .map(dog => scoreDog(answers, dog, cuestionarioId))
    .sort((a, b) => b.compatibilidad - a.compatibilidad)
    .slice(0, limit)
}

// ─── Respuestas de ejemplo para testing ──────────────────────────────────────

export const SAMPLE_QUIZ_ANSWERS: LifestyleQuizAnswers = {
  actividadFisica: 'moderado',
  horasEnCasaDiarias: 8,
  horasLibresParaPerro: 3,
  tipoVivienda: 'departamento',
  tieneJardin: false,
  tamanoEspacio: 'mediano',
  experienciaPrevia: false,
  conviveConNinos: false,
  conviveConMascotas: false,
  tamanoPreferido: ['pequeño', 'mediano'],
  energiaPreferida: 'moderada',
  sexoPreferido: 'sin_preferencia',
  edadPreferida: ['joven', 'adulto'],
  presupuestoMensualMXN: 1500,
  disponibilidadEntrenamiento: true,
  aceptaPerroConNecesidadesEspeciales: false,
}
