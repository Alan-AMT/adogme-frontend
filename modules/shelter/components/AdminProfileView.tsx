// modules/profile/components/ProfileView.tsx
// Perfil del usuario con 4 pestañas:
//   Mis datos · Seguridad · Preferencias ML · Notificaciones
"use client";

import { useState } from "react";
import { Avatar } from "../../shared/components/ui/Avatar";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Alert } from "../../shared/components/ui/Alert";
import "../../profile/styles/profile.css";
import { useProfile } from "@/modules/profile/application/hooks/useProfile";
import {
  isStrongPassword,
  isValidPersonName,
} from "@/modules/shared/utils/validators";

// ─── Constantes ───────────────────────────────────────────────────────────────

type TabKey = "data" | "security" | "preferences" | "notifications";

interface TabDef {
  key: TabKey;
  label: string;
  icon: string;
  /** Si true, la pestaña solo se muestra para applicant */
  applicantOnly?: boolean;
}

const TABS: TabDef[] = [
  { key: "data", label: "Mis datos", icon: "person" },
  { key: "security", label: "Seguridad", icon: "lock" },
];

const ROLE_LABEL: Record<string, string> = {
  applicant: "Adoptante",
  shelter: "Refugio",
  admin: "Administrador",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pwdStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  if (pwd.length < 6) return 1;
  if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return 2;
  return 3;
}

const STRENGTH_LABEL = ["", "Débil", "Media", "Fuerte"];
const STRENGTH_CLS = ["", "weak", "medium", "strong"];

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────

// ── Tab 1: Mis datos ──────────────────────────────────────────────────────────

function TabData() {
  const {
    user,
    saving,
    saveError,
    saveOk,
    updateProfile,
    clearStatus,
  } = useProfile();

  const [nombre, setNombre] = useState(user?.name ?? "");
  const [localErr, setLocalErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalErr(null);
    clearStatus("data");

    const nextNombre = nombre.trim();
    if (!nextNombre) {
      setLocalErr("El nombre completo es obligatorio.");
      return;
    }
    if (!isValidPersonName(nextNombre)) {
      setLocalErr("Ingresa nombre y apellido válidos.");
      return;
    }

    await updateProfile({
      nombre: nextNombre !== user?.name ? nextNombre : undefined,
    });
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
            onChange={(e) => setNombre(e.target.value)}
            required
            leftIcon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                person
              </span>
            }
          />
          <div className="pf-field-readonly">
            <p className="pf-field-readonly__label">Correo electrónico</p>
            <p className="pf-field-readonly__value">{user?.email}</p>
          </div>

        </div>

        {(localErr ?? saveError) && (
          <div style={{ marginTop: "1rem" }}>
            <Alert type="error" message={localErr ?? saveError ?? ""} closable />
          </div>
        )}
        {saveOk && (
          <div style={{ marginTop: "1rem" }}>
            <Alert
              type="success"
              message="Datos actualizados correctamente."
              closable
            />
          </div>
        )}

        <div className="pf-save-bar">
          <Button type="submit" loading={saving} size="md">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 17 }}
            >
              save
            </span>
            Guardar cambios
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── Tab 2: Seguridad ──────────────────────────────────────────────────────────

function TabSecurity() {
  const {
    changingPassword,
    passwordError,
    passwordOk,
    changePassword,
    clearStatus,
  } = useProfile();

  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localErr, setLocalErr] = useState<string | null>(null);

  const strength = pwdStrength(newPwd);
  const mismatch = confirm.length > 0 && confirm !== newPwd;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalErr(null);
    clearStatus("password");

    if (!isStrongPassword(newPwd)) {
      setLocalErr(
        "La nueva contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.",
      );
      return;
    }
    if (newPwd !== confirm) {
      setLocalErr("Las contraseñas no coinciden.");
      return;
    }

    await changePassword(current, newPwd);
    if (!passwordError) {
      setCurrent("");
      setNewPwd("");
      setConfirm("");
    }
  }

  const displayError = localErr ?? passwordError;

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
              onChange={(e) => setCurrent(e.target.value)}
              required
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  lock
                </span>
              }
            />
          </div>
          <div>
            <Input
              label="Nueva contraseña"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  key
                </span>
              }
            />
            {/* Strength indicator */}
            {newPwd.length > 0 && (
              <div>
                <div className="pf-pwd-strength">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={[
                        "pf-pwd-strength__bar",
                        strength >= level
                          ? `pf-pwd-strength__bar--${STRENGTH_CLS[strength]}`
                          : "",
                      ].join(" ")}
                    />
                  ))}
                </div>
                <p
                  className={`pf-pwd-strength__label pf-pwd-strength__label--${STRENGTH_CLS[strength]}`}
                >
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
              onChange={(e) => setConfirm(e.target.value)}
              required
              error={mismatch ? "Las contraseñas no coinciden" : undefined}
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  key
                </span>
              }
            />
          </div>
        </div>

        {displayError && (
          <div style={{ marginTop: "1rem" }}>
            <Alert type="error" message={displayError} closable />
          </div>
        )}
        {passwordOk && (
          <div style={{ marginTop: "1rem" }}>
            <Alert
              type="success"
              message="Contraseña actualizada correctamente."
              closable
            />
          </div>
        )}

        <div className="pf-save-bar">
          <Button
            type="submit"
            loading={changingPassword}
            size="md"
            disabled={mismatch || !current || !newPwd || !confirm}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 17 }}
            >
              lock_reset
            </span>
            Cambiar contraseña
          </Button>
        </div>
      </div>

      {/* Hint */}
      <div className="pf-card" style={{ background: "#f9fafb" }}>
        <div
          style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 20,
              color: "#71717a",
              flexShrink: 0,
              marginTop: 1,
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 20",
            }}
          >
            info
          </span>
          <div>
            <p
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#3f3f46",
                marginBottom: "0.2rem",
              }}
            >
              Consejos para una contraseña segura
            </p>
            <ul
              style={{
                fontSize: "0.78rem",
                color: "#71717a",
                fontWeight: 500,
                lineHeight: 1.6,
                paddingLeft: "1rem",
                margin: 0,
              }}
            >
              <li>Al menos 8 caracteres</li>
              <li>Combina letras mayúsculas, minúsculas y números</li>
              <li>Evita usar tu nombre o fecha de nacimiento</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}

// ─── ProfileView (orquestador) ────────────────────────────────────────────────

export default function ShelterAdminProfileView() {
  const { user } = useProfile();
  const [activeTab, setActiveTab] = useState<TabKey>("data");

  const visibleTabs = TABS

  // Si el tab activo ya no es visible (p.ej. shelter entra a 'preferences'), resetear
  const currentTab = visibleTabs.find((t) => t.key === activeTab)
    ? activeTab
    : "data";

  if (!user) return null;

  const role = user.role;
  const roleCls = `pf-header__role--${role}`;
  const roleLabel = ROLE_LABEL[role] ?? role;

  return (
    <div className="pf-page">
      {/* ── Columna izquierda: sidebar ── */}
      <div className="pf-sidebar-card z-10">
        <div className="pf-cover" />
        <div className="pf-cover-body">
          <div className="pf-header__avatar-wrap">
            <Avatar name={user.name} size="xl" />
          </div>

          <div className="pf-header__info">
            <p className="pf-header__name">{user.name}</p>
            <p className="pf-header__email">{user.email}</p>
            <span className={`pf-header__role ${roleCls}`}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 12,
                  fontVariationSettings:
                    "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 13",
                }}
              >
                verified_user
              </span>
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Nav vertical */}
        <nav className="pf-vnav">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`pf-vnavitem${currentTab === tab.key ? " pf-vnavitem--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings:
                    currentTab === tab.key
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
        {currentTab === "data" && <TabData />}
        {currentTab === "security" && <TabSecurity />}
      </div>
    </div>
  );
}
