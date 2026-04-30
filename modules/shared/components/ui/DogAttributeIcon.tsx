// modules/shared/components/ui/DogAttributeIcon.tsx
// Iconos de atributos del perro usando Material Symbols
// Estilo: outlined, color brand (#FA5252), tamaño configurable
//
// Uso:
//   <DogAttributeIcon type="edad"   />   → cake (pastel)
//   <DogAttributeIcon type="tamano" />   → straighten (regla)
//   <DogAttributeIcon type="energia"/>   → bolt (rayo)
//   <DogAttributeIcon type="salud"  />   → medical_bag (maletín médico)
//
// Requiere Material Symbols en el layout:
//   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

import type { CSSProperties } from 'react'

// ─── Mapa de iconos ───────────────────────────────────────────────────────────

export type DogAttributeType =
  | 'edad'
  | 'tamano'
  | 'energia'
  | 'salud'
  | 'sexo'
  | 'castrado'
  | 'vacunado'
  | 'desparasitado'
  | 'vacunas'
  | 'ninos'
  | 'perros'
  | 'gatos'
  | 'jardin'
  | 'peso'

const ICON_MAP: Record<DogAttributeType, string> = {
  edad:     'cake',
  tamano:   'straighten',
  energia:  'bolt',
  salud:    'medical_bag',
  sexo:     'gender_male',        // se sobreescribe dinámicamente si es hembra
  castrado:      'cut',
  vacunado:      'vaccines',
  desparasitado: 'bug_report',
  vacunas:       'syringe',
  ninos:    'child_care',
  perros:   'pets',
  gatos:    'cruelty_free',
  jardin:   'yard',
  peso:     'scale',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DogAttributeIconProps {
  type: DogAttributeType
  /** Tamaño en px. Default: 20 */
  size?: number
  /** Color. Default: var(--brand) = #FA5252 */
  color?: string
  /** Filled vs outlined. Default: false (outlined) */
  filled?: boolean
  /** Grosor (100–700). Default: 300 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /** Clase CSS adicional */
  className?: string
  /** Nombre personalizado del icono (sobreescribe el mapa) */
  iconName?: string
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DogAttributeIcon({
  type,
  size = 20,
  color = 'var(--brand)',
  filled = false,
  weight = 300,
  className = '',
  iconName,
}: DogAttributeIconProps) {
  const name = iconName ?? ICON_MAP[type]

  const style: CSSProperties = {
    fontSize: size,
    color,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
    lineHeight: 1,
    userSelect: 'none',
    flexShrink: 0,
  }

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

// ─── Variante con label (como en la imagen de referencia) ─────────────────────
// Muestra icono + texto en columna, estilo ficha del perro

interface DogAttributeBadgeProps {
  type: DogAttributeType
  label: string
  value: string
  iconName?: string
}

export function DogAttributeBadge({ type, label, value, iconName }: DogAttributeBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <DogAttributeIcon type={type} size={20} iconName={iconName} />
      <div className="flex flex-col leading-tight">
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'var(--fg)', fontWeight: 500 }}>
          {value}
        </span>
      </div>
    </div>
  )
}

// ─── Grupo de 4 atributos principales (Edad, Tamaño, Energía, Salud) ─────────
// Listo para usar directo en DogCard o DogDetail

interface DogAttributesGroupProps {
  edad: string      // ej: "2 años"
  tamano: string    // ej: "Mediano"
  energia: string   // ej: "Alta"
  salud: string     // ej: "Vacunado"
}

export function DogAttributesGroup({ edad, tamano, energia, salud }: DogAttributesGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <DogAttributeBadge type="edad"    label="Edad"    value={edad}    />
      <DogAttributeBadge type="tamano"  label="Tamaño"  value={tamano}  />
      <DogAttributeBadge type="energia" label="Energía" value={energia} />
      <DogAttributeBadge type="salud"   label="Salud"   value={salud}   />
    </div>
  )
}

// ─── Mapa de nombres legibles para cada tipo ──────────────────────────────────
// Útil para renderizar labels dinámicamente

export const DOG_ATTRIBUTE_LABELS: Record<DogAttributeType, string> = {
  edad:     'Edad',
  tamano:   'Tamaño',
  energia:  'Energía',
  salud:    'Salud',
  sexo:     'Sexo',
  castrado:      'Castrado',
  vacunado:      'Vacunado',
  desparasitado: 'Desparasitado',
  vacunas:       'Vacunas',
  ninos:    'Con niños',
  perros:   'Con perros',
  gatos:    'Con gatos',
  jardin:   'Jardín',
  peso:     'Peso',
}
