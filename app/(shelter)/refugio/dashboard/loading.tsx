// app/(shelter)/refugio/dashboard/loading.tsx — Archivo 219
// Skeleton: 6 KPI cards (sd-stats) + tabla de solicitudes recientes (sd-req-table)
import '@/modules/shelter/styles/shelterDashboard.css'

const S = { background: '#f4f4f5', borderRadius: 8, display: 'block' as const }

function CardSkeleton() {
  return (
    <div className="sd-card" style={{ pointerEvents: 'none' }}>
      <div className="sd-card__header">
        <div style={{ ...S, height: 13, width: '55%', borderRadius: 4 }} />
        <div style={{ ...S, height: 28, width: 28, borderRadius: 8 }} />
      </div>
      <div style={{ ...S, height: 34, width: '45%', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ ...S, height: 11, width: '70%', borderRadius: 4 }} />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="animate-pulse" style={{ padding: '0 0 40px' }}>

      {/* Stats grid — 6 cards */}
      <div className="sd-stats">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>

      {/* Recent requests table */}
      <div className="sd-body">
        <div className="sd-card" style={{ gridColumn: '1 / -1', pointerEvents: 'none' }}>
          <div className="sd-card__header" style={{ marginBottom: 16 }}>
            <div style={{ ...S, height: 16, width: 180, borderRadius: 4 }} />
          </div>
          <table className="sd-req-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                {[120, 90, 80, 80, 70].map((w, i) => (
                  <th key={i} style={{ padding: '10px 12px' }}>
                    <div style={{ ...S, height: 11, width: w, borderRadius: 3 }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {/* Dog + name */}
                  <td style={{ padding: '12px 12px' }}>
                    <div className="sd-req__dog">
                      <div style={{ ...S, width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ ...S, height: 13, width: 90, borderRadius: 4 }} />
                    </div>
                  </td>
                  {/* Adoptante */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 13, width: 110, borderRadius: 4 }} />
                  </td>
                  {/* Fecha */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 13, width: 80, borderRadius: 4 }} />
                  </td>
                  {/* Badge */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 22, width: 72, borderRadius: 999 }} />
                  </td>
                  {/* Link */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 13, width: 50, borderRadius: 4 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
