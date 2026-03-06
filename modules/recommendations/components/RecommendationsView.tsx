// modules/recommendations/components/RecommendationsView.tsx
// Vista de resultados del motor ML — grid de perros recomendados con
// badge de compatibilidad, razones del match y estado vacío.
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/modules/shared/infrastructure/store/authStore'
import type {
  MLRecommendationResponse,
  DogRecommendation,
} from '@/modules/shared/domain/LifestyleProfile'
import '../styles/recommendations.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESULTS_KEY = (id: number) => `ml-results-${id}`

function compatClass(score: number): string {
  if (score >= 75) return 'rec-card__compat--high'
  if (score >= 50) return 'rec-card__compat--mid'
  return 'rec-card__compat--low'
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="rec-page">
      {/* Header placeholder */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div
            style={{
              width: 180,
              height: '1.35rem',
              borderRadius: '0.375rem',
              background: '#e4e4e7',
              animation: 'rec-shimmer 1.4s ease-in-out infinite',
              backgroundSize: '200% 100%',
              backgroundImage:
                'linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%)',
            }}
          />
          <div
            style={{
              width: 100,
              height: '0.8rem',
              borderRadius: '0.25rem',
              background: '#e4e4e7',
              animation: 'rec-shimmer 1.4s ease-in-out infinite',
              backgroundSize: '200% 100%',
              backgroundImage:
                'linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%)',
            }}
          />
        </div>
      </div>

      <div className="rec-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rec-skeleton-card">
            <div className="rec-skeleton-photo" />
            <div className="rec-skeleton-body">
              <div className="rec-skeleton-line rec-skeleton-line--lg" />
              <div className="rec-skeleton-line rec-skeleton-line--md" />
              <div className="rec-skeleton-line rec-skeleton-line--sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rec-empty">
      <span
        className="material-symbols-outlined rec-empty__icon"
        style={{ fontVariationSettings: "'FILL' 0,'wght' 200,'GRAD' 0,'opsz' 48" }}
      >
        search_check
      </span>
      <h2 className="rec-empty__title">Aún no tienes recomendaciones</h2>
      <p className="rec-empty__subtitle">
        Completa el quiz de estilo de vida y nuestro sistema encontrará los perros más
        compatibles contigo.
      </p>
      <Link href="/mi-match/quiz" className="rec-empty__btn">
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 18,
            fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 20",
          }}
        >
          auto_awesome
        </span>
        Hacer el quiz ahora
      </Link>
    </div>
  )
}

// ─── Tarjeta de recomendación ─────────────────────────────────────────────────

interface RecommendationCardProps {
  rec:   DogRecommendation
  rank:  number
}

function RecommendationCard({ rec, rank }: RecommendationCardProps) {
  const score          = Math.round(rec.compatibilidad)
  const positiveReason = rec.razonesMatch.find(r => r.esPositivo)
  const negativeReason = rec.razonesMatch.find(r => !r.esPositivo)
  // Mostrar máx 2 razones: 1 positiva prioritaria + 1 negativa si existe
  const shownReasons = [
    ...(positiveReason ? [positiveReason] : []),
    ...(negativeReason ? [negativeReason] : []),
  ].slice(0, 2)

  const photoSrc = rec.perroFoto ?? '/assets/dogs/placeholder.jpg'

  return (
    <Link href={`/perros/${rec.perroId}`} className="rec-card group">

      {/* Foto con badges */}
      <div className="rec-card__media">
        <Image
          src={photoSrc}
          alt={rec.perroNombre ?? 'Perro recomendado'}
          fill
          className="rec-card__img group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 540px) 50vw, (max-width: 900px) 33vw, 220px"
        />

        {/* Ranking — top N */}
        <div className={`rec-card__rank${rank <= 3 ? ' rec-card__rank--top' : ''}`}>
          #{rank}
        </div>

        {/* Compatibilidad */}
        <div className={`rec-card__compat ${compatClass(score)}`}>
          <span className="rec-card__compat-score">{score}%</span>
          <span className="rec-card__compat-label">compatible</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="rec-card__body">
        <p className="rec-card__name">{rec.perroNombre ?? 'Sin nombre'}</p>
        {rec.perroRaza    && <p className="rec-card__breed">{rec.perroRaza}</p>}
        {rec.refugioNombre && <p className="rec-card__shelter">{rec.refugioNombre}</p>}

        {/* Razones del match */}
        {shownReasons.length > 0 && (
          <div className="rec-card__reasons">
            {shownReasons.map((r, i) => (
              <span
                key={i}
                className={`rec-card__reason ${
                  r.esPositivo ? 'rec-card__reason--pos' : 'rec-card__reason--neg'
                }`}
              >
                <span className="material-symbols-outlined">
                  {r.esPositivo ? 'check_circle' : 'cancel'}
                </span>
                {r.texto}
              </span>
            ))}
          </div>
        )}

        <span className="rec-card__cta">
          Ver perfil
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 16" }}
          >
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  )
}

// ─── Helpers de fecha ─────────────────────────────────────────────────────────

function formatGenDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export function RecommendationsView() {
  // C2 — Leer isLoading del store para detectar cuando termina la hydration
  const { user, isLoading: storeLoading } = useAuthStore()
  const [result, setResult]               = useState<MLRecommendationResponse | null>(null)
  const [loaded, setLoaded]               = useState(false)

  // C2 — Solo leer localStorage cuando el store ya está hidratado (storeLoading=false)
  useEffect(() => {
    if (storeLoading) return   // esperar hydration del auth store
    if (!user?.id) { setLoaded(true); return }
    try {
      const raw = localStorage.getItem(RESULTS_KEY(user.id))
      if (raw) setResult(JSON.parse(raw) as MLRecommendationResponse)
    } catch { /* noop */ }
    setLoaded(true)
  }, [user?.id, storeLoading])

  if (!loaded || storeLoading) return <LoadingSkeleton />

  const recomendaciones = result?.recomendaciones ?? []
  const hasResults      = recomendaciones.length > 0

  return (
    <div className="rec-page">

      {/* Encabezado */}
      <header className="rec-header">
        <div>
          <h1 className="rec-header__title">
            {hasResults ? 'Tus mejores matches' : 'Mis recomendaciones'}
          </h1>
          {result && (
            <p className="rec-header__meta">
              {result.totalEvaluados} perros evaluados
              {hasResults && ` · ${recomendaciones.length} resultados`}
              {/* C1 — Mostrar fecha de generación del análisis */}
              {result.fechaGeneracion && (
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
                  Generado el {formatGenDate(result.fechaGeneracion)}
                </span>
              )}
            </p>
          )}
        </div>

        <Link href="/mi-match/quiz" className="rec-header__update">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 15,
              fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 16",
            }}
          >
            tune
          </span>
          Actualizar preferencias
        </Link>
      </header>

      {/* Resumen generado por el modelo */}
      {result?.resumen && (
        <div className="rec-summary">
          <span className="material-symbols-outlined rec-summary__icon">
            auto_awesome
          </span>
          <p className="rec-summary__text">{result.resumen}</p>
        </div>
      )}

      {/* Grid o estado vacío */}
      {hasResults ? (
        <div className="rec-grid">
          {recomendaciones.map((rec, idx) => (
            <RecommendationCard key={rec.id} rec={rec} rank={idx + 1} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
