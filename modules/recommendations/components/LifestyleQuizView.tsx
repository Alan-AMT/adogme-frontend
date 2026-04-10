// modules/recommendations/components/LifestyleQuizView.tsx
// Orquestador del quiz de estilo de vida.
//
//  ┌─ Header sticky ─────────────────────────────────────┐
//  │  [← Salir]    Paso 3 de 7    Vivienda               │
//  │  ████████████░░░░░░░░░░░░░░░░░░░░░   43%            │
//  └──────────────────────────────────────────────────────┘
//  ┌─ Content (scrollable) ──────────────────────────────┐
//  │  <StepComponent> con animación slide                 │
//  └──────────────────────────────────────────────────────┘
//  ┌─ Nav sticky bottom ─────────────────────────────────┐
//  │  [← Anterior]       [Siguiente →]                   │
//  │  Último paso:       [Obtener mis recomendaciones ✨] │
//  └──────────────────────────────────────────────────────┘
'use client'

import { type ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressBar } from '../../shared/components/ui/ProgressBar'
import { Button }      from '../../shared/components/ui/Button'
import { Alert }       from '../../shared/components/ui/Alert'
import { Spinner }     from '../../shared/components/ui/Spinner'
import { useLifestyleQuiz, TOTAL_STEPS } from '../application/hooks/useLifestyleQuiz'
import { Step1Activity }    from './quiz-steps/Step1Activity'
import { Step2Housing }     from './quiz-steps/Step2Housing'
import { Step3Experience }  from './quiz-steps/Step3Experience'
import { Step4Coexistence } from './quiz-steps/Step4Coexistence'
import type { StepProps } from './quiz-steps/types'
import '../styles/quiz.css'

// ─── Metadatos por paso ───────────────────────────────────────────────────────

const STEP_META: { label: string }[] = [
  { label: 'Actividad'   },
  { label: 'Hogar'       },
  { label: 'Experiencia' },
  { label: 'Cuidados'    },
]

// ─── Componentes de paso ──────────────────────────────────────────────────────

const STEP_COMPONENTS: ComponentType<StepProps>[] = [
  Step1Activity,
  Step2Housing,
  Step3Experience,
  Step4Coexistence,
]

// ─── Componente ───────────────────────────────────────────────────────────────

export default function LifestyleQuizView() {
  const router = useRouter()

  const {
    currentStep,
    answers,
    direction,
    canAdvance,
    isSubmitting,
    submitError,
    setAnswer,
    nextStep,
    prevStep,
    submitQuiz,
  } = useLifestyleQuiz()

  const isFirstStep = currentStep === 0
  const isLastStep  = currentStep === TOTAL_STEPS - 1
  const progress    = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)

  const CurrentStep = STEP_COMPONENTS[currentStep]

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const result = await submitQuiz()
    if (result) router.push('/mi-match')
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        background: '#fafafa',
      }}
    >

      {/* ── Loading overlay (ML processing) ───────────────────────────────── */}
      {isSubmitting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            zIndex: 50,
          }}
        >
          <Spinner size="lg" />
          <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#52525b', textAlign: 'center', maxWidth: 260, lineHeight: 1.5 }}>
            Generando tus recomendaciones personalizadas…
          </p>
        </div>
      )}

      {/* ── Header sticky ─────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#fff',
          borderBottom: '1.5px solid #f0f0f0',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: '0 auto',
            padding: '1rem 1.25rem 0.875rem',
          }}
        >
          {/* Row: Salir | Paso N de 7 | Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <Link
              href="/mi-match"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#71717a',
                textDecoration: 'none',
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
              Salir
            </Link>

            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a' }}>
              Paso{' '}
              <strong style={{ color: '#18181b' }}>{currentStep + 1}</strong>
              {' '}de {TOTAL_STEPS}
            </p>

            <p
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#ff6b6b',
                minWidth: 72,
                textAlign: 'right',
              }}
            >
              {STEP_META[currentStep].label}
            </p>
          </div>

          {/* Progress bar */}
          <ProgressBar value={progress} size="sm" />
        </div>
      </header>

      {/* ── Step content ──────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: 600,
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.25rem 1.5rem',
          overflowX: 'hidden',
        }}
      >
        {/* Animación: key fuerza re-mount → re-dispara la animación CSS */}
        <div
          key={currentStep}
          className={
            direction === 'forward'
              ? 'qz-slide-enter-right'
              : 'qz-slide-enter-left'
          }
        >
          <CurrentStep answers={answers} onChange={setAnswer} />
        </div>

        {/* Error del submit */}
        {submitError && (
          <div style={{ marginTop: '1.25rem' }}>
            <Alert type="error" message={submitError} closable />
          </div>
        )}
      </main>

      {/* ── Navegación sticky bottom ───────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          borderTop: '1.5px solid #f0f0f0',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: '0 auto',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* ← Anterior */}
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="md"
              onClick={prevStep}
              disabled={isSubmitting}
              leftIcon={
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  arrow_back
                </span>
              }
            >
              Anterior
            </Button>
          )}

          {/* Siguiente / Obtener recomendaciones */}
          <div style={{ flex: 1 }}>
            {isLastStep ? (
              <Button
                fullWidth
                size="md"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!canAdvance || isSubmitting}
                rightIcon={
                  !isSubmitting ? (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 17,
                        fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18",
                      }}
                    >
                      auto_awesome
                    </span>
                  ) : undefined
                }
              >
                Obtener mis recomendaciones
              </Button>
            ) : (
              <Button
                fullWidth
                size="md"
                onClick={nextStep}
                disabled={!canAdvance}
                rightIcon={
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    arrow_forward
                  </span>
                }
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>

        {/* Hint cuando el paso está incompleto */}
        {!canAdvance && !isSubmitting && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.72rem',
              color: '#a1a1aa',
              fontWeight: 600,
              paddingBottom: '0.6rem',
            }}
          >
            Completa todas las opciones para continuar
          </p>
        )}
      </nav>
    </div>
  )
}
