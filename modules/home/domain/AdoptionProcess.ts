// modules/home/domain/AdoptionProcess.ts

export interface AdoptionStep {
  id: number
  step: number
  icon: string
  title: string
  subtitle: string
  description: string
  tips: string[]
  duration: string
}

export type AdoptionProcess = AdoptionStep[]
