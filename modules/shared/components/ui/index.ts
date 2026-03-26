// modules/shared/components/ui/index.ts
// ─── Barrel export — todos los componentes atómicos ─────────────────────────
// Adaptado a la estructura real de archivos del proyecto

// ── Formularios ──────────────────────────────────────────────────────────────
export { Button } from './Button'
export type { ButtonSize, ButtonVariant } from './Button'

export { Input } from './Input'

export { Select } from './Select'
export type { SelectOption } from './Select'

export { Textarea } from './Textarea'

export { TagInput } from './TagInput'

export { RangeSlider } from './RangeSlider'

export { FileUpload } from './FileUpload'

// ── Feedback / estado ────────────────────────────────────────────────────────
export {
    Badge,
    dogStatusBadgeVariant,
    requestStatusBadgeVariant,
    shelterStatusBadgeVariant
} from './Badge'
export type { BadgeSize, BadgeVariant } from './Badge'

export { Spinner } from './Spinner'

export { DogCardSkeleton, ShelterCardSkeleton, Skeleton } from './Skeleton'

export { ProgressBar } from './ProgressBar'

export { Alert } from './Alert'

// Toast — exporta desde ToastContainer si es archivo separado, sino desde Toast
export { ToastContainer } from './ToastContainer'

export { Tooltip } from './Tooltip'

// ── Overlays / diálogos ──────────────────────────────────────────────────────
export { Modal } from './Modal'
export type { ModalSize } from './Modal'

export { ConfirmDialog } from './ConfirmDialog'

// ── Personas / identidad ─────────────────────────────────────────────────────
export { Avatar } from './Avatar'
export type { AvatarShape, AvatarSize } from './Avatar'

// ── Controles especiales ─────────────────────────────────────────────────────
// (Checkbox y Toggle existen en tu carpeta local)
export { Checkbox } from './Checkbox'
export { Toggle } from './Toggle'

// ── Navegación / estructura ──────────────────────────────────────────────────
export { Tabs } from './Tabs'
export type { TabVariant } from './Tabs'

export { Accordion } from './Accordion'

export { Stepper } from './Stepper'

export { Pagination } from './Pagination'

// ── Contenido ────────────────────────────────────────────────────────────────
export { EMPTY_STATES, EmptyState } from './EmptyState'

export { ImageGallery } from './ImageGallery'

// ── Iconos ────────────────────────────────────────────────────────────────────
// Todos los exports de tu Icon.tsx (incluyendo tags de personalidad)
export {
    Icon, IconActivo, IconAdd, IconAdmin, IconAdoption, IconApprove, IconAttach, IconBack, IconCalendar, IconCard, IconCarinoso, IconCastrado, IconCazador,
    // Mensajería
    IconChat, IconCheck, IconChevronDown, IconChevronRight, IconClose, IconCopy, IconCurioso,
    // Admin / dashboard
    IconDashboard, IconDelete, IconDog,
    // Donaciones
    IconDonate, IconDownload,
    // Atributos del perro
    IconEdad, IconEdit, IconEmail, IconEnergia, IconEnergicoTag, IconError, IconFilter, IconGatos,
    // Acciones
    IconHeart, IconHeartAdd,
    // Navegación
    IconHome, IconIndependiente, IconInfo, IconJardin,
    // Tags de personalidad
    IconJugueton, IconLeal, IconLoading, IconLocation, IconLogin, IconLogout, IconMenu, IconMicrochip, IconMoney,
    // Compatibilidad / convivencia
    IconNinos, IconNotif, IconObediente, IconPassword, IconPending, IconPerros, IconPeso, IconPhone, IconProtector, IconReject, IconRelajado, IconRequest, IconSalud, IconSave, IconSearch, IconSend, IconSettings, IconSexo, IconShare,
    // Refugio / adopción
    IconShelter, IconSociable, IconSort, IconStar, IconStats,
    // Estado / feedback
    IconSuccess, IconTamano, IconTerco, IconTimido, IconTranquilo, IconUpload,
    // Auth / usuario
    IconUser, IconVacunas, IconVerified, IconWarning
} from './Icon'

// ── Dog attribute helpers ────────────────────────────────────────────────────
export {
    DOG_ATTRIBUTE_LABELS, DogAttributeBadge, DogAttributeIcon, DogAttributesGroup
} from './DogAttributeIcon'
export type { DogAttributeType } from './DogAttributeIcon'
