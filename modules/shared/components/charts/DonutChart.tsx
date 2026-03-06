// modules/shared/components/charts/DonutChart.tsx
// 'use client' — Recharts.
// Props: data: {name: string; value: number; color: string}[], size?, showLegend?
'use client'

import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DonutDataPoint {
  name:  string
  value: number
  color: string
}

export interface DonutChartProps {
  data:         DonutDataPoint[]
  size?:        number
  showLegend?:  boolean
}

// ─── Tooltip personalizado ────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0]

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #f0f0f0',
      borderRadius: '0.85rem',
      padding: '8px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      minWidth: 120,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%',
          background: d.payload?.color ?? d.color,
          display: 'inline-block', flexShrink: 0,
        }} />
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#71717a', margin: 0 }}>
          {d.name}
        </p>
      </div>
      <p style={{ fontSize: '1.05rem', fontWeight: 900, color: '#18181b', margin: '3px 0 0' }}>
        {d.value?.toLocaleString('es-MX')}
      </p>
    </div>
  )
}

// ─── Label central (porcentaje del slice activo) ──────────────────────────────

function CenterLabel({
  cx, cy, activeIndex, data,
}: {
  cx: number; cy: number; activeIndex: number | null; data: DonutDataPoint[]
}) {
  const total   = data.reduce((s, d) => s + d.value, 0)
  const current = activeIndex !== null ? data[activeIndex] : null
  const pct     = current ? Math.round((current.value / total) * 100) : null

  return (
    <g>
      {current ? (
        <>
          <text
            x={cx} y={cy - 8}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '1.4rem', fontWeight: 900, fill: '#18181b' }}
          >
            {pct}%
          </text>
          <text
            x={cx} y={cy + 14}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '0.68rem', fontWeight: 700, fill: '#a1a1aa' }}
          >
            {current.name}
          </text>
        </>
      ) : (
        <>
          <text
            x={cx} y={cy - 6}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '1.5rem', fontWeight: 900, fill: '#18181b' }}
          >
            {total.toLocaleString('es-MX')}
          </text>
          <text
            x={cx} y={cy + 14}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '0.68rem', fontWeight: 700, fill: '#a1a1aa' }}
          >
            total
          </text>
        </>
      )}
    </g>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DonutChart({
  data,
  size        = 220,
  showLegend  = true,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const total = data.reduce((s, d) => s + d.value, 0)

  if (!data || data.length === 0) {
    return (
      <div style={{
        height: size, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fafafa', borderRadius: '1rem',
        border: '1.5px dashed #f0f0f0',
      }}>
        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 600 }}>Sin datos</p>
      </div>
    )
  }

  const innerRadius = Math.round(size * 0.28)
  const outerRadius = Math.round(size * 0.42)

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1.2rem',
      border: '1.5px solid #f0f0f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      padding: 16,
      display: 'flex',
      flexDirection: showLegend ? 'column' : 'row',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Gráfica */}
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  style={{ cursor: 'pointer', transition: 'opacity 150ms ease' }}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      {showLegend && (
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {data.map((d, i) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
            const isActive = activeIndex === i

            return (
              <div
                key={d.name}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px',
                  borderRadius: '0.65rem',
                  background: isActive ? '#fafafa' : 'transparent',
                  border: `1px solid ${isActive ? '#f0f0f0' : 'transparent'}`,
                  cursor: 'default',
                  transition: 'background 150ms ease, border-color 150ms ease',
                }}
              >
                {/* Dot de color */}
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: d.color, flexShrink: 0,
                }} />

                {/* Nombre */}
                <span style={{
                  flex: 1, fontSize: '0.8rem', fontWeight: 700,
                  color: isActive ? '#18181b' : '#52525b',
                  transition: 'color 150ms ease',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {d.name}
                </span>

                {/* Valor */}
                <span style={{
                  fontSize: '0.82rem', fontWeight: 900, color: '#18181b', flexShrink: 0,
                }}>
                  {d.value.toLocaleString('es-MX')}
                </span>

                {/* Porcentaje badge */}
                <span style={{
                  fontSize: '0.7rem', fontWeight: 900,
                  padding: '2px 7px', borderRadius: 999,
                  background: `${d.color}18`,
                  color: d.color,
                  flexShrink: 0,
                  minWidth: 36, textAlign: 'center',
                }}>
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
