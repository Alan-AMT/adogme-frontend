// app/(shelter)/refugio/perros/loading.tsx — Archivo 220
// Skeleton: toolbar + tabla sv-table (8 filas)
import '@/modules/shelter/styles/shelterViews.css'

const S = { background: '#f4f4f5', display: 'block' as const }

export default function Loading() {
  return (
    <div className="animate-pulse" style={{ padding: '0 0 40px' }}>

      {/* Toolbar skeleton */}
      <div className="sv-toolbar" style={{ marginBottom: 20 }}>
        <div className="sv-search" style={{ pointerEvents: 'none', flex: 1 }}>
          <div style={{ ...S, height: 16, width: 16, borderRadius: '50%' }} />
          <div style={{ ...S, height: 14, width: '40%', borderRadius: 4, marginLeft: 10 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[80, 100, 90].map((w, i) => (
            <div key={i} style={{ ...S, height: 36, width: w, borderRadius: 999 }} />
          ))}
        </div>
        <div style={{ ...S, height: 40, width: 130, borderRadius: 10, marginLeft: 8 }} />
      </div>

      {/* Table skeleton */}
      <div className="sv-table-wrap">
        <table className="sv-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              {[160, 100, 80, 90, 60, 70, 80].map((w, i) => (
                <th key={i} style={{ padding: '10px 12px' }}>
                  <div style={{ ...S, height: 11, width: w, borderRadius: 3 }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {/* Dog cell */}
                <td style={{ padding: '12px 12px' }}>
                  <div className="sv-dog-cell">
                    <div style={{ ...S, width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                    <div>
                      <div style={{ ...S, height: 14, width: 100, borderRadius: 4, marginBottom: 5 }} />
                      <div style={{ ...S, height: 11, width: 70, borderRadius: 4 }} />
                    </div>
                  </div>
                </td>
                {/* Raza */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ ...S, height: 13, width: 80, borderRadius: 4 }} />
                </td>
                {/* Edad */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ ...S, height: 13, width: 50, borderRadius: 4 }} />
                </td>
                {/* Estado badge */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ ...S, height: 22, width: 80, borderRadius: 999 }} />
                </td>
                {/* Vacuna */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ ...S, height: 20, width: 20, borderRadius: '50%', margin: '0 auto' }} />
                </td>
                {/* Castrado */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ ...S, height: 20, width: 20, borderRadius: '50%', margin: '0 auto' }} />
                </td>
                {/* Acciones */}
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ ...S, height: 30, width: 60, borderRadius: 8 }} />
                    <div style={{ ...S, height: 30, width: 60, borderRadius: 8 }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
