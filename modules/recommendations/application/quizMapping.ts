// modules/recommendations/application/quizMapping.ts
// Mapea el estado interno del FE (QuizDraftState con multi-selects) al
// payload que espera el microservicio ML (q1..q20: 1-5).
//
// Reglas:
//   q7  — multi-select → toma el weight más alto seleccionado
//   q18 — multi-select → cuenta componentes (capeado en 5: 0→1, 1→2, ..., 4+→5)
//   q20 — multi-select → toma el weight más alto seleccionado
//   resto → ya son QuizScale 1-5

import type {
  QuizDraftState,
  QuizSubmitPayload,
  QuizScale,
  Q7Option,
  Q20Option,
  QuizQuestionDef,
  MultiChoiceQuestion,
} from "@/modules/shared/domain/LifestyleProfile";
import { QUIZ_BLOCKS } from "@/modules/shared/domain/LifestyleProfile";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Toma el weight más alto entre las opciones seleccionadas. Default 1 si vacío. */
export function highest<T extends string>(
  selected: T[] | undefined,
  ranking: Record<T, number>,
): QuizScale {
  if (!selected || selected.length === 0) return 1;
  const max = Math.max(...selected.map((s) => ranking[s] ?? 1));
  return clampScale(max);
}

/** Cuenta cuántos componentes marcó. 0→1, 1→2, ..., 4+→5. */
export function countCapped(selected: unknown[] | undefined): QuizScale {
  const n = selected ? selected.length : 0;
  return clampScale(Math.min(5, n + 1));
}

function clampScale(n: number): QuizScale {
  const v = Math.max(1, Math.min(5, Math.round(n)));
  return v as QuizScale;
}

// ─── Rankings (derivados del catálogo declarativo) ───────────────────────────

function buildRanking(question: MultiChoiceQuestion): Record<string, number> {
  return Object.fromEntries(question.options.map((o) => [o.id, o.weight]));
}

function findMulti(id: "q7" | "q18" | "q20"): MultiChoiceQuestion {
  for (const block of QUIZ_BLOCKS) {
    const q = block.questions.find((x) => x.id === id);
    if (q && q.type === "multi") return q;
  }
  throw new Error(`Multi-choice question ${id} not found in QUIZ_BLOCKS`);
}

const Q7_RANKING = buildRanking(findMulti("q7"));
const Q20_RANKING = buildRanking(findMulti("q20"));

// ─── mapDraftToPayload ───────────────────────────────────────────────────────
// Convierte el estado interno → payload {q1..q20: 1-5} listo para el ML.
// Las preguntas no respondidas se rellenan con 3 (valor neutro).

export function mapDraftToPayload(draft: QuizDraftState): QuizSubmitPayload {
  const orNeutral = (v: QuizScale | undefined): QuizScale => v ?? 3;

  return {
    q1: orNeutral(draft.q1),
    q2: orNeutral(draft.q2),
    q3: orNeutral(draft.q3),
    q4: orNeutral(draft.q4),
    q5: orNeutral(draft.q5),
    q6: orNeutral(draft.q6),
    q7: highest<Q7Option>(
      draft.q7Selected,
      Q7_RANKING as Record<Q7Option, number>,
    ),
    q8: orNeutral(draft.q8),
    q9: orNeutral(draft.q9),
    q10: orNeutral(draft.q10),
    q11: orNeutral(draft.q11),
    q12: orNeutral(draft.q12),
    q13: orNeutral(draft.q13),
    q14: orNeutral(draft.q14),
    q15: orNeutral(draft.q15),
    q16: orNeutral(draft.q16),
    q17: orNeutral(draft.q17),
    q18: countCapped(draft.q18Selected),
    q19: orNeutral(draft.q19),
    q20: highest<Q20Option>(
      draft.q20Selected,
      Q20_RANKING as Record<Q20Option, number>,
    ),
  };
}

// ─── isQuestionAnswered ──────────────────────────────────────────────────────
// Una pregunta está respondida si el usuario interactuó con ella.
// Para single: tiene un valor 1-5. Para multi: tiene al menos un seleccionado.

export function isQuestionAnswered(
  q: QuizQuestionDef,
  draft: QuizDraftState,
): boolean {
  if (q.type === "single") {
    const v = (draft as Record<string, unknown>)[q.id] as QuizScale | undefined;
    return v !== undefined && v >= 1 && v <= 5;
  }
  // multi
  if (q.id === "q7") return (draft.q7Selected?.length ?? 0) > 0;
  if (q.id === "q18") return (draft.q18Selected?.length ?? 0) > 0;
  if (q.id === "q20") return (draft.q20Selected?.length ?? 0) > 0;
  return false;
}

// ─── isBlockComplete ─────────────────────────────────────────────────────────

export function isBlockComplete(
  blockIndex: number,
  draft: QuizDraftState,
): boolean {
  const block = QUIZ_BLOCKS[blockIndex];
  if (!block) return false;
  return block.questions.every((q) => isQuestionAnswered(q, draft));
}
