// modules/profile/components/ProfileView.tsx
// Perfil del usuario con 4 pestañas:
//   Mis datos · Seguridad · Preferencias ML · Notificaciones
'use client'

import Link from 'next/link'
import { useState, useEffect }  from 'react'
import { Avatar }   from '../../shared/components/ui/Avatar'
import { Input }    from '../../shared/components/ui/Input'
import { Button }   from '../../shared/components/ui/Button'
import { Alert }    from '../../shared/components/ui/Alert'
import { Toggle }   from '../../shared/components/ui/Toggle'
import { Spinner }  from '../../shared/components/ui/Spinner'
import { useProfile } from '../application/hooks/useProfile'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'
import '../styles/profile.css'
import '../../recommendations/styles/quiz.css'

// ─── Constantes ───────────────────────────────────────────────────────────────

type TabKey = 'data' | 'security' | 'preferences' | 'notifications'

interface TabDef {
  key:   TabKey
  label: string
  icon:  string
  /** Si true, la pestaña solo se muestra para applicant */
  applicantOnly?: boolean
}

const TABS: TabDef[] = [
  { key: 'data',          label: 'Mis datos',       icon: 'person'         },
  { key: 'security',      label: 'Seguridad',        icon: 'lock'           },
  { key: 'preferences',   label: 'Preferencias ML',  icon: 'auto_awesome', applicantOnly: true },
  { key: 'notifications', label: 'Notificaciones',   icon: 'notifications'  },
]

const ROLE_LABEL: Record<string, string> = {
  applicant: 'Adoptante',
  shelter:   'Refugio',
  admin:     'Administrador',
}

const LIFESTYLE_DEFAULTS: LifestyleQuizAnswers = {
  actividadFisica:                    'moderado',
  horasEnCasaDiarias:                 8,
  horasLibresParaPerro:               2,
  tipoVivienda:                       'departamento',
  tieneJardin:                        false,
  tamanoEspacio:                      'mediano',
  experienciaPrevia:                  false,
  conviveConNinos:                    false,
  conviveConMascotas:                 false,
  tamanoPreferido:                    ['sin_preferencia'],
  energiaPreferida:                   'sin_preferencia',
  sexoPreferido:                      'sin_preferencia',
  edadPreferida:                      ['sin_preferencia'],
  presupuestoMensualMXN:              2000,
  disponibilidadEntrenamiento:        false,
  aceptaPerroConNecesidadesEspeciales: false,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function pwdStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0
  if (pwd.length < 6) return 1
  if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return 2
  return 3
}

const STRENGTH_LABEL = ['', 'Débil', 'Media', 'Fuerte']
const STRENGTH_CLS   = ['', 'weak',  'medium', 'strong']

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────

// ── Tab 1: Mis datos ──────────────────────────────────────────────────────────

function TabData() {
  const { user, isApplicant, saving, saveError, saveOk, updateProfile, clearStatus } = useProfile()

  const [nombre,    setNombre]    = useState(user?.nombre    ?? '')
  const [telefono,  setTelefono]  = useState(user?.telefono  ?? '')
  const [direccion, setDireccion] = useState(
    isApplicant && user && 'direccion' in user ? (user as { direccion: string }).direccion : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearStatus('data')
    await updateProfile({
      nombre:    nombre    !== user?.nombre   ? nombre    : undefined,
      telefono:  telefono  !== user?.telefono ? telefono  : undefined,
      ...(isApplicant ? { direccion } : {}),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">badge</span>
          Información personal
        </h2>

        <div className="pf-form-grid">
          <Input
            label="Nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>}
          />
          <div className="pf-field-readonly">
            <p className="pf-field-readonly__label">Correo electrónico</p>
            <p className="pf-field-readonly__value">{user?.correo}</p>
          </div>
          <Input
            label="Teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            type="tel"
            leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>phone</span>}
          />
          {isApplicant && (
            <div className="pf-form-full">
              <Input
                label="Dirección"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>home_pin</span>}
                helperText="Colonia, calle y número, alcaldía, CDMX"
              />
            </div>
          )}
        </div>

        {saveError && (
          <div style={{ marginTop: '1rem' }}>
            <Alert type="error" message={saveError} closable />
          </div>
        )}
        {saveOk && (
          <div style={{ marginTop: '1rem' }}>
            <Alert type="success" message="Datos actualizados correctamente." closable />
          </div>
        )}

        <div className="pf-save-bar">
          <Button type="submit" loading={saving} size="md">
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>save</span>
            Guardar cambios
          </Button>
        </div>
      </div>
    </form>
  )
}

// ── Tab 2: Seguridad ──────────────────────────────────────────────────────────

function TabSecurity() {
  const { changingPassword, passwordError, passwordOk, changePassword, clearStatus } = useProfile()

  const [current,  setCurrent]  = useState('')
  const [newPwd,   setNewPwd]   = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [localErr, setLocalErr] = useState<string | null>(null)

  const strength  = pwdStrength(newPwd)
  const mismatch  = confirm.length > 0 && confirm !== newPwd

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalErr(null)
    clearStatus('password')

    if (newPwd.length < 8) {
      setLocalErr('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPwd !== confirm) {
      setLocalErr('Las contraseñas no coinciden.')
      return
    }

    await changePassword(current, newPwd)
    if (!passwordError) {
      setCurrent('')
      setNewPwd('')
      setConfirm('')
    }
  }

  const displayError = localErr ?? passwordError

  return (
    <form onSubmit={handleSubmit}>
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">lock</span>
          Cambiar contraseña
        </h2>

        <div className="pf-form-grid">
          <div className="pf-form-full">
            <Input
              label="Contraseña actual"
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              required
              leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>}
            />
          </div>
          <div>
            <Input
              label="Nueva contraseña"
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              required
              leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>}
            />
            {/* Strength indicator */}
            {newPwd.length > 0 && (
              <div>
                <div className="pf-pwd-strength">
                  {[1, 2, 3].map(level => (
                    <div
                      key={level}
                      className={[
                        'pf-pwd-strength__bar',
                        strength >= level ? `pf-pwd-strength__bar--${STRENGTH_CLS[strength]}` : '',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <p className={`pf-pwd-strength__label pf-pwd-strength__label--${STRENGTH_CLS[strength]}`}>
                  {STRENGTH_LABEL[strength]}
                </p>
              </div>
            )}
          </div>
          <div>
            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              error={mismatch ? 'Las contraseñas no coinciden' : undefined}
              leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>}
            />
          </div>
        </div>

        {displayError && (
          <div style={{ marginTop: '1rem' }}>
            <Alert type="error" message={displayError} closable />
          </div>
        )}
        {passwordOk && (
          <div style={{ marginTop: '1rem' }}>
            <Alert type="success" message="Contraseña actualizada correctamente." closable />
          </div>
        )}

        <div className="pf-save-bar">
          <Button
            type="submit"
            loading={changingPassword}
            size="md"
            disabled={mismatch || !current || !newPwd || !confirm}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>lock_reset</span>
            Cambiar contraseña
          </Button>
        </div>
      </div>

      {/* Hint */}
      <div className="pf-card" style={{ background: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20, color: '#71717a', flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20" }}
          >
            info
          </span>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3f3f46', marginBottom: '0.2rem' }}>
              Consejos para una contraseña segura
            </p>
            <ul style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, lineHeight: 1.6, paddingLeft: '1rem', margin: 0 }}>
              <li>Al menos 8 caracteres</li>
              <li>Combina letras mayúsculas, minúsculas y números</li>
              <li>Evita usar tu nombre o fecha de nacimiento</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  )
}

// ── Tab 3: Preferencias ML ────────────────────────────────────────────────────

type PrefDraft = Pick<LifestyleQuizAnswers,
  | 'actividadFisica'
  | 'horasLibresParaPerro'
  | 'tipoVivienda'
  | 'tieneJardin'
  | 'tamanoEspacio'
  | 'energiaPreferida'
  | 'sexoPreferido'
  | 'tamanoPreferido'
  | 'edadPreferida'
  | 'presupuestoMensualMXN'
  | 'conviveConNinos'
  | 'conviveConMascotas'
  | 'experienciaPrevia'
  | 'disponibilidadEntrenamiento'
  | 'aceptaPerroConNecesidadesEspeciales'
>

// ── Quiz option constants ─────────────────────────────────────────────────────

const PF_ACTIVITIES = [
  { value: 'sedentario' as const, icon: 'weekend',         label: 'Sedentario', desc: 'Prefiero el descanso, salidas cortas' },
  { value: 'moderado'   as const, icon: 'directions_walk', label: 'Moderado',   desc: 'Caminatas y actividad ocasional'      },
  { value: 'activo'     as const, icon: 'directions_run',  label: 'Activo',     desc: 'Ejercito varias veces por semana'     },
  { value: 'muy_activo' as const, icon: 'sports',          label: 'Muy activo', desc: 'Deporte diario o actividad intensa'   },
]

const PF_HORAS = [
  { value: 0.5, label: '< 1 hora'    },
  { value: 1.5, label: '1 – 2 horas' },
  { value: 3.5, label: '3 – 4 horas' },
  { value: 5,   label: '+ 4 horas'   },
]

const PF_VIVIENDA = [
  { value: 'casa'         as const, icon: 'house',     label: 'Casa',          desc: 'Con o sin patio propio'   },
  { value: 'departamento' as const, icon: 'apartment', label: 'Departamento',  desc: 'Piso en edificio o torre' },
  { value: 'casa_campo'   as const, icon: 'cabin',     label: 'Casa de campo', desc: 'Rancho, granja o terreno' },
  { value: 'otro'         as const, icon: 'home_work', label: 'Otro',          desc: 'Habitación, cuarto, etc.' },
]

const PF_GARDEN = [
  { value: true,  icon: 'yard',           label: 'Sí, tengo', desc: 'Jardín, patio o terraza' },
  { value: false, icon: 'do_not_disturb', label: 'No tengo',  desc: 'Sin espacio exterior'    },
]

const PF_TAMANO_ESPACIO = [
  { value: 'pequeño' as const, label: 'Pequeño' },
  { value: 'mediano' as const, label: 'Mediano' },
  { value: 'grande'  as const, label: 'Grande'  },
]

const PF_TAMANO_PERRO = [
  { value: 'pequeño'         as const, icon: 'cruelty_free',    label: 'Pequeño',         desc: 'Menos de 10 kg'   },
  { value: 'mediano'         as const, icon: 'pets',            label: 'Mediano',         desc: '10 – 25 kg'       },
  { value: 'grande'          as const, icon: 'service_toolbox', label: 'Grande',          desc: '25 – 45 kg'       },
  { value: 'gigante'         as const, icon: 'skull',           label: 'Gigante',         desc: 'Más de 45 kg'     },
  { value: 'sin_preferencia' as const, icon: 'favorite',        label: 'Sin preferencia', desc: 'Cualquier tamaño' },
]

const PF_ENERGIA = [
  { value: 'baja'            as const, icon: 'self_care',       label: 'Tranquilo',  desc: 'Ideal para el sofá'         },
  { value: 'moderada'        as const, icon: 'directions_walk', label: 'Moderado',   desc: 'Equilibrado y adaptable'    },
  { value: 'alta'            as const, icon: 'directions_run',  label: 'Energético', desc: 'Le encanta el movimiento'   },
  { value: 'sin_preferencia' as const, icon: 'favorite',        label: 'Cualquiera', desc: 'Sin preferencia de energía' },
]

const PF_SEXO = [
  { value: 'macho'           as const, icon: 'male',        label: 'Macho'           },
  { value: 'hembra'          as const, icon: 'female',      label: 'Hembra'          },
  { value: 'sin_preferencia' as const, icon: 'transgender', label: 'Sin preferencia' },
]

const PF_EDAD = [
  { value: 'cachorro'        as const, label: 'Cachorro (0-1 año)' },
  { value: 'joven'           as const, label: 'Joven (1-3 años)'   },
  { value: 'adulto'          as const, label: 'Adulto (3-8 años)'  },
  { value: 'senior'          as const, label: 'Senior (8+ años)'   },
  { value: 'sin_preferencia' as const, label: 'Sin preferencia'    },
]

const PF_EXP = [
  { value: true,  icon: 'military_tech',  label: 'Tengo experiencia',  desc: 'He tenido o cuidado perros antes' },
  { value: false, icon: 'emoji_nature',   label: 'Soy nuevo en esto',  desc: 'Primera vez que adoptaré un perro' },
]

const PF_NINOS = [
  { value: true,  icon: 'child_care',    label: 'Sí, hay niños',   desc: 'El perro convivirá con menores' },
  { value: false, icon: 'person',        label: 'No hay niños',    desc: 'Solo adultos en casa'           },
]

const PF_MASCOTAS = [
  { value: true,  icon: 'pets',            label: 'Sí, tengo',  desc: 'Perros, gatos u otras mascotas' },
  { value: false, icon: 'do_not_disturb',  label: 'No tengo',   desc: 'Será el único animal en casa'   },
]

const PF_BUDGET = [
  { value: 500,  icon: 'savings',                label: 'Básico',     range: 'hasta $500/mes'      },
  { value: 1500, icon: 'account_balance_wallet', label: 'Estándar',   range: '$500 – $1,500/mes'   },
  { value: 3000, icon: 'credit_card',            label: 'Cómodo',     range: '$1,500 – $3,000/mes' },
  { value: 5000, icon: 'diamond',                label: 'Sin límite', range: 'más de $3,000/mes'   },
]

// ── Yes/No pill pair ──────────────────────────────────────────────────────────

function YesNoPair({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="qz-pills">
      <button type="button"
        className={`qz-pill${value === true ? ' qz-pill--selected' : ''}`}
        onClick={() => onChange(true)}
      >
        <span className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}>
          check_circle
        </span>
        Sí
      </button>
      <button type="button"
        className={`qz-pill${value === false ? ' qz-pill--selected' : ''}`}
        onClick={() => onChange(false)}
      >
        <span className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}>
          cancel
        </span>
        No
      </button>
    </div>
  )
}

// ── defaultDraft ──────────────────────────────────────────────────────────────

function defaultDraft(base: LifestyleQuizAnswers | null): PrefDraft {
  const src = base ?? LIFESTYLE_DEFAULTS
  return {
    actividadFisica:                     src.actividadFisica,
    horasLibresParaPerro:                src.horasLibresParaPerro,
    tipoVivienda:                        src.tipoVivienda,
    tieneJardin:                         src.tieneJardin,
    tamanoEspacio:                       src.tamanoEspacio,
    energiaPreferida:                    src.energiaPreferida,
    sexoPreferido:                       src.sexoPreferido,
    tamanoPreferido:                     src.tamanoPreferido,
    edadPreferida:                       src.edadPreferida,
    presupuestoMensualMXN:               src.presupuestoMensualMXN,
    conviveConNinos:                     src.conviveConNinos,
    conviveConMascotas:                  src.conviveConMascotas,
    experienciaPrevia:                   src.experienciaPrevia,
    disponibilidadEntrenamiento:         src.disponibilidadEntrenamiento,
    aceptaPerroConNecesidadesEspeciales: src.aceptaPerroConNecesidadesEspeciales,
  }
}

// ── TabPreferences ────────────────────────────────────────────────────────────

function TabPreferences() {
  const {
    lifestyle, loadingPreferences, savingPreferences,
    preferencesError, preferencesOk,
    updatePreferences, clearStatus,
    isApplicant,
  } = useProfile()

  const [draft, setDraft] = useState<PrefDraft>(() => defaultDraft(lifestyle))

  useEffect(() => {
    if (lifestyle) setDraft(defaultDraft(lifestyle))
  }, [lifestyle])

  function set<K extends keyof PrefDraft>(key: K, val: PrefDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: val }))
  }

  function toggleTamanoPerro(value: LifestyleQuizAnswers['tamanoPreferido'][number]) {
    const selected = draft.tamanoPreferido
    if (value === 'sin_preferencia') { set('tamanoPreferido', ['sin_preferencia']); return }
    const withoutSin = selected.filter(v => v !== 'sin_preferencia')
    if (withoutSin.includes(value)) {
      const next = withoutSin.filter(v => v !== value)
      set('tamanoPreferido', (next.length ? next : ['sin_preferencia']) as typeof selected)
    } else {
      set('tamanoPreferido', [...withoutSin, value] as typeof selected)
    }
  }

  function toggleEdadPerro(value: LifestyleQuizAnswers['edadPreferida'][number]) {
    const selected = draft.edadPreferida
    if (value === 'sin_preferencia') { set('edadPreferida', ['sin_preferencia']); return }
    const withoutSin = selected.filter(v => v !== 'sin_preferencia')
    if (withoutSin.includes(value)) {
      const next = withoutSin.filter(v => v !== value)
      set('edadPreferida', (next.length ? next : ['sin_preferencia']) as typeof selected)
    } else {
      set('edadPreferida', [...withoutSin, value] as typeof selected)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearStatus('preferences')
    const full: LifestyleQuizAnswers = {
      ...LIFESTYLE_DEFAULTS,
      ...(lifestyle ?? {}),
      ...draft,
    }
    await updatePreferences(full)
  }

  if (!isApplicant) {
    return (
      <div className="pf-card">
        <div className="pf-pref-empty">
          <span className="material-symbols-outlined pf-pref-empty__icon">auto_awesome</span>
          <p className="pf-pref-empty__title">Solo para adoptantes</p>
          <p className="pf-pref-empty__sub">
            Las preferencias ML están disponibles para cuentas de adoptante. Con ellas personalizamos las recomendaciones de perros.
          </p>
        </div>
      </div>
    )
  }

  if (loadingPreferences) {
    return (
      <div className="pf-card" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Banner: estado y acceso al quiz ── */}
      <div className="pf-card" style={{
        background: 'linear-gradient(135deg, #fff5f5 0%, #fff0f9 100%)',
        border: '1.5px solid #fecdd3',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#ff6b6b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: 22, color: '#fff',
                fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24",
              }}>
                auto_awesome
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '0.92rem', color: '#18181b', lineHeight: 1.2 }}>
                {lifestyle ? 'Perfil de compatibilidad activo' : 'Completa el cuestionario de compatibilidad'}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, marginTop: '0.15rem' }}>
                {lifestyle
                  ? 'Edita tus respuestas directamente o vuelve a llenar el cuestionario completo'
                  : 'El quiz de 7 pasos mejora la precisión de tu match con los perros'}
              </p>
            </div>
          </div>
          <Link
            href="/mi-match/quiz"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 1.1rem', borderRadius: '999px',
              background: '#ff6b6b', color: '#fff',
              fontWeight: 700, fontSize: '0.82rem',
              textDecoration: 'none', flexShrink: 0,
              boxShadow: '0 3px 10px rgba(255,107,107,0.28)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>quiz</span>
            {lifestyle ? 'Volver a llenar el quiz' : 'Llenar quiz'}
          </Link>
        </div>
      </div>

      {/* ── 1: Estilo de vida ── */}
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">directions_run</span>
          Estilo de vida
        </h2>

        <div className="qz-section" style={{ marginTop: 0 }}>
          <p className="qz-section__label">Actividad física</p>
          <div className="qz-cards-grid">
            {PF_ACTIVITIES.map(opt => {
              const isSel = draft.actividadFisica === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('actividadFisica', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="qz-section">
          <p className="qz-section__label">Horas al día para tu perro</p>
          <div className="qz-pills">
            {PF_HORAS.map(h => {
              const isSel = draft.horasLibresParaPerro === h.value
              return (
                <button key={h.value} type="button"
                  className={`qz-pill${isSel ? ' qz-pill--selected' : ''}`}
                  onClick={() => set('horasLibresParaPerro', h.value)}
                >
                  <span className="material-symbols-outlined"
                    style={{ fontSize: 14, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14" }}>
                    schedule
                  </span>
                  {h.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 2: Tu vivienda ── */}
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">house</span>
          Tu vivienda
        </h2>

        <div className="qz-section" style={{ marginTop: 0 }}>
          <p className="qz-section__label">Tipo de vivienda</p>
          <div className="qz-cards-grid">
            {PF_VIVIENDA.map(opt => {
              const isSel = draft.tipoVivienda === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('tipoVivienda', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="qz-section">
          <p className="qz-section__label">¿Cuentas con jardín o patio?</p>
          <div className="qz-cards-grid">
            {PF_GARDEN.map(opt => {
              const isSel = draft.tieneJardin === opt.value
              return (
                <button key={String(opt.value)} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('tieneJardin', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="qz-section">
          <p className="qz-section__label">Tamaño del espacio interior</p>
          <div className="qz-pills">
            {PF_TAMANO_ESPACIO.map(opt => {
              const isSel = draft.tamanoEspacio === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-pill${isSel ? ' qz-pill--selected' : ''}`}
                  onClick={() => set('tamanoEspacio', opt.value)}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 3: Experiencia y convivencia ── */}
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">family_restroom</span>
          Experiencia y convivencia
        </h2>

        {/* Experiencia previa */}
        <div className="qz-section" style={{ marginTop: 0 }}>
          <p className="qz-section__label">¿Tienes experiencia con perros?</p>
          <div className="qz-cards-grid">
            {PF_EXP.map(opt => {
              const isSel = draft.experienciaPrevia === opt.value
              return (
                <button key={String(opt.value)} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('experienciaPrevia', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Niños */}
        <div className="qz-section">
          <p className="qz-section__label">¿Hay niños en el hogar?</p>
          <div className="qz-cards-grid">
            {PF_NINOS.map(opt => {
              const isSel = draft.conviveConNinos === opt.value
              return (
                <button key={String(opt.value)} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('conviveConNinos', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mascotas */}
        <div className="qz-section">
          <p className="qz-section__label">¿Tienes otras mascotas?</p>
          <div className="qz-cards-grid">
            {PF_MASCOTAS.map(opt => {
              const isSel = draft.conviveConMascotas === opt.value
              return (
                <button key={String(opt.value)} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('conviveConMascotas', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 30, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 32"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 32" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 4: Tu perro ideal ── */}
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">pets</span>
          Tu perro ideal
        </h2>

        {/* Tamaño preferido — multi-select */}
        <div className="qz-section" style={{ marginTop: 0 }}>
          <p className="qz-section__label">Tamaño preferido (puedes elegir varios)</p>
          <div className="qz-cards-grid">
            {PF_TAMANO_PERRO.slice(0, 4).map(opt => {
              const isSel = draft.tamanoPreferido.includes(opt.value)
              return (
                <button key={opt.value} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => toggleTamanoPerro(opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 28, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 30"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 30" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
          {/* Sin preferencia — fila completa */}
          {(() => {
            const sinPref = PF_TAMANO_PERRO[4]
            const isSel   = draft.tamanoPreferido.includes('sin_preferencia')
            return (
              <button type="button"
                className={`qz-card${isSel ? ' qz-card--selected' : ''}`}
                style={{ marginTop: '0.875rem', flexDirection: 'row', justifyContent: 'center', gap: '0.75rem', padding: '0.875rem', width: '100%' }}
                onClick={() => toggleTamanoPerro('sin_preferencia')}
              >
                <span className="material-symbols-outlined qz-card__icon"
                  style={{ fontSize: 22, fontVariationSettings: isSel
                    ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24"
                    : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24" }}>
                  {sinPref.icon}
                </span>
                <span className="qz-card__label">{sinPref.label}</span>
                <span className="qz-card__desc" style={{ margin: 0 }}>{sinPref.desc}</span>
              </button>
            )
          })()}
        </div>

        {/* Energía preferida */}
        <div className="qz-section">
          <p className="qz-section__label">Nivel de energía preferido</p>
          <div className="qz-cards-grid">
            {PF_ENERGIA.map(opt => {
              const isSel = draft.energiaPreferida === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-card qz-card--sm${isSel ? ' qz-card--selected' : ''}`}
                  onClick={() => set('energiaPreferida', opt.value)}
                >
                  <span className="material-symbols-outlined qz-card__icon"
                    style={{ fontSize: 28, fontVariationSettings: isSel
                      ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 30"
                      : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 30" }}>
                    {opt.icon}
                  </span>
                  <p className="qz-card__label">{opt.label}</p>
                  <p className="qz-card__desc">{opt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sexo preferido */}
        <div className="qz-section">
          <p className="qz-section__label">Sexo preferido</p>
          <div className="qz-pills">
            {PF_SEXO.map(opt => {
              const isSel = draft.sexoPreferido === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-pill${isSel ? ' qz-pill--selected' : ''}`}
                  onClick={() => set('sexoPreferido', opt.value)}
                >
                  <span className="material-symbols-outlined"
                    style={{ fontSize: 15, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 16" }}>
                    {opt.icon}
                  </span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Edad preferida — multi-select */}
        <div className="qz-section">
          <p className="qz-section__label">Edad preferida (puedes elegir varias)</p>
          <div className="qz-pills">
            {PF_EDAD.map(opt => {
              const isSel = draft.edadPreferida.includes(opt.value)
              return (
                <button key={opt.value} type="button"
                  className={`qz-pill${isSel ? ' qz-pill--selected' : ''}`}
                  onClick={() => toggleEdadPerro(opt.value)}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 5: Compromisos y presupuesto ── */}
      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">volunteer_activism</span>
          Compromisos y presupuesto
        </h2>

        <div className="qz-section" style={{ marginTop: 0 }}>
          <p className="qz-section__label">Presupuesto mensual estimado</p>
          <div className="qz-budget-grid">
            {PF_BUDGET.map(opt => {
              const isSel = draft.presupuestoMensualMXN === opt.value
              return (
                <button key={opt.value} type="button"
                  className={`qz-budget-card${isSel ? ' qz-budget-card--selected' : ''}`}
                  onClick={() => set('presupuestoMensualMXN', opt.value)}
                >
                  <span className="material-symbols-outlined"
                    style={{
                      fontSize: 26,
                      color: isSel ? '#ff6b6b' : '#a1a1aa',
                      fontVariationSettings: isSel
                        ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 28"
                        : "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 28",
                      marginBottom: '0.2rem',
                    }}>
                    {opt.icon}
                  </span>
                  <p className="qz-budget-card__amount">{opt.label}</p>
                  <p className="qz-budget-card__range">{opt.range}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="qz-section">
          <p className="qz-section__label">¿Estás dispuesto a entrenar al perro?</p>
          <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, marginBottom: '0.6rem', lineHeight: 1.4 }}>
            Algunos perros necesitan adiestramiento básico y paciencia inicial
          </p>
          <YesNoPair
            value={draft.disponibilidadEntrenamiento}
            onChange={v => set('disponibilidadEntrenamiento', v)}
          />
        </div>

        <div className="qz-section">
          <p className="qz-section__label">¿Aceptas perros con necesidades especiales?</p>
          <p style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500, marginBottom: '0.6rem', lineHeight: 1.4 }}>
            Perros con discapacidades, enfermedades crónicas o que requieren cuidados extra
          </p>
          <YesNoPair
            value={draft.aceptaPerroConNecesidadesEspeciales}
            onChange={v => set('aceptaPerroConNecesidadesEspeciales', v)}
          />
        </div>
      </div>

      {preferencesError && (
        <Alert type="error" message={preferencesError} closable />
      )}
      {preferencesOk && (
        <Alert type="success" message="Preferencias guardadas. Las recomendaciones se actualizarán en tu próxima sesión." closable />
      )}

      <div className="pf-save-bar">
        <Button type="submit" loading={savingPreferences} size="md">
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>auto_awesome</span>
          {lifestyle ? 'Guardar cambios' : 'Guardar preferencias'}
        </Button>
      </div>
    </form>
  )
}

// ── Tab 4: Notificaciones ─────────────────────────────────────────────────────

interface NotifSettings {
  newDogMatches:  boolean
  requestUpdates: boolean
  newsAndTips:    boolean
}

const NOTIF_DEFAULT: NotifSettings = {
  newDogMatches:  true,
  requestUpdates: true,
  newsAndTips:    false,
}

function TabNotifications() {
  const { user } = useProfile()
  const [loaded, setLoaded] = useState(false)
  const [notif,  setNotif]  = useState<NotifSettings>(NOTIF_DEFAULT)

  const storageKey = `notif-prefs-${user?.id ?? 0}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setNotif(JSON.parse(raw) as NotifSettings)
    } catch { /* noop */ }
    setLoaded(true)
  }, [storageKey])

  function toggle(key: keyof NotifSettings) {
    setNotif(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* noop */ }
      return next
    })
  }

  if (!loaded) return null

  const rows: { key: keyof NotifSettings; title: string; desc: string }[] = [
    {
      key:   'newDogMatches',
      title: 'Nuevas coincidencias',
      desc:  'Recibe alertas cuando aparezcan perros que coincidan con tus preferencias ML.',
    },
    {
      key:   'requestUpdates',
      title: 'Estado de solicitudes',
      desc:  'Notificaciones cuando el refugio actualice el estado de tu solicitud de adopción.',
    },
    {
      key:   'newsAndTips',
      title: 'Novedades y consejos',
      desc:  'Tips de cuidado, historias de adopción y novedades de la plataforma.',
    },
  ]

  return (
    <div className="pf-card">
      <h2 className="pf-card__title">
        <span className="material-symbols-outlined">notifications</span>
        Notificaciones
      </h2>
      <div className="pf-notif-list">
        {rows.map(row => (
          <div key={row.key} className="pf-notif-row">
            <div className="pf-notif-row__info">
              <p className="pf-notif-row__title">{row.title}</p>
              <p className="pf-notif-row__desc">{row.desc}</p>
            </div>
            <Toggle
              checked={notif[row.key]}
              onChange={() => toggle(row.key)}
              id={`notif-${row.key}`}
            />
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 500, marginTop: '1rem' }}>
        Las preferencias se guardan localmente. Las notificaciones push estarán disponibles en la próxima versión.
      </p>
    </div>
  )
}

// ─── ProfileView (orquestador) ────────────────────────────────────────────────

export default function ProfileView() {
  const { user, isApplicant } = useProfile()
  const [activeTab, setActiveTab] = useState<TabKey>('data')

  const visibleTabs = TABS.filter(t => !t.applicantOnly || isApplicant)

  // Si el tab activo ya no es visible (p.ej. shelter entra a 'preferences'), resetear
  const currentTab = visibleTabs.find(t => t.key === activeTab) ? activeTab : 'data'

  if (!user) return null

  const role      = user.role
  const roleCls   = `pf-header__role--${role}`
  const roleLabel = ROLE_LABEL[role] ?? role

  return (
    <div className="pf-page">

      {/* ── Columna izquierda: sidebar ── */}
      <div className="pf-sidebar-card">
        <div className="pf-cover" />
        <div className="pf-cover-body">
          <div className="pf-header__avatar-wrap">
            <Avatar src={user.avatarUrl} name={user.nombre} size="xl" />
            <button
              type="button"
              className="pf-header__avatar-edit"
              aria-label="Cambiar foto de perfil"
              title="Cambiar foto (próximamente)"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>photo_camera</span>
            </button>
          </div>

          <div className="pf-header__info">
            <p className="pf-header__name">{user.nombre}</p>
            <p className="pf-header__email">{user.correo}</p>
            <span className={`pf-header__role ${roleCls}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 13" }}>
                verified_user
              </span>
              {roleLabel}
            </span>
            <p className="pf-header__since">
              Miembro desde {formatDate(user.fechaRegistro)}
            </p>
          </div>
        </div>

        {/* Nav vertical */}
        <nav className="pf-vnav">
          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`pf-vnavitem${currentTab === tab.key ? ' pf-vnavitem--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: currentTab === tab.key
                    ? "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18"
                    : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 18",
                }}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Columna derecha: contenido ── */}
      <div className="pf-main">
        {currentTab === 'data'          && <TabData />}
        {currentTab === 'security'      && <TabSecurity />}
        {currentTab === 'preferences'   && <TabPreferences />}
        {currentTab === 'notifications' && <TabNotifications />}
      </div>
    </div>
  )
}
