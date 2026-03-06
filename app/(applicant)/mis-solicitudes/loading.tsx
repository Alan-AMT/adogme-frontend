// app/(applicant)/mis-solicitudes/loading.tsx — Archivo 222
// Skeleton: as-page-header + tabs + lista de as-card (6 tarjetas)
import '@/modules/adoption/styles/adoptionForm.css'

const S = { background: '#f4f4f5', display: 'block' as const }

export default function Loading() {
  return (
    <div className="as-page animate-pulse">

      {/* Page header */}
      <div className="as-page-header">
        <div style={{ ...S, height: 28, width: 220, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ ...S, height: 14, width: 300, borderRadius: 4 }} />
      </div>

      {/* Tabs */}
      <div className="as-tabs" style={{ marginBottom: 24 }}>
        {[70, 90, 90, 80, 90, 90].map((w, i) => (
          <div
            key={i}
            style={{ ...S, height: 36, width: w, borderRadius: 999 }}
          />
        ))}
      </div>

      {/* Cards list */}
      <div className="as-list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="as-card"
            style={{ pointerEvents: 'none', display: 'flex', gap: 16, padding: 16 }}
          >
            {/* Dog photo */}
            <div style={{ ...S, width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} />

            {/* Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ ...S, height: 18, width: '45%', borderRadius: 4 }} />
                <div style={{ ...S, height: 22, width: 80, borderRadius: 999 }} />
              </div>
              <div style={{ ...S, height: 12, width: '60%', borderRadius: 4 }} />
              <div style={{ ...S, height: 12, width: '40%', borderRadius: 4 }} />
              <div style={{ ...S, height: 12, width: '30%', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
