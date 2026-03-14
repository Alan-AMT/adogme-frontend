// modules/shared/components/layout/DashboardLayout.tsx
// 'use client' — maneja collapsed state y mobile drawer
// Combina Sidebar + área principal con scroll independiente
// En mobile: sidebar es overlay drawer desde la izquierda
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Sidebar, type SidebarItem } from './Sidebar'

// ─── Props ────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children:       ReactNode
  sidebarItems:   SidebarItem[]
  sidebarHeader?: ReactNode
  sidebarFooter?: ReactNode
  /** Título del área — se muestra en el header interno del dashboard */
  title?:         string
  /** Acciones que van a la derecha del header interno */
  headerActions?: ReactNode
}

// ─── Overlay mobile para el drawer ───────────────────────────────────────────

function MobileSidebarOverlay({
  open, onClose, items, header, footer,
}: {
  open: boolean; onClose: () => void
  items: SidebarItem[]; header?: ReactNode; footer?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[9998] transition-all duration-300"
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú del dashboard"
        className="fixed top-0 left-0 z-[9999] h-full"
        style={{
          width: 240,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: '8px 0 40px rgba(0,0,0,0.15)',
        }}
      >
        <Sidebar
          items={items}
          collapsed={false}
          header={header}
          footer={footer}
        />
      </div>
    </>,
    document.body
  )
}

// ─── DashboardLayout ──────────────────────────────────────────────────────────

export function DashboardLayout({
  children,
  sidebarItems,
  sidebarHeader,
  sidebarFooter,
  title,
  headerActions,
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const [collapsed,    setCollapsed]    = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  // Cerrar mobile drawer al navegar
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <div className="flex h-full overflow-hidden bg-[#f9fafb]">

      {/* ── Sidebar desktop — oculto en mobile ── */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <Sidebar
          items={sidebarItems}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          header={sidebarHeader}
          footer={sidebarFooter}
        />
      </div>

      {/* ── Sidebar mobile — portal drawer ── */}
      <MobileSidebarOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={sidebarItems}
        header={sidebarHeader}
        footer={sidebarFooter}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header interno del dashboard ── */}
        <div
          className="shrink-0 h-16 px-4 sm:px-6 flex items-center gap-4 border-b bg-white"
          style={{ borderColor: '#f0f0f0' }}
        >
          {/* Hamburguesa — solo mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full
                       border border-[#e5e7eb] bg-white text-[#374151]
                       hover:bg-[#fafafa] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
          </button>

          {/* Breadcrumb / título */}
          {title && (
            <div className="flex-1 min-w-0">
              <h1 className="text-[16px] font-[900] text-[#18181b] truncate tracking-tight">
                {title}
              </h1>
            </div>
          )}

          {/* Acciones — flex-end */}
          {headerActions && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {headerActions}
            </div>
          )}
        </div>

        {/* ── Área de contenido con scroll independiente ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Ejemplo de uso — descomentar para ver cómo se usa ────────────────────────
/*
import { DashboardLayout } from '@/modules/shared/components/layout/DashboardLayout'
import type { SidebarItem } from '@/modules/shared/components/layout/Sidebar'

const REFUGIO_ITEMS: SidebarItem[] = [
  { id: 'perros',      label: 'Mis perros',     icon: 'pets',        href: '/portal/perros' },
  { id: 'solicitudes', label: 'Solicitudes',    icon: 'assignment',  href: '/portal/solicitudes', badge: 4 },
  { id: 'mensajes',    label: 'Mensajes',       icon: 'chat_bubble', href: '/portal/mensajes',    badge: 2,
    subItems: [
      { id: 'inbox', label: 'Bandeja entrada', href: '/portal/mensajes/inbox', badge: 2 },
      { id: 'sent',  label: 'Enviados',        href: '/portal/mensajes/sent' },
    ]
  },
  { id: 'stats',  label: 'Estadísticas', icon: 'bar_chart',  href: '/portal/stats' },
  { id: 'config', label: 'Configuración', icon: 'settings',  href: '/portal/config', divider: true },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      sidebarItems={REFUGIO_ITEMS}
      title="Portal Refugio"
      headerActions={
        <button className="...">+ Nuevo perro</button>
      }
    >
      {children}
    </DashboardLayout>
  )
}
*/
