// modules/shared/application/hooks/useDebounce.ts
// ─────────────────────────────────────────────────────────────────────────────
// Retrasa la actualización de un valor hasta que deje de cambiar.
// Usado en el buscador de perros para no filtrar en cada keystroke.
//
// Uso:
//   const debouncedSearch = useDebounce(searchTerm, 350)
//   // debouncedSearch solo cambia 350ms después del último cambio de searchTerm
// ─────────────────────────────────────────────────────────────────────────────
'use client'

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
