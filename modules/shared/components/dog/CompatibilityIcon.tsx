// modules/shared/components/dog/CompatibilityIcon.tsx
// Icono del sujeto + fondo de color según respuesta.

export type CompatibilityAnswer = 'yes' | 'maybe' | 'no'
export type CompatibilitySubject = 'kids' | 'cats' | 'dogs'

interface CompatibilityIconProps {
  answer:     CompatibilityAnswer
  subject:    CompatibilitySubject
  showLabel?: boolean
  size?:      'sm' | 'md' | 'lg'
}

// ─── Configuración visual ─────────────────────────────────────────────────────

const ANSWER_STYLES: Record<CompatibilityAnswer, {
  bg: string; iconColor: string; label: string; dotColor: string
}> = {
  yes:   { bg: '#f0fdf4', iconColor: '#16a34a', label: 'Sí',   dotColor: '#22c55e' },
  maybe: { bg: '#fefce8', iconColor: '#a16207', label: 'Tal vez', dotColor: '#eab308' },
  no:    { bg: '#fef2f2', iconColor: '#dc2626', label: 'No',   dotColor: '#ef4444' },
}

const SUBJECT_CONFIG: Record<CompatibilitySubject, { icon: string; label: string }> = {
  kids: { icon: 'child_care',   label: 'Niños' },
  cats: { icon: 'cruelty_free', label: 'Gatos' },
  dogs: { icon: 'pets',         label: 'Perros' },
}

const SIZE_PX: Record<NonNullable<CompatibilityIconProps['size']>, { box: number; icon: number; text: string }> = {
  sm: { box: 32, icon: 16, text: 'text-[10px]' },
  md: { box: 40, icon: 20, text: 'text-[11px]' },
  lg: { box: 48, icon: 24, text: 'text-[12px]' },
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function CompatibilityIcon({
  answer, subject, showLabel = true, size = 'md',
}: CompatibilityIconProps) {
  const a   = ANSWER_STYLES[answer]
  const s   = SUBJECT_CONFIG[subject]
  const sz  = SIZE_PX[size]

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Caja con icono */}
      <div
        className="relative flex items-center justify-center rounded-[10px] flex-shrink-0"
        style={{ width: sz.box, height: sz.box, background: a.bg }}
        title={`${s.label}: ${a.label}`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: sz.icon,
            color: a.iconColor,
            fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20",
          }}
          aria-hidden="true"
        >
          {s.icon}
        </span>

        {/* Dot indicador — esquina inferior derecha */}
        <span
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
          style={{ background: a.dotColor }}
          aria-hidden="true"
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`${sz.text} font-[700] text-[#71717a] text-center leading-tight`}>
          {s.label}
        </span>
      )}
    </div>
  )
}

// ─── Grupo de 3 compatibilidades ──────────────────────────────────────────────

interface CompatibilityGroupProps {
  kids:  CompatibilityAnswer
  cats:  CompatibilityAnswer
  dogs:  CompatibilityAnswer
  size?: CompatibilityIconProps['size']
  showLabels?: boolean
}

export function CompatibilityGroup({ kids, cats, dogs, size = 'md', showLabels = true }: CompatibilityGroupProps) {
  return (
    <div className="flex items-center gap-2">
      <CompatibilityIcon subject="kids" answer={kids} size={size} showLabel={showLabels} />
      <CompatibilityIcon subject="cats" answer={cats} size={size} showLabel={showLabels} />
      <CompatibilityIcon subject="dogs" answer={dogs} size={size} showLabel={showLabels} />
    </div>
  )
}
