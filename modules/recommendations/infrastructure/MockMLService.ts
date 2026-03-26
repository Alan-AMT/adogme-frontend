// modules/recommendations/infrastructure/MockMLService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Implementación mock del servicio de recomendaciones ML.
//
// Algoritmo de scoring (100 puntos base; ajustes por campos de compromisos):
//   Energía            25 pts  — nivelEnergia vs actividadFisica / energiaPreferida
//                               ajustado por horasLibresParaPerro (factor 0.6-1.0)
//   Espacio + Jardín   20 pts  — tipoVivienda × tamano + necesitaJardin
//                               ajustado por tamanoEspacio (factor 0.4-1.0)
//   Tamaño preferido   15 pts  — tamano vs tamanoPreferido del quiz
//   Niños              10 pts  — aptoNinos vs conviveConNinos
//   Mascotas           10 pts  — aptoPerros vs conviveConMascotas
//   Experiencia        10 pts  — nivelEnergia dificultad vs experienciaPrevia
//                               bonificado si disponibilidadEntrenamiento = true
//   Edad preferida      5 pts  — edadCategoria vs edadPreferida
//   Sexo preferido      5 pts  — sexo vs sexoPreferido
//   ── Ajustes negativos (penalizaciones por incompatibilidad de compromisos) ──
//   Necesidades esp.  hasta -10 pts  — aceptaPerroConNecesidadesEspeciales=false + perro senior
//   Presupuesto       hasta  -8 pts  — presupuestoMensualMXN < 1500 + perro con alto costo
//                                ─────────────────────────────────────────
//   TOTAL BASE        100 pts  →  score final = max(0, base + ajustes)
//
// Solo se evalúan perros con estado = 'disponible'.
// Se devuelven los top 10 por score descendente.
// ─────────────────────────────────────────────────────────────────────────────

import type { Dog, DogListItem, DogSize, EnergyLevel } from '@/modules/shared/domain/Dog'
import type {
  LifestyleQuizAnswers,
  DogRecommendation,
  MatchReason,
  MLRecommendationResponse,
} from '@/modules/shared/domain/LifestyleProfile'
import { dogService } from '@/modules/dogs/infrastructure/DogServiceFactory'
import type { IMLService } from './IMLService'

// ─── Constantes de peso ───────────────────────────────────────────────────────

const W = {
  ENERGY:      25,
  SPACE:       20,
  SIZE_PREF:   15,
  NINOS:       10,
  MASCOTAS:    10,
  EXPERIENCE:  10,
  AGE_PREF:     5,
  SEX_PREF:     5,
} as const

const TOP_N    = 10
const VERSION  = '1.0.0-mock'
const DELAY_MS = 700

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── Mapas de índice numérico para distancia ──────────────────────────────────

const ENERGY_IDX: Record<EnergyLevel, number> = {
  baja: 0, moderada: 1, alta: 2, muy_alta: 3,
}

const ACTIVITY_IDX: Record<string, number> = {
  sedentario: 0, moderado: 1, activo: 2, muy_activo: 3,
}

// Compatibilidad vivienda × tamaño del perro (0-1)
//                        pequeño  mediano  grande  gigante
const HOUSING_SIZE_COMPAT: Record<string, Record<DogSize, number>> = {
  departamento: { pequeño: 1.0, mediano: 0.85, grande: 0.50, gigante: 0.15 },
  casa:         { pequeño: 1.0, mediano: 1.00, grande: 0.95, gigante: 0.80 },
  casa_campo:   { pequeño: 1.0, mediano: 1.00, grande: 1.00, gigante: 1.00 },
  otro:         { pequeño: 0.9, mediano: 0.80, grande: 0.65, gigante: 0.40 },
}

// A5 — Horas de atención mínimas necesarias por nivel de energía
const ENERGY_HOURS_NEED: Record<EnergyLevel, number> = {
  baja: 1, moderada: 2, alta: 3, muy_alta: 4,
}

// A5 — Factor de compatibilidad tamaño espacio × tamaño del perro (0.4-1.0)
//                           pequeño  mediano  grande  gigante
const SPACE_SIZE_COMPAT: Record<string, Record<DogSize, number>> = {
  pequeño: { pequeño: 1.0, mediano: 0.70, grande: 0.40, gigante: 0.15 },
  mediano:  { pequeño: 1.0, mediano: 1.00, grande: 0.75, gigante: 0.50 },
  grande:   { pequeño: 1.0, mediano: 1.00, grande: 1.00, gigante: 0.90 },
}

// A5 — Perros con alto costo mensual de manutención
function isHighCostDog(dog: ScoredDog): boolean {
  return dog.tamano === 'grande' || dog.tamano === 'gigante' || dog.nivelEnergia === 'muy_alta'
}

// A5 — Proxy "perro con necesidades especiales" (senior o muy alta energía sin experiencia típica)
function isSpecialNeedsDog(dog: ScoredDog): boolean {
  return dog.edadCategoria === 'senior'
}

// Labels para los reasons
const ENERGY_LABELS: Record<EnergyLevel, string> = {
  baja: 'baja energía', moderada: 'energía moderada', alta: 'alta energía', muy_alta: 'muy alta energía',
}
const ACTIVITY_LABELS: Record<string, string> = {
  sedentario: 'sedentario', moderado: 'moderado', activo: 'activo', muy_activo: 'muy activo',
}
const SIZE_LABELS: Record<DogSize, string> = {
  pequeño: 'pequeño', mediano: 'mediano', grande: 'grande', gigante: 'gigante',
}

// ─── Funciones de scoring individuales ───────────────────────────────────────

interface ScoredCriteria {
  score: number
  reason: MatchReason | null
}

/** 25 pts — Energía del perro vs actividad del adoptante
 *  A5: ajustado por horasLibresParaPerro (factor 0.6–1.0) */
function scoreEnergy(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  const dogIdx = ENERGY_IDX[dog.nivelEnergia]

  // Prioridad: energiaPreferida explícita > actividadFisica derivada
  const targetIdx = a.energiaPreferida !== 'sin_preferencia'
    ? (ENERGY_IDX[a.energiaPreferida as EnergyLevel] ?? ACTIVITY_IDX[a.actividadFisica])
    : ACTIVITY_IDX[a.actividadFisica]

  const diff      = Math.abs(dogIdx - targetIdx)
  let baseScore   = diff === 0 ? W.ENERGY
                  : diff === 1 ? Math.round(W.ENERGY * 0.68)   // 17
                  : diff === 2 ? Math.round(W.ENERGY * 0.32)   //  8
                  : 0

  // A5 — Ajuste por horas libres disponibles para el perro
  const horasNeed   = ENERGY_HOURS_NEED[dog.nivelEnergia]
  const horasFactor = a.horasLibresParaPerro >= horasNeed
    ? 1
    : Math.max(0.6, a.horasLibresParaPerro / horasNeed)
  const score = Math.round(baseScore * horasFactor)

  let reason: MatchReason | null = null
  if (diff === 0 && horasFactor === 1) {
    reason = {
      categoria:  'actividad',
      texto:      `Su ${ENERGY_LABELS[dog.nivelEnergia]} encaja con tu estilo de vida ${ACTIVITY_LABELS[a.actividadFisica]}`,
      esPositivo: true,
    }
  } else if (diff >= 2 || horasFactor < 0.8) {
    reason = {
      categoria:  'actividad',
      texto:      horasFactor < 0.8
        ? `Necesita al menos ${horasNeed}h diarias de atención y tienes ${a.horasLibresParaPerro}h disponibles`
        : `Su nivel de energía (${ENERGY_LABELS[dog.nivelEnergia]}) podría no encajar con tu ritmo ${ACTIVITY_LABELS[a.actividadFisica]}`,
      esPositivo: false,
    }
  }

  return { score, reason }
}

/** 20 pts — Compatibilidad vivienda × tamaño del perro + jardín
 *  A5: ajustado por tamanoEspacio (factor adicional sobre el housing score) */
function scoreSpace(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  // Mitad de los puntos por compatibilidad vivienda/tamaño + ajuste por tamanoEspacio
  const housingCompat   = HOUSING_SIZE_COMPAT[a.tipoVivienda]?.[dog.tamano] ?? 0.5
  const spaceSizeFactor = SPACE_SIZE_COMPAT[a.tamanoEspacio]?.[dog.tamano] ?? 0.7
  const combinedFactor  = (housingCompat + spaceSizeFactor) / 2   // promedio de ambos factores
  const housingScore    = Math.round((W.SPACE / 2) * combinedFactor)   // max 10

  // Otra mitad: jardín
  let gardenScore: number
  let gardenReason: MatchReason | null = null

  if (dog.necesitaJardin && !a.tieneJardin) {
    gardenScore  = 0
    gardenReason = {
      categoria:  'espacio',
      texto:      'Este perro necesita jardín o patio, y tú no cuentas con uno',
      esPositivo: false,
    }
  } else if (dog.necesitaJardin && a.tieneJardin) {
    gardenScore  = W.SPACE / 2   // 10
    gardenReason = {
      categoria:  'espacio',
      texto:      'Tienes jardín, ¡perfecto para su nivel de actividad!',
      esPositivo: true,
    }
  } else {
    gardenScore = W.SPACE / 2   // no necesita jardín → neutral positivo
  }

  // Bonus razón por vivienda si compatibilidad muy baja
  let housingReason: MatchReason | null = null
  if (housingCompat <= 0.5) {
    housingReason = {
      categoria:  'espacio',
      texto:      `Un perro de tamaño ${SIZE_LABELS[dog.tamano]} puede sentirse limitado en un ${a.tipoVivienda.replace('_', ' ')}`,
      esPositivo: false,
    }
  } else if (housingCompat === 1.0 && dog.tamano !== 'pequeño') {
    housingReason = {
      categoria:  'espacio',
      texto:      `Tu ${a.tipoVivienda.replace('_', ' ')} ofrece espacio adecuado para un perro de tamaño ${SIZE_LABELS[dog.tamano]}`,
      esPositivo: true,
    }
  }

  const reason = gardenReason ?? housingReason
  return { score: housingScore + gardenScore, reason }
}

/** 15 pts — Tamaño del perro vs preferencia explícita del adoptante */
function scoreSizePref(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  const prefs = a.tamanoPreferido

  if (prefs.includes('sin_preferencia')) {
    return { score: Math.round(W.SIZE_PREF * 0.67), reason: null }  // 10 pts — neutro
  }

  if (prefs.includes(dog.tamano)) {
    return {
      score: W.SIZE_PREF,
      reason: {
        categoria:  'tamaño',
        texto:      `El tamaño ${SIZE_LABELS[dog.tamano]} coincide con tus preferencias`,
        esPositivo: true,
      },
    }
  }

  return {
    score: 0,
    reason: {
      categoria:  'tamaño',
      texto:      `Buscas un perro ${prefs.filter(p => p !== 'sin_preferencia').map(p => SIZE_LABELS[p as DogSize]).join(' o ')} y este es ${SIZE_LABELS[dog.tamano]}`,
      esPositivo: false,
    },
  }
}

/** 10 pts — Compatibilidad con niños */
function scoreNinos(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  if (!a.conviveConNinos) return { score: W.NINOS, reason: null }

  if (dog.aptoNinos) {
    return {
      score: W.NINOS,
      reason: {
        categoria:  'convivencia',
        texto:      'Es apto para convivir con niños',
        esPositivo: true,
      },
    }
  }

  return {
    score: 0,
    reason: {
      categoria:  'convivencia',
      texto:      'No se ha verificado su compatibilidad con niños',
      esPositivo: false,
    },
  }
}

/** 10 pts — Compatibilidad con otras mascotas */
function scoreMascotas(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  if (!a.conviveConMascotas) return { score: W.MASCOTAS, reason: null }

  if (dog.aptoPerros) {
    return {
      score: W.MASCOTAS,
      reason: {
        categoria:  'convivencia',
        texto:      'Convive bien con otras mascotas',
        esPositivo: true,
      },
    }
  }

  return {
    score: 0,
    reason: {
      categoria:  'convivencia',
      texto:      'Puede tener dificultad para convivir con otras mascotas',
      esPositivo: false,
    },
  }
}

/** 10 pts — Experiencia del adoptante vs dificultad del perro
 *  A5: bonificado si disponibilidadEntrenamiento = true y sin experiencia previa */
function scoreExperience(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  const needsExp = dog.nivelEnergia === 'muy_alta'

  if (!needsExp) return { score: W.EXPERIENCE, reason: null }

  if (a.experienciaPrevia) {
    return {
      score: W.EXPERIENCE,
      reason: {
        categoria:  'experiencia',
        texto:      'Tu experiencia previa es ideal para manejar su alto nivel de energía',
        esPositivo: true,
      },
    }
  }

  // A5 — Sin experiencia pero dispuesto a entrenar: penalización reducida
  if (a.disponibilidadEntrenamiento) {
    return {
      score: Math.round(W.EXPERIENCE * 0.6),   // 6 pts
      reason: {
        categoria:  'experiencia',
        texto:      'No tienes experiencia previa, pero tu disposición a entrenar es un buen punto de partida',
        esPositivo: true,
      },
    }
  }

  return {
    score: Math.round(W.EXPERIENCE * 0.3),   // 3 pts
    reason: {
      categoria:  'experiencia',
      texto:      'Su nivel de energía muy alta puede ser retador sin experiencia ni disposición a entrenar',
      esPositivo: false,
    },
  }
}

/** 5 pts — Edad del perro vs preferencia del adoptante */
function scoreAgePref(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  const prefs = a.edadPreferida

  if (prefs.includes('sin_preferencia') || prefs.includes(dog.edadCategoria)) {
    return { score: W.AGE_PREF, reason: null }
  }

  return { score: 1, reason: null }   // 1 pt — leve penalización
}

/** 5 pts — Sexo del perro vs preferencia del adoptante */
function scoreSexPref(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  if (a.sexoPreferido === 'sin_preferencia' || a.sexoPreferido === dog.sexo) {
    return { score: W.SEX_PREF, reason: null }
  }
  return { score: 2, reason: null }   // 2 pts — penalización leve
}

/** A5 — Ajuste negativo: aceptaPerroConNecesidadesEspeciales vs proxy "perro senior"
 *  0 pts si el adoptante acepta o el perro no es senior
 * -10 pts si no acepta y el perro es senior */
function scoreSpecialNeeds(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  if (!isSpecialNeedsDog(dog)) return { score: 0, reason: null }

  if (a.aceptaPerroConNecesidadesEspeciales) {
    return {
      score: 0,
      reason: {
        categoria:  'preferencias',
        texto:      'Estás abierto a perros senior con cuidados especiales',
        esPositivo: true,
      },
    }
  }

  return {
    score: -10,
    reason: {
      categoria:  'preferencias',
      texto:      'Los perros senior requieren cuidados adicionales que indicaste no estar preparado para asumir',
      esPositivo: false,
    },
  }
}

/** A5 — Ajuste negativo: presupuestoMensualMXN vs costo estimado del perro
 *  0 pts si el presupuesto es suficiente
 * -4 pts si presupuesto bajo con perro de alto costo
 * -8 pts si presupuesto muy bajo con perro de alto costo */
function scoreBudget(dog: ScoredDog, a: LifestyleQuizAnswers): ScoredCriteria {
  if (!isHighCostDog(dog)) return { score: 0, reason: null }
  if (a.presupuestoMensualMXN >= 2000) return { score: 0, reason: null }

  if (a.presupuestoMensualMXN < 1000) {
    return {
      score: -8,
      reason: {
        categoria:  'preferencias',
        texto:      'Tu presupuesto mensual puede ser insuficiente para los cuidados que este perro requiere',
        esPositivo: false,
      },
    }
  }

  return {
    score: -4,
    reason: {
      categoria:  'preferencias',
      texto:      'Tu presupuesto es ajustado para las necesidades de este perro',
      esPositivo: false,
    },
  }
}

// ─── Scoring total de un perro ────────────────────────────────────────────────

type ScoredDog = DogListItem   // getDogs devuelve DogListItem (superset en runtime)

interface DogScore {
  dog:           ScoredDog
  total:         number   // 0-100
  reasons:       MatchReason[]
}

function scoreDog(dog: ScoredDog, answers: LifestyleQuizAnswers): DogScore {
  const criteria = [
    scoreEnergy      (dog, answers),
    scoreSpace       (dog, answers),
    scoreSizePref    (dog, answers),
    scoreNinos       (dog, answers),
    scoreMascotas    (dog, answers),
    scoreExperience  (dog, answers),
    scoreAgePref     (dog, answers),
    scoreSexPref     (dog, answers),
    // A5 — ajustes negativos por compromisos
    scoreSpecialNeeds(dog, answers),
    scoreBudget      (dog, answers),
  ]

  const total   = Math.max(0, criteria.reduce((sum, c) => sum + c.score, 0))
  const reasons = criteria
    .map(c => c.reason)
    .filter((r): r is MatchReason => r !== null)
    .slice(0, 4)   // máximo 4 razones

  return { dog, total, reasons }
}

// ─── Resumen en lenguaje natural ──────────────────────────────────────────────

function buildResumen(answers: LifestyleQuizAnswers, total: number): string {
  const lines: string[] = []

  const actividadLabels: Record<string, string> = {
    sedentario: 'un estilo de vida tranquilo',
    moderado:   'un ritmo moderado de actividad',
    activo:     'un estilo de vida activo',
    muy_activo: 'un estilo de vida muy activo',
  }
  lines.push(`Basado en ${actividadLabels[answers.actividadFisica]}`)

  if (answers.tieneJardin) lines.push('espacio con jardín')
  if (answers.conviveConNinos) lines.push('niños en el hogar')
  if (answers.conviveConMascotas) lines.push('otras mascotas')

  const context = lines.length > 1
    ? `${lines[0]}, ${lines.slice(1).join(', ')}`
    : lines[0]

  const topScore = total >= 80 ? 'alta' : total >= 60 ? 'buena' : 'moderada'
  return `${context}, priorizamos perros con ${topScore} compatibilidad contigo. Los resultados se ordenan de mayor a menor match.`
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export class MockMLService implements IMLService {

  async generateRecommendations(
    adoptanteId: number,
    answers: LifestyleQuizAnswers,
  ): Promise<MLRecommendationResponse> {
    await delay(DELAY_MS)

    // A3 — Obtener perros disponibles a través del servicio, no del mock directo
    const { data: disponibles } = await dogService.getDogs({ estado: 'disponible', limit: 100 })

    // Score y ordenar
    const scored = disponibles
      .map(dog => scoreDog(dog, answers))
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_N)

    const now      = new Date().toISOString()
    const cuestionarioId = Date.now()   // mock — sin BD real

    const recomendaciones: DogRecommendation[] = scored.map((s, i) => ({
      id:             i + 1,
      adoptanteId,
      perroId:        s.dog.id,
      cuestionarioId,
      fecha:          now,
      compatibilidad: s.total,
      fechaGeneracion: now,
      razonesMatch:   s.reasons,

      // Datos enriquecidos del perro
      perroNombre:  s.dog.nombre,
      perroFoto:    s.dog.foto,
      perroRaza:    s.dog.raza,
      perroEdad:    s.dog.edad,
      perroTamano:  s.dog.tamano,
      refugioNombre: s.dog.refugioNombre,
      refugioSlug:   s.dog.refugioSlug,
    }))

    const topScore  = recomendaciones[0]?.compatibilidad ?? 0

    return {
      adoptanteId,
      cuestionarioId,
      recomendaciones,
      resumen:          buildResumen(answers, topScore),
      totalEvaluados:   disponibles.length,
      fechaGeneracion:  now,
      version:          VERSION,
    }
  }
}
