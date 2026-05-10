// modules/recommendations/infrastructure/MLService.ts
// Implementación real del servicio ML — orquesta llamadas al microservicio ML
// y la hidratación de perros desde dogs-ms.
//
// Dos flujos públicos:
//   1) generateRecommendations(answers)        — usuario completó el quiz
//   2) getMatchesByUserVector(userVector)      — ya tiene preferencias guardadas
//
// La función privada fetchAndHydrateMatches() comparte el paso común
// (top-N + hidratación + razones).

import type { Dog } from "@/modules/shared/domain/Dog";
import type {
  QuizSubmitPayload,
  DogRecommendation,
  MLRecommendationResponse,
  MatchReason,
  QuizCategory,
} from "@/modules/shared/domain/LifestyleProfile";
import { dogService } from "@/modules/dogs/infrastructure/DogServiceFactory";
import { profileService } from "@/modules/profile/infrastructure/ProfileServiceFactory";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import type { IMLService } from "./IMLService";

// ─── Constantes ───────────────────────────────────────────────────────────────

const TOP_N = 4;
const VERSION = "1.0.0";

// ─── Shapes del microservicio ML ─────────────────────────────────────────────

interface ProcessQuestionnaireResponse {
  user_vector: [number, number, number, number];
}

interface MLMatchResult {
  dog_id: number; // id interno del ML — no usar para hidratar
  dog_service_id: string; // UUID — id que entiende dogs-ms
  compatibility_score: number; // 0-1
  similarity: number;
  ml_score: number;
  user_vector: [number, number, number, number];
  dog_vector: [number, number, number, number];
  predicted_speed: number;
  speed_label: string;
  probabilities: Record<string, number>;
}

interface CompatibleDogsResponse {
  top_n: number;
  results: MLMatchResult[];
}

// ─── Razones del match ───────────────────────────────────────────────────────
// Compara user_vector vs dog_vector dimensión por dimensión.
// Diferencia < 1.5 → razón positiva. >= 1.5 → razón negativa.

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  activity: "actividad",
  housing: "espacio",
  experience: "experiencia",
  care: "cuidados",
};

const DIMENSION_TO_CATEGORY: QuizCategory[] = [
  "activity",
  "housing",
  "experience",
  "care",
];

function buildReasons(
  userVec: [number, number, number, number],
  dogVec: [number, number, number, number],
): MatchReason[] {
  return DIMENSION_TO_CATEGORY.map((cat, idx) => {
    const diff = Math.abs(userVec[idx] - dogVec[idx]);
    const esPositivo = diff < 1.5;
    const label = CATEGORY_LABELS[cat];
    return {
      categoria: cat,
      texto: esPositivo
        ? `Tu perfil de ${label} es compatible con este perro`
        : `Hay diferencia en ${label} — considera si se adapta a tu estilo`,
      esPositivo,
    };
  });
}

// ─── Resumen ──────────────────────────────────────────────────────────────────

function buildResumen(topScore: number): string {
  if (topScore >= 80)
    return "Excelente compatibilidad — estos perros se adaptan muy bien a tu perfil";
  if (topScore >= 60)
    return "Buena compatibilidad — encontramos candidatos con mucho potencial";
  if (topScore >= 40)
    return "Algunos perros que podrían adaptarse a tu estilo de vida";
  return "Resultados limitados — considera ajustar tus respuestas para refinar";
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export class MLService implements IMLService {
  async generateRecommendations(
    adoptanteId: string,
    answers: QuizSubmitPayload,
  ): Promise<MLRecommendationResponse> {
    // ML calcula user_vector
    const { data } = await apiClient.post<ProcessQuestionnaireResponse>(
      API_ENDPOINTS.ML.PROCESS_QUESTIONNAIRE,
      answers,
      { timeout: 30_000, withCredentials: false },
    );
    const userVector = data.user_vector;

    await profileService.updateUserVector(adoptanteId, userVector);

    // Sync authStore — la cookie/sesión queda con el user_vector fresco
    const { user, setUser } = useAuthStore.getState(); // se guarda en la authstore para tener actualizado
    //console.log(user)
    if (user && user.role === "applicant") {
      setUser({ ...user, userVector });
    }

    // Top matches con el user_vector recién calculado
    return this.fetchAndHydrateMatches(adoptanteId, userVector);
  }

  async getMatchesByUserVector(
    adoptanteId: string,
    userVector: [number, number, number, number],
  ): Promise<MLRecommendationResponse> {
    return this.fetchAndHydrateMatches(adoptanteId, userVector);
  }

  private async fetchAndHydrateMatches(
    adoptanteId: string,
    userVector: [number, number, number, number],
  ): Promise<MLRecommendationResponse> {
    //  Top-N matches del ML
    const { data: matchesRes } = await apiClient.post<CompatibleDogsResponse>(
      `${API_ENDPOINTS.ML.COMPATIBLE_DOGS}?top_n=${TOP_N}`,
      { user_vector: userVector },
      { timeout: 30_000, withCredentials: false },
    );
    const matches = matchesRes.results ?? [];

    // Hidratar perros desde dogs-ms (paralelo, tolerante a fallos)
    const dogs: (Dog | null)[] = await Promise.all(
      matches.map((m) =>
        dogService.getDogById(m.dog_service_id).catch(() => null),
      ),
    );

    // 3. Construir DogRecommendation[] — descarta perros no encontrados
    const cuestionarioId = Date.now();
    const now = new Date().toISOString();

    const recomendaciones: DogRecommendation[] = matches
      .map((m, i): DogRecommendation | null => {
        const dog = dogs[i];
        if (!dog) return null;

        return {
          id: i + 1,
          adoptanteId,
          perroId: dog.id,
          cuestionarioId,
          fecha: now,
          compatibilidad: Math.round(m.compatibility_score * 100),
          fechaGeneracion: now,
          similarity: m.similarity,
          predictedSpeed: m.predicted_speed,
          speedLabel: m.speed_label,
          razonesMatch: buildReasons(m.user_vector, m.dog_vector),
          perroNombre: dog.nombre,
          perroFoto: dog.foto,
          perroRaza: dog.raza,
          perroEdad: dog.edad,
          perroTamano: dog.tamano,
          refugioNombre: dog.refugioNombre,
        };
      })
      .filter((r): r is DogRecommendation => r !== null);

    const topScore = recomendaciones[0]?.compatibilidad ?? 0;

    return {
      adoptanteId,
      cuestionarioId,
      recomendaciones,
      resumen: buildResumen(topScore),
      totalEvaluados: matches.length,
      fechaGeneracion: now,
      version: VERSION,
      userVector,
    };
  }
}
