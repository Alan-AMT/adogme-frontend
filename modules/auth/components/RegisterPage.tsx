"use client";
// modules/auth/components/RegisterPage.tsx

import "../styles/auth.css";

import Link from "next/link";
import { useState } from "react";
import {
    ALCALDIAS_CDMX,
    mockRegisterAdoptante,
    mockRegisterRefugio,
} from "../infrastructure/MockAuthService";

type Role = "adoptante" | "refugio";
type Step = 1 | 2 | 3;

function getStrength(p: string) {
  if (!p) return { pct: 0, label: "", color: "#e4e4e7" };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const m = [
    { pct: 20, label: "Muy débil", color: "#ef4444" },
    { pct: 40, label: "Débil", color: "#f97316" },
    { pct: 65, label: "Regular", color: "#eab308" },
    { pct: 85, label: "Buena", color: "#22c55e" },
    { pct: 100, label: "Excelente", color: "#16a34a" },
  ];
  return m[s] ?? m[0];
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  children,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  children?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
        {required && <span className="auth-required">*</span>}
      </label>
      <div className="auth-control">
        <span className="material-symbols-outlined auth-icon" style={{ fontSize: 18 }}>{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="auth-input"
        />
        {children && <div className="auth-right-slot">{children}</div>}
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  icon,
  options,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
        {required && <span className="auth-required">*</span>}
      </label>
      <div className="auth-control">
        <span className="material-symbols-outlined auth-icon" style={{ fontSize: 18 }}>{icon}</span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="auth-select"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* Step indicator (uses auth.css classes to avoid misalignment) */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="auth-steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone = current > n;
        const isActive = current === n;
        const isLast = i === steps.length - 1;

        return (
          <div key={label} className={`auth-step ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`}>
            <div className="auth-step__row">
              <div className="auth-step__circle">
                {isDone ? (
                  <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                ) : (
                  n
                )}
              </div>

              {!isLast && <div className={`auth-step__line ${isDone ? "is-done" : ""}`} />}
            </div>

            <div className="auth-step__label">{label}</div>
          </div>
        );
      })}
    </div>
  );
}

const ROLES = [
  { id: "adoptante" as Role, icon: "person", label: "Adoptante", desc: "Quiero adoptar" },
  { id: "refugio" as Role, icon: "home_work", label: "Refugio", desc: "Tengo un refugio" },
];

const ADOPTANTE_STEPS = ["Perfil", "Contraseña", "Dirección"];
const REFUGIO_STEPS = ["Datos", "Contraseña", "Refugio"];

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("adoptante");
  const [step, setStep] = useState<Step>(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Shared
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Adoptante address
  const [alcaldia, setAlcaldia] = useState("");
  const [colonia, setColonia] = useState("");
  const [calle, setCalle] = useState("");
  const [numExt, setNumExt] = useState("");
  const [numInt, setNumInt] = useState("");
  const [cp, setCp] = useState("");

  // Refugio details
  const [refNombre, setRefNombre] = useState("");
  const [refUbicacion, setRefUbicacion] = useState("");
  const [refDescripcion, setRefDescripcion] = useState("");
  const [refTelefono, setRefTelefono] = useState("");
  const [refCorreo, setRefCorreo] = useState("");
  const [refAlcaldia, setRefAlcaldia] = useState("");
  const [refHorario, setRefHorario] = useState("");
  const [refCapacidad, setRefCapacidad] = useState("");

  const strength = getStrength(contrasena);
  const steps = role === "adoptante" ? ADOPTANTE_STEPS : REFUGIO_STEPS;

  function validate1() {
    if (!nombre.trim()) return "El nombre completo es requerido.";
    if (!correo.trim() || !/\S+@\S+\.\S+/.test(correo)) return "Correo electrónico inválido.";
    if (!telefono.trim()) return "El teléfono es requerido.";
    return "";
  }
  function validate2() {
    if (!contrasena) return "La contraseña es requerida.";
    if (contrasena.length < 8) return "Mínimo 8 caracteres.";
    if (contrasena !== confirmar) return "Las contraseñas no coinciden.";
    return "";
  }
  function validate3Adoptante() {
    if (!alcaldia) return "Selecciona una alcaldía.";
    if (!colonia.trim()) return "La colonia es requerida.";
    if (!calle.trim()) return "La calle es requerida.";
    if (!numExt.trim()) return "El número exterior es requerido.";
    if (!cp.trim()) return "El código postal es requerido.";
    return "";
  }
  function validate3Refugio() {
    if (!refNombre.trim()) return "El nombre del refugio es requerido.";
    if (!refUbicacion.trim()) return "La dirección del refugio es requerida.";
    if (!refAlcaldia) return "Selecciona la alcaldía donde se ubica el refugio.";
    if (!refDescripcion.trim()) return "La descripción es requerida.";
    return "";
  }

  function handleNext() {
    setError("");
    const err = step === 1 ? validate1() : validate2();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => (s + 1) as Step);
  }

  function handleBack() {
    setError("");
    setStep((s) => (s - 1) as Step);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const err = role === "adoptante" ? validate3Adoptante() : validate3Refugio();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      if (role === "adoptante") {
        const res = await mockRegisterAdoptante({
          nombre,
          correo,
          telefono,
          contrasena,
          confirmarContrasena: confirmar,
          alcaldia,
          colonia,
          calle,
          numeroExterior: numExt,
          numeroInterior: numInt,
          codigoPostal: cp,
        });
        setSuccess(`¡Cuenta creada exitosamente! Bienvenido, ${res.nombre}.`);
      } else {
        const res = await mockRegisterRefugio({
          nombre: refNombre,
          correo: refCorreo || correo,
          telefono: refTelefono || telefono,
          contrasena,
          confirmarContrasena: confirmar,
          ubicacion: refUbicacion,
          descripcion: refDescripcion,
        });
        setSuccess(
          `¡Refugio registrado! Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos a ${res.correo}.`
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-wrap">
          <div className="auth-card">
            <div className="auth-card__accent" />
            <div className="auth-card__body">
              <div className="auth-brand">
                <div className="auth-brand__icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff", fontVariationSettings: "'FILL' 1" }}>
                    pets
                  </span>
                </div>
                <div className="auth-brand__name">
                  a<strong>DOG</strong>me
                </div>
              </div>

              <h1 className="auth-title">Crear cuenta</h1>
              <p className="auth-subtitle">
                ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
              </p>

              {/* Google (step 1 only) */}
              {step === 1 && !success && (
                <>
                  <button type="button" className="auth-google">
                    <GoogleIcon />
                    Continuar con Google
                  </button>

                  <div className="auth-divider">
                    <div className="auth-divider__line" />
                    <div className="auth-divider__text">o regístrate con correo</div>
                    <div className="auth-divider__line" />
                  </div>
                </>
              )}

              {/* Role selector (step 1 only) */}
              {step === 1 && !success && (
                <div className="auth-mb-10">
                  <div className="auth-section-kicker auth-section-kicker--red">Tipo de cuenta</div>

                  <div className="auth-role-grid">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRole(r.id);
                          setError("");
                          setStep(1);
                        }}
                        className={`auth-role ${role === r.id ? "is-active" : ""}`}
                      >
                        <span className="material-symbols-outlined auth-role__icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {r.icon}
                        </span>
                        <div className="auth-role__title">{r.label}</div>
                        <div className="auth-role__desc">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Refugio notice */}
              {role === "refugio" && step === 1 && !success && (
                <div className="auth-alert auth-alert--warn">
                  <span className="material-symbols-outlined auth-alert__icon" style={{ fontSize: 16 }}>info</span>
                  Los refugios requieren aprobación del administrador antes de publicar perros. Puedes completar tu perfil
                  (logo e imágenes) después del registro.
                </div>
              )}

              {/* Step indicator */}
              {!success && <StepIndicator steps={steps} current={step} />}

              {/* Alerts */}
              {error && (
                <div className="auth-alert auth-alert--error">
                  <span className="material-symbols-outlined auth-alert__icon" style={{ fontSize: 16 }}>error</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="auth-alert auth-alert--success">
                  <span className="material-symbols-outlined auth-alert__icon" style={{ fontSize: 16 }}>check_circle</span>
                  {success}
                </div>
              )}

              {!success && (
                <form className="auth-form" onSubmit={handleSubmit}>
                  {/* STEP 1 */}
                  {step === 1 && (
                    <>
                      <div className="auth-section-kicker">
                        {role === "adoptante" ? "Información personal" : "Responsable del refugio"}
                      </div>

                      <Field
                        id="reg-nombre"
                        required
                        label={role === "refugio" ? "Tu nombre (responsable)" : "Nombre completo"}
                        placeholder={role === "refugio" ? "Nombre del responsable" : "Tu nombre completo"}
                        value={nombre}
                        onChange={setNombre}
                        icon="person"
                      />

                      <Field
                        id="reg-correo"
                        required
                        label="Correo electrónico"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={correo}
                        onChange={setCorreo}
                        icon="mail"
                      />

                      <Field
                        id="reg-tel"
                        required
                        label="Teléfono"
                        placeholder="55 1234 5678"
                        value={telefono}
                        onChange={setTelefono}
                        icon="call"
                      />

                      <button type="button" onClick={handleNext} className="auth-btn auth-btn--primary">
                        Siguiente
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          arrow_forward
                        </span>
                      </button>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <>
                      <div className="auth-section-kicker">Seguridad</div>

                      <div className="auth-field">
                        <label htmlFor="reg-pass" className="auth-label">
                          Contraseña<span className="auth-required">*</span>
                        </label>
                        <div className="auth-control">
                          <span className="material-symbols-outlined auth-icon" style={{ fontSize: 18 }}>
                            lock
                          </span>
                          <input
                            id="reg-pass"
                            type={showPass ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            autoComplete="new-password"
                            className="auth-input"
                          />
                          <div className="auth-right-slot">
                            <button type="button" onClick={() => setShowPass((v) => !v)} className="auth-eye">
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                {showPass ? "visibility_off" : "visibility"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {contrasena && (
                          <div className="auth-strength">
                            <div className="auth-strength__bar">
                              <div
                                className="auth-strength__fill"
                                style={{ width: `${strength.pct}%`, background: strength.color }}
                              />
                            </div>
                            <div className="auth-strength__label" style={{ color: strength.color }}>
                              {strength.label}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="auth-field">
                        <label htmlFor="reg-confirm" className="auth-label">
                          Confirmar contraseña<span className="auth-required">*</span>
                        </label>
                        <div className="auth-control">
                          <span className="material-symbols-outlined auth-icon" style={{ fontSize: 18 }}>
                            lock_reset
                          </span>
                          <input
                            id="reg-confirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            autoComplete="new-password"
                            className="auth-input"
                          />
                          <div className="auth-right-slot">
                            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="auth-eye">
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                {showConfirm ? "visibility_off" : "visibility"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {confirmar && contrasena !== confirmar && (
                          <div style={{ color: "#ef4444", fontWeight: 900, fontSize: 12, display: "flex", gap: 6, alignItems: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                            Las contraseñas no coinciden
                          </div>
                        )}
                      </div>

                      <div className="auth-btn-row">
                        <button type="button" onClick={handleBack} className="auth-btn auth-btn--ghost">
                          ← Atrás
                        </button>
                        <button type="button" onClick={handleNext} className="auth-btn auth-btn--primary">
                          Siguiente
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* STEP 3 ADOPTANTE */}
                  {step === 3 && role === "adoptante" && (
                    <>
                      <div className="auth-section-kicker">Dirección</div>

                      <SelectField
                        id="reg-alcaldia"
                        required
                        label="Alcaldía / Municipio"
                        value={alcaldia}
                        onChange={setAlcaldia}
                        icon="location_city"
                        options={ALCALDIAS_CDMX}
                        placeholder="Selecciona una alcaldía"
                      />

                      <Field
                        id="reg-colonia"
                        required
                        label="Colonia"
                        placeholder="Nombre de tu colonia"
                        value={colonia}
                        onChange={setColonia}
                        icon="holiday_village"
                      />

                      <Field
                        id="reg-calle"
                        required
                        label="Calle"
                        placeholder="Nombre de la calle"
                        value={calle}
                        onChange={setCalle}
                        icon="signpost"
                      />

                      <div className="auth-grid-2">
                        <Field
                          id="reg-ext"
                          required
                          label="Núm. exterior"
                          placeholder="123"
                          value={numExt}
                          onChange={setNumExt}
                          icon="home"
                        />
                        <Field
                          id="reg-int"
                          label="Núm. interior"
                          placeholder="Depto (opc.)"
                          value={numInt}
                          onChange={setNumInt}
                          icon="apartment"
                        />
                      </div>

                      <Field
                        id="reg-cp"
                        required
                        label="Código postal"
                        placeholder="Ej. 07000"
                        value={cp}
                        onChange={(v) => setCp(v.replace(/\D/g, "").slice(0, 5))}
                        icon="markunread_mailbox"
                      />

                      <div className="auth-btn-row">
                        <button type="button" onClick={handleBack} className="auth-btn auth-btn--ghost">
                          ← Atrás
                        </button>
                        <button type="submit" disabled={loading} className="auth-btn auth-btn--primary">
                          {loading ? (
                            <>
                              <span className="auth-spinner" />
                              Creando…
                            </>
                          ) : (
                            "Registrarme"
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {/* STEP 3 REFUGIO */}
                  {step === 3 && role === "refugio" && (
                    <>
                      <div className="auth-section-kicker">Datos del refugio</div>

                      <Field
                        id="ref-nombre"
                        required
                        label="Nombre del refugio"
                        placeholder="Ej. Patitas Felices GAM"
                        value={refNombre}
                        onChange={setRefNombre}
                        icon="home_work"
                      />

                      <SelectField
                        id="ref-alcaldia"
                        required
                        label="Alcaldía donde se ubica"
                        value={refAlcaldia}
                        onChange={setRefAlcaldia}
                        icon="location_city"
                        options={ALCALDIAS_CDMX}
                        placeholder="Selecciona una alcaldía"
                      />

                      <Field
                        id="ref-ubicacion"
                        required
                        label="Dirección completa"
                        placeholder="Calle, número, colonia"
                        value={refUbicacion}
                        onChange={setRefUbicacion}
                        icon="location_on"
                      />

                      <div className="auth-grid-2">
                        <Field
                          id="ref-tel"
                          label="Teléfono del refugio"
                          placeholder="55 0000 0000"
                          value={refTelefono}
                          onChange={setRefTelefono}
                          icon="call"
                        />
                        <Field
                          id="ref-correo"
                          label="Correo del refugio"
                          type="email"
                          placeholder="refugio@mail.com"
                          value={refCorreo}
                          onChange={setRefCorreo}
                          icon="mail"
                        />
                      </div>

                      <Field
                        id="ref-horario"
                        label="Horario de atención"
                        placeholder="Lun–Vie 9:00–18:00"
                        value={refHorario}
                        onChange={setRefHorario}
                        icon="schedule"
                      />

                      <Field
                        id="ref-capacidad"
                        label="Capacidad aproximada (perros)"
                        placeholder="Ej. 30"
                        value={refCapacidad}
                        onChange={(v) => setRefCapacidad(v.replace(/\D/g, ""))}
                        icon="pets"
                      />

                      <div className="auth-field">
                        <label className="auth-label">
                          Descripción del refugio<span className="auth-required">*</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Cuéntanos sobre tu refugio, misión, cuánto tiempo llevan operando…"
                          value={refDescripcion}
                          onChange={(e) => setRefDescripcion(e.target.value)}
                          className="auth-textarea"
                        />
                      </div>

                      <div className="auth-alert auth-alert--info">
                        <span className="material-symbols-outlined auth-alert__icon" style={{ fontSize: 16 }}>
                          photo_camera
                        </span>
                        Logo e imágenes de portada podrás subirlas desde tu perfil después del registro. Son necesarias para
                        ser aprobado y publicar perros.
                      </div>

                      <div className="auth-btn-row">
                        <button type="button" onClick={handleBack} className="auth-btn auth-btn--ghost">
                          ← Atrás
                        </button>
                        <button type="submit" disabled={loading} className="auth-btn auth-btn--primary">
                          {loading ? (
                            <>
                              <span className="auth-spinner" />
                              Registrando…
                            </>
                          ) : (
                            "Registrar refugio"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {success && (
                <Link href="/login" className="auth-btn auth-btn--primary auth-mt-8">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                    login
                  </span>
                  Ir a iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-info">
          <div className="auth-info__kicker">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>apparel</span>
            crea tu cuenta
          </div>

          <h2 className="auth-info__title">
            Regístrate para adoptar o registrar tu refugio
          </h2>

          <p className="auth-info__desc">
            Crea tu perfil en minutos. Si eres refugio, tu cuenta se revisa para asegurar transparencia y confianza en la comunidad.
          </p>

          <ul className="auth-info__list">
            <li className="auth-info__item">Adoptantes: filtra y guarda favoritos</li>
            <li className="auth-info__item">Refugios: publica perros y gestiona solicitudes</li>
            <li className="auth-info__item">Seguridad: contraseñas fuertes y validaciones</li>
          </ul>

          <div className="auth-info__actions">
            <button className="auth-info__btn" type="button">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
              Cómo funciona
            </button>
            <button className="auth-info__btn" type="button">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shield</span>
              Seguridad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
