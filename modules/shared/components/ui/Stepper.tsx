// modules/shared/components/ui/Stepper.tsx
// Basado EXACTAMENTE en .auth-steps, .auth-step, .auth-step__circle, .auth-step__line del CSS original
'use client'

interface Step {
  id:           string
  label:        string
  description?: string
}

interface StepperProps {
  steps:          Step[]
  currentStep:    number   // índice 0-based
  completedSteps: number[] // índices completados
  errorSteps?:    number[] // índices con error
  orientation?:  'horizontal' | 'vertical'
  className?:    string
}

export function Stepper({
  steps, currentStep, completedSteps, errorSteps = [], orientation = 'horizontal', className = '',
}: StepperProps) {

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col gap-0 ${className}`}>
        {steps.map((step, i) => {
          const isDone    = completedSteps.includes(i)
          const isActive  = i === currentStep
          const isError   = errorSteps.includes(i)
          const isLast    = i === steps.length - 1

          return (
            <div key={step.id} className="flex gap-4">
              {/* Columna izquierda: círculo + línea */}
              <div className="flex flex-col items-center">
                {/* Círculo — .auth-step__circle */}
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-[950] border-2 flex-shrink-0 bg-white',
                  'transition-all duration-300',
                  isError   ? 'border-[#ef4444] text-[#ef4444] shadow-[0_0_0_4px_rgba(239,68,68,0.14)]' :
                  isDone    ? 'border-[var(--brand)] bg-[var(--brand)] text-white' :
                  isActive  ? 'border-[var(--brand)] text-[var(--brand)] shadow-[0_0_0_4px_rgba(255,107,107,0.14)]' :
                              'border-[#e5e7eb] text-[#9ca3af]',
                ].join(' ')}>
                  {isError  ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span> :
                   isDone   ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> :
                              i + 1}
                </div>
                {/* Línea vertical */}
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1 min-h-[2rem] ${isDone ? 'bg-[var(--brand)]' : 'bg-[#e5e7eb]'}`} />
                )}
              </div>

              {/* Texto */}
              <div className={`pb-6 pt-0.5 ${isLast ? '' : ''}`}>
                <p className={`text-sm font-[900] leading-tight ${isActive ? 'text-[var(--brand)]' : isDone ? 'text-[#18181b]' : 'text-[#9ca3af]'}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-[#9ca3af] font-[600] mt-0.5 leading-snug">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Horizontal — IDÉNTICO a .auth-steps ──────────────────────────────────────
  return (
    <div className={`flex justify-between items-flex-start relative ${className}`}>
      {steps.map((step, i) => {
        const isDone   = completedSteps.includes(i)
        const isActive = i === currentStep
        const isError  = errorSteps.includes(i)
        const isLast   = i === steps.length - 1

        return (
          <div key={step.id} className="relative flex flex-col items-center flex-1 z-[1]">
            {/* Línea conectora — .auth-step__line */}
            {!isLast && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 z-[-1] transition-colors duration-300
                  ${isDone ? 'bg-[var(--brand)]' : 'bg-[#e5e7eb]'}`}
              />
            )}

            {/* Círculo — .auth-step__circle */}
            <div className={[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-[950] border-2 bg-white',
              'transition-all duration-300',
              isError  ? 'border-[#ef4444] text-[#ef4444] shadow-[0_0_0_4px_rgba(239,68,68,0.14)]' :
              isDone   ? 'border-[var(--brand)] bg-[var(--brand)] text-white' :
              isActive ? 'border-[var(--brand)] text-[var(--brand)] shadow-[0_0_0_4px_rgba(255,107,107,0.14)]' :
                         'border-[#e5e7eb] text-[#9ca3af]',
            ].join(' ')}>
              {isError  ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span> :
               isDone   ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> :
                          i + 1}
            </div>

            {/* Label — .auth-step__label */}
            <span className={[
              'mt-2.5 text-xs font-[900] text-center whitespace-nowrap transition-colors duration-300',
              isActive ? 'text-[var(--brand)]' : isDone ? 'text-[#3f3f46]' : 'text-[#9ca3af]',
            ].join(' ')}>
              {step.label}
            </span>

            {step.description && (
              <span className="mt-0.5 text-[10px] text-[#9ca3af] text-center font-[600] hidden sm:block">
                {step.description}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
