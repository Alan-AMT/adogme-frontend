// modules/shelter/components/ShelterDashboardView.tsx
// Archivo 173 — Dashboard principal del portal del refugio.
// 4 StatsCards · LineChart · DonutChart · Tabla solicitudes · Tabla perros · FAB
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useEffect, useState }   from 'react'
import { StatsCard }             from '@/modules/shared/components/charts/StatsCard'
import { useShelterDashboard }   from '../application/hooks/useShelterDashboard'
import type { DashboardPeriod, ChartPoint } from '../application/hooks/useShelterDashboard'
import type { AdoptionRequestListItem }     from '@/modules/shared/domain/AdoptionRequest'
import type { DogListItem }                 from '@/modules/shared/domain/Dog'
import { shelterService }                  from '../infrastructure/ShelterServiceFactory'
import '../styles/shelterDashboard.css'

const CURRENT_SHELTER_ID = 1

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  in_review: 'En revisión',
  approved:  'Aprobada',
  rejected:  'Rechazada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  pending:   '#f59e0b',
  in_review: '#3b82f6',
  approved:  '#16a34a',
  rejected:  '#ef4444',
  cancelled: '#a1a1aa',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}

// ─── Selector de período ──────────────────────────────────────────────────────

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 'week',  label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'year',  label: 'Este año' },
]

function PeriodSelector({ value, onChange }: { value: DashboardPeriod; onChange: (p: DashboardPeriod) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.35rem' }}>
      {PERIOD_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '0.25rem 0.65rem', borderRadius: 999,
            fontSize: '0.72rem', fontWeight: 900, border: 'none', cursor: 'pointer',
            background: value === opt.value ? '#ff6b6b' : '#f4f4f5',
            color:      value === opt.value ? '#fff'    : '#71717a',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── LineChart (SVG puro) ─────────────────────────────────────────────────────

function LineChart({ data }: { data: ChartPoint[] }) {
  const W = 400; const H = 130
  const pad = { t: 16, r: 12, b: 28, l: 32 }
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  const max = Math.max(...data.map(d => d.value), 1)
  const n   = data.length - 1 || 1

  const pts = data.map((d, i) => ({
    x: pad.l + (i / n) * innerW,
    y: pad.t + (1 - d.value / max) * innerH,
  }))

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ')
  const area = [
    `M ${pts[0].x} ${pad.t + innerH}`,
    ...pts.map(p => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${pad.t + innerH}`,
    'Z',
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad.l} y1={pad.t + t * innerH} x2={pad.l + innerW} y2={pad.t + t * innerH}
          stroke="#f4f4f5" strokeWidth={1} />
      ))}
      <path d={area} fill="rgba(255,107,107,0.08)" />
      <polyline points={polyline} fill="none" stroke="#ff6b6b" strokeWidth={2}
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#ff6b6b" strokeWidth={2} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={pad.l + (i / n) * innerW} y={H - 4}
          textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="inherit" fontWeight={700}>
          {d.label}
        </text>
      ))}
      <text x={pad.l - 4} y={pad.t + 4} textAnchor="end" fontSize={9} fill="#a1a1aa" fontFamily="inherit">{max}</text>
      <text x={pad.l - 4} y={pad.t + innerH + 4} textAnchor="end" fontSize={9} fill="#a1a1aa" fontFamily="inherit">0</text>
    </svg>
  )
}

// ─── DonutChart (SVG puro) ────────────────────────────────────────────────────

interface DonutSlice { label: string; value: number; color: string }

function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const R = 44; const CX = 56; const CY = 56; const strokeW = 14
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1
  let angle = -90

  const arcs = slices.filter(s => s.value > 0).map(sl => {
    const deg = (sl.value / total) * 360
    const s   = angle
    const e   = angle + deg - 0.5
    angle    += deg
    const toRad = (d: number) => (d * Math.PI) / 180
    const x1 = CX + R * Math.cos(toRad(s)); const y1 = CY + R * Math.sin(toRad(s))
    const x2 = CX + R * Math.cos(toRad(e)); const y2 = CY + R * Math.sin(toRad(e))
    return { path: `M ${x1} ${y1} A ${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ${x2} ${y2}`, color: sl.color, sl }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <svg viewBox="0 0 112 112" style={{ width: 110, flexShrink: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f4f4f5" strokeWidth={strokeW} />
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth={strokeW} strokeLinecap="round" />
        ))}
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize={16} fontWeight={900} fill="#18181b" fontFamily="inherit">
          {total}
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize={8} fontWeight={700} fill="#a1a1aa" fontFamily="inherit">
          total
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
        {slices.filter(s => s.value > 0).map(sl => (
          <div key={sl.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: sl.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#52525b', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {sl.label}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#18181b', fontWeight: 900, marginLeft: 'auto' }}>
              {sl.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tabla de solicitudes recientes ──────────────────────────────────────────

function RecentRequestsTable({ requests }: { requests: AdoptionRequestListItem[] }) {
  if (requests.length === 0) {
    return (
      <div className="sd-empty">
        <span className="material-symbols-outlined" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>inbox</span>
        No hay solicitudes recientes
      </div>
    )
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sd-req-table">
        <thead>
          <tr><th>Perro</th><th>Adoptante</th><th>Fecha</th><th>Estado</th><th /></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>
                <div className="sd-req__dog">
                  {r.perroFoto && <Image src={r.perroFoto} alt={r.perroNombre ?? ''} width={32} height={32} className="sd-req__dog-img" />}
                  <span className="sd-req__dog-name">{r.perroNombre ?? '—'}</span>
                </div>
              </td>
              <td>{r.adoptanteNombre ?? '—'}</td>
              <td><span className="sd-date">{formatDate(r.fecha)}</span></td>
              <td>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999,
                  background: `${STATUS_COLORS[r.estado] ?? '#a1a1aa'}18`,
                  color: STATUS_COLORS[r.estado] ?? '#a1a1aa',
                }}>
                  {STATUS_LABELS[r.estado] ?? r.estado}
                </span>
              </td>
              <td>
                <Link href={`/refugio/solicitudes/${r.id}`}
                  style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b6b', textDecoration: 'none' }}>
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Tabla de perros recientes ────────────────────────────────────────────────

const DOG_STATUS_LABELS: Record<string, string> = {
  disponible:    'Disponible',
  en_proceso:    'En proceso',
  adoptado:      'Adoptado',
  no_disponible: 'No disponible',
}

function RecentDogsTable({ dogs }: { dogs: DogListItem[] }) {
  if (dogs.length === 0) {
    return (
      <div className="sd-empty">
        <span className="material-symbols-outlined" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>pets</span>
        No hay perros registrados
      </div>
    )
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sd-req-table">
        <thead>
          <tr><th>Perro</th><th>Raza</th><th>Estado</th><th /></tr>
        </thead>
        <tbody>
          {dogs.map(d => (
            <tr key={d.id}>
              <td>
                <div className="sd-req__dog">
                  {d.foto && <Image src={d.foto} alt={d.nombre} width={32} height={32} className="sd-req__dog-img" />}
                  <span className="sd-req__dog-name">{d.nombre}</span>
                </div>
              </td>
              <td style={{ fontSize: '0.78rem', color: '#71717a' }}>{d.raza}</td>
              <td>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999,
                  background: d.estado === 'disponible' ? '#dcfce7' : '#f4f4f5',
                  color:      d.estado === 'disponible' ? '#16a34a' : '#71717a',
                }}>
                  {DOG_STATUS_LABELS[d.estado] ?? d.estado}
                </span>
              </td>
              <td>
                <Link href={`/refugio/perros/${d.id}/editar`}
                  style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff6b6b', textDecoration: 'none' }}>
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <>
      <div className="sd-stats sd-stats--4">
        {[1,2,3,4].map(i => <div key={i} className="sd-skel-stat" />)}
      </div>
      <div className="sd-charts-row">
        <div className="sd-card" style={{ minHeight: 200 }} />
        <div className="sd-card" style={{ minHeight: 200 }} />
      </div>
      <div className="sd-tables-row">
        <div className="sd-card" style={{ padding: '0.75rem 0' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="sd-skel-row" />)}
        </div>
        <div className="sd-card" style={{ padding: '0.75rem 0' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="sd-skel-row" />)}
        </div>
      </div>
    </>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function ShelterDashboardView() {
  const { stats, requests, loading, error, period, setPeriod, chartData } = useShelterDashboard()

  const [recentDogs, setRecentDogs] = useState<DogListItem[]>([])
  useEffect(() => {
    shelterService.getShelterDogs(CURRENT_SHELTER_ID, { limit: 5 })
      .then(r => setRecentDogs(r.data))
      .catch(() => { /* silencioso */ })
  }, [])

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>error</span>
        {error}
      </div>
    )
  }

  if (loading || !stats) return <Skeleton />

  const donutSlices: DonutSlice[] = [
    { label: 'Pendientes',  value: stats.solicitudesPendientes, color: STATUS_COLORS.pending },
    { label: 'En revisión', value: stats.solicitudesEnRevision, color: STATUS_COLORS.in_review },
    { label: 'Completadas', value: Math.min(stats.adopcionesTotales, 8), color: STATUS_COLORS.approved },
  ]

  return (
    <>
      {/* Selector de período */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* 4 StatsCards */}
      <div className="sd-stats sd-stats--4">
        <StatsCard
          title="Perros activos"
          value={stats.perrosDisponibles + stats.perrosEnProceso}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>pets</span>}
          color="#ff6b6b"
          subtitle={`${stats.perrosDisponibles} disponibles · ${stats.perrosEnProceso} en proceso`}
        />
        <StatsCard
          title="Solicitudes pendientes"
          value={stats.solicitudesPendientes}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>schedule</span>}
          color="#f59e0b"
          subtitle={`${stats.solicitudesEnRevision} en revisión`}
        />
        <StatsCard
          title="Adopciones completadas"
          value={stats.adopcionesTotales}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>favorite</span>}
          color="#16a34a"
          trend={{ value: 12, direction: 'up' }}
        />
        <StatsCard
          title="Donaciones del período"
          value={formatMXN(stats.donacionesEstemes ?? 0)}
          icon={<span className="material-symbols-outlined" style={{ fontSize: 22 }}>volunteer_activism</span>}
          color="#8b5cf6"
        />
      </div>

      {/* Fila de charts */}
      <div className="sd-charts-row">
        <div className="sd-card">
          <div className="sd-card__header">
            <p className="sd-card__title">
              <span className="material-symbols-outlined">show_chart</span>
              Solicitudes recibidas
            </p>
          </div>
          <div style={{ padding: '1rem 1.25rem 0.75rem' }}>
            <LineChart data={chartData} />
          </div>
        </div>

        <div className="sd-card">
          <div className="sd-card__header">
            <p className="sd-card__title">
              <span className="material-symbols-outlined">donut_small</span>
              Distribución de estados
            </p>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <DonutChart slices={donutSlices} />
          </div>
        </div>
      </div>

      {/* Fila de tablas */}
      <div className="sd-tables-row">
        <div className="sd-card">
          <div className="sd-card__header">
            <p className="sd-card__title">
              <span className="material-symbols-outlined">assignment</span>
              Últimas solicitudes
            </p>
            <Link href="/refugio/solicitudes" className="sd-card__link">
              Ver todas <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <RecentRequestsTable requests={requests} />
        </div>

        <div className="sd-card">
          <div className="sd-card__header">
            <p className="sd-card__title">
              <span className="material-symbols-outlined">pets</span>
              Perros recientes
            </p>
            <Link href="/refugio/perros" className="sd-card__link">
              Ver todos <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <RecentDogsTable dogs={recentDogs} />
        </div>
      </div>

      {/* FAB — + Agregar perro */}
      <Link
        href="/refugio/perros/nuevo"
        style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.75rem 1.25rem', borderRadius: 999,
          background: '#ff6b6b', color: '#fff',
          fontWeight: 900, fontSize: '0.85rem', textDecoration: 'none',
          boxShadow: '0 6px 24px rgba(255,107,107,0.4)', zIndex: 50,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
        Agregar perro
      </Link>
    </>
  )
}
