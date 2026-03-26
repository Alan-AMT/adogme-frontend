// modules/shared/components/dog/VaccinationCard.tsx
// Tabla de vacunas con el marco back.jpg igual que las demás cards
// Badge Completo/Incompleto, warnings para vacunas obligatorias, dates

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Vaccination {
  id:         string
  nombre:     string
  fecha?:     string    // ISO date string: '2024-03-15'
  dosis?:     string    // ej: 'Dosis 1/3', 'Refuerzo anual'
  vencimiento?: string  // ISO date string
  obligatoria?: boolean
}

interface VaccinationCardProps {
  vaccinations:    Vaccination[]
  dewormedDate?:   string
  sterilized:      boolean
  sterilizedDate?: string
}

// ─── Vacunas obligatorias que generan warning si faltan ──────────────────────

const REQUIRED_VACCINES = ['rabia', 'parvovirus']

function isRequired(nombre: string) {
  return REQUIRED_VACCINES.some(r => nombre.toLowerCase().includes(r))
}

// ─── Helpers de fecha ────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function isExpired(iso?: string) {
  if (!iso) return false
  return new Date(iso) < new Date()
}

function isExpiringSoon(iso?: string) {
  if (!iso) return false
  const diff = new Date(iso).getTime() - Date.now()
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000 // < 30 días
}

// ─── Row de cada vacuna ───────────────────────────────────────────────────────

function VaccineRow({ vac }: { vac: Vaccination }) {
  const hasDate   = !!vac.fecha
  const expired   = isExpired(vac.vencimiento)
  const nearExpiry = isExpiringSoon(vac.vencimiento)
  const req       = isRequired(vac.nombre)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 8,
        padding: '10px 12px',
        borderRadius: '0.65rem',
        background: hasDate ? '#fafffe' : (req ? '#fef2f2' : '#fafafa'),
        border: `1px solid ${hasDate ? '#dcfce7' : (req ? '#fecaca' : '#f0f0f0')}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Ícono check/warning */}
        <div
          style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hasDate ? 'rgba(34,197,94,0.1)' : (req ? 'rgba(239,68,68,0.08)' : '#f4f4f5'),
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 17,
              color: hasDate ? '#16a34a' : (req ? '#ef4444' : '#a1a1aa'),
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 17",
            }}
          >
            {hasDate ? 'check_circle' : (req ? 'warning' : 'radio_button_unchecked')}
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181b', margin: 0 }}>
              {vac.nombre}
            </p>
            {req && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 900, padding: '1px 6px', borderRadius: 999,
                background: 'rgba(239,68,68,0.08)', color: '#dc2626',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                Obligatoria
              </span>
            )}
          </div>

          {vac.dosis && (
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600, margin: '2px 0 0' }}>
              {vac.dosis}
            </p>
          )}

          {vac.fecha && (
            <p style={{ fontSize: '0.76rem', color: '#71717a', fontWeight: 500, margin: '2px 0 0' }}>
              Aplicada: {formatDate(vac.fecha)}
            </p>
          )}
        </div>
      </div>

      {/* Vencimiento */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        {vac.vencimiento && (
          <>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700,
              color: expired ? '#dc2626' : nearExpiry ? '#d97706' : '#71717a',
            }}>
              Vence:
            </span>
            <span style={{
              fontSize: '0.73rem', fontWeight: 800,
              color: expired ? '#dc2626' : nearExpiry ? '#d97706' : '#374151',
            }}>
              {formatDate(vac.vencimiento)}
            </span>
            {expired && (
              <span style={{
                fontSize: '0.64rem', fontWeight: 900, color: '#dc2626',
                padding: '1px 6px', borderRadius: 999, background: 'rgba(239,68,68,0.08)',
              }}>
                Vencida
              </span>
            )}
            {nearExpiry && !expired && (
              <span style={{
                fontSize: '0.64rem', fontWeight: 900, color: '#d97706',
                padding: '1px 6px', borderRadius: 999, background: 'rgba(234,179,8,0.1)',
              }}>
                Próximo vencimiento
              </span>
            )}
          </>
        )}
        {!vac.fecha && !vac.vencimiento && (
          <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>
            Pendiente
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VaccinationCard({
  vaccinations, dewormedDate, sterilized, sterilizedDate,
}: VaccinationCardProps) {

  // Calcular si el esquema está completo
  const missingRequired = REQUIRED_VACCINES.filter(req =>
    !vaccinations.some(v => v.nombre.toLowerCase().includes(req) && v.fecha)
  )
  const hasExpired = vaccinations.some(v => v.fecha && isExpired(v.vencimiento))
  const isComplete = missingRequired.length === 0 && !hasExpired

  return (
    <div
      style={{
        borderRadius: '1.25rem',
        padding: 10,
        backgroundImage: "url('/assets/ui/back.jpg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '180px auto',
        boxShadow: '0 6px 20px rgba(0,0,0,0.07)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: '1px solid #f4f4f5',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: '#fff5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 19, color: '#ff6b6b',
                  fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 19",
                }}
              >
                vaccines
              </span>
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#18181b', margin: 0, lineHeight: 1.2 }}>
                Historial de vacunación
              </p>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600, margin: 0 }}>
                {vaccinations.filter(v => v.fecha).length} de {vaccinations.length} aplicadas
              </p>
            </div>
          </div>

          {/* Badge completo/incompleto */}
          <span
            style={{
              padding: '5px 12px', borderRadius: 999,
              fontSize: '0.72rem', fontWeight: 900,
              background:  isComplete ? '#d1fae5' : '#fef2f2',
              color:       isComplete ? '#065f46' : '#b91c1c',
              border:      `1px solid ${isComplete ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {isComplete ? '✓ Completo' : '✗ Incompleto'}
          </span>
        </div>

        {/* ── Warning si faltan obligatorias ── */}
        {missingRequired.length > 0 && (
          <div
            style={{
              margin: '12px 14px 0',
              padding: '10px 12px',
              borderRadius: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: '#dc2626', flexShrink: 0, marginTop: 1 }}
            >
              warning
            </span>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b91c1c', margin: 0 }}>
              Faltan vacunas obligatorias:{' '}
              <strong>{missingRequired.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}</strong>
            </p>
          </div>
        )}

        {/* ── Lista de vacunas ── */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {vaccinations.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: '#a1a1aa', fontWeight: 600, textAlign: 'center', padding: '16px 0' }}>
              Sin registro de vacunas
            </p>
          ) : (
            vaccinations.map(vac => <VaccineRow key={vac.id} vac={vac} />)
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: '#f4f4f5', margin: '0 14px' }} />

        {/* ── Info adicional: desparasitación + esterilización ── */}
        <div
          style={{
            padding: '12px 14px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          {/* Desparasitación */}
          <div
            style={{
              padding: '10px 12px', borderRadius: '0.65rem',
              background: dewormedDate ? '#fafffe' : '#fafafa',
              border: `1px solid ${dewormedDate ? '#dcfce7' : '#f0f0f0'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 15, color: dewormedDate ? '#16a34a' : '#a1a1aa' }}
              >
                bug_report
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Desparasitado
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: dewormedDate ? '#16a34a' : '#a1a1aa', margin: 0 }}>
              {dewormedDate ? formatDate(dewormedDate) : 'Sin registro'}
            </p>
          </div>

          {/* Esterilización */}
          <div
            style={{
              padding: '10px 12px', borderRadius: '0.65rem',
              background: sterilized ? '#fafffe' : '#fafafa',
              border: `1px solid ${sterilized ? '#dcfce7' : '#f0f0f0'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 15,
                  color: sterilized ? '#16a34a' : '#a1a1aa',
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {sterilized ? 'check_circle' : 'cancel'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Esterilizado
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: sterilized ? '#16a34a' : '#71717a', margin: 0 }}>
              {sterilized ? (sterilizedDate ? formatDate(sterilizedDate) : 'Sí') : 'No'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
