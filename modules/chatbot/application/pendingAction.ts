// modules/chatbot/application/pendingAction.ts
// Intención pendiente del chatbot que sobrevive una navegación a /login.
// Se guarda cuando el usuario hace click en el botón de login generado por el
// chatbot, y se consume cuando el usuario regresa logueado para retomar
// automáticamente la conversación donde la dejó.

const KEY = 'chatbot-pending-action'
const TTL_MS = 5 * 60 * 1000   // 5 minutos: tiempo razonable para completar login

interface PendingAction {
  text:      string
  expiresAt: number
}

export function setPendingAction(text: string): void {
  if (typeof window === 'undefined') return
  try {
    const payload: PendingAction = { text, expiresAt: Date.now() + TTL_MS }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch { /* storage lleno o privado */ }
}

/** Lee y borra la intención pendiente. Retorna null si no existe o expiró. */
export function consumePendingAction(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    localStorage.removeItem(KEY)

    const parsed = JSON.parse(raw) as PendingAction
    if (typeof parsed?.text !== 'string') return null
    if (typeof parsed?.expiresAt !== 'number') return null
    if (Date.now() > parsed.expiresAt) return null

    return parsed.text
  } catch {
    return null
  }
}
