'use client'

import { BlockStep } from '@/modules/recommendations/components/quiz-steps/BlockStep'
import '@/modules/recommendations/styles/quiz.css'
import { useCompatibilityCheck } from '../application/hooks/useCompatibilityCheck'
import type { CompatibilityReason } from '../application/hooks/useCompatibilityCheck'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Props {
  dogId: string
  dogName: string
  onClose: () => void
}

// ─── Score circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626'
  const bg    = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fefce8' : '#fef2f2'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: bg, border: `3px solid ${color}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 900, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color, opacity: 0.8 }}>%</span>
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#52525b', fontWeight: 600 }}>
        Índice de compatibilidad
      </p>
    </div>
  )
}

// ─── Fila de razón ────────────────────────────────────────────────────────────

function ReasonRow({ reason }: { reason: CompatibilityReason }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
      padding: '0.65rem 0.85rem', borderRadius: '0.6rem',
      background: reason.esPositivo ? '#f0fdf4' : '#fef9c3',
      marginBottom: '0.5rem',
    }}>
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18, flexShrink: 0, marginTop: 1,
          color: reason.esPositivo ? '#16a34a' : '#a16207',
          fontVariationSettings: `'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20`,
        }}
      >
        {reason.esPositivo ? 'check_circle' : 'warning'}
      </span>
      <span style={{ fontSize: '0.825rem', color: '#374151', lineHeight: 1.45, fontWeight: 500 }}>
        {reason.texto}
      </span>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div style={{
      height: 4, borderRadius: 999, background: '#f4f4f5',
      marginBottom: '1.5rem', overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', borderRadius: 999,
        background: '#ff6b6b', width: `${pct}%`,
        transition: 'width 300ms ease',
      }} />
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function CompatibilityCheckModal({ dogId, dogName, onClose }: Props) {
  const {
    draft, currentStep, totalSteps,
    phase, result, isCalculating, error,
    canAdvance, isLastStep,
    setAnswer, nextStep, prevStep, calculate, reset,
  } = useCompatibilityCheck(dogId)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '1.25rem',
          width: '100%', maxWidth: 540,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem 0',
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#18181b', margin: 0 }}>
              Calcular compatibilidad
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#71717a', margin: '2px 0 0', fontWeight: 500 }}>
              {dogName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none',
              background: '#f4f4f5', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#71717a' }}>close</span>
          </button>
        </div>

        {/* Body — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

          {/* ── Fase quiz ── */}
          {phase === 'quiz' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 700 }}>
                  Paso {currentStep + 1} de {totalSteps}
                </span>
              </div>
              <ProgressBar current={currentStep} total={totalSteps} />
              <BlockStep blockIndex={currentStep} draft={draft} onChange={setAnswer} />
            </>
          )}

          {/* ── Fase resultado ── */}
          {phase === 'result' && result && (
            <>
              <div style={{ textAlign: 'center' }}>
                <ScoreCircle score={result.score} />
              </div>

              {result.reasons.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p style={{
                    fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: '0.75rem',
                  }}>
                    Desglose por dimensión
                  </p>
                  {result.reasons.map(r => (
                    <ReasonRow key={r.categoria} reason={r} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Fase error ── */}
          {phase === 'error' && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 40, color: '#dc2626', display: 'block', marginBottom: '0.75rem' }}
              >
                error
              </span>
              <p style={{ fontSize: '0.875rem', color: '#52525b', marginBottom: '1.5rem' }}>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer — fijo */}
        <div style={{
          padding: '1rem 1.5rem 1.25rem',
          borderTop: '1px solid #f4f4f5',
          display: 'flex', gap: '0.65rem', justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          {phase === 'quiz' && (
            <>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  style={{
                    padding: '0.55rem 1.1rem', borderRadius: 999,
                    border: '1.5px solid #e4e4e7', background: '#fff',
                    fontSize: '0.85rem', fontWeight: 800, color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Anterior
                </button>
              )}
              {isLastStep ? (
                <button
                  onClick={calculate}
                  disabled={!canAdvance || isCalculating}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: 999,
                    border: 'none', background: canAdvance && !isCalculating ? '#ff6b6b' : '#f4f4f5',
                    fontSize: '0.85rem', fontWeight: 900,
                    color: canAdvance && !isCalculating ? '#fff' : '#a1a1aa',
                    cursor: canAdvance && !isCalculating ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}
                >
                  {isCalculating && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 15, animation: 'spin 1s linear infinite' }}
                    >
                      progress_activity
                    </span>
                  )}
                  {isCalculating ? 'Calculando...' : 'Calcular compatibilidad'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canAdvance}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: 999,
                    border: 'none', background: canAdvance ? '#ff6b6b' : '#f4f4f5',
                    fontSize: '0.85rem', fontWeight: 900,
                    color: canAdvance ? '#fff' : '#a1a1aa',
                    cursor: canAdvance ? 'pointer' : 'not-allowed',
                  }}
                >
                  Siguiente
                </button>
              )}
            </>
          )}

          {(phase === 'result' || phase === 'error') && (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '0.55rem 1.1rem', borderRadius: 999,
                  border: '1.5px solid #e4e4e7', background: '#fff',
                  fontSize: '0.85rem', fontWeight: 800, color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '0.55rem 1.25rem', borderRadius: 999,
                  border: 'none', background: '#ff6b6b',
                  fontSize: '0.85rem', fontWeight: 900, color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Calcular de nuevo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
