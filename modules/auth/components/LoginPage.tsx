"use client";
// modules/auth/components/LoginPage.tsx

import "../styles/auth.css";

import Link from "next/link";
import { useState } from "react";
import { mockLogin } from "../infrastructure/MockAuthService";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  children,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">{label}</label>
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

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!correo.trim() || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await mockLogin({ correo: correo.trim(), contrasena, recordar });
      setSuccess(`¡Bienvenido de vuelta, ${res.nombre}! Redirigiendo…`);
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

              <h1 className="auth-title">Inicia sesión</h1>
              <p className="auth-subtitle">
                ¿No tienes cuenta?{" "}
                <Link href="/registro">Regístrate gratis</Link>
              </p>

              <button type="button" className="auth-google">
                <GoogleIcon />
                Continuar con Google
              </button>

              <div className="auth-divider">
                <div className="auth-divider__line" />
                <div className="auth-divider__text">o continúa con correo</div>
                <div className="auth-divider__line" />
              </div>

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

              <form className="auth-form" onSubmit={handleSubmit}>
                <InputField
                  id="login-correo"
                  label="Correo electrónico"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={correo}
                  onChange={setCorreo}
                  icon="mail"
                />

                <InputField
                  id="login-pass"
                  label="Contraseña"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={setContrasena}
                  icon="lock"
                >
                  <button type="button" onClick={() => setShowPass(v => !v)} className="auth-eye">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {showPass ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </InputField>

                <div className="auth-row">
                  <label className="auth-check">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      checked={recordar}
                      onChange={(e) => setRecordar(e.target.checked)}
                    />
                    Recordarme
                  </label>

                  {/* Enlace corregido para recuperación de contraseña */}
                  <Link href="/forgot-password" size="13px" className="auth-link">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="auth-btn auth-btn--primary">
                  {loading ? (
                    <>
                      <span className="auth-spinner" />
                      Ingresando…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                        login
                      </span>
                      Iniciar sesión
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="auth-hint">
            <strong>Demo:</strong> usa <span className="auth-code">ana.garcia@email.com</span> · contraseña{" "}
            <span className="auth-code">password123</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-info">
          <div className="auth-info__kicker">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
            portal de adopción
          </div>

          <h2 className="auth-info__title">
            Inicia sesión y encuentra a tu próximo mejor amigo
          </h2>

          <p className="auth-info__desc">
            aDOGme conecta adoptantes con refugios verificados. Filtra por tamaño, energía y compatibilidad, y lleva un
            proceso más seguro y acompañado.
          </p>

          <ul className="auth-info__list">
            <li className="auth-info__item">Perfiles verificados y procesos responsables</li>
            <li className="auth-info__item">Búsqueda rápida por alcaldía y preferencias</li>
            <li className="auth-info__item">Comunicación segura con refugios</li>
          </ul>

          <div className="auth-info__actions">
            {/* Botones habilitados con navegación Next.js */}
            <Link href="/perros" className="auth-info__btn">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>pets</span>
              Ver perros
            </Link>
            <Link href="/refugios" className="auth-info__btn">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home_work</span>
              Ver refugios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
