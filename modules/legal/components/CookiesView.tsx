import Link from "next/link";

const LAST_UPDATED = "1 de mayo de 2026";

interface CookieRow {
  nombre: string;
  tipo: "Esencial" | "Funcional" | "Analítica";
  duracion: string;
  proposito: string;
}

const COOKIES: CookieRow[] = [
  {
    nombre: "adogme_session",
    tipo: "Esencial",
    duracion: "Sesión",
    proposito: "Mantiene tu sesión iniciada mientras navegas.",
  },
  {
    nombre: "adogme_refresh",
    tipo: "Esencial",
    duracion: "7 días",
    proposito: "Token de renovación de sesión para no pedir contraseña en cada visita.",
  },
  {
    nombre: "adogme_prefs",
    tipo: "Funcional",
    duracion: "30 días",
    proposito: "Guarda preferencias de filtros y configuración de la interfaz.",
  },
  {
    nombre: "_ga",
    tipo: "Analítica",
    duracion: "2 años",
    proposito: "Identifica usuarios únicos para estadísticas de uso (Google Analytics).",
  },
  {
    nombre: "_ga_*",
    tipo: "Analítica",
    duracion: "2 años",
    proposito: "Almacena el estado de la sesión de Google Analytics.",
  },
];

const TIPO_COLORS: Record<CookieRow["tipo"], { bg: string; color: string }> = {
  Esencial: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
  Funcional: { bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
  Analítica: { bg: "rgba(250,82,82,0.1)", color: "#FA5252" },
};

export default function CookiesView() {
  return (
    <div
      style={{
        maxWidth: 760,
        marginInline: "auto",
        padding: "3rem 1.25rem 5rem",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--brand, #FA5252)",
            marginBottom: "0.5rem",
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--fg, #0f172a)",
            margin: "0 0 0.75rem",
            lineHeight: 1.1,
          }}
        >
          Política de cookies
        </h1>
        <p
          style={{
            color: "var(--muted, #475569)",
            fontSize: "0.95rem",
            margin: 0,
          }}
        >
          Última actualización: {LAST_UPDATED}
        </p>
      </header>

      {/* Intro card */}
      <div
        style={{
          background: "rgba(250, 82, 82, 0.06)",
          border: "1px solid rgba(250, 82, 82, 0.18)",
          borderRadius: 16,
          padding: "1.25rem 1.5rem",
          marginBottom: "3rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-start",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 22,
            color: "var(--brand, #FA5252)",
            flexShrink: 0,
            marginTop: 2,
            fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 22",
          }}
        >
          cookie
        </span>
        <p
          style={{
            color: "var(--fg, #0f172a)",
            fontSize: "0.9rem",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Usamos cookies para que la plataforma funcione correctamente y para
          entender cómo se usa. Las cookies esenciales no pueden desactivarse;
          las demás son opcionales.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

        <section id="que-son" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>
            1. ¿Qué son las cookies?
          </h2>
          <p style={{ color: "var(--muted, #475569)", fontSize: "0.93rem", lineHeight: 1.7, margin: 0 }}>
            Las cookies son pequeños archivos de texto que un sitio web almacena en
            tu dispositivo cuando lo visitas. Permiten que el sitio recuerde tus
            acciones y preferencias durante un período de tiempo, para que no tengas
            que volver a configurarlas cada vez que regreses.
          </p>
        </section>

        <section id="tipos" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 1rem", letterSpacing: "-0.01em" }}>
            2. Tipos de cookies que usamos
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(["Esencial", "Funcional", "Analítica"] as CookieRow["tipo"][]).map((tipo) => {
              const { bg, color } = TIPO_COLORS[tipo];
              const descripciones: Record<CookieRow["tipo"], string> = {
                Esencial: "Imprescindibles para que la plataforma funcione. No pueden desactivarse.",
                Funcional: "Recuerdan tus preferencias para mejorar tu experiencia.",
                Analítica: "Nos ayudan a entender cómo se usa la plataforma de forma anónima.",
              };
              return (
                <div
                  key={tipo}
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    alignItems: "flex-start",
                    padding: "0.85rem 1rem",
                    background: bg,
                    borderRadius: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color,
                      background: "rgba(255,255,255,0.6)",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {tipo}
                  </span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted, #475569)", lineHeight: 1.6 }}>
                    {descripciones[tipo]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="tabla" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 1rem", letterSpacing: "-0.01em" }}>
            3. Cookies específicas
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid var(--border, #e2e8f0)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Nombre", "Tipo", "Duración", "Propósito"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.7rem 1rem",
                        textAlign: "left",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--muted, #475569)",
                        borderBottom: "1px solid var(--border, #e2e8f0)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c, i) => {
                  const { bg, color } = TIPO_COLORS[c.tipo];
                  return (
                    <tr
                      key={c.nombre}
                      style={{
                        borderBottom:
                          i < COOKIES.length - 1
                            ? "1px solid var(--border, #e2e8f0)"
                            : "none",
                      }}
                    >
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--fg, #0f172a)", fontFamily: "monospace", fontSize: "0.82rem" }}>
                        {c.nombre}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.18rem 0.55rem",
                            borderRadius: 999,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color,
                            background: bg,
                          }}
                        >
                          {c.tipo}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--muted, #475569)", whiteSpace: "nowrap" }}>
                        {c.duracion}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--muted, #475569)", lineHeight: 1.5 }}>
                        {c.proposito}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="terceros" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>
            4. Cookies de terceros
          </h2>
          <p style={{ color: "var(--muted, #475569)", fontSize: "0.93rem", lineHeight: 1.7, margin: 0 }}>
            Usamos Google Analytics para estadísticas de uso agregadas. Google puede
            establecer sus propias cookies conforme a su política de privacidad.
            Puedes optar por salir de Google Analytics instalando el{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand, #FA5252)", fontWeight: 700, textDecoration: "none" }}
            >
              complemento de inhabilitación
            </a>
            .
          </p>
        </section>

        <section id="control" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>
            5. Cómo controlar las cookies
          </h2>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {[
              "Desde la configuración de tu navegador puedes ver, bloquear o eliminar las cookies almacenadas.",
              "Desactivar cookies esenciales puede impedir el correcto funcionamiento de la plataforma.",
              "Para las cookies analíticas puedes usar el complemento de inhabilitación de Google Analytics.",
              "Los cambios en la configuración del navegador aplican a todos los sitios, no solo a aDOGme.",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                  color: "var(--muted, #475569)",
                  fontSize: "0.93rem",
                  lineHeight: 1.65,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--brand, #FA5252)",
                    flexShrink: 0,
                    marginTop: "0.5rem",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="cambios" style={{ scrollMarginTop: 80 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--fg, #0f172a)", margin: "0 0 0.75rem", letterSpacing: "-0.01em" }}>
            6. Cambios en esta política
          </h2>
          <p style={{ color: "var(--muted, #475569)", fontSize: "0.93rem", lineHeight: 1.7, margin: 0 }}>
            Podemos actualizar esta política cuando añadamos nuevas funcionalidades o
            cambiemos nuestros proveedores. Los cambios se publicarán en esta página
            con la fecha de actualización correspondiente.
          </p>
        </section>
      </div>

      {/* Footer links */}
      <div
        style={{
          marginTop: "4rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border, #e2e8f0)",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: "var(--muted, #475569)", fontSize: "0.85rem", margin: 0 }}>
          ¿Preguntas?{" "}
          <a
            href="mailto:contacto@adogme.org"
            style={{ color: "var(--brand, #FA5252)", fontWeight: 700, textDecoration: "none" }}
          >
            contacto@adogme.org
          </a>
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/privacidad"
            style={{ color: "var(--muted, #475569)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
          >
            Privacidad
          </Link>
          <Link
            href="/terminos"
            style={{ color: "var(--muted, #475569)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
          >
            Términos
          </Link>
        </div>
      </div>
    </div>
  );
}
