// modules/recommendations/components/quiz-steps/BlockStep.tsx
// Paso genérico del quiz — renderiza todas las preguntas de un bloque.
// Reemplaza Step1Activity, Step2Housing, Step3Experience, Step4Coexistence:
// el catálogo declarativo de QUIZ_BLOCKS dice qué renderizar.
'use client'

import { QUIZ_BLOCKS } from '@/modules/shared/domain/LifestyleProfile'
import type {
  QuizDraftState,
  QuizScale,
  Q7Option,
  Q18Option,
  Q20Option,
} from '@/modules/shared/domain/LifestyleProfile'
import { OptionQuestion }      from './OptionQuestion'
import { MultiOptionQuestion } from './MultiOptionQuestion'

interface BlockStepProps {
  blockIndex: number
  draft:      QuizDraftState
  onChange:   <K extends keyof QuizDraftState>(key: K, value: QuizDraftState[K]) => void
}

export function BlockStep({ blockIndex, draft, onChange }: BlockStepProps) {
  const block = QUIZ_BLOCKS[blockIndex]
  if (!block) return null

  return (
    <div className="qz-step">
      <div className="qz-step__head">
        <div className="qz-step__icon">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}
          >
            {block.icon}
          </span>
        </div>
        <h2 className="qz-step__title">{block.label}</h2>
        <p className="qz-step__subtitle">{block.subtitle}</p>
      </div>

      <div className="qz-questions">
        {block.questions.map(q => {
          if (q.type === 'single') {
            return (
              <OptionQuestion
                key={q.id}
                text={q.text}
                options={q.options}
                value={(draft as Record<string, unknown>)[q.id] as QuizScale | undefined}
                onChange={v => onChange(q.id as keyof QuizDraftState, v as QuizDraftState[keyof QuizDraftState])}
              />
            )
          }

          // multi
          if (q.id === 'q7') {
            return (
              <MultiOptionQuestion
                key="q7"
                text={q.text}
                hint={q.hint}
                options={q.options}
                value={draft.q7Selected ?? []}
                onChange={(next) => onChange('q7Selected', next as Q7Option[])}
              />
            )
          }
          if (q.id === 'q18') {
            return (
              <MultiOptionQuestion
                key="q18"
                text={q.text}
                hint={q.hint}
                options={q.options}
                value={draft.q18Selected ?? []}
                onChange={(next) => onChange('q18Selected', next as Q18Option[])}
              />
            )
          }
          if (q.id === 'q20') {
            return (
              <MultiOptionQuestion
                key="q20"
                text={q.text}
                hint={q.hint}
                options={q.options}
                value={draft.q20Selected ?? []}
                onChange={(next) => onChange('q20Selected', next as Q20Option[])}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
