// modules/auth/components/RegisterView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 88 — RegisterView (REFACTOR de RegisterPage.tsx)
// Stepper 3 pasos con selector de rol (adoptante / refugio).
// Usa useRegister hook. Pantallas de éxito diferenciadas por rol.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import "../styles/auth.css";
import Link from "next/link";
import React, { useState } from "react";

import {
  AuthBrand,
  AuthCard,
  AuthLayout,
} from "@/modules/shared/components/layout/AuthLayout";
import { Alert } from "@/modules/shared/components/ui/Alert";
import { Button } from "@/modules/shared/components/ui/Button";
import { Input } from "@/modules/shared/components/ui/Input";
import { Stepper } from "@/modules/shared/components/ui/Stepper";

import type { RegisterRole } from "../application/hooks/useRegister";
import { useRegister } from "../application/hooks/useRegister";
import { ALCALDIAS_CDMX } from "@/modules/shared/constants/alcaldias";

// ── Helpers de icono ──────────────────────────────────────────────────────────
function MIcon({ name, fill = false }: { name: string; fill?: boolean }) {
  return (
    <span
      className="material-symbols-outlined text-[#a1a1aa]"
      style={{
        fontSize: 18,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 18`,
      }}
    >
      {name}
    </span>
  );
}

// ── Select para alcaldías ─────────────────────────────────────────────────────
function AuthSelect({
  id,
  value,
  onChange,
  icon,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative flex items-center">
      <span
        className="absolute left-3 pointer-events-none text-[#a1a1aa] material-symbols-outlined"
        style={{ fontSize: 18 }}
      >
        {icon}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] text-[#3f3f46]
                   text-[13px] pl-10 pr-8 py-3 outline-none cursor-pointer appearance-none
                   focus:border-[#ff6b6b] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)]
                   transition-all duration-200"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Config de roles ───────────────────────────────────────────────────────────
const ROLES: { id: RegisterRole; icon: string; label: string; desc: string }[] =
  [
    {
      id: "applicant",
      icon: "person",
      label: "Adoptante",
      desc: "Quiero adoptar",
    },
    {
      id: "shelter",
      icon: "home_work",
      label: "Refugio",
      desc: "Tengo un refugio",
    },
  ];

// ── Back button ───────────────────────────────────────────────────────────────
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-full
                 bg-white border border-[#e5e7eb] text-[#374151] font-[900] text-[13px]
                 hover:bg-[#fafafa] transition-colors"
    >
      ← Atrás
    </button>
  );
}

// ── Pantalla de éxito — adoptante ─────────────────────────────────────────────
function AdoptanteSuccessScreen({ email: _email }: { email: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "#f0fdf4", border: "3px solid #dcfce7" }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 40,
            color: "#16a34a",
            fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40",
          }}
        >
          check_circle
        </span>
      </div>
      <div>
        <h2 className="text-[22px] font-[950] text-[#111827] tracking-tight mb-2">
          ¡Cuenta creada!
        </h2>
        <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[300px]">
          Tu cuenta fue creada exitosamente. Ya puedes iniciar sesión y empezar
          a adoptar.
        </p>
      </div>
      <Link
        href="/login"
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full
                   bg-[#ff6b6b] text-white font-[950] text-[13px]
                   hover:bg-[#fa5252] hover:-translate-y-0.5 transition-all duration-150"
        style={{ boxShadow: "0 12px 22px rgba(255,107,107,0.28)" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
        >
          login
        </span>
        Iniciar sesión
      </Link>
    </div>
  );
}

// ── Pantalla de éxito — refugio ───────────────────────────────────────────────
function RefugioSuccessScreen() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "#fef3c7", border: "3px solid #fde68a" }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 40,
            color: "#b45309",
            fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40",
          }}
        >
          pending
        </span>
      </div>
      <div>
        <h2 className="text-[22px] font-[950] text-[#111827] tracking-tight mb-2">
          Solicitud enviada
        </h2>
        <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[300px]">
          Tu refugio está en revisión. Te notificaremos cuando sea aprobado.
        </p>
      </div>

      <div className="w-full flex flex-col gap-2.5">
        {[
          {
            icon: "check_circle",
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#dcfce7",
            text: "Solicitud recibida",
            done: true,
          },
          {
            icon: "manage_search",
            color: "#b45309",
            bg: "#fffbeb",
            border: "#fde68a",
            text: "Revisión del equipo (1–3 días)",
            done: false,
          },
          {
            icon: "verified",
            color: "#a1a1aa",
            bg: "#f9fafb",
            border: "#e5e7eb",
            text: "Aprobación y activación",
            done: false,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px]"
            style={{ background: item.bg, border: `1px solid ${item.border}` }}
          >
            <span
              className="material-symbols-outlined flex-shrink-0"
              style={{
                fontSize: 18,
                color: item.color,
                fontVariationSettings: `'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18`,
              }}
            >
              {item.icon}
            </span>
            <span
              className="text-[12px] font-[800]"
              style={{ color: item.done ? "#15803d" : item.color }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/login"
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full
                   bg-[#ff6b6b] text-white font-[950] text-[13px]
                   hover:bg-[#fa5252] hover:-translate-y-0.5 transition-all duration-150"
        style={{ boxShadow: "0 12px 22px rgba(255,107,107,0.28)" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
        >
          login
        </span>
        Ir a iniciar sesión
      </Link>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function RegisterView() {
  const reg = useRegister();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    step,
    role,
    steps,
    data,
    update,
    loading,
    error,
    success,
    passwordStrength,
    setRole,
    handleNext,
    handleBack,
    handleSubmit,
  } = reg;

  // ── Pantallas de éxito ─────────────────────────────────────────────────────
  if (success && role === "applicant") {
    return (
      <AuthLayout
        rightKicker="crea tu cuenta"
        rightKickerIcon="person_add"
        rightTitle="¡Bienvenido a la familia aDOGme!"
        rightDesc="Ya eres parte de la comunidad. Activa tu cuenta y empieza a buscar a tu nuevo mejor amigo."
        rightList={[
          "Filtra por tamaño, energía y más",
          "Guarda tus favoritos",
          "Proceso de adopción responsable",
        ]}
        rightActions={[{ label: "Ver perros", icon: "pets", href: "/perros" }]}
      >
        <AuthCard>
          <div className="auth-header">
            <AuthBrand />
          </div>
          <AdoptanteSuccessScreen email={data.correo} />
        </AuthCard>
      </AuthLayout>
    );
  }

  if (success && role === "shelter") {
    return (
      <AuthLayout
        rightKicker="registro de refugio"
        rightKickerIcon="home_work"
        rightTitle="¡Solicitud enviada con éxito!"
        rightDesc="Nuestro equipo revisará tu información para verificar el refugio. El proceso toma 1–3 días hábiles."
        rightList={[
          "Revisión por nuestro equipo",
          "Notificación por correo al aprobarse",
          "Acceso completo al portal de refugios",
        ]}
        rightActions={[
          { label: "Ver refugios", icon: "home_work", href: "/refugios" },
        ]}
      >
        <AuthCard>
          <div className="auth-header">
            <AuthBrand />
          </div>
          <RefugioSuccessScreen />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      rightKicker="crea tu cuenta"
      rightKickerIcon="person_add"
      rightTitle="Regístrate para adoptar o registrar tu refugio"
      rightDesc="Crea tu perfil en minutos. Si eres refugio, tu cuenta se revisa para asegurar transparencia y confianza en la comunidad."
      rightList={[
        "Adoptantes: filtra y guarda favoritos",
        "Refugios: publica perros y gestiona solicitudes",
        "Seguridad: contraseñas fuertes y validaciones",
      ]}
      rightActions={[
        { label: "Cómo funciona", icon: "support_agent" },
        { label: "Seguridad", icon: "shield" },
      ]}
    >
      <AuthCard>
        {/* Header igual al LoginView */}
        <div className="auth-header">
          <AuthBrand />
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">
            ¿Ya tienes cuenta?{" "}
            {/* ✅ subrayado como el "¿Olvidaste tu contraseña?" (auth-link) */}
            <Link href="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* ── Selector de rol ── */}
        <div className="mb-4">
          <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#ff6b6b] mb-2">
            ¿Cómo quieres usar aDOGme?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={[
                  "flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-[14px] border text-center",
                  "transition-all duration-150 cursor-pointer",
                  role === r.id
                    ? "bg-[#fff1f2] border-[#ff6b6b] shadow-[0_0_0_4px_rgba(255,107,107,0.16)]"
                    : "bg-white border-[#e5e7eb] hover:-translate-y-0.5 hover:bg-[#fff5f5] hover:border-[#ffd0d0]",
                ].join(" ")}
              >
                <span
                  className="material-symbols-outlined text-[26px] leading-none"
                  style={{ color: role === r.id ? "#ff6b6b" : "#a1a1aa" }}
                >
                  {r.icon}
                </span>
                <span className="font-[950] text-[14px] text-[#111827]">
                  {r.label}
                </span>
                <span
                  className={`font-[700] text-[12px] ${role === r.id ? "text-[#ff6b6b]/75" : "text-[#9ca3af]"}`}
                >
                  {r.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Stepper ── */}
        <Stepper
          steps={steps}
          currentStep={step - 1}
          completedSteps={Array.from({ length: step - 1 }, (_, i) => i)}
          className="mb-5"
        />

        {/* ── Alertas ── */}
        {error && (
          <div className="mb-3.5">
            <Alert type="error" message={error} />
          </div>
        )}

        {/* ── Formulario por paso ── */}
        <form
          className="flex flex-col gap-3.5"
          onSubmit={step < 3 ? handleNext : handleSubmit}
          noValidate
        >
          {/* ── PASO 1: Datos básicos ── */}
          {step === 1 && (
            <>
              <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
                Información personal
              </p>

              <Input
                id="reg-nombre"
                label="Nombre completo"
                placeholder="Tu nombre completo"
                autoComplete="name"
                value={data.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                leftIcon={<MIcon name="person" />}
                required
              />
              <Input
                id="reg-correo"
                type="email"
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                value={data.correo}
                onChange={(e) => update("correo", e.target.value)}
                leftIcon={<MIcon name="mail" />}
                required
              />
              <Input
                id="reg-tel"
                type="tel"
                label="Teléfono"
                placeholder="55 0000 0000"
                autoComplete="tel"
                value={data.telefono}
                onChange={(e) => update("telefono", e.target.value)}
                leftIcon={<MIcon name="phone" />}
                required
              />

              <Button
                type="submit"
                fullWidth
                className="mt-1 !font-[950] !text-[13px] !rounded-full"
                style={
                  {
                    boxShadow: "0 12px 22px rgba(255,107,107,0.28)",
                    background: "#ff6b6b",
                  } as React.CSSProperties
                }
              >
                Continuar
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                >
                  arrow_forward
                </span>
              </Button>
            </>
          )}

          {/* ── PASO 2: Contraseña ── */}
          {step === 2 && (
            <>
              <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
                Elige una contraseña segura
              </p>

              <Input
                id="reg-pass"
                type={showPass ? "text" : "password"}
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => update("password", e.target.value)}
                leftIcon={<MIcon name="lock" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="p-1.5 rounded-[10px] text-[#a1a1aa] hover:bg-black/5 hover:text-[#52525b] transition-colors"
                    aria-label={showPass ? "Ocultar" : "Mostrar"}
                    tabIndex={-1}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18 }}
                    >
                      {showPass ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                }
                required
              />

              {data.password && (
                <div className="flex flex-col gap-1.5 -mt-1">
                  <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{
                        width: `${passwordStrength.pct}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-[900]"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              <Input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                label="Confirmar contraseña"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                value={data.confirmar}
                onChange={(e) => update("confirmar", e.target.value)}
                leftIcon={<MIcon name="lock_reset" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="p-1.5 rounded-[10px] text-[#a1a1aa] hover:bg-black/5 hover:text-[#52525b] transition-colors"
                    aria-label={showConfirm ? "Ocultar" : "Mostrar"}
                    tabIndex={-1}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 18 }}
                    >
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                }
                required
              />

              <div className="flex gap-3 mt-1">
                <BackBtn onClick={handleBack} />
                <Button
                  type="submit"
                  className="flex-[2] !font-[950] !text-[13px] !rounded-full"
                  style={
                    {
                      boxShadow: "0 12px 22px rgba(255,107,107,0.28)",
                      background: "#ff6b6b",
                    } as React.CSSProperties
                  }
                >
                  Continuar
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    arrow_forward
                  </span>
                </Button>
              </div>
            </>
          )}

          {/* ── PASO 3 — Adoptante: Dirección ── */}
          {step === 3 && role === "applicant" && (
            <>
              <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
                Tu dirección
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[900] text-[#1f2937]">
                  Alcaldía <span className="text-[#ff6b6b]">*</span>
                </label>
                <AuthSelect
                  id="reg-alcaldia"
                  value={data.alcaldia}
                  onChange={(v) => update("alcaldia", v)}
                  icon="location_city"
                  options={ALCALDIAS_CDMX}
                  placeholder="Selecciona tu alcaldía"
                />
              </div>

              <Input
                id="reg-colonia"
                label="Colonia"
                placeholder="Ej. Guadalupe Tepeyac"
                value={data.colonia}
                onChange={(e) => update("colonia", e.target.value)}
                leftIcon={<MIcon name="holiday_village" />}
                required
              />
              <Input
                id="reg-calle"
                label="Calle"
                placeholder="Nombre de la calle"
                value={data.calle}
                onChange={(e) => update("calle", e.target.value)}
                leftIcon={<MIcon name="signpost" />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="reg-ext"
                  label="Núm. exterior"
                  placeholder="123"
                  value={data.numExt}
                  onChange={(e) => update("numExt", e.target.value)}
                  leftIcon={<MIcon name="home" />}
                  required
                />
                <Input
                  id="reg-int"
                  label="Núm. interior"
                  placeholder="Depto (opc.)"
                  value={data.numInt}
                  onChange={(e) => update("numInt", e.target.value)}
                  leftIcon={<MIcon name="apartment" />}
                />
              </div>

              <Input
                id="reg-cp"
                label="Código postal"
                placeholder="Ej. 07000"
                value={data.cp}
                onChange={(e) =>
                  update("cp", e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                leftIcon={<MIcon name="markunread_mailbox" />}
                required
              />

              <div className="flex gap-3 mt-1">
                <BackBtn onClick={handleBack} />
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-[2] !font-[950] !text-[13px] !rounded-full"
                  style={
                    {
                      boxShadow: "0 12px 22px rgba(255,107,107,0.28)",
                      background: "#ff6b6b",
                    } as React.CSSProperties
                  }
                >
                  {loading ? "Creando…" : "Registrarme"}
                </Button>
              </div>
            </>
          )}

          {/* ── PASO 3 — Refugio: Datos del refugio ── */}
          {step === 3 && role === "shelter" && (
            <>
              <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
                Datos del refugio
              </p>

              <Input
                id="ref-nombre"
                label="Nombre del refugio"
                placeholder="Ej. Patitas Felices GAM"
                value={data.refNombre}
                onChange={(e) => update("refNombre", e.target.value)}
                leftIcon={<MIcon name="home_work" />}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-[900] text-[#1f2937]">
                  Alcaldía donde se ubica{" "}
                  <span className="text-[#ff6b6b]">*</span>
                </label>
                <AuthSelect
                  id="ref-alcaldia"
                  value={data.refAlcaldia}
                  onChange={(v) => update("refAlcaldia", v)}
                  icon="location_city"
                  options={ALCALDIAS_CDMX}
                  placeholder="Selecciona una alcaldía"
                />
              </div>

              <Input
                id="ref-ubicacion"
                label="Dirección completa"
                placeholder="Calle, número, colonia"
                value={data.refUbicacion}
                onChange={(e) => update("refUbicacion", e.target.value)}
                leftIcon={<MIcon name="location_on" />}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="ref-tel"
                  type="tel"
                  label="Teléfono del refugio"
                  placeholder="55 0000 0000"
                  value={data.refTelefono}
                  onChange={(e) => update("refTelefono", e.target.value)}
                  leftIcon={<MIcon name="call" />}
                />
                <Input
                  id="ref-correo"
                  type="email"
                  label="Correo del refugio"
                  placeholder="refugio@mail.com"
                  value={data.refCorreo}
                  onChange={(e) => update("refCorreo", e.target.value)}
                  leftIcon={<MIcon name="mail" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="ref-horario"
                  label="Horario"
                  placeholder="Lun–Vie 9–18h"
                  value={data.refHorario}
                  onChange={(e) => update("refHorario", e.target.value)}
                  leftIcon={<MIcon name="schedule" />}
                />
                <Input
                  id="ref-website"
                  label="Página web"
                  placeholder="http://refugio.com"
                  value={data.refWebsite}
                  onChange={(e) => update("refWebsite", e.target.value)}
                  leftIcon={<MIcon name="captive_portal" />}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ref-desc"
                  className="text-[13px] font-[900] text-[#1f2937]"
                >
                  Descripción <span className="text-[#ff6b6b]">*</span>
                </label>
                <textarea
                  id="ref-desc"
                  rows={3}
                  placeholder="Cuéntanos sobre tu refugio, misión y cuánto tiempo llevan operando…"
                  value={data.refDescripcion}
                  onChange={(e) => update("refDescripcion", e.target.value)}
                  className="w-full rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] text-[#111827]
                             text-[13px] px-3.5 py-3 outline-none resize-none
                             focus:border-[#ff6b6b] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,107,0.2)]
                             transition-all duration-200"
                />
              </div>

              <div
                className="flex items-start gap-2.5 px-3 py-3 rounded-[14px]"
                style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{ fontSize: 15, color: "#1d4ed8", marginTop: 1 }}
                >
                  photo_camera
                </span>
                <span className="text-[12px] font-[700] text-[#1d4ed8]">
                  Logo e imágenes podrás subirlas desde tu perfil una vez
                  aprobado.
                </span>
              </div>

              <div className="flex gap-3 mt-1">
                <BackBtn onClick={handleBack} />
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-[2] !font-[950] !text-[13px] !rounded-full"
                  style={
                    {
                      boxShadow: "0 12px 22px rgba(255,107,107,0.28)",
                      background: "#ff6b6b",
                    } as React.CSSProperties
                  }
                >
                  {loading ? "Registrando…" : "Registrar refugio"}
                </Button>
              </div>
            </>
          )}
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
