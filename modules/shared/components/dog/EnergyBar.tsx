// modules/shared/components/dog/EnergyBar.tsx
// 5 segmentos horizontales. Rellenos en gradiente verde→rojo según level.

export type EnergyLevel = 1 | 2 | 3 | 4 | 5

interface EnergyBarProps {
  level:       EnergyLevel
  showLabel?:  boolean
  size?:       'sm' | 'md'
}

const LABELS: Record<EnergyLevel, string> = {
  1: 'Bajo',
  2: 'Moderado',
  3: 'Alto',
  4: 'Muy alto',
  5: 'Extremo',
}

// Colores por nivel — gradiente visual verde → rojo
const SEGMENT_COLORS: Record<EnergyLevel, string> = {
  1: '#22c55e',  // verde
  2: '#84cc16',  // lima
  3: '#eab308',  // amarillo
  4: '#f97316',  // naranja
  5: '#ef4444',  // rojo
}

export function EnergyBar({ level, showLabel = true, size = 'md' }: EnergyBarProps) {
  const color  = SEGMENT_COLORS[level]
  const label  = LABELS[level]
  const segH   = size === 'sm' ? 5 : 7
  const gap    = size === 'sm' ? 3 : 4

  return (
    <div className="flex flex-col gap-1.5">
      {/* Segmentos */}
      <div className="flex items-center" style={{ gap }}>
        {([1, 2, 3, 4, 5] as EnergyLevel[]).map(i => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-300"
            style={{
              height: segH,
              background: i <= level ? color : '#f4f4f5',
              opacity: i <= level ? (0.5 + (i / level) * 0.5) : 1,
            }}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-[800] uppercase tracking-[0.12em]"
            style={{ color }}
          >
            {label}
          </span>
          <span className="text-[11px] font-[600] text-[#a1a1aa]">
            {level}/5
          </span>
        </div>
      )}
    </div>
  )
}
