// modules/recommendations/infrastructure/IMLService.ts
// Contrato del servicio de recomendaciones ML

import type { LifestyleQuizAnswers, MLRecommendationResponse } from '@/modules/shared/domain/LifestyleProfile'

export interface IMLService {
  /**
   * Evalúa todos los perros disponibles contra las respuestas del quiz del
   * adoptante y devuelve un MLRecommendationResponse con los top-N ordenados
   * por compatibilidad descendente.
   */
  generateRecommendations(
    adoptanteId: number,
    answers: LifestyleQuizAnswers,
  ): Promise<MLRecommendationResponse>
}
