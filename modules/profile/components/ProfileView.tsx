// modules/profile/components/ProfileView.tsx
// Perfil del usuario con 4 pestañas:
//   Mis datos · Seguridad · Preferencias ML · Notificaciones
'use client'

import { useState, useEffect }  from 'react'
import { Avatar }   from '../../shared/components/ui/Avatar'
import { Input }    from '../../shared/components/ui/Input'
import { Button }   from '../../shared/components/ui/Button'
import { Alert }    from '../../shared/components/ui/Alert'
import { Select }   from '../../shared/components/ui/Select'
import { Toggle }   from '../../shared/components/ui/Toggle'
import { Spinner }  from '../../shared/components/ui/Spinner'
import { useProfile } from '../application/hooks/useProfile'
import type { LifestyleQuizAnswers } from '@/modules/shared/domain/LifestyleProfile'
import '../styles/profile.css'

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
  | 'tipoVivienda'
  | 'tieneJardin'
  | 'tamanoEspacio'
  | 'energiaPreferida'
  | 'sexoPreferido'
  | 'horasLibresParaPerro'
  | 'presupuestoMensualMXN'
  | 'conviveConNinos'
  | 'conviveConMascotas'
  | 'experienciaPrevia'
  | 'disponibilidadEntrenamiento'
>

function defaultDraft(base: LifestyleQuizAnswers | null): PrefDraft {
  const src = base ?? LIFESTYLE_DEFAULTS
  return {
    actividadFisica:             src.actividadFisica,
    tipoVivienda:                src.tipoVivienda,
    tieneJardin:                 src.tieneJardin,
    tamanoEspacio:               src.tamanoEspacio,
    energiaPreferida:            src.energiaPreferida,
    sexoPreferido:               src.sexoPreferido,
    horasLibresParaPerro:        src.horasLibresParaPerro,
    presupuestoMensualMXN:       src.presupuestoMensualMXN,
    conviveConNinos:             src.conviveConNinos,
    conviveConMascotas:          src.conviveConMascotas,
    experienciaPrevia:           src.experienciaPrevia,
    disponibilidadEntrenamiento: src.disponibilidadEntrenamiento,
  }
}

function TabPreferences() {
  const {
    lifestyle, loadingPreferences, savingPreferences,
    preferencesError, preferencesOk,
    updatePreferences, clearStatus,
    isApplicant,
  } = useProfile()

  const [draft, setDraft] = useState<PrefDraft>(() => defaultDraft(lifestyle))

  // Sincroniza el draft cuando se carguen las preferencias desde el servicio
  useEffect(() => {
    if (lifestyle) setDraft(defaultDraft(lifestyle))
  }, [lifestyle])

  function set<K extends keyof PrefDraft>(key: K, val: PrefDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: val }))
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
      {!lifestyle && (
        <div className="pf-card">
          <div className="pf-pref-empty">
            <span className="material-symbols-outlined pf-pref-empty__icon">pets</span>
            <p className="pf-pref-empty__title">Aún no tienes preferencias</p>
            <p className="pf-pref-empty__sub">
              Completa tu perfil de adopción para recibir recomendaciones personalizadas basadas en tu estilo de vida.
            </p>
          </div>
        </div>
      )}

      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">directions_run</span>
          Estilo de vida
        </h2>

        <div className="pf-pref-banner">
          <span className="material-symbols-outlined">auto_awesome</span>
          Tus preferencias mejoran las recomendaciones de perros que recibes
        </div>

        <div className="pf-form-grid">
          <Select
            label="Actividad física"
            value={draft.actividadFisica}
            onChange={e => set('actividadFisica', e.target.value as PrefDraft['actividadFisica'])}
            options={[
              { value: 'sedentario',  label: 'Sedentario' },
              { value: 'moderado',    label: 'Moderado' },
              { value: 'activo',      label: 'Activo' },
              { value: 'muy_activo',  label: 'Muy activo' },
            ]}
          />
          <Input
            label="Horas libres para el perro / día"
            type="number"
            min={0}
            max={24}
            value={draft.horasLibresParaPerro}
            onChange={e => set('horasLibresParaPerro', Number(e.target.value))}
            leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>}
          />
          <Select
            label="Tipo de vivienda"
            value={draft.tipoVivienda}
            onChange={e => set('tipoVivienda', e.target.value as PrefDraft['tipoVivienda'])}
            options={[
              { value: 'casa',          label: 'Casa' },
              { value: 'departamento',  label: 'Departamento' },
              { value: 'casa_campo',    label: 'Casa de campo / Rancho' },
              { value: 'otro',          label: 'Otro' },
            ]}
          />
          <Select
            label="Tamaño del espacio"
            value={draft.tamanoEspacio}
            onChange={e => set('tamanoEspacio', e.target.value as PrefDraft['tamanoEspacio'])}
            options={[
              { value: 'pequeño', label: 'Pequeño' },
              { value: 'mediano', label: 'Mediano' },
              { value: 'grande',  label: 'Grande' },
            ]}
          />
          <Select
            label="Energía preferida en el perro"
            value={draft.energiaPreferida}
            onChange={e => set('energiaPreferida', e.target.value as PrefDraft['energiaPreferida'])}
            options={[
              { value: 'baja',           label: 'Baja' },
              { value: 'moderada',       label: 'Moderada' },
              { value: 'alta',           label: 'Alta' },
              { value: 'sin_preferencia',label: 'Sin preferencia' },
            ]}
          />
          <Select
            label="Sexo preferido"
            value={draft.sexoPreferido}
            onChange={e => set('sexoPreferido', e.target.value as PrefDraft['sexoPreferido'])}
            options={[
              { value: 'macho',          label: 'Macho' },
              { value: 'hembra',         label: 'Hembra' },
              { value: 'sin_preferencia',label: 'Sin preferencia' },
            ]}
          />
          <div className="pf-form-full">
            <Input
              label="Presupuesto mensual estimado (MXN)"
              type="number"
              min={0}
              step={100}
              value={draft.presupuestoMensualMXN}
              onChange={e => set('presupuestoMensualMXN', Number(e.target.value))}
              leftIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>payments</span>}
              helperText="Incluye alimento, veterinario, accesorios"
            />
          </div>
        </div>
      </div>

      <div className="pf-card">
        <h2 className="pf-card__title">
          <span className="material-symbols-outlined">family_restroom</span>
          Convivencia y experiencia
        </h2>
        <div className="pf-pref-toggles">
          <Toggle
            checked={draft.tieneJardin}
            onChange={v => set('tieneJardin', v)}
            label="Tengo jardín o patio"
            description="Importante para perros de tamaño grande o alta energía"
          />
          <Toggle
            checked={draft.conviveConNinos}
            onChange={v => set('conviveConNinos', v)}
            label="Convivo con niños"
            description="Priorizamos perros amigables con niños en las recomendaciones"
          />
          <Toggle
            checked={draft.conviveConMascotas}
            onChange={v => set('conviveConMascotas', v)}
            label="Tengo otras mascotas"
            description="Filtramos perros con buena convivencia con otros animales"
          />
          <Toggle
            checked={draft.experienciaPrevia}
            onChange={v => set('experienciaPrevia', v)}
            label="Tengo experiencia previa con perros"
            description="Consideramos tu experiencia para recomendar razas o niveles de energía"
          />
          <Toggle
            checked={draft.disponibilidadEntrenamiento}
            onChange={v => set('disponibilidadEntrenamiento', v)}
            label="Disponible para entrenamiento"
            description="Abierto a perros que requieran adiestramiento básico"
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
          {lifestyle ? 'Actualizar preferencias' : 'Guardar preferencias'}
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

      {/* ── Header ── */}
      <div className="pf-header">
        <div className="pf-header__avatar-wrap">
          <Avatar src={user.avatarUrl} name={user.nombre} size="xl" />
          <button
            type="button"
            className="pf-header__avatar-edit"
            aria-label="Cambiar foto de perfil"
            title="Cambiar foto (próximamente)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>photo_camera</span>
          </button>
        </div>

        <div className="pf-header__info">
          <p className="pf-header__name">{user.nombre}</p>
          <p className="pf-header__email">{user.correo}</p>
          <span className={`pf-header__role ${roleCls}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 14" }}>
              verified_user
            </span>
            {roleLabel}
          </span>
          <p className="pf-header__since">
            Miembro desde {formatDate(user.fechaRegistro)}
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pf-tabs">
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`pf-tab${currentTab === tab.key ? ' pf-tab--active' : ''}`}
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
      </div>

      {/* ── Tab panels ── */}
      {currentTab === 'data'          && <TabData />}
      {currentTab === 'security'      && <TabSecurity />}
      {currentTab === 'preferences'   && <TabPreferences />}
      {currentTab === 'notifications' && <TabNotifications />}
    </div>
  )
}
