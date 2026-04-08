// modules/shared/components/charts/LineChart.tsx
// 'use client' — Recharts.
// Props: data: {date: string; value: number}[], label: string, color?, height?
'use client'

import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

interface TooltipEntry {
  name?:    string
  value?:   number
  color?:   string
}

interface CustomTooltipProps {
  active?:  boolean
  payload?: TooltipEntry[]
  label?:   string
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface LineChartDataPoint {
  date:  string   // etiqueta del eje X, ej: 'Ene', '12 Feb', etc.
  value: number
}

export interface LineChartProps {
  data:    LineChartDataPoint[]
  label:   string
  color?:  string
  height?: number
}

// ─── Tooltip personalizado ────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label: xLabel }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0]

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #f0f0f0',
      borderRadius: '0.85rem',
      padding: '8px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      minWidth: 110,
    }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a1a1aa', margin: '0 0 3px' }}>
        {xLabel}
      </p>
      <p style={{ fontSize: '1rem', fontWeight: 900, color: '#18181b', margin: 0 }}>
        {point.value?.toLocaleString('es-MX')}
      </p>
      <p style={{ fontSize: '0.73rem', fontWeight: 700, color: point.color, margin: '1px 0 0' }}>
        {point.name}
      </p>
    </div>
  )
}

// ─── Dot personalizado ────────────────────────────────────────────────────────

function CustomDot(props: {
  cx?: number; cy?: number; stroke?: string; fill?: string
  r?: number | string; index?: number; dataLength?: number
  [key: string]: unknown
}) {
  const { cx, cy, stroke, index, dataLength } = props
  // Solo mostrar dot en el último punto
  if (index !== (dataLength ?? 0) - 1) return null
  return (
    <circle cx={cx} cy={cy} r={5} fill={stroke} stroke="#fff" strokeWidth={2} />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LineChart({
  data,
  label,
  color  = '#ff6b6b',
  height = 220,
}: LineChartProps) {

  if (!data || data.length === 0) {
    return (
      <div style={{
        height, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fafafa', borderRadius: '1rem',
        border: '1.5px dashed #f0f0f0',
      }}>
        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: 600 }}>
          Sin datos
        </p>
      </div>
    )
  }

  // Padding para que el gradiente no quede cortado
  const gradientId = `line-gradient-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1.2rem',
      border: '1.5px solid #f0f0f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      padding: '16px 8px 8px 0',
    }}>
      {/* Título */}
      <p style={{
        fontSize: '0.82rem', fontWeight: 900, color: '#52525b',
        margin: '0 0 12px 20px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          display: 'inline-block', width: 10, height: 10,
          borderRadius: '50%', background: color, flexShrink: 0,
        }} />
        {label}
      </p>

      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={data} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.12} />
              <stop offset="95%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f4f4f5"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fontWeight: 700, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />

          <YAxis
            tick={{ fontSize: 11, fontWeight: 700, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={v => v.toLocaleString('es-MX')}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />

          {/* Área de relleno */}
          <defs>
            <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <Line
            type="monotone"
            dataKey="value"
            name={label}
            stroke={color}
            strokeWidth={2.5}
            dot={(props) => (
              <CustomDot
                key={`dot-${props.index}`}
                {...props}
                dataLength={data.length}
              />
            )}
            activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
