// app/(admin)/admin/loading.tsx — Archivo 221
// Skeleton: 6 KPI cards (ad-stats) + charts row + pending shelters table
import '@/modules/admin/styles/admin.css'

const S = { background: '#f4f4f5', display: 'block' as const }

function KpiSkeleton() {
  return (
    <div className="ad-card" style={{ pointerEvents: 'none' }}>
      <div className="ad-card__header">
        <div style={{ ...S, height: 12, width: '60%', borderRadius: 4 }} />
        <div style={{ ...S, height: 28, width: 28, borderRadius: 8 }} />
      </div>
      <div style={{ ...S, height: 32, width: '40%', borderRadius: 6, margin: '12px 0 8px' }} />
      <div style={{ ...S, height: 10, width: '70%', borderRadius: 4 }} />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="animate-pulse" style={{ padding: '0 0 40px' }}>

      {/* KPI grid */}
      <div className="ad-stats">
        {Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>

      {/* Charts row */}
      <div className="ad-charts-row">
        {/* Line chart card */}
        <div className="ad-card" style={{ flex: 2, pointerEvents: 'none' }}>
          <div className="ad-card__header" style={{ marginBottom: 20 }}>
            <div style={{ ...S, height: 15, width: 160, borderRadius: 4 }} />
          </div>
          <div style={{ ...S, height: 180, width: '100%', borderRadius: 12 }} />
        </div>
        {/* Bar chart card */}
        <div className="ad-card" style={{ flex: 1, pointerEvents: 'none' }}>
          <div className="ad-card__header" style={{ marginBottom: 16 }}>
            <div style={{ ...S, height: 15, width: 130, borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[80, 65, 55, 70, 45].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...S, height: 11, width: 70, borderRadius: 4, flexShrink: 0 }} />
                <div style={{ ...S, height: 16, width: `${w}%`, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending shelters table */}
      <div className="ad-tables-row">
        <div className="ad-card" style={{ pointerEvents: 'none' }}>
          <div className="ad-card__header" style={{ marginBottom: 16 }}>
            <div style={{ ...S, height: 15, width: 200, borderRadius: 4 }} />
          </div>
          <table className="ad-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                {[160, 100, 90, 80].map((w, i) => (
                  <th key={i} style={{ padding: '10px 12px' }}>
                    <div style={{ ...S, height: 11, width: w, borderRadius: 3 }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px 12px' }}>
                    <div className="ad-shelter-cell">
                      <div style={{ ...S, width: 36, height: 36, borderRadius: 8 }} />
                      <div>
                        <div style={{ ...S, height: 13, width: 110, borderRadius: 4, marginBottom: 4 }} />
                        <div style={{ ...S, height: 10, width: 80, borderRadius: 4 }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 13, width: 90, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ ...S, height: 13, width: 80, borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ ...S, height: 30, width: 70, borderRadius: 8 }} />
                      <div style={{ ...S, height: 30, width: 70, borderRadius: 8 }} />
                    </div>
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
