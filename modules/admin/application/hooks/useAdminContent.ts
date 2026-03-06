'use client'
// modules/admin/application/hooks/useAdminContent.ts
// Carga y guarda el proceso de adopción y las FAQs del chatbot.

import { useCallback, useEffect, useState } from 'react'
import type { AdoptionStep, ChatbotFAQ } from '@/modules/shared/mockData/content.mock'
import { adminService }                   from '../../infrastructure/AdminServiceFactory'

export interface UseAdminContentReturn {
  steps:               AdoptionStep[]
  faqs:                ChatbotFAQ[]
  isLoading:           boolean
  isSaving:            boolean
  error:               string | null
  saveAdoptionProcess: (steps: AdoptionStep[]) => Promise<void>
  saveFaqs:            (faqs: ChatbotFAQ[]) => Promise<void>
}

export function useAdminContent(): UseAdminContentReturn {
  const [steps,     setSteps]     = useState<AdoptionStep[]>([])
  const [faqs,      setFaqs]      = useState<ChatbotFAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving,  setIsSaving]  = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      adminService.getAdoptionProcess(),
      adminService.getChatbotFAQs(),
    ])
      .then(([proc, faqData]) => { setSteps(proc); setFaqs(faqData) })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  const saveAdoptionProcess = useCallback(async (newSteps: AdoptionStep[]) => {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await adminService.updateAdoptionProcess(newSteps)
      setSteps(updated)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al guardar')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  const saveFaqs = useCallback(async (newFaqs: ChatbotFAQ[]) => {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await adminService.updateChatbotFAQs(newFaqs)
      setFaqs(updated)
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Error al guardar')
      throw e
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { steps, faqs, isLoading, isSaving, error, saveAdoptionProcess, saveFaqs }
}
