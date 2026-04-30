// modules/shared/infrastructure/store/uiStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Estado global de UI — toasts y estado del chatbot
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { create } from 'zustand'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface UIState {
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

export const useUIStore = create<UIState>((set) => ({

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
