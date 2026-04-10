// modules/recommendations/infrastructure/MockMLService.ts
// Mock del servicio ML — simula el pipeline real del microservicio aDOGme-ML:
//   1. Convierte respuestas q1-q20 al user_vector de 4 dimensiones
//   2. Obtiene perros disponibles y calcula su dog_vector
//   3. Calcula compatibilidad = α × similitud euclidiana + β × ml_score (mock)
//   4. Devuelve top-10 ordenados por score
//
// Cuando se conecte el backend real, este archivo se reemplaza por
// una llamada HTTP a /predict/process-questionnaire y /predict/compatible-dogs.

import type { Dog } from '@/modules/shared/domain/Dog'
import type {
  LifestyleQuizAnswers,
  DogRecommendation,
  MLRecommendationResponse,
} from '@/modules/shared/domain/LifestyleProfile'
import { dogService } from '@/modules/dogs/infrastructure/DogServiceFactory'
import type { IMLService } from './IMLService'

// ─── Constantes ───────────────────────────────────────────────────────────────

const TOP_N    = 10
const ALPHA    = 0.6   // peso similitud euclidiana
const BETA     = 0.4   // peso ml_score (mock)
const VERSION  = '1.0.0-mock'
const DELAY_MS = 700

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── Vector de usuario (4D) desde las 20 respuestas ──────────────────────────
// Replica la lógica de UserAnswerEntity.to_vector() del ML service

function computeUserVector(a: LifestyleQuizAnswers): [number, number, number, number] {
  const avg = (...keys: (keyof LifestyleQuizAnswers)[]) => {
    const vals = keys.map(k => a[k] as number)
    return vals.reduce((s, v) => s + v, 0) / vals.length
  }
  return [
    avg('q1','q2','q3','q4','q5'),    // activity_score
    avg('q6','q7','q8','q9','q10'),   // housing_score
    avg('q11','q12','q13','q14','q15'), // experience_score
    avg('q16','q17','q18','q19','q20'), // care_score
  ]
}

// ─── Vector de perro (4D) desde sus atributos ─────────────────────────────────
// Replica la lógica de DogEntity.to_vector() del ML service

function computeDogVector(dog: Dog): [number, number, number, number] {
  const age = dog.edad

  const ageActivity = age <= 6 ? 5 : age <= 24 ? 4 : age <= 84 ? 3 : 2
  const sizeActivity: Record<string, number> = { pequeño: 2, mediano: 3, grande: 4, gigante: 5 }
  const activityReq = (ageActivity + (sizeActivity[dog.tamano] ?? 3)) / 2

  const spaceReq: Record<string, number> = { pequeño: 1.5, mediano: 2.5, grande: 3.5, gigante: 5 }

  const ageTrain = age <= 6 ? 5 : age <= 12 ? 4 : age <= 48 ? 3 : 2
  const healthTrain = dog.castrado ? 2 : 3  // simplificado
  const trainingDiff = (ageTrain + healthTrain) / 2

  const healthBase  = dog.castrado ? 1 : 3
  const healthScore = (dog.vacunas?.length ?? 0) > 0 ? 1 : 0
  const medicalNeed = 5 - healthScore * (4 / 3)
  const careReq     = (healthBase + medicalNeed) / 2

  return [activityReq, spaceReq[dog.tamano] ?? 3, trainingDiff, careReq]
}

// ─── Similitud euclidiana normalizada [0,1] ───────────────────────────────────

function euclideanSimilarity(u: number[], d: number[]): number {
  const maxDist = Math.sqrt(4 * (5 - 1) ** 2) // máx distancia posible (4D, escala 1-5)
  const dist    = Math.sqrt(u.reduce((s, v, i) => s + (v - d[i]) ** 2, 0))
  return Math.max(0, 1 - dist / maxDist)
}

// ─── ML score mock ─────────────────────────────────────────────────────────────
// Simula predict_proba[0..2] (clases de adopción rápida)

function mockMlScore(dog: Dog): number {
  let score = 0.5
  if (dog.edad <= 12) score += 0.1        // cachorro → adopción rápida
  if (dog.vacunas && dog.vacunas.length > 0) score += 0.1
  if (dog.castrado) score += 0.05
  if (dog.fotos && dog.fotos.length > 2)  score += 0.1
  if (dog.descripcion && dog.descripcion.length > 100) score += 0.05
  return Math.min(score, 1)
}

// ─── Razones del match ────────────────────────────────────────────────────────

function buildReasons(userVec: number[], dogVec: number[], score: number) {
  const categories = [
    { label: 'actividad',   idx: 0 },
    { label: 'espacio',     idx: 1 },
    { label: 'experiencia', idx: 2 },
    { label: 'cuidados',    idx: 3 },
  ] as const

  return categories.map(cat => {
    const diff = Math.abs(userVec[cat.idx] - dogVec[cat.idx])
    const esPositivo = diff < 1.5
    return {
      categoria: cat.label,
      texto: esPositivo
        ? `Tu perfil de ${cat.label} es compatible con este perro`
        : `Hay diferencia en ${cat.label} — considera si se adapta a tu estilo`,
      esPositivo,
    }
  })
}

// ─── Resumen ──────────────────────────────────────────────────────────────────

function buildResumen(score: number): string {
  if (score >= 80) return 'Excelente compatibilidad — estos perros se adaptan muy bien a tu perfil'
  if (score >= 60) return 'Buena compatibilidad — encontramos candidatos con mucho potencial'
  return 'Algunos perros que podrían adaptarse a tu estilo de vida'
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export class MockMLService implements IMLService {
  async generateRecommendations(
    adoptanteId: number,
    answers:     LifestyleQuizAnswers,
  ): Promise<MLRecommendationResponse> {
    await delay(DELAY_MS)

    const cuestionarioId = Date.now()
    const now            = new Date().toISOString()

    // 1. Calcular user_vector
    const userVec = computeUserVector(answers)

    // 2. Obtener perros disponibles
    const { data: disponibles } = await dogService.getDogs({
      estado: 'disponible',
      limit:  100,
    })

    // 3. Puntuar cada perro
    const scored = (disponibles as Dog[]).map(dog => {
      const dogVec    = computeDogVector(dog)
      const sim       = euclideanSimilarity(userVec, dogVec)
      const mlScore   = mockMlScore(dog)
      const total     = Math.round((ALPHA * sim + BETA * mlScore) * 100)
      return { dog, dogVec, sim, mlScore, total }
    })

    // 4. Top N por score
    scored.sort((a, b) => b.total - a.total)
    const top = scored.slice(0, TOP_N)

    // 5. Construir respuesta
    const recomendaciones: DogRecommendation[] = top.map((s, i) => ({
      id:              i + 1,
      adoptanteId,
      perroId:         s.dog.id,
      cuestionarioId,
      fecha:           now,
      compatibilidad:  s.total,
      fechaGeneracion: now,
      razonesMatch:    buildReasons(userVec, s.dogVec, s.total),
      perroNombre:     s.dog.nombre,
      perroFoto:       s.dog.foto,
      perroRaza:       s.dog.raza,
      perroEdad:       s.dog.edad,
      perroTamano:     s.dog.tamano,
      refugioNombre:   s.dog.refugioNombre,
      refugioSlug:     s.dog.refugioSlug,
    }))

    const topScore = recomendaciones[0]?.compatibilidad ?? 0

    return {
      adoptanteId,
      cuestionarioId,
      recomendaciones,
      resumen:         buildResumen(topScore),
      totalEvaluados:  disponibles.length,
      fechaGeneracion: now,
      version:         VERSION,
    }
  }
}
