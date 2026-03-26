// app/(public)/refugios/loading.tsx — Archivo 218 (refugios)
// Skeleton del listado de refugios: hero + filtros + grid de sl-card
import '@/modules/home/styles/sheltersList.css'

const S = { background: '#f4f4f5', borderRadius: 8, display: 'block' as const }

export default function Loading() {
  return (
    <div className="sl-page animate-pulse">

      {/* Hero skeleton */}
      <div className="sl-hero" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...S, height: 14, width: 120, marginBottom: 12, borderRadius: 4 }} />
        <div style={{ ...S, height: 40, width: 340, marginBottom: 12, borderRadius: 8 }} />
        <div style={{ ...S, height: 18, width: 260, borderRadius: 4 }} />
      </div>

      {/* Filter chips skeleton */}
      <div className="sl-filters">
        {[100, 90, 110, 80, 105].map((w, i) => (
          <div key={i} style={{ ...S, height: 36, width: w, borderRadius: 999 }} />
        ))}
      </div>

      {/* Grid skeleton — 6 cards */}
      <div className="sl-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="sl-card" style={{ pointerEvents: 'none' }}>
            <div className="sl-card__media">
              <div style={{ ...S, width: '100%', height: '100%', borderRadius: 0 }} />
            </div>
            <div className="sl-card__body">
              <div style={{ ...S, height: 18, width: '65%', marginBottom: 6, borderRadius: 4 }} />
              <div style={{ ...S, height: 13, width: '45%', marginBottom: 14, borderRadius: 4 }} />
              <div className="sl-card__stats">
                {[1, 2].map((j) => (
                  <div key={j} className="sl-card__stat">
                    <div style={{ ...S, height: 20, width: 40, marginBottom: 4, borderRadius: 4 }} />
                    <div style={{ ...S, height: 10, width: 56, borderRadius: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
