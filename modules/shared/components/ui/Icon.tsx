// modules/shared/components/ui/Icon.tsx
// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE GLOBAL DE ICONOS — Material Symbols Outlined (Google)
// ─────────────────────────────────────────────────────────────────────────────
//
// USO BÁSICO:
//   import { Icon } from '@/modules/shared/components/ui/Icon'
//
//   <Icon name="bolt" />
//   <Icon name="bolt" size={24} color="var(--brand)" filled />
//   <Icon name="pets" size={32} weight={200} />
//
// BUSCAR ICONOS:
//   → https://fonts.google.com/icons  (filtrar por "Outlined")
//   El `name` es exactamente el nombre que aparece ahí, en snake_case.
//   Ejemplos: "home", "search", "bolt", "medical_bag", "cake", "straighten"
//
// REQUISITO (ya está en app/layout.tsx):
//   <link rel="stylesheet"
//     href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
//   />
// ─────────────────────────────────────────────────────────────────────────────

import type { CSSProperties } from 'react'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface IconProps {
  /** Nombre del icono en snake_case — buscar en fonts.google.com/icons */
  name: string
  /** Tamaño en px. Default: 20 */
  size?: number
  /** Color CSS. Default: 'currentColor' (hereda del padre) */
  color?: string
  /** Relleno sólido vs contorno. Default: false (outlined) */
  filled?: boolean
  /** Grosor del trazo (100–700). Default: 300 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  /** Clase adicional para spacing u overrides */
  className?: string
  /** aria-label para accesibilidad cuando el icono tiene significado propio */
  label?: string
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  filled = false,
  weight = 300,
  className = '',
  label,
}: IconProps) {
  const style: CSSProperties = {
    fontSize: size,
    lineHeight: 1,
    color,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
    userSelect: 'none',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
  }

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      aria-hidden={label ? undefined : 'true'}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  )
}

// ─── Variantes predefinidas ───────────────────────────────────────────────────
// Shortcuts para los casos más comunes del proyecto.
// No hay que recordar el name — ya está encapsulado.

type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<SizeVariant, number> = {
  xs: 14,
  sm: 16,
  md: 20,   // default
  lg: 24,
  xl: 32,
}

interface IconVariantProps {
  size?: SizeVariant | number
  color?: string
  filled?: boolean
  className?: string
}

function makeIcon(name: string) {
  return function NamedIcon({ size = 'md', color, filled, className }: IconVariantProps) {
    const px = typeof size === 'number' ? size : SIZE_MAP[size]
    return <Icon name={name} size={px} color={color} filled={filled} className={className} />
  }
}

// ── Atributos del perro (los 4 principales) ───────────────────────────────────
export const IconEdad     = makeIcon('cake')          // 🎂 Edad
export const IconTamano   = makeIcon('straighten')    // 📏 Tamaño
export const IconEnergia  = makeIcon('bolt')          // ⚡ Energía
export const IconSalud    = makeIcon('medical_bag')   // 🩺 Salud

// ── Atributos adicionales del perro ──────────────────────────────────────────
export const IconSexo      = makeIcon('transgender')   // ⚧ Sexo
export const IconCastrado  = makeIcon('cut')           // ✂ Castrado
export const IconMicrochip = makeIcon('memory_chip')   // 💾 Microchip
export const IconVacunas   = makeIcon('syringe')       // 💉 Vacunas
export const IconPeso      = makeIcon('scale')         // ⚖ Peso

// ── Compatibilidad / convivencia ──────────────────────────────────────────────
export const IconNinos   = makeIcon('child_care')      // 👶 Niños
export const IconPerros  = makeIcon('pets')            // 🐾 Otros perros
export const IconGatos   = makeIcon('cruelty_free')    // 🐱 Gatos
export const IconJardin  = makeIcon('yard')            // 🌿 Jardín

// ── Personalidad / tags ───────────────────────────────────────────────────────
export const IconJugueton      = makeIcon('sports_tennis')
export const IconTranquilo     = makeIcon('self_care')
export const IconProtector     = makeIcon('security')
export const IconCurioso       = makeIcon('search')
export const IconLeal          = makeIcon('favorite')
export const IconEnergicoTag   = makeIcon('bolt')
export const IconRelajado      = makeIcon('weekend')
export const IconSociable      = makeIcon('pets')
export const IconTimido        = makeIcon('hide')
export const IconIndependiente = makeIcon('flight')
export const IconObediente     = makeIcon('check_circle')
export const IconTerco         = makeIcon('sentiment_neutral')
export const IconCarinoso      = makeIcon('volunteer_activism')
export const IconActivo        = makeIcon('directions_run')
export const IconCazador       = makeIcon('track_changes')

// ── Navegación ────────────────────────────────────────────────────────────────
export const IconHome       = makeIcon('home')
export const IconSearch     = makeIcon('search')
export const IconBack       = makeIcon('arrow_back')
export const IconClose      = makeIcon('close')
export const IconMenu       = makeIcon('menu')
export const IconChevronDown= makeIcon('keyboard_arrow_down')
export const IconChevronRight= makeIcon('chevron_right')
export const IconFilter     = makeIcon('tune')
export const IconSort       = makeIcon('sort')

// ── Acciones ──────────────────────────────────────────────────────────────────
export const IconHeart      = makeIcon('favorite')
export const IconHeartAdd   = makeIcon('favorite_border')
export const IconShare      = makeIcon('share')
export const IconEdit       = makeIcon('edit')
export const IconDelete     = makeIcon('delete')
export const IconSave       = makeIcon('save')
export const IconSend       = makeIcon('send')
export const IconUpload     = makeIcon('upload')
export const IconDownload   = makeIcon('download')
export const IconAdd        = makeIcon('add')
export const IconCheck      = makeIcon('check')
export const IconCopy       = makeIcon('content_copy')

// ── Estado / feedback ─────────────────────────────────────────────────────────
export const IconSuccess    = makeIcon('check_circle')
export const IconWarning    = makeIcon('warning')
export const IconError      = makeIcon('error')
export const IconInfo       = makeIcon('info')
export const IconPending    = makeIcon('schedule')
export const IconLoading    = makeIcon('progress_activity')

// ── Auth / usuario ────────────────────────────────────────────────────────────
export const IconUser       = makeIcon('person')
export const IconLogin      = makeIcon('login')
export const IconLogout     = makeIcon('logout')
export const IconPassword   = makeIcon('lock')
export const IconEmail      = makeIcon('mail')
export const IconPhone      = makeIcon('phone')

// ── Refugio / adopción ────────────────────────────────────────────────────────
export const IconShelter    = makeIcon('house')
export const IconDog        = makeIcon('pets')
export const IconAdoption   = makeIcon('handshake')
export const IconRequest    = makeIcon('assignment')
export const IconCalendar   = makeIcon('calendar_today')
export const IconLocation   = makeIcon('location_on')
export const IconVerified   = makeIcon('verified')
export const IconStar       = makeIcon('star')

// ── Mensajería ────────────────────────────────────────────────────────────────
export const IconChat       = makeIcon('chat_bubble')
export const IconNotif      = makeIcon('notifications')
export const IconAttach     = makeIcon('attach_file')

// ── Donaciones ────────────────────────────────────────────────────────────────
export const IconDonate     = makeIcon('volunteer_activism')
export const IconCard       = makeIcon('credit_card')
export const IconMoney      = makeIcon('payments')

// ── Dashboard / admin ─────────────────────────────────────────────────────────
export const IconDashboard  = makeIcon('dashboard')
export const IconStats      = makeIcon('bar_chart')
export const IconSettings   = makeIcon('settings')
export const IconAdmin      = makeIcon('admin_panel_settings')
export const IconApprove    = makeIcon('task_alt')
export const IconReject     = makeIcon('cancel')
