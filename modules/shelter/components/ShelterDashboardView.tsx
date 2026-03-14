// modules/shelter/components/ShelterDashboardView.tsx
// Dashboard principal del portal del refugio — diseño premium.
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useEffect, useState } from 'react'
import { useShelterDashboard } from '../application/hooks/useShelterDashboard'
import type { DashboardPeriod, ChartPoint } from '../application/hooks/useShelterDashboard'
import type { AdoptionRequestListItem } from '@/modules/shared/domain/AdoptionRequest'
import type { DogListItem }             from '@/modules/shared/domain/Dog'
import { shelterService }               from '../infrastructure/ShelterServiceFactory'
import '../styles/shelterDashboard.css'

const CURRENT_SHELTER_ID = 1

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  in_review: 'En revisión',
  approved:  'Aprobada',
  rejected:  'Rechazada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  in_review: { bg: '#dbeafe', text: '#1e3a8a', dot: '#3b82f6' },
  approved:  { bg: '#d1fae5', text: '#064e3b', dot: '#10b981' },
  rejected:  { bg: '#fee2e2', text: '#7f1d1d', dot: '#ef4444' },
  cancelled: { bg: '#f4f4f5', text: '#52525b', dot: '#a1a1aa' },
}

const DOG_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  disponible:    { label: 'Disponible',    bg: '#d1fae5', text: '#065f46' },
  en_proceso:    { label: 'En proceso',    bg: '#fef3c7', text: '#92400e' },
  adoptado:      { label: 'Adoptado',      bg: '#dbeafe', text: '#1e40af' },
  no_disponible: { label: 'No disponible', bg: '#f4f4f5', text: '#71717a' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}
function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}
function todayGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
function todayLabel() {
  return new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 'week',  label: 'Semana' },
  { value: 'month', label: 'Mes'    },
  { value: 'year',  label: 'Año'    },
]

function PeriodSelector({ value, onChange }: { value: DashboardPeriod; onChange: (p: DashboardPeriod) => void }) {
  return (
    <div className="sd2-period">
      {PERIOD_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`sd2-period__btn${value === opt.value ? ' sd2-period__btn--active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface KpiCardProps {
  label:  string
  value:  string | number
  sub?:   string
  icon:   string
  color:  string
  trend?: { value: number; up: boolean }
}

function KpiCard({ label, value, sub, icon, color, trend }: KpiCardProps) {
  return (
    <div className="sd2-kpi">
      <div className="sd2-kpi__top">
        <div className="sd2-kpi__icon" style={{ background: `${color}1a`, color }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        {trend && (
          <span className={`sd2-kpi__trend${trend.up ? ' sd2-kpi__trend--up' : ' sd2-kpi__trend--dn'}`}>
            <span className="material-symbols-outlined">{trend.up ? 'trending_up' : 'trending_down'}</span>
            {trend.value}%
          </span>
        )}
      </div>
      <p className="sd2-kpi__value">{value}</p>
      <p className="sd2-kpi__label">{label}</p>
      {sub && <p className="sd2-kpi__sub">{sub}</p>}
      <div className="sd2-kpi__bar-track">
        <div className="sd2-kpi__bar-fill" style={{ background: color }} />
      </div>
    </div>
  )
}

function LineChart({ data }: { data: ChartPoint[] }) {
  const W = 500; const H = 140
  const pad = { t: 12, r: 16, b: 28, l: 36 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const max = Math.max(...data.map(d => d.value), 1)
  const n   = data.length - 1 || 1

  const pts = data.map((d, i) => ({
    x: pad.l + (i / n) * iW,
    y: pad.t + (1 - d.value / max) * iH,
  }))

  let linePath = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3
    const cp2x = pts[i].x + (2 * (pts[i + 1].x - pts[i].x)) / 3
    linePath += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`
  }
  const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${pad.t + iH} L ${pts[0].x} ${pad.t + iH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff6b6b" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={pad.t + t * iH} x2={pad.l + iW} y2={pad.t + t * iH}
            stroke="#f0f0f0" strokeWidth={1} />
          <text x={pad.l - 6} y={pad.t + t * iH + 4} textAnchor="end"
            fontSize={9} fill="#c4c4c4" fontFamily="inherit">
            {Math.round(max * (1 - t))}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="url(#lg-area)" />
      <path d={linePath} fill="none" stroke="#ff6b6b" strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5}   fill="#fff" stroke="#ff6b6b" strokeWidth={2} />
          <circle cx={p.x} cy={p.y} r={2.5} fill="#ff6b6b" />
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={pad.l + (i / n) * iW} y={H - 4}
          textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="inherit" fontWeight={700}>
          {d.label}
        </text>
      ))}
    </svg>
  )
}

interface DonutSlice { label: string; value: number; color: string }

function DonutChart({ slices }: { slices: DonutSlice[] }) {
  const R = 44; const CX = 56; const CY = 56; const SW = 12
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1
  let angle = -90

  const arcs = slices.filter(s => s.value > 0).map(sl => {
    const deg = (sl.value / total) * 360
    const s = angle; const e = angle + deg - 0.8
    angle += deg
    const r = (d: number) => (d * Math.PI) / 180
    const x1 = CX + R * Math.cos(r(s)); const y1 = CY + R * Math.sin(r(s))
    const x2 = CX + R * Math.cos(r(e)); const y2 = CY + R * Math.sin(r(e))
    return { path: `M ${x1} ${y1} A ${R} ${R} 0 ${deg > 180 ? 1 : 0} 1 ${x2} ${y2}`, color: sl.color, sl }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <svg viewBox="0 0 112 112" style={{ width: 108, flexShrink: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f4f4f5" strokeWidth={SW} />
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth={SW} strokeLinecap="round" />
        ))}
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize={18} fontWeight={900} fill="#18181b" fontFamily="inherit">
          {total}
        </text>
        <text x={CX} y={CY + 11} textAnchor="middle" fontSize={9} fontWeight={700} fill="#a1a1aa" fontFamily="inherit">
          total
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {slices.filter(s => s.value > 0).map(sl => (
          <div key={sl.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: sl.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 600 }}>{sl.label}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#18181b', marginLeft: 'auto', paddingLeft: '1rem' }}>
              {sl.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentRequestsTable({ requests }: { requests: AdoptionRequestListItem[] }) {
  if (requests.length === 0) {
    return (
      <div className="sd2-empty">
        <span className="material-symbols-outlined">inbox</span>
        No hay solicitudes recientes
      </div>
    )
  }
  return (
    <div className="sd2-list">
      {requests.map(r => {
        const sc = STATUS_COLORS[r.estado] ?? STATUS_COLORS.cancelled
        return (
          <div key={r.id} className="sd2-list__row">
            <div className="sd2-list__dog">
              {r.perroFoto
                ? <Image src={r.perroFoto} alt={r.perroNombre ?? ''} width={38} height={38} className="sd2-list__img" />
                : <div className="sd2-list__img sd2-list__img--ph"><span className="material-symbols-outlined">pets</span></div>
              }
              <div>
                <p className="sd2-list__name">{r.perroNombre ?? '—'}</p>
                <p className="sd2-list__sub">{r.adoptanteNombre ?? '—'}</p>
              </div>
            </div>
            <div className="sd2-list__meta">
              <span className="sd2-date">{formatDate(r.fecha)}</span>
              <span className="sd2-badge" style={{ background: sc.bg, color: sc.text }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                {STATUS_LABELS[r.estado] ?? r.estado}
              </span>
              <Link href={`/refugio/solicitudes/${r.id}`} className="sd2-link">
                Ver <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RecentDogsTable({ dogs }: { dogs: DogListItem[] }) {
  if (dogs.length === 0) {
    return (
      <div className="sd2-empty">
        <span className="material-symbols-outlined">pets</span>
        No hay perros registrados
      </div>
    )
  }
  return (
    <div className="sd2-list">
      {dogs.map(d => {
        const ds = DOG_STATUS[d.estado] ?? DOG_STATUS.no_disponible
        return (
          <div key={d.id} className="sd2-list__row">
            <div className="sd2-list__dog">
              {d.foto
                ? <Image src={d.foto} alt={d.nombre} width={38} height={38} className="sd2-list__img" />
                : <div className="sd2-list__img sd2-list__img--ph"><span className="material-symbols-outlined">pets</span></div>
              }
              <div>
                <p className="sd2-list__name">{d.nombre}</p>
                <p className="sd2-list__sub">{d.raza}</p>
              </div>
            </div>
            <div className="sd2-list__meta">
              <span className="sd2-badge" style={{ background: ds.bg, color: ds.text }}>{ds.label}</span>
              <Link href={`/refugio/perros/${d.id}/editar`} className="sd2-link">
                Editar <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Skeleton() {
  return (
    <>
      <div className="sd2-kpi-grid">
        {[1,2,3,4].map(i => <div key={i} className="sd2-skel" style={{ height: 130 }} />)}
      </div>
      <div className="sd2-charts-row">
        <div className="sd2-skel" style={{ height: 220 }} />
        <div className="sd2-skel" style={{ height: 220 }} />
      </div>
      <div className="sd2-tables-row">
        <div className="sd2-skel" style={{ height: 280 }} />
        <div className="sd2-skel" style={{ height: 280 }} />
      </div>
    </>
  )
}

export default function ShelterDashboardView() {
  const { stats, requests, loading, error, period, setPeriod, chartData } = useShelterDashboard()
  const [recentDogs, setRecentDogs] = useState<DogListItem[]>([])

  useEffect(() => {
    shelterService.getShelterDogs(CURRENT_SHELTER_ID, { limit: 5 })
      .then(r => setRecentDogs(r.data))
      .catch(() => {})
  }, [])

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>error</span>
        {error}
      </div>
    )
  }

  if (loading || !stats) return <Skeleton />

  const donutSlices: DonutSlice[] = [
    { label: 'Pendientes',  value: stats.solicitudesPendientes,          color: '#f59e0b' },
    { label: 'En revisión', value: stats.solicitudesEnRevision,          color: '#3b82f6' },
    { label: 'Completadas', value: Math.min(stats.adopcionesTotales, 8), color: '#10b981' },
  ]

  return (
    <>
      {/* Hero */}
      <div className="sd2-hero">
        <div className="sd2-hero__left">
          <p className="sd2-hero__greeting">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#fbbf24', fontSize: 20 }}>
              wb_sunny
            </span>
            {todayGreeting()}, <strong>Huellitas MX</strong>
          </p>
          <p className="sd2-hero__date">{todayLabel()}</p>
          <p className="sd2-hero__summary">
            Tienes{' '}
            <strong>{stats.solicitudesPendientes} solicitud{stats.solicitudesPendientes !== 1 ? 'es' : ''} pendiente{stats.solicitudesPendientes !== 1 ? 's' : ''}</strong>
            {' '}por revisar · <strong>{stats.perrosDisponibles} perro{stats.perrosDisponibles !== 1 ? 's' : ''}</strong> disponible{stats.perrosDisponibles !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="sd2-hero__actions">
          <Link href="/refugio/perros/nuevo" className="sd2-hero__cta">
            <span className="material-symbols-outlined">add</span>
            Agregar perro
          </Link>
          <Link href="/refugio/solicitudes" className="sd2-hero__cta sd2-hero__cta--ghost">
            <span className="material-symbols-outlined">assignment</span>
            Ver solicitudes
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="sd2-kpi-grid">
        <KpiCard label="Perros activos"         value={stats.perrosDisponibles + stats.perrosEnProceso} sub={`${stats.perrosDisponibles} disponibles · ${stats.perrosEnProceso} en proceso`} icon="pets"               color="#ff6b6b" />
        <KpiCard label="Solicitudes pendientes" value={stats.solicitudesPendientes}                     sub={`${stats.solicitudesEnRevision} en revisión`}                                 icon="pending_actions"    color="#f59e0b" />
        <KpiCard label="Adopciones completadas" value={stats.adopcionesTotales}                                                                                                           icon="favorite"           color="#10b981" trend={{ value: 12, up: true }} />
        <KpiCard label="Donaciones del período" value={formatMXN(stats.donacionesEstemes ?? 0)}                                                                                           icon="volunteer_activism" color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="sd2-charts-row">
        <div className="sd2-card">
          <div className="sd2-card__head">
            <div>
              <p className="sd2-card__title">Solicitudes recibidas</p>
              <p className="sd2-card__desc">Evolución en el período seleccionado</p>
            </div>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <div style={{ padding: '0.25rem 1.25rem 1rem' }}>
            <LineChart data={chartData} />
          </div>
        </div>
        <div className="sd2-card">
          <div className="sd2-card__head">
            <div>
              <p className="sd2-card__title">Distribución de estados</p>
              <p className="sd2-card__desc">Resumen de solicitudes activas</p>
            </div>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <DonutChart slices={donutSlices} />
          </div>
          <div className="sd2-mini-stats">
            <div className="sd2-mini-stat">
              <p className="sd2-mini-stat__val">{stats.perrosTotales}</p>
              <p className="sd2-mini-stat__lbl">Total perros</p>
            </div>
            <div className="sd2-mini-stat">
              <p className="sd2-mini-stat__val">{stats.adopcionesTotales}</p>
              <p className="sd2-mini-stat__lbl">Adoptados</p>
            </div>
            <div className="sd2-mini-stat">
              <p className="sd2-mini-stat__val">{stats.perrosDisponibles}</p>
              <p className="sd2-mini-stat__lbl">Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="sd2-tables-row">
        <div className="sd2-card">
          <div className="sd2-card__head">
            <div>
              <p className="sd2-card__title">Últimas solicitudes</p>
              <p className="sd2-card__desc">Las {requests.length} más recientes</p>
            </div>
            <Link href="/refugio/solicitudes" className="sd2-card__more">
              Ver todas <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <RecentRequestsTable requests={requests} />
        </div>
        <div className="sd2-card">
          <div className="sd2-card__head">
            <div>
              <p className="sd2-card__title">Mis perros</p>
              <p className="sd2-card__desc">Registrados recientemente</p>
            </div>
            <Link href="/refugio/perros" className="sd2-card__more">
              Ver todos <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <RecentDogsTable dogs={recentDogs} />
        </div>
      </div>
    </>
  )
}
