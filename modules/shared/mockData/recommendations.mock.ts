// modules/shared/mockData/recommendations.mock.ts
// Datos mock de recomendaciones — usa la nueva estructura q1-q20

import type { LifestyleQuizAnswers, DogRecommendation } from '../domain/LifestyleProfile'
import { MOCK_DOGS } from './dogs.mock'

// ─── Quiz de ejemplo ──────────────────────────────────────────────────────────

export const MOCK_QUIZ_ANSWERS: LifestyleQuizAnswers = {
  q1: 4, q2: 4, q3: 5, q4: 3, q5: 4,   // activo
  q6: 3, q7: 3, q8: 3, q9: 4, q10: 2,  // depto mediano
  q11: 3, q12: 3, q13: 4, q14: 4, q15: 3, // algo de experiencia
  q16: 4, q17: 3, q18: 3, q19: 4, q20: 5, // comprometido
}

// ─── Recomendaciones de ejemplo ───────────────────────────────────────────────

export const MOCK_RECOMMENDATIONS: DogRecommendation[] = MOCK_DOGS
  .filter(d => d.estado === 'disponible')
  .slice(0, 10)
  .map((dog, i) => ({
    id:              i + 1,
    adoptanteId:     1,
    perroId:         dog.id,
    cuestionarioId:  1001,
    fecha:           '2026-04-10T12:00:00Z',
    compatibilidad:  85 - i * 5,
    fechaGeneracion: '2026-04-10T12:00:00Z',
    razonesMatch: [
      { categoria: 'actividad',   texto: 'Tu nivel de actividad es compatible',    esPositivo: true  },
      { categoria: 'espacio',     texto: 'El espacio en tu hogar es adecuado',      esPositivo: true  },
      { categoria: 'experiencia', texto: 'Tu experiencia previa es un plus',        esPositivo: true  },
      { categoria: 'cuidados',    texto: 'Estás preparado para sus necesidades',    esPositivo: true  },
    ],
    perroNombre:  dog.nombre,
    perroFoto:    dog.foto,
    perroRaza:    dog.raza,
    perroEdad:    dog.edad,
    perroTamano:  dog.tamano,
    refugioNombre: dog.refugioNombre,
    refugioSlug:   dog.refugioSlug,
  }))
