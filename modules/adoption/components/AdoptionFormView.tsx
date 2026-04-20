// modules/adoption/components/AdoptionFormView.tsx
// Orquesta el formulario multi-paso de adopción
'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { useAuthStore }     from '../../shared/infrastructure/store/authStore'
import { useAdoptionForm }  from '../application/hooks/useAdoptionForm'
import { ADOPTION_STEPS }   from '../domain/AdoptionRequest'
import { Stepper }          from '../../shared/components/ui/Stepper'
import PersonalDataStep     from './steps/PersonalDataStep'
import HousingStep          from './steps/HousingStep'
import RoutineStep          from './steps/RoutineStep'
import ExperienceStep       from './steps/ExperienceStep'
import CommitmentsStep      from './steps/CommitmentsStep'
import ReviewStep           from './steps/ReviewStep'
import type { Dog }         from '../../shared/domain/Dog'
import '../styles/adoptionForm.css'

interface Props {
  dog: Dog
}

// ─── Tiempo relativo ──────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  return `hace ${Math.floor(mins / 60)} h`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdoptionFormView({ dog }: Props) {
  const user = useAuthStore(s => s.user)

  const form = useAdoptionForm({
    perroId:     dog.id,
    perroSlug:   dog.nombre.toLowerCase().replace(/\s+/g, '-'),
    perroNombre: dog.nombre,
    refugioId:   dog.refugioId,
  })

  const {
    currentStep, formData, errors, isSubmitting, savedAt,
    submittedRequest,
    nextStep, prevStep, updateField, submitForm,
  } = form

  // Steps for Stepper component (id must be string)
  const stepperSteps = ADOPTION_STEPS.map(s => ({ id: String(s.id), label: s.label }))
  const completedSteps = ADOPTION_STEPS.slice(0, currentStep).map(s => s.id)

  // ── Render current step ────────────────────────────────────────────────────

  function renderStep() {
    switch (currentStep) {
      case 0: return <PersonalDataStep errors={errors} />
      case 1: return <HousingStep    data={formData} errors={errors} updateField={updateField} />
      case 2: return <RoutineStep    data={formData} errors={errors} updateField={updateField} />
      case 3: return <ExperienceStep data={formData} errors={errors} updateField={updateField} />
      case 4: return <CommitmentsStep data={formData} errors={errors} updateField={updateField} />
      case 5: return (
        <ReviewStep
          data={formData}
          dog={dog}
          isSubmitting={isSubmitting}
          errors={errors}
          onSubmit={submitForm}
        />
      )
      default: return null
    }
  }

  // ── Guard — shouldn't be visible if user isn't applicant ──────────────────
  if (!user) return null

  return (
    <div className="af-page">

      {/* ── Dog bar ── */}
      <div className="af-dog-bar">
        <div className="af-dog-bar__photo">
          <Image
            src={dog.foto ?? ''}
            alt={dog.nombre}
            fill
            className="object-cover"
            sizes="52px"
          />
        </div>
        <div className="af-dog-bar__info">
          <p className="af-dog-bar__name">Adoptando a {dog.nombre}</p>
          <p className="af-dog-bar__sub">
            {dog.raza} · {dog.refugioNombre ?? 'Refugio'}
          </p>
        </div>
        <Link
          href={`/perros/${dog.nombre.toLowerCase().replace(/\s+/g, '-')}`}
          className="af-dog-bar__back"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
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
              {ADOPTION_STEPS[currentStep].icon}
            </span>
          </div>
          <p className="af-step-header__kicker">Paso {currentStep + 1} de {ADOPTION_STEPS.length}</p>
          <h2 className="af-step-header__title">{ADOPTION_STEPS[currentStep].title}</h2>
          <p className="af-step-header__sub">{ADOPTION_STEPS[currentStep].subtitle}</p>
        </div>

        {/* Step content */}
        {renderStep()}

        {/* ── Navigation (hidden on review step — ReviewStep has its own submit) ── */}
        {currentStep < 5 && (
          <div className="af-nav" style={{ marginTop: '2rem' }}>
            {currentStep > 0 ? (
              <button type="button" className="af-nav__back" onClick={prevStep}>
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_back</span>
                Atrás
              </button>
            ) : (
              <div />
            )}

            <button type="button" className="af-nav__next" onClick={nextStep}>
              {currentStep === 4 ? 'Revisar solicitud' : 'Continuar'}
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_forward</span>
            </button>
          </div>
        )}

        {/* Back button on review step */}
        {currentStep === 5 && (
          <div className="af-nav" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="af-nav__back" onClick={prevStep}>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_back</span>
              Editar respuestas
            </button>
          </div>
        )}
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
          Borrador guardado {relativeTime(savedAt)}
        </p>
      )}

      {/* ── Success modal ── */}
      {submittedRequest && (
        <div className="af-modal-overlay">
          <div className="af-modal">
            <div className="relative flex items-center justify-center" style={{ width: 80, height: 80, margin: '0 auto 1.5rem' }}>
              <div
                className="w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle, #dcfce7 0%, #f0fdf4 70%)', border: '2px solid #bbf7d0' }}
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
              <strong>{dog.nombre}</strong> ha sido recibida y está siendo
              revisada por el refugio.
            </p>

            <div className="af-modal__id">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                tag
              </span>
              Solicitud #{submittedRequest.id}
            </div>

            <div className="af-modal__actions">
              <Link href="/mis-solicitudes" className="af-modal__btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  folder_open
                </span>
                Ver mis solicitudes
              </Link>
              <Link href="/perros" className="af-modal__btn-secondary">
                Explorar más perros
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
