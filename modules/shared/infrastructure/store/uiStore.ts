// modules/shared/infrastructure/store/uiStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Estado global de UI — toasts y estado del chatbot
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { create } from 'zustand'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id:       string
  type:     ToastType
  message:  string
  duration: number   // ms — default 4000
}

export interface UIState {
  // Toasts
  toasts:       Toast[]
  addToast:     (toast: Omit<Toast, 'id'>) => void
  removeToast:  (id: string) => void

  // Chatbot
  isChatbotOpen:  boolean
  toggleChatbot:  () => void
  openChatbot:    () => void
  closeChatbot:   () => void

  // Mobile nav
  isMobileMenuOpen:   boolean
  toggleMobileMenu:   () => void
  closeMobileMenu:    () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIState>((set, get) => ({

  // ── Toasts ─────────────────────────────────────────────────────────────────
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const { duration = 4000, ...rest } = toast
    const full: Toast = { ...rest, id, duration }

    set(state => ({ toasts: [...state.toasts, full] }))

    // Auto-remove después de duration
    setTimeout(() => {
      get().removeToast(id)
    }, full.duration)
  },

  removeToast: (id) =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  // ── Chatbot ────────────────────────────────────────────────────────────────
  isChatbotOpen: false,
  toggleChatbot:  () => set(state => ({ isChatbotOpen: !state.isChatbotOpen })),
  openChatbot:    () => set({ isChatbotOpen: true }),
  closeChatbot:   () => set({ isChatbotOpen: false }),

  // ── Mobile menu ────────────────────────────────────────────────────────────
  isMobileMenuOpen: false,
  toggleMobileMenu:  () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu:   () => set({ isMobileMenuOpen: false }),
}))
