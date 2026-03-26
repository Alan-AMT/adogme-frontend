// modules/shared/components/ui/RangeSlider.tsx
'use client'

interface Mark { value: number; label: string }

interface RangeSliderProps {
  min:         number
  max:         number
  step?:       number
  value:       number
  onChange:    (v: number) => void
  label?:      string
  showValue?:  boolean
  marks?:      Mark[]
}

export function RangeSlider({
  min, max, step = 1, value, onChange, label, showValue, marks,
}: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">

      {/* Header: label + valor actual */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label     && <span className="text-[13px] font-[800] text-[#1f2937]">{label}</span>}
          {showValue && <span className="text-sm font-[900] tabular-nums text-[var(--brand)]">{value}</span>}
        </div>
      )}

      {/* Track + thumb */}
      <div className="relative h-5 flex items-center">

        {/* Fondo del track */}
        <div className="w-full h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--brand)] rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Input nativo invisible — para interactividad */}
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Thumb visual */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                     bg-[var(--brand)] border-2 border-white
                     shadow-[0_2px_8px_rgba(255,107,107,0.45)]"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>

      {/* Marks */}
      {marks && marks.length > 0 && (
        <div className="flex justify-between">
          {marks.map(m => (
            <span key={m.value} className="text-[10px] text-[#a1a1aa] font-[600]">
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
