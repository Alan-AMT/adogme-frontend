// modules/auth/components/ShelterRegisterView.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archivo 89 — ShelterRegisterView (NUEVO)
// Registro dedicado para refugios (/registro/refugio).
// 3 pasos: Responsable → Contraseña → Refugio.
// Placeholder de FileUpload para logo/banner/docs.
// Post-submit: timeline "Tu solicitud está en revisión".
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import {
  AuthBrand,
  AuthCard,
  AuthLayout,
  GoogleIcon,
} from "@/modules/shared/components/layout/AuthLayout";
import { Alert } from "@/modules/shared/components/ui/Alert";
import { Button } from "@/modules/shared/components/ui/Button";
import { Input } from "@/modules/shared/components/ui/Input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALCALDIAS_CDMX } from "@/modules/shared/constants/alcaldias";
import { useRegister } from "../application/hooks/useRegister";

// ── Helpers ───────────────────────────────────────────────────────────────────
function MIcon({ name }: { name: string }) {
  return (
    <span
      className="material-symbols-outlined text-[#a1a1aa]"
      style={{ fontSize: 18 }}
    >
      {name}
    </span>
  );
}

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

// ── Stepper mini ──────────────────────────────────────────────────────────────
const MINI_STEPS = ["Responsable", "Contraseña", "Refugio"];

function MiniStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex justify-between items-center relative mb-5">
      {MINI_STEPS.map((label, i) => {
        const num = i + 1;
        const isDone = num < step;
        const isActive = num === step;
        const isLast = i === MINI_STEPS.length - 1;
        return (
          <div
            key={label}
            className="relative flex flex-col items-center flex-1 z-[1]"
          >
            {!isLast && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 z-[-1] transition-colors duration-300
                  ${isDone ? "bg-[#ff6b6b]" : "bg-[#e5e7eb]"}`}
              />
            )}
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-[950] border-2 bg-white",
                "transition-all duration-300",
                isDone
                  ? "border-[#ff6b6b] bg-[#ff6b6b] text-white"
                  : isActive
                    ? "border-[#ff6b6b] text-[#ff6b6b] shadow-[0_0_0_4px_rgba(255,107,107,0.14)]"
                    : "border-[#e5e7eb] text-[#9ca3af]",
              ].join(" ")}
            >
              {isDone ? (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14 }}
                >
                  check
                </span>
              ) : (
                num
              )}
            </div>
            <span
              className={[
                "mt-2 text-[10px] font-[900] text-center whitespace-nowrap transition-colors duration-300",
                isActive
                  ? "text-[#ff6b6b]"
                  : isDone
                    ? "text-[#3f3f46]"
                    : "text-[#9ca3af]",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Placeholder de FileUpload ─────────────────────────────────────────────────
function FileUploadField({
  label,
  hint,
  accept,
  icon,
}: {
  label: string;
  hint: string;
  accept: string;
  icon: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-[900] text-[#1f2937]">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 px-3.5 py-3 rounded-[14px] border-2 border-dashed
                   border-[#e5e7eb] bg-[#f9fafb] text-left
                   hover:border-[#ff6b6b] hover:bg-[#fff5f5] transition-all duration-150"
      >
        <span
          className="material-symbols-outlined flex-shrink-0"
          style={{ fontSize: 22, color: fileName ? "#ff6b6b" : "#a1a1aa" }}
        >
          {fileName ? "check_circle" : icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13px] font-[800] truncate ${fileName ? "text-[#ff6b6b]" : "text-[#6b7280]"}`}
          >
            {fileName ?? "Haz clic para seleccionar"}
          </p>
          <p className="text-[11px] text-[#9ca3af] font-[600]">{hint}</p>
        </div>
        <span className="text-[11px] font-[900] text-[#ff6b6b] shrink-0">
          {fileName ? "Cambiar" : "Subir"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </div>
  );
}

// ── Pantalla de éxito ─────────────────────────────────────────────────────────
function SuccessScreen() {
  const timeline = [
    {
      icon: "check_circle",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#dcfce7",
      label: "Solicitud recibida",
      note: "Tu información fue enviada correctamente.",
      done: true,
    },
    {
      icon: "manage_search",
      color: "#b45309",
      bg: "#fffbeb",
      border: "#fde68a",
      label: "Revisión del equipo",
      note: "El equipo verificará la información en 1–3 días.",
      done: false,
    },
    {
      icon: "verified",
      color: "#a1a1aa",
      bg: "#f9fafb",
      border: "#e5e7eb",
      label: "Aprobación y activación",
      note: "Recibirás un correo al aprobarse.",
      done: false,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center py-2">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
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
        <h2 className="text-[22px] font-[950] text-[#111827] tracking-tight mb-2">
          ¡Solicitud enviada!
        </h2>
        <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[300px]">
          Tu refugio está en revisión. Te notificaremos por correo cuando sea
          aprobado.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-2">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-3.5 py-3 rounded-[12px]"
            style={{ background: item.bg, border: `1px solid ${item.border}` }}
          >
            <span
              className="material-symbols-outlined flex-shrink-0 mt-0.5"
              style={{
                fontSize: 18,
                color: item.color,
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18",
              }}
            >
              {item.icon}
            </span>
            <div className="leading-tight">
              <p
                className="text-[13px] font-[900]"
                style={{ color: item.done ? "#15803d" : item.color }}
              >
                {item.label}
              </p>
              <p className="text-[11px] font-[600] text-[#9ca3af] mt-0.5">
                {item.note}
              </p>
            </div>
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

// ── Componente principal ──────────────────────────────────────────────────────
export default function ShelterRegisterView() {
  const reg = useRegister();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Forzar rol 'refugio' al montar
  useEffect(() => {
    reg.setRole("refugio");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    step,
    data,
    update,
    loading,
    error,
    success,
    passwordStrength,
    handleNext,
    handleBack,
    handleSubmit,
  } = reg;

  if (success) {
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
          <AuthBrand />
          <SuccessScreen />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      rightKicker="registro de refugio"
      rightKickerIcon="home_work"
      rightTitle="Únete a la red de refugios verificados de la GAM"
      rightDesc="Registra tu refugio para publicar perros en adopción y gestionar solicitudes de manera segura y transparente."
      rightList={[
        "Perfil de refugio verificado y confiable",
        "Publica perros y recibe solicitudes en línea",
        "Panel de gestión completo y gratuito",
      ]}
      rightActions={[
        { label: "Ver refugios", icon: "home_work", href: "/refugios" },
        { label: "Cómo funciona", icon: "support_agent" },
      ]}
    >
      <AuthCard>
        <AuthBrand />

        <h1 className="text-[26px] font-[950] text-[#111827] mt-1 mb-0.5 tracking-tight">
          Registrar refugio
        </h1>
        <p className="text-[13px] text-[#6b7280] mb-4">
          ¿Eres adoptante?{" "}
          <Link
            href="/registro"
            className="text-[#ff6b6b] font-[900] hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>

        {/* Stepper */}
        <MiniStepper step={step as 1 | 2 | 3} />

        {/* Error */}
        {error && (
          <div className="mb-3.5">
            <Alert type="error" message={error} />
          </div>
        )}

        {/* ── PASO 1: Datos del responsable ── */}
        {step === 1 && (
          <form
            className="flex flex-col gap-3.5"
            onSubmit={handleNext}
            noValidate
          >
            <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
              Datos del responsable
            </p>
            <Input
              id="sr-nombre"
              label="Nombre del responsable"
              placeholder="Tu nombre completo"
              autoComplete="name"
              value={data.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              leftIcon={<MIcon name="person" />}
              required
            />
            <Input
              id="sr-correo"
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
              id="sr-tel"
              type="tel"
              label="Teléfono de contacto"
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
          </form>
        )}

        {/* ── PASO 2: Contraseña ── */}
        {step === 2 && (
          <form
            className="flex flex-col gap-3.5"
            onSubmit={handleNext}
            noValidate
          >
            <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
              Elige una contraseña segura
            </p>
            <Input
              id="sr-pass"
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
              id="sr-confirm"
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
          </form>
        )}

        {/* ── PASO 3: Datos del refugio ── */}
        {step === 3 && (
          <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit}
            noValidate
          >
            <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af]">
              Información del refugio
            </p>

            <Input
              id="sr-refnombre"
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
                id="sr-refcaldia"
                value={data.refAlcaldia}
                onChange={(v) => update("refAlcaldia", v)}
                icon="location_city"
                options={ALCALDIAS_CDMX}
                placeholder="Selecciona una alcaldía"
              />
            </div>

            <Input
              id="sr-refubicacion"
              label="Dirección completa"
              placeholder="Calle, número, colonia"
              value={data.refUbicacion}
              onChange={(e) => update("refUbicacion", e.target.value)}
              leftIcon={<MIcon name="location_on" />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="sr-reftel"
                type="tel"
                label="Teléfono"
                placeholder="55 0000 0000"
                value={data.refTelefono}
                onChange={(e) => update("refTelefono", e.target.value)}
                leftIcon={<MIcon name="call" />}
              />
              <Input
                id="sr-refcap"
                label="Capacidad (perros)"
                placeholder="Ej. 30"
                value={data.refCapacidad}
                onChange={(e) =>
                  update("refCapacidad", e.target.value.replace(/\D/g, ""))
                }
                leftIcon={<MIcon name="pets" />}
              />
            </div>

            <Input
              id="sr-refhorario"
              label="Horario de atención"
              placeholder="Lun–Vie 9–18h"
              value={data.refHorario}
              onChange={(e) => update("refHorario", e.target.value)}
              leftIcon={<MIcon name="schedule" />}
            />

            {/* Descripción */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sr-refdesc"
                className="text-[13px] font-[900] text-[#1f2937]"
              >
                Descripción <span className="text-[#ff6b6b]">*</span>
              </label>
              <textarea
                id="sr-refdesc"
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

            {/* ── Sección de archivos (placeholder) ── */}
            <p className="text-[11px] font-[950] tracking-[0.18em] uppercase text-[#9ca3af] mt-1">
              Documentación (opcional)
            </p>
            <FileUploadField
              label="Logo del refugio"
              hint="PNG o JPG · Máx. 2 MB · Recomendado: 400×400 px"
              accept="image/png,image/jpeg"
              icon="add_photo_alternate"
            />
            <FileUploadField
              label="Imagen de portada (banner)"
              hint="PNG o JPG · Máx. 5 MB · Recomendado: 1200×400 px"
              accept="image/png,image/jpeg"
              icon="image"
            />
            <FileUploadField
              label="Documentación del refugio"
              hint="PDF · Acta constitutiva, permiso, o identificación oficial"
              accept="application/pdf"
              icon="description"
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
                {loading ? "Registrando…" : "Registrar refugio"}
              </Button>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
