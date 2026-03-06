// modules/shared/components/layout/Sidebar.tsx
// 'use client' — maneja estado collapsed, subItems expanded, hover
// Usado por DashboardLayout para Portal Refugio y Panel Admin
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SidebarItem {
  id:        string
  label:     string
  icon:      string
  href?:     string
  badge?:    number
  subItems?: { id: string; label: string; href: string; badge?: number }[]
  divider?:  boolean  // inserta línea separadora antes de este item
  danger?:   boolean  // texto rojo (ej: "Eliminar cuenta")
}

interface SidebarProps {
  items:       SidebarItem[]
  collapsed?:  boolean
  onCollapse?: (v: boolean) => void
  header?:     ReactNode
  footer?:     ReactNode
}

// ─── Helper active ────────────────────────────────────────────────────────────

function isActive(pathname: string, href?: string) {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function SidebarBadge({ count, collapsed }: { count: number; collapsed: boolean }) {
  if (collapsed) {
    return (
      <span
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
                   text-[9px] font-[900] text-white"
        style={{ background: '#ff6b6b' }}
      >
        {count > 9 ? '9+' : count}
      </span>
    )
  }
  return (
    <span
      className="ml-auto text-[11px] font-[900] px-2 py-0.5 rounded-full leading-none flex-shrink-0"
      style={{
        background: 'rgba(255,107,107,0.12)',
        color: '#ff6b6b',
        border: '1px solid rgba(255,107,107,0.2)',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

function SidebarNavItem({
  item, collapsed, depth = 0,
}: {
  item: SidebarItem; collapsed: boolean; depth?: number
}) {
  const pathname = usePathname()
  const [subOpen, setSubOpen] = useState(false)

  const hasChildren = !!item.subItems?.length
  const active = isActive(pathname, item.href)
  const subActive = item.subItems?.some(s => isActive(pathname, s.href)) ?? false

  // Al estar collapsed los subItems no se muestran (solo hover tooltip)
  const showChildren = hasChildren && subOpen && !collapsed

  const itemContent = (
    <span className="flex items-center gap-3 w-full min-w-0">
      {/* Icon */}
      <span className="relative flex-shrink-0">
        <span
          className="material-symbols-outlined transition-all duration-200"
          style={{
            fontSize: collapsed ? 22 : 20,
            color: (active || subActive) ? '#ff6b6b' : item.danger ? '#ef4444' : '#a1a1aa',
            fontVariationSettings: `'FILL' ${(active || subActive) ? 1 : 0},'wght' 300,'GRAD' 0,'opsz' 20`,
          }}
        >
          {item.icon}
        </span>
        {/* Badge en modo collapsed */}
        {collapsed && item.badge && item.badge > 0 && (
          <SidebarBadge count={item.badge} collapsed />
        )}
      </span>

      {/* Label + badge — oculto en collapsed */}
      {!collapsed && (
        <>
          <span
            className="text-[13px] flex-1 min-w-0 truncate transition-colors duration-150"
            style={{
              fontWeight: (active || subActive) ? 900 : 700,
              color: (active || subActive)
                ? '#ff6b6b'
                : item.danger ? '#ef4444' : '#374151',
            }}
          >
            {item.label}
          </span>

          {/* Badge normal */}
          {item.badge && item.badge > 0 && !hasChildren && (
            <SidebarBadge count={item.badge} collapsed={false} />
          )}

          {/* Chevron si tiene sub-items */}
          {hasChildren && (
            <span
              className="material-symbols-outlined flex-shrink-0 text-[#c4c4c7] transition-transform duration-200"
              style={{
                fontSize: 16,
                transform: subOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              keyboard_arrow_down
            </span>
          )}
        </>
      )}
    </span>
  )

  // ── Wrapper: link o button ────────────────────────────────────────────────
  const wrapperClass = [
    'relative flex items-center rounded-[11px] transition-all duration-150 group',
    depth > 0 ? 'px-3 py-2' : 'px-3 py-2.5',
    collapsed ? 'justify-center' : '',
    (active && !hasChildren)
      ? 'bg-[rgba(255,107,107,0.10)] text-[#ff6b6b]'
      : subActive
        ? 'bg-[rgba(255,107,107,0.06)]'
        : item.danger
          ? 'hover:bg-[#fef2f2]'
          : 'hover:bg-[#f9fafb]',
  ].join(' ')

  // Tooltip en collapsed
  const tooltip = collapsed ? (
    <span
      className="absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-[8px] text-[12px] font-[800]
                 text-white whitespace-nowrap pointer-events-none
                 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      style={{ background: '#18181b' }}
    >
      {item.label}
      {item.badge ? ` (${item.badge})` : ''}
    </span>
  ) : null

  return (
    <li>
      {/* Divider opcional */}
      {item.divider && (
        <div className="my-2 border-t border-[#f4f4f5]" />
      )}

      {/* Link o botón */}
      {item.href && !hasChildren ? (
        <Link href={item.href} className={wrapperClass}>
          {tooltip}
          {itemContent}
          {/* Indicador activo */}
          {active && !collapsed && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#ff6b6b]" />
          )}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => hasChildren && setSubOpen(v => !v)}
          className={`w-full text-left ${wrapperClass}`}
        >
          {tooltip}
          {itemContent}
          {active && !collapsed && !hasChildren && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#ff6b6b]" />
          )}
        </button>
      )}

      {/* Sub-items */}
      {showChildren && (
        <ul
          className="mt-0.5 ml-[calc(20px+12px)] flex flex-col gap-0.5 overflow-hidden"
          style={{
            borderLeft: '1px solid #f0f0f0',
            paddingLeft: 12,
          }}
        >
          {item.subItems!.map(sub => {
            const subIsActive = isActive(pathname, sub.href)
            return (
              <li key={sub.id}>
                <Link
                  href={sub.href}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-[9px] text-[12px] font-[700]
                             transition-colors duration-150 hover:bg-[#f9fafb]"
                  style={{ color: subIsActive ? '#ff6b6b' : '#52525b', fontWeight: subIsActive ? 900 : 700 }}
                >
                  {sub.label}
                  {sub.badge && sub.badge > 0 && (
                    <span
                      className="ml-auto text-[10px] font-[900] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b' }}
                    >
                      {sub.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// ─── Sidebar principal ────────────────────────────────────────────────────────

export function Sidebar({
  items, collapsed = false, onCollapse, header, footer,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden transition-[width] duration-300 ease-in-out
                 bg-white border-r border-[#f0f0f0]"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* ── Header custom o por defecto ── */}
      {header ? (
        <div className="shrink-0 border-b border-[#f4f4f5]">{header}</div>
      ) : (
        <div
          className="shrink-0 px-4 h-16 flex items-center gap-3 border-b border-[#f4f4f5]"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {/* Icono brand */}
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: '#ff6b6b', boxShadow: '0 4px 10px rgba(255,107,107,0.3)' }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
            >
              pets
            </span>
          </div>
          {!collapsed && (
            <span className="font-[950] text-[17px] text-[#111827] tracking-[-0.02em] leading-none">
              a<span className="text-[#ff6b6b]">DOG</span>me
            </span>
          )}
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <ul className="flex flex-col gap-0.5">
          {items.map(item => (
            <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* ── Footer custom o collapse button ── */}
      {footer ? (
        <div className="shrink-0 border-t border-[#f4f4f5]">{footer}</div>
      ) : onCollapse ? (
        <div className="shrink-0 border-t border-[#f4f4f5] p-2">
          <button
            type="button"
            onClick={() => onCollapse(!collapsed)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[11px] text-[12px] font-[800]
                       text-[#a1a1aa] hover:bg-[#f9fafb] hover:text-[#374151] transition-all duration-150"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <span
              className="material-symbols-outlined flex-shrink-0 transition-transform duration-300"
              style={{ fontSize: 18, transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              chevron_left
            </span>
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      ) : null}
    </aside>
  )
}
