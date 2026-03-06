// modules/admin/components/AdminPortalLayout.tsx
// Archivo 199 — DashboardLayout con sidebar para el panel de administración.
// Sidebar: Dashboard · Refugios (badge=pendientes) · Perros · Contenido.
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { DashboardLayout } from '@/modules/shared/components/layout/DashboardLayout'
import type { SidebarItem } from '@/modules/shared/components/layout/Sidebar'
import { useAuthStore }    from '@/modules/shared/infrastructure/store/authStore'
import { adminService }    from '../infrastructure/AdminServiceFactory'

// ─── Título según pathname ────────────────────────────────────────────────────

function usePageTitle() {
  const pathname = usePathname()
  if (pathname.includes('/refugios/')) return 'Detalle de refugio'
  if (pathname.includes('/refugios'))  return 'Refugios'
  if (pathname.includes('/perros/'))   return 'Editar perro'
  if (pathname.includes('/perros'))    return 'Perros'
  if (pathname.includes('/contenido')) return 'Contenido'
  return 'Dashboard'
}

// ─── Header actions ───────────────────────────────────────────────────────────

function HeaderActions() {
  const router  = useRouter()
  const logout  = useAuthStore(s => s.logout)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '2.25rem',
        height:         '2.25rem',
        borderRadius:   999,
        border:         '1.5px solid #f0f0f0',
        background:     '#fff',
        cursor:         'pointer',
        color:          '#71717a',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
    </button>
  )
}

// ─── Header del sidebar: ícono + identidad admin ──────────────────────────────

function AdminSidebarHeader() {
  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '0.65rem',
        padding:    '0.75rem 1rem',
        minHeight:  64,
        overflow:   'hidden',
      }}
    >
      {/* Ícono admin */}
      <div
        style={{
          flexShrink:     0,
          width:          36,
          height:         36,
          borderRadius:   10,
          background:     'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color: '#fff', fontVariationSettings: "'FILL' 1" }}
        >
          shield
        </span>
      </div>

      {/* Nombre + etiqueta */}
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <p
          style={{
            fontSize:     13,
            fontWeight:   900,
            color:        '#18181b',
            lineHeight:   1.25,
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          aDOGme Admin
        </p>
        <p
          style={{
            fontSize:   11,
            color:      '#a1a1aa',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            marginTop:  2,
          }}
        >
          Panel de administración
        </p>
      </div>
    </div>
  )
}

// ─── Sidebar items ────────────────────────────────────────────────────────────

function buildSidebarItems(pendientes: number): SidebarItem[] {
  return [
    {
      id:    'dashboard',
      label: 'Dashboard',
      icon:  'dashboard',
      href:  '/admin',
    },
    {
      id:    'refugios',
      label: 'Refugios',
      icon:  'home_work',
      href:  '/admin/refugios',
      badge: pendientes > 0 ? pendientes : undefined,
    },
    {
      id:    'perros',
      label: 'Perros',
      icon:  'pets',
      href:  '/admin/perros',
    },
    {
      id:      'contenido',
      label:   'Contenido',
      icon:    'edit_document',
      href:    '/admin/contenido',
      divider: true,
    },
  ]
}

// ─── AdminPortalLayout ────────────────────────────────────────────────────────

export function AdminPortalLayout({ children }: { children: ReactNode }) {
  const title = usePageTitle()
  const [pendientes, setPendientes] = useState(0)

  useEffect(() => {
    adminService.getStats()
      .then(stats => setPendientes(stats.refugiosPendientes))
      .catch(() => {})
  }, [])

  return (
    <DashboardLayout
      sidebarItems={buildSidebarItems(pendientes)}
      sidebarHeader={<AdminSidebarHeader />}
      title={title}
      headerActions={<HeaderActions />}
    >
      {children}
    </DashboardLayout>
  )
}
