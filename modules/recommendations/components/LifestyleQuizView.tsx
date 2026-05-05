// modules/recommendations/components/LifestyleQuizView.tsx
// Orquestador del quiz de match (4 bloques: Activity / Housing / Experience / Care).
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressBar } from '../../shared/components/ui/ProgressBar'
import { Button }      from '../../shared/components/ui/Button'
import { Alert }       from '../../shared/components/ui/Alert'
import { Spinner }     from '../../shared/components/ui/Spinner'
import { useLifestyleQuiz, TOTAL_STEPS } from '../application/hooks/useLifestyleQuiz'
import { QUIZ_BLOCKS } from '../../shared/domain/LifestyleProfile'
import { BlockStep }   from './quiz-steps/BlockStep'
import '../styles/quiz.css'

export default function LifestyleQuizView() {
  const router = useRouter()

  const {
    currentStep,
    draft,
    direction,
    canAdvance,
    isSubmitting,
    submitError,
    setAnswer,
    nextStep,
    prevStep,
    submitQuiz,
  } = useLifestyleQuiz() // hook que maneja el estado del quiz, respuestas, validaciones y envío.

  const isFirstStep = currentStep === 0
  const isLastStep  = currentStep === TOTAL_STEPS - 1
  const progress    = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)
  const blockMeta   = QUIZ_BLOCKS[currentStep]

  async function handleSubmit() {
    const result = await submitQuiz()
    if (result) router.push('/mi-match') //te manda a las recomendaciones
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        background: '#fafafa',
      }}
    >
      {/* ── Loading overlay ─────────────────────────────────────────────── */}
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
          <p
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#52525b',
              textAlign: 'center',
              maxWidth: 260,
              lineHeight: 1.5,
            }}
          >
            Generando tus recomendaciones personalizadas…
          </p>
        </div>
      )}

      {/* ── Header sticky ───────────────────────────────────────────────── */}
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
              {blockMeta.label}
            </p>
          </div>

          <ProgressBar value={progress} size="sm" />
        </div>
      </header>

      {/* ── Step content ────────────────────────────────────────────────── */}
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
        <div
          key={currentStep}
          className={
            direction === 'forward' ? 'qz-slide-enter-right' : 'qz-slide-enter-left'
          }
        >
          <BlockStep blockIndex={currentStep} draft={draft} onChange={setAnswer} />
        </div>

        {submitError && (
          <div style={{ marginTop: '1.25rem' }}>
            <Alert type="error" message={submitError} closable />
          </div>
        )}
      </main>

      {/* ── Navegación sticky bottom ─────────────────────────────────────── */}
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
            Responde todas las preguntas para continuar
          </p>
        )}
      </nav>
    </div>
  )
}
