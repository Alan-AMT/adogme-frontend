// modules/profile/components/ProfileView.tsx
// Perfil del usuario con 4 pestañas:
//   Mis datos · Seguridad · Preferencias ML · Notificaciones
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar } from "../../shared/components/ui/Avatar";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Alert } from "../../shared/components/ui/Alert";
import { Toggle } from "../../shared/components/ui/Toggle";
import { Spinner } from "../../shared/components/ui/Spinner";
import { useProfile } from "../application/hooks/useProfile";
import type { Adoptante } from "../../shared/domain/User";
import type { LifestyleQuizAnswers } from "@/modules/shared/domain/LifestyleProfile";
import "../styles/profile.css";
import "../../recommendations/styles/quiz.css";

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
  {
    key: "preferences",
    label: "Algoritmo de Preferencias",
    icon: "auto_awesome",
    applicantOnly: true,
  },
  // { key: 'notifications', label: 'Notificaciones',   icon: 'notifications'  },
];

const ROLE_LABEL: Record<string, string> = {
  applicant: "Adoptante",
  shelter: "Refugio",
  admin: "Administrador",
};

const LIFESTYLE_DEFAULTS: LifestyleQuizAnswers = {
  q1: 3,
  q2: 3,
  q3: 3,
  q4: 3,
  q5: 3,
  q6: 3,
  q7: 3,
  q8: 3,
  q9: 3,
  q10: 3,
  q11: 3,
  q12: 3,
  q13: 3,
  q14: 3,
  q15: 3,
  q16: 3,
  q17: 3,
  q18: 3,
  q19: 3,
  q20: 3,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
    isApplicant,
    saving,
    saveError,
    saveOk,
    updateProfile,
    clearStatus,
  } = useProfile();

  const applicant = isApplicant ? (user as Adoptante) : null;

  const [nombre, setNombre] = useState(user?.name ?? "");
  const [telefono, setTelefono] = useState(applicant?.phone ?? "");
  const [direccion, setDireccion] = useState(applicant?.address ?? "");
  const [cp, setCp] = useState(applicant?.postalCode ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearStatus("data");
    await updateProfile({
      nombre: nombre !== user?.name ? nombre : undefined,
      telefono: telefono !== (applicant?.phone ?? "") ? telefono : undefined,
      direccion:
        isApplicant && direccion !== (applicant?.address ?? "")
          ? direccion
          : undefined,
      cp: isApplicant && cp !== (applicant?.postalCode ?? "") ? cp : undefined,
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
          {isApplicant && (
            <Input
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  phone
                </span>
              }
            />
          )}
          {isApplicant && (
            <Input
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  signpost
                </span>
              }
            />
          )}
          {isApplicant && (
            <Input
              label="Código postal"
              value={cp}
              onChange={(e) =>
                setCp(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              leftIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18 }}
                >
                  markunread_mailbox
                </span>
              }
            />
          )}
        </div>

        {saveError && (
          <div style={{ marginTop: "1rem" }}>
            <Alert type="error" message={saveError} closable />
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

    if (newPwd.length < 8) {
      setLocalErr("La nueva contraseña debe tener al menos 8 caracteres.");
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

// ── Tab 3: Preferencias ML ────────────────────────────────────────────────────

// ── TabPreferences ────────────────────────────────────────────────────────────

const CATEGORY_LABELS = [
  {
    label: "Actividad",
    icon: "directions_run",
    keys: ["q1", "q2", "q3", "q4", "q5"] as const,
  },
  {
    label: "Hogar",
    icon: "home",
    keys: ["q6", "q7", "q8", "q9", "q10"] as const,
  },
  {
    label: "Experiencia",
    icon: "school",
    keys: ["q11", "q12", "q13", "q14", "q15"] as const,
  },
  {
    label: "Recursos",
    icon: "favorite",
    keys: ["q16", "q17", "q18", "q19", "q20"] as const,
  },
];

function categoryAvg(
  answers: LifestyleQuizAnswers,
  keys: readonly (keyof LifestyleQuizAnswers)[],
): number {
  const vals = keys.map((k) => answers[k] as number);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function TabPreferences() {
  const { lifestyle, loadingPreferences, isApplicant } = useProfile();

  if (!isApplicant) {
    return (
      <div className="pf-card">
        <div className="pf-pref-empty">
          <span className="material-symbols-outlined pf-pref-empty__icon">
            auto_awesome
          </span>
          <p className="pf-pref-empty__title">Solo para adoptantes</p>
          <p className="pf-pref-empty__sub">
            Las preferencias ML están disponibles para cuentas de adoptante. Con
            ellas personalizamos las recomendaciones de perros.
          </p>
        </div>
      </div>
    );
  }

  if (loadingPreferences) {
    return (
      <div
        className="pf-card"
        style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* ── Banner ── */}
      <div
        className="pf-card"
        style={{
          background: "linear-gradient(135deg, #fff5f5 0%, #fff0f9 100%)",
          border: "1.5px solid #fecdd3",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#ff6b6b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: "#fff",
                  fontVariationSettings:
                    "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24",
                }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <p
                style={{
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  color: "#18181b",
                  lineHeight: 1.2,
                }}
              >
                {lifestyle
                  ? "Perfil de compatibilidad activo"
                  : "Completa el cuestionario de compatibilidad"}
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#71717a",
                  fontWeight: 500,
                  marginTop: "0.15rem",
                }}
              >
                {lifestyle
                  ? "20 preguntas · 4 categorías · actualizado"
                  : "El quiz de 20 preguntas mejora la precisión de tu match"}
              </p>
            </div>
          </div>
          <Link
            href="/mi-match/quiz"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "999px",
              background: "#ff6b6b",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              textDecoration: "none",
              flexShrink: 0,
              boxShadow: "0 3px 10px rgba(255,107,107,0.28)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              quiz
            </span>
            {lifestyle ? "Volver a llenar el quiz" : "Llenar quiz"}
          </Link>
        </div>
      </div>

      {/* ── Resumen de scores por categoría ── */}
      {lifestyle && (
        <div className="pf-card">
          <h2 className="pf-card__title">
            <span className="material-symbols-outlined">bar_chart</span>
            Resumen de tu perfil
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {CATEGORY_LABELS.map((cat) => {
              const avg = categoryAvg(lifestyle, cat.keys);
              const pct = Math.round((avg / 5) * 100);
              return (
                <div key={cat.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: "#ff6b6b",
                          fontVariationSettings:
                            "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 18",
                        }}
                      >
                        {cat.icon}
                      </span>
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#374151",
                        }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        color: "#ff6b6b",
                      }}
                    >
                      {avg} / 5
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "#f0f0f0",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, #ff6b6b, #ff8e53)",
                        borderRadius: 99,
                        transition: "width 600ms ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#a1a1aa",
              fontWeight: 500,
              marginTop: "1rem",
            }}
          >
            Para actualizar tu perfil, vuelve a completar el cuestionario de 20
            preguntas.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Tab 4: Notificaciones ─────────────────────────────────────────────────────

interface NotifSettings {
  newDogMatches: boolean;
  requestUpdates: boolean;
  newsAndTips: boolean;
}

const NOTIF_DEFAULT: NotifSettings = {
  newDogMatches: true,
  requestUpdates: true,
  newsAndTips: false,
};

function TabNotifications() {
  const { user } = useProfile();
  const [loaded, setLoaded] = useState(false);
  const [notif, setNotif] = useState<NotifSettings>(NOTIF_DEFAULT);

  const storageKey = `notif-prefs-${user?.id ?? 0}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setNotif(JSON.parse(raw) as NotifSettings);
    } catch {
      /* noop */
    }
    setLoaded(true);
  }, [storageKey]);

  function toggle(key: keyof NotifSettings) {
    setNotif((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }

  if (!loaded) return null;

  const rows: { key: keyof NotifSettings; title: string; desc: string }[] = [
    {
      key: "newDogMatches",
      title: "Nuevas coincidencias",
      desc: "Recibe alertas cuando aparezcan perros que coincidan con tus preferencias ML.",
    },
    {
      key: "requestUpdates",
      title: "Estado de solicitudes",
      desc: "Notificaciones cuando el refugio actualice el estado de tu solicitud de adopción.",
    },
    {
      key: "newsAndTips",
      title: "Novedades y consejos",
      desc: "Tips de cuidado, historias de adopción y novedades de la plataforma.",
    },
  ];

  return (
    <div className="pf-card">
      <h2 className="pf-card__title">
        <span className="material-symbols-outlined">notifications</span>
        Notificaciones
      </h2>
      <div className="pf-notif-list">
        {rows.map((row) => (
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
      <p
        style={{
          fontSize: "0.75rem",
          color: "#a1a1aa",
          fontWeight: 500,
          marginTop: "1rem",
        }}
      >
        Las preferencias se guardan localmente. Las notificaciones push estarán
        disponibles en la próxima versión.
      </p>
    </div>
  );
}

// ─── ProfileView (orquestador) ────────────────────────────────────────────────

export default function ProfileView() {
  const { user, isApplicant } = useProfile();
  const [activeTab, setActiveTab] = useState<TabKey>("data");

  const visibleTabs = TABS.filter((t) => !t.applicantOnly || isApplicant);

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
            <button
              type="button"
              className="pf-header__avatar-edit"
              aria-label="Cambiar foto de perfil"
              title="Cambiar foto (próximamente)"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 13 }}
              >
                photo_camera
              </span>
            </button>
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
        {currentTab === "preferences" && <TabPreferences />}
        {currentTab === "notifications" && <TabNotifications />}
      </div>
    </div>
  );
}
