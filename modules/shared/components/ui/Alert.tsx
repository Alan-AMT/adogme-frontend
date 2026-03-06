// modules/shared/components/ui/Alert.tsx
// Basado en .auth-alert--error/success/warn/info del CSS original
'use client'

import { useState, type ReactNode } from 'react'

type AlertType = 'info' | 'warning' | 'error' | 'success'

interface AlertProps {
  type:       AlertType
  title?:     string
  message:    string
  closable?:  boolean
  action?:    ReactNode
}

const CFG = {
  success: { bg: 'bg-[#f0fdf4]', border: 'border-[#dcfce7]', text: 'text-[#15803d]', icon: 'check_circle' },
  error:   { bg: 'bg-[#fef2f2]', border: 'border-[#fee2e2]', text: 'text-[#b91c1c]', icon: 'error' },
  warning: { bg: 'bg-[#fffbeb]', border: 'border-[#fef3c7]', text: 'text-[#b45309]', icon: 'warning' },
  info:    { bg: 'bg-[#eff6ff]', border: 'border-[#dbeafe]', text: 'text-[#1d4ed8]', icon: 'info' },
}

export function Alert({ type, title, message, closable, action }: AlertProps) {
  const [closed, setClosed] = useState(false)
  if (closed) return null
  const cfg = CFG[type]

  return (
    <div className={`flex gap-3 items-start px-4 py-3 rounded-[14px] border text-sm font-[800] ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className="material-symbols-outlined flex-shrink-0"
        style={{ fontSize: 18, marginTop: 1, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18" }}>
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-[900] mb-0.5">{title}</p>}
        <p className="font-[700] leading-snug opacity-90">{message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {closable && (
        <button onClick={() => setClosed(true)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
        </button>
      )}
    </div>
  )
}
