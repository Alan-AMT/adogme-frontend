// modules/shared/components/dog/PersonalityTag.tsx
// Chip con emoji + texto. Colores por categoría.
// Usado en DogCard (máx 3) y DogProfile (todos)

export type PersonalityTagCategory = 'energy' | 'social' | 'behavior' | 'special'

export interface PersonalityTag {
  id:       string
  label:    string
  emoji:    string
  category: PersonalityTagCategory
}

interface PersonalityTagProps {
  tag:        PersonalityTag
  size?:      'sm' | 'md'
  selected?:  boolean
  onClick?:   () => void
}

// ─── Colores por categoría ────────────────────────────────────────────────────

const CAT_STYLES: Record<PersonalityTagCategory, {
  bg: string; border: string; text: string
  activeBg: string; activeBorder: string; activeText: string
}> = {
  energy: {
    bg: '#fff7ed', border: '#fed7aa', text: '#c2410c',
    activeBg: '#ea580c', activeBorder: '#c2410c', activeText: '#fff',
  },
  social: {
    bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d',
    activeBg: '#16a34a', activeBorder: '#15803d', activeText: '#fff',
  },
  behavior: {
    bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8',
    activeBg: '#2563eb', activeBorder: '#1d4ed8', activeText: '#fff',
  },
  special: {
    bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce',
    activeBg: '#9333ea', activeBorder: '#7e22ce', activeText: '#fff',
  },
}

// ─── Catálogo de tags predefinidos ────────────────────────────────────────────
// Úsalos en el dominio: dog.personalityTags: PersonalityTag[]

export const PERSONALITY_TAGS: PersonalityTag[] = [
  // Energy
  { id: 'energetico',    label: 'Energético',    emoji: '⚡', category: 'energy' },
  { id: 'tranquilo',     label: 'Tranquilo',     emoji: '😴', category: 'energy' },
  { id: 'jugueton',      label: 'Juguetón',      emoji: '🎾', category: 'energy' },
  { id: 'activo',        label: 'Activo',         emoji: '🏃', category: 'energy' },
  { id: 'relajado',      label: 'Relajado',       emoji: '🛋️', category: 'energy' },
  // Social
  { id: 'carinos',       label: 'Cariñoso',       emoji: '🥰', category: 'social' },
  { id: 'sociable',      label: 'Sociable',       emoji: '🐾', category: 'social' },
  { id: 'timido',        label: 'Tímido',         emoji: '🙈', category: 'social' },
  { id: 'leal',          label: 'Leal',           emoji: '❤️', category: 'social' },
  { id: 'independiente', label: 'Independiente',  emoji: '🦅', category: 'social' },
  // Behavior
  { id: 'obediente',     label: 'Obediente',      emoji: '✅', category: 'behavior' },
  { id: 'protector',     label: 'Protector',      emoji: '🛡️', category: 'behavior' },
  { id: 'curioso',       label: 'Curioso',        emoji: '🔍', category: 'behavior' },
  { id: 'terco',         label: 'Terco',          emoji: '😤', category: 'behavior' },
  { id: 'inteligente',   label: 'Inteligente',    emoji: '🧠', category: 'behavior' },
  // Special
  { id: 'senior',        label: 'Senior',         emoji: '👴', category: 'special' },
  { id: 'rescatado',     label: 'Rescatado',      emoji: '🏠', category: 'special' },
  { id: 'especial',      label: 'Necesidad esp.', emoji: '💙', category: 'special' },
  { id: 'cachorro',      label: 'Cachorro',       emoji: '🐶', category: 'special' },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function PersonalityTag({ tag, size = 'md', selected = false, onClick }: PersonalityTagProps) {
  const s = CAT_STYLES[tag.category]
  const isInteractive = !!onClick

  const style = {
    background:   selected ? s.activeBg  : s.bg,
    border:       `1.5px solid ${selected ? s.activeBorder : s.border}`,
    color:        selected ? s.activeText : s.text,
    cursor:       isInteractive ? 'pointer' : 'default',
    transition:   'all 150ms ease',
  }

  const className = [
    'inline-flex items-center gap-1 rounded-full font-[700] leading-none select-none',
    size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[12px]',
  ].join(' ')

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        <span aria-hidden="true">{tag.emoji}</span>
        {tag.label}
      </button>
    )
  }

  return (
    <span className={className} style={style}>
      <span aria-hidden="true">{tag.emoji}</span>
      {tag.label}
    </span>
  )
}
