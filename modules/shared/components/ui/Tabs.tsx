// modules/shared/components/ui/Tabs.tsx
'use client'

import type { ReactNode } from 'react'

export type TabVariant = 'underline' | 'pills' | 'bordered'

interface TabItem {
  id:     string
  label:  string
  icon?:  ReactNode
  badge?: number
}

interface TabsProps {
  tabs:      TabItem[]
  activeTab: string
  onChange:  (id: string) => void
  variant?:  TabVariant
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className = '' }: TabsProps) {

  // ── Underline (como nav de categorías) ──────────────────────────────────────
  if (variant === 'underline') {
    return (
      <div className={`border-b border-[#f4f4f5] flex gap-0 overflow-x-auto scrollbar-none ${className}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'inline-flex items-center gap-2 px-4 py-3 text-sm font-[800] whitespace-nowrap',
              'border-b-2 transition-all duration-150 -mb-px',
              tab.id === activeTab
                ? 'border-[var(--brand)] text-[var(--brand)]'
                : 'border-transparent text-[#71717a] hover:text-[#3f3f46] hover:border-[#e4e4e7]',
            ].join(' ')}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-[900] bg-[#ff6b6b] text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  // ── Pills — .cat-chip / .cat-chip--active ────────────────────────────────────
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-[700] whitespace-nowrap',
              'border-[1.5px] transition-all duration-150',
              tab.id === activeTab
                ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white'
                : 'bg-[#fafafa] border-[#e4e4e7] text-[#52525b] hover:border-[#ff6b6b] hover:text-[#ff6b6b] hover:bg-[#fff5f5]',
            ].join(' ')}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-[900] ${tab.id === activeTab ? 'bg-white/30 text-white' : 'bg-[#ff6b6b] text-white'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  // ── Bordered ─────────────────────────────────────────────────────────────────
  return (
    <div className={`flex gap-0 p-1 bg-[#f4f4f5] rounded-[14px] overflow-x-auto ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            'flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px]',
            'text-sm font-[800] whitespace-nowrap transition-all duration-200',
            tab.id === activeTab
              ? 'bg-white text-[#18181b] shadow-[0_1px_6px_rgba(0,0,0,0.08)]'
              : 'text-[#71717a] hover:text-[#3f3f46]',
          ].join(' ')}
        >
          {tab.icon}
          {tab.label}
          {tab.badge != null && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-[900] bg-[#ff6b6b] text-white">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
