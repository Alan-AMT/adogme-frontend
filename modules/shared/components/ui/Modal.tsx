// modules/shared/components/ui/Modal.tsx
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './Button'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
  isOpen:     boolean
  onClose:    () => void
  title?:     string
  size?:      ModalSize
  children:   ReactNode
  footer?:    ReactNode
  className?: string
}

const SIZE_CLS: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw] max-h-[95vh]',
}

export function Modal({ isOpen, onClose, title, size = 'md', children, footer, className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape para cerrar
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Overlay — rgba igual que cat-drawer-overlay
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel — animación scale+fade como auth-card */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={[
          'relative w-full bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.18)]',
          'outline-none overflow-hidden',
          'animate-[modalIn_200ms_cubic-bezier(0.22,1,0.36,1)]',
          SIZE_CLS[size],
          className,
        ].filter(Boolean).join(' ')}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Accent line — igual que auth-card__accent */}
        <div className="h-[6px] bg-gradient-to-r from-[#ff6b6b] via-[#fa5252] to-[#ff9999]" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f4f4f5]">
            <h2 id="modal-title" className="text-lg font-[900] text-[#18181b]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center text-[#71717a]
                         hover:bg-[#ffe4e4] hover:text-[#ff6b6b] transition-colors"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-5 pt-3 border-t border-[#f4f4f5] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

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

export function ConfirmDialog({
  isOpen, onConfirm, onCancel, title, description,
  confirmLabel = 'Confirmar', confirmVariant = 'danger', loading,
}: ConfirmDialogProps) {
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
        {/* Icono según variant */}
        <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center
          ${confirmVariant === 'danger' ? 'bg-[#fef2f2]' : 'bg-[#fff1f2]'}`}>
          <span className="material-symbols-outlined"
            style={{
              fontSize: 28,
              color: confirmVariant === 'danger' ? '#ef4444' : '#ff6b6b',
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 28",
            }}>
            {confirmVariant === 'danger' ? 'delete' : 'help'}
          </span>
        </div>
        <h3 className="text-lg font-[900] text-[#18181b] mb-2">{title}</h3>
        <p className="text-sm text-[#71717a] font-[500] leading-relaxed">{description}</p>
      </div>
    </Modal>
  )
}
