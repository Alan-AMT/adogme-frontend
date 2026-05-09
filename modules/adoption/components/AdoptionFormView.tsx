// modules/adoption/components/AdoptionFormView.tsx
// Orquesta el formulario multi-paso de adopción: conecta el hook RHF con
// los 6 step components vía FormProvider y maneja la navegación.
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { FormProvider } from 'react-hook-form'

import { useAuthStore }    from '../../shared/infrastructure/store/authStore'
import { useAdoptionForm } from '../application/hooks/useAdoptionForm'
import { ADOPTION_STEPS }  from '../../shared/domain/AdoptionRequest'
import { Stepper }         from '../../shared/components/ui/Stepper'

import PersonalDataStep    from './steps/PersonalDataStep'
import HousingStep         from './steps/HousingStep'
import RoutineStep         from './steps/RoutineStep'
import PetsExperienceStep  from './steps/PetsExperienceStep'
import ResponsibilityStep  from './steps/ResponsibilityStep'
import ConfirmationsStep   from './steps/ConfirmationsStep'

import '../styles/adoptionForm.css'

// ─── Metadatos UI del Stepper (reintroducidos en Fase 5) ──────────────────────
// Se mantienen aquí (no en el dominio) porque son puramente presentacionales.
// Mismo orden y longitud que ADOPTION_STEPS.
const STEP_META: { icon: string; subtitle: string }[] = [
  { icon: 'person',              subtitle: 'Tus datos para que el refugio te contacte' },
  { icon: 'home',                subtitle: 'Cuéntanos sobre tu hogar y entorno' },
  { icon: 'schedule',            subtitle: 'Tu rutina diaria con el perro' },
  { icon: 'pets',                subtitle: 'Tu experiencia con mascotas' },
  { icon: 'volunteer_activism',  subtitle: 'Tus compromisos y responsabilidades' },
  { icon: 'check_circle',        subtitle: 'Confirma y envía tu solicitud' },
]

// ─── Tiempo relativo desde Date ───────────────────────────────────────────────

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 10) return 'ahora'
  if (seconds < 60) return `hace ${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  return `hace ${hours} h`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  perroId:       string
  refugioId:     string
  perroNombre:   string
  perroRaza:     string
  perroFoto:     string | null
  refugioNombre: string
  refugioLogo:   string | null
  dogVector:     [number, number, number, number] | null
}

export default function AdoptionFormView({
  perroId,
  refugioId,
  perroNombre,
  perroRaza,
  perroFoto,
  refugioNombre,
  refugioLogo,
  dogVector,
}: Props) {
  const user = useAuthStore(s => s.user)

  const {
    form,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    submittedRequest,
    savedAt,
    formError,
  } = useAdoptionForm({
    perroId,
    refugioId,
    perroNombre,
    perroRaza,
    perroFoto,
    refugioNombre,
    refugioLogo,
    dogVector,
  })

  // Re-render cada 30s para mantener fresco el indicador "guardado hace X".
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!savedAt) return
    const id = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [savedAt])

  // Guard — la ruta ya garantiza que el usuario sea applicant, pero protegemos
  // el render para evitar UIs en estado indefinido.
  if (!user) return null

  const isLastStep = currentStep === totalSteps - 1
  const stepDef    = ADOPTION_STEPS[currentStep]
  const stepMeta   = STEP_META[currentStep]

  // Stepper expects number ids and number[] for completed/error indices.
  const stepperSteps   = ADOPTION_STEPS.map(s => ({ id: String(s.id), label: s.label }))
  const completedSteps = Array.from({ length: currentStep }, (_, i) => i)

  function handlePrimary() {
    if (isLastStep) void submitForm()
    else void nextStep()
  }

  function renderStep() {
    switch (currentStep) {
      case 0: return <PersonalDataStep />
      case 1: return <HousingStep />
      case 2: return <RoutineStep />
      case 3: return <PetsExperienceStep />
      case 4: return <ResponsibilityStep />
      case 5: return <ConfirmationsStep />
      default: return null
    }
  }

  return (
    <FormProvider {...form}>
      <div className="af-page">

        {/* ── Dog bar ── */}
        <div className="af-dog-bar">
          <div className="af-dog-bar__photo">
            {perroFoto && (
              <Image
                src={perroFoto}
                alt={perroNombre ?? 'Perro'}
                fill
                className="object-cover"
                sizes="52px"
              />
            )}
          </div>
          <div className="af-dog-bar__info">
            <p className="af-dog-bar__name">
              Adoptando a {perroNombre ?? 'este perro'}
            </p>
            <p className="af-dog-bar__sub">
              {refugioNombre ?? 'Refugio'}
            </p>
          </div>
          <Link href={`/perros/${perroId}`} className="af-dog-bar__back">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_back
            </span>
            Volver al perfil
          </Link>
        </div>

        {/* ── Stepper ── */}
        <div className="af-stepper-wrap">
          <Stepper
            steps={stepperSteps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* ── Step card ── */}
        <div className="af-step-card">

          {/* Step header */}
          <div className="af-step-header">
            <div className="af-step-header__icon">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48" }}
              >
                {stepMeta.icon}
              </span>
            </div>
            <p className="af-step-header__kicker">
              Paso {currentStep + 1} de {totalSteps}
            </p>
            <h2 className="af-step-header__title">{stepDef.title}</h2>
            <p className="af-step-header__sub">{stepMeta.subtitle}</p>
          </div>

          {/* Error banner — sticky-feel, color rojo */}
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl border-2 border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 20" }}
              >
                error
              </span>
              <p className="text-sm font-bold leading-snug">{formError}</p>
            </div>
          )}

          {/* Step content */}
          {renderStep()}

          {/* ── Navigation ── */}
          <div className="af-nav" style={{ marginTop: '2rem' }}>
            {currentStep > 0 ? (
              <button
                type="button"
                className="af-nav__back"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  arrow_back
                </span>
                Atrás
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              className={isLastStep ? 'af-nav__submit' : 'af-nav__next'}
              onClick={handlePrimary}
              disabled={isSubmitting}
            >
              {isLastStep
                ? (isSubmitting ? 'Enviando…' : 'Enviar solicitud')
                : 'Continuar'}
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                {isLastStep ? 'send' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Saved indicator ── */}
        {savedAt && (
          <p className="af-saved">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 15" }}
            >
              cloud_done
            </span>
            Borrador guardado {getRelativeTime(savedAt)}
          </p>
        )}

        {/* ── Success modal ── */}
        {/* No cerrable por click fuera: el draft ya se purgó y la única forma
            de avanzar es navegar a una de las dos rutas ofrecidas. */}
        {submittedRequest && (
          <div className="af-modal-overlay">
            <div className="af-modal">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 80, height: 80, margin: '0 auto 1.5rem' }}
              >
                <div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #dcfce7 0%, #f0fdf4 70%)',
                    border: '2px solid #bbf7d0',
                  }}
                />
                <div
                  className="absolute w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: '#16a34a' }}
                >
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontSize: 26, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 26" }}
                  >
                    task_alt
                  </span>
                </div>
              </div>

              <h2 className="af-modal__title">¡Solicitud enviada!</h2>

              <p className="af-modal__sub">
                Tu solicitud para adoptar a{' '}
                <strong>{perroNombre ?? 'este perro'}</strong> ha sido recibida
                y está siendo revisada por el refugio.
              </p>

              <div className="af-modal__id">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  tag
                </span>
                Solicitud #{submittedRequest.id.slice(0, 8)}
              </div>

              <div className="af-modal__actions">
                <Link href="/mis-solicitudes" className="af-modal__btn-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    folder_open
                  </span>
                  Ver mis solicitudes
                </Link>
                <Link href={`/perros/${perroId}`} className="af-modal__btn-secondary">
                  Volver al perfil del perro
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  )
}
