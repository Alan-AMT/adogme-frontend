// modules/shared/components/charts/StatsCard.tsx
// Card con número grande, icono de color, flecha de tendencia (verde arriba, rojo abajo).
// Props: title, value, trend?, icon, color?, subtitle?

import type { ReactNode } from 'react'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StatsTrend {
  value:     number           // porcentaje absoluto, ej: 12.5
  direction: 'up' | 'down'
}

export interface StatsCardProps {
  title:     string
  value:     string | number
  icon:      ReactNode
  trend?:    StatsTrend
  subtitle?: string
  /** Color del icono y acento. Default: '#ff6b6b' */
  color?:    string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = '#ff6b6b',
}: StatsCardProps) {
  const isUp   = trend?.direction === 'up'
  const trendColor = isUp ? '#16a34a' : '#dc2626'

  // Color de fondo suave derivado del color del icono (10% opacidad)
  const iconBg = `${color}18`

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '1.2rem',
        border: '1.5px solid #f0f0f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow   = `0 8px 28px rgba(0,0,0,0.08)`
        el.style.borderColor = '#e5e7eb'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow   = '0 2px 12px rgba(0,0,0,0.05)'
        el.style.borderColor = '#f0f0f0'
      }}
    >
      {/* Decoración circular de fondo */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 90, height: 90, borderRadius: '50%',
        background: iconBg,
        pointerEvents: 'none',
      }} />

      {/* ── Fila superior: icono + tendencia ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        {/* Icono */}
        <div style={{
          width: 42, height: 42, borderRadius: '0.85rem',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          color,
        }}>
          {icon}
        </div>

        {/* Tendencia */}
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '4px 9px', borderRadius: 999,
            background: isUp ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
            border: `1px solid ${isUp ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.18)'}`,
          }}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 15,
                color: trendColor,
                fontVariationSettings: "'FILL' 1,'wght' 600",
              }}
            >
              {isUp ? 'trending_up' : 'trending_down'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: trendColor }}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </div>

      {/* ── Valor principal ── */}
      <div>
        <p style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: 900,
          color: '#18181b',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {value}
        </p>

        {/* Título */}
        <p style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#71717a',
          margin: '4px 0 0',
          lineHeight: 1.3,
        }}>
          {title}
        </p>

        {/* Subtítulo opcional */}
        {subtitle && (
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#a1a1aa',
            margin: '2px 0 0',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Línea de color en el borde inferior */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: `linear-gradient(90deg, ${color}, ${color}40)`,
        borderRadius: '0 0 1.2rem 1.2rem',
      }} />
    </div>
  )
}
