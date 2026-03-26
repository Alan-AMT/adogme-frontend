// modules/shared/components/ui/ConfirmDialog.tsx
'use client'

import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen:          boolean
  onConfirm:       () => void
  onCancel:        () => void
  title:           string
  description:     string
  confirmLabel?:   string
  confirmVariant?: 'danger' | 'primary'
  loading?:        boolean
}

// Iconos y colores por variante
const VARIANT_ICON: Record<NonNullable<ConfirmDialogProps['confirmVariant']>, string> = {
  danger:  'delete',
  primary: 'help',
}
const VARIANT_BG: Record<NonNullable<ConfirmDialogProps['confirmVariant']>, string> = {
  danger:  'bg-[#fef2f2]',
  primary: 'bg-[#fff1f2]',
}
const VARIANT_COLOR: Record<NonNullable<ConfirmDialogProps['confirmVariant']>, string> = {
  danger:  '#ef4444',
  primary: '#ff6b6b',
}

export function ConfirmDialog({
  isOpen, onConfirm, onCancel, title, description,
  confirmLabel = 'Confirmar', confirmVariant = 'danger', loading,
}: ConfirmDialogProps) {
  const icon  = VARIANT_ICON[confirmVariant]
  const bg    = VARIANT_BG[confirmVariant]
  const color = VARIANT_COLOR[confirmVariant]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} size="md" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-center py-2">
        {/* Icono */}
        <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${bg}`}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 28,
              color,
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 28",
            }}
          >
            {icon}
          </span>
        </div>

        <h3 className="text-lg font-[900] text-[#18181b] mb-2">{title}</h3>
        <p className="text-sm text-[#71717a] font-[500] leading-relaxed">{description}</p>
      </div>
    </Modal>
  )
}
