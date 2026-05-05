// modules/recommendations/infrastructure/IMLService.ts
// Contrato del servicio de recomendaciones ML

import type { MLRecommendationResponse, QuizSubmitPayload } from '@/modules/shared/domain/LifestyleProfile'

export interface IMLService {

      /**
     * Procesa un quiz nuevo: ML calcula user_vector + top matches.                                                              
     * Usa cuando el usuario completa el quiz.                                                                                   
     */                                                                                                                          
    generateRecommendations(                                                                                                     
      adoptanteId: string,                                                                                                       
      answers: QuizSubmitPayload,                                                                                                
    ): Promise<MLRecommendationResponse>


      /**                                                     
     * Obtiene matches usando un user_vector ya existente.                                                                       
     * Usa cuando el usuario entra a /mi-match y ya tiene preferencias guardadas.
     */                                                                                                                          
    getMatchesByUserVector(
      adoptanteId: string,                                                                                                       
      userVector: [number, number, number, number],         
    ): Promise<MLRecommendationResponse>      
}
