// modules/shelter/components/ShelterPortalLayout.tsx
// Archivo 170 — DashboardLayout con sidebar inteligente para el portal del refugio.
//
// - Sidebar items con badges dinámicos (solicitudes pendientes, mensajes no leídos)
// - Header del sidebar: logo del refugio + nombre (cargados via shelterService)
// - Header del dashboard: título derivado del pathname + acciones (nuevo perro, logout)
'use client'

import Image         from 'next/image'
import Link          from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { DashboardLayout } from '@/modules/shared/components/layout/DashboardLayout'
import type { SidebarItem } from '@/modules/shared/components/layout/Sidebar'
import { useAuthStore }    from '@/modules/shared/infrastructure/store/authStore'
import { shelterService }  from '../infrastructure/ShelterServiceFactory'
import { messageService }  from '@/modules/messaging/infrastructure/MessageServiceFactory'
import type { Shelter }    from '@/modules/shared/domain/Shelter'

const CURRENT_SHELTER_ID = 1

// ─── Título según pathname ────────────────────────────────────────────────────

function usePageTitle() {
  const pathname = usePathname()
  if (pathname.includes('/perros/nuevo'))  return 'Nuevo perro'
  if (pathname.includes('/perros/'))       return 'Editar perro'
  if (pathname.includes('/perros'))        return 'Mis perros'
  if (pathname.includes('/solicitudes/'))  return 'Detalle de solicitud'
  if (pathname.includes('/solicitudes'))   return 'Solicitudes'
  if (pathname.includes('/mensajes'))      return 'Mensajes'
  if (pathname.includes('/donaciones'))    return 'Donaciones'
  if (pathname.includes('/perfil'))        return 'Perfil del refugio'
  return 'Dashboard'
}

// ─── Header actions ───────────────────────────────────────────────────────────

function HeaderActions() {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Link
        href="/refugio/perros/nuevo"
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '0.35rem',
          padding:        '0.45rem 0.9rem',
          borderRadius:   999,
          background:     '#ff6b6b',
          color:          '#fff',
          fontSize:       '0.8rem',
          fontWeight:     900,
          textDecoration: 'none',
          whiteSpace:     'nowrap',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
        <span>Nuevo perro</span>
      </Link>

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
    </div>
  )
}

// ─── Header del sidebar: logo + nombre del refugio ───────────────────────────
// El Sidebar envuelve este nodo en un div con overflow:hidden — el nombre
// se recorta automáticamente cuando el sidebar colapsa a 64px.

function ShelterSidebarHeader({ shelter }: { shelter: Shelter | null }) {
  const nombre = shelter?.nombre ?? 'Mi Refugio'
  const logo   = shelter?.logo

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
      {/* Logo del refugio — siempre visible, encaja en 36px */}
      <div
        style={{
          flexShrink:     0,
          width:          36,
          height:         36,
          borderRadius:   10,
          overflow:       'hidden',
          background:     logo ? 'transparent' : '#ff6b6b',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {logo ? (
          <Image
            src={logo}
            alt={nombre}
            width={36}
            height={36}
            style={{ objectFit: 'cover', width: 36, height: 36 }}
          />
        ) : (
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
          >
            pets
          </span>
        )}
      </div>

      {/* Nombre + etiqueta — se recortan al colapsar (overflow hidden del padre) */}
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
          {nombre}
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
          Portal refugio
        </p>
      </div>
    </div>
  )
}

// ─── Sidebar items con badges dinámicos ───────────────────────────────────────

function buildSidebarItems(pendientes: number, mensajesNoLeidos: number): SidebarItem[] {
  return [
    {
      id:    'dashboard',
      label: 'Dashboard',
      icon:  'dashboard',
      href:  '/refugio/dashboard',
    },
    {
      id:    'perros',
      label: 'Mis perros',
      icon:  'pets',
      href:  '/refugio/perros',
    },
    {
      id:    'solicitudes',
      label: 'Solicitudes',
      icon:  'assignment',
      href:  '/refugio/solicitudes',
      badge: pendientes > 0 ? pendientes : undefined,
    },
    {
      id:    'mensajes',
      label: 'Mensajes',
      icon:  'chat_bubble',
      href:  '/refugio/mensajes',
      badge: mensajesNoLeidos > 0 ? mensajesNoLeidos : undefined,
    },
    {
      id:    'donaciones',
      label: 'Donaciones',
      icon:  'volunteer_activism',
      href:  '/refugio/donaciones',
    },
    {
      id:      'perfil',
      label:   'Perfil',
      icon:    'manage_accounts',
      href:    '/refugio/perfil',
      divider: true,
    },
  ]
}

// ─── ShelterPortalLayout ──────────────────────────────────────────────────────

export function ShelterPortalLayout({ children }: { children: ReactNode }) {
  const title = usePageTitle()

  const [shelter,          setShelter]         = useState<Shelter | null>(null)
  const [pendientes,       setPendientes]       = useState(0)
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0)

  // Carga paralela: perfil + stats de dashboard + conversaciones del refugio
  useEffect(() => {
    Promise.all([
      shelterService.getShelterProfile(CURRENT_SHELTER_ID),
      shelterService.getDashboardStats(CURRENT_SHELTER_ID),
      messageService.getConversationsByShelterId(CURRENT_SHELTER_ID),
    ]).then(([profile, stats, convs]) => {
      setShelter(profile)
      setPendientes(stats.solicitudesPendientes)
      const unread = convs.reduce((sum, c) => sum + (c.noLeidosPorRefugio ?? 0), 0)
      setMensajesNoLeidos(unread)
    }).catch(() => {
      // Los badges quedan en 0 si falla la carga — no es bloqueante
    })
  }, [])

  return (
    <DashboardLayout
      sidebarItems={buildSidebarItems(pendientes, mensajesNoLeidos)}
      sidebarHeader={<ShelterSidebarHeader shelter={shelter} />}
      title={title}
      headerActions={<HeaderActions />}
    >
      {children}
    </DashboardLayout>
  )
}
