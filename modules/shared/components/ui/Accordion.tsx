// modules/shared/components/ui/Accordion.tsx
// Estilo basado en .hiw-card (homeHowItWorks.css): border, radius, bg blanco
'use client'

import { useState, type ReactNode } from 'react'

interface AccordionItem {
  id:      string
  title:   string
  content: ReactNode
}

interface AccordionProps {
  items:     AccordionItem[]
  multiple?: boolean   // si true, permite varios abiertos simultáneamente
  className?: string
}

export function Accordion({ items, multiple = false, className = '' }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map(item => {
        const isOpen = open.has(item.id)
        return (
          <div
            key={item.id}
            className="border border-[#e2e8f0] rounded-[1rem] bg-white overflow-hidden transition-shadow duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-[800] text-[#18181b]">{item.title}</span>
              <span
                className={`material-symbols-outlined text-[#a1a1aa] transition-transform duration-250 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                style={{ fontSize: 20 }}
              >
                keyboard_arrow_down
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-4 text-sm text-[#52525b] leading-relaxed font-[500] border-t border-[#f4f4f5] pt-3">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
