"use client";

import Link from "next/link";
import { useState } from "react";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectarías con tu lógica de Firebase/Auth
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      {/* COLUMNA IZQUIERDA: Formulario (50%) */}
      <div className="auth-left">
        <div className="auth-wrap">
          <div className="auth-card">
            <div className="auth-card__accent" />
            <div className="auth-card__body">

              {/* Logo estilizado */}
              <div className="auth-brand">
                <div className="auth-brand__icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff", fontVariationSettings: "'FILL' 1" }}>
                    key
                  </span>
                </div>
                <div className="auth-brand__name">
                  a<strong>DOG</strong>me
                </div>
              </div>

              <h1 className="auth-title">Recuperar acceso</h1>
              <p className="auth-subtitle">
                Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>

              {!submitted ? (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="auth-field">
                    <label className="auth-label">Correo electrónico</label>
                    <div className="auth-control">
                      <span className="material-symbols-outlined auth-icon" style={{ fontSize: 18 }}>mail</span>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-btn auth-btn--primary auth-mt-8">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                    Enviar enlace de recuperación
                  </button>
                </form>
              ) : (
                <div className="auth-alert auth-alert--success">
                  <span className="material-symbols-outlined auth-alert__icon" style={{ fontSize: 20 }}>check_circle</span>
                  <p>Si el correo está registrado, recibirás un enlace de recuperación en unos minutos.</p>
                </div>
              )}

              <div className="auth-hint">
                <Link href="/login" className="auth-link">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>arrow_back</span>
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: Información (50%) */}
      <div className="auth-right">
        <div className="auth-info">
          <div className="auth-info__kicker">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>security</span>
            seguridad adogme
          </div>

          <h2 className="auth-info__title">
            Protegemos tu cuenta y a nuestros peludos
          </h2>

          <p className="auth-info__desc">
            Si olvidaste tu acceso, el proceso de recuperación es rápido y cifrado. Queremos asegurarnos de que siempre puedas estar conectado con tu comunidad.
          </p>

          <ul className="auth-info__list">
            <li className="auth-info__item">Verificación de identidad segura</li>
            <li className="auth-info__item">Soporte técnico para adoptantes</li>
            <li className="auth-info__item">Acceso rápido tras restablecer</li>
          </ul>

          <div className="auth-info__actions">
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
