import Link from "next/link";

const LAST_UPDATED = "1 de mayo de 2026";

interface Section {
  id: string;
  title: string;
  content: string | string[];
}

const SECTIONS: Section[] = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    content:
      "aDOGme (en adelante, \"la Plataforma\") es responsable del tratamiento de los datos personales que recopila a través de adogme.org. Para cualquier consulta relacionada con privacidad puedes contactarnos en contacto@adogme.org.",
  },
  {
    id: "datos",
    title: "2. Datos que recopilamos",
    content: [
      "Datos de registro: nombre, correo electrónico, contraseña cifrada y tipo de cuenta (adoptante o refugio).",
      "Datos de perfil: fotografía, teléfono, dirección, descripción del hogar y experiencia con mascotas.",
      "Datos de solicitud de adopción: documentos de identidad y comprobante de domicilio que adjuntes.",
      "Datos de uso: páginas visitadas, filtros aplicados, perros guardados como favoritos y resultados del quiz de compatibilidad.",
      "Datos técnicos: dirección IP, tipo de dispositivo, navegador y sistema operativo.",
    ],
  },
  {
    id: "finalidades",
    title: "3. Finalidades del tratamiento",
    content: [
      "Operar y gestionar tu cuenta de usuario.",
      "Facilitar el proceso de adopción entre adoptantes y refugios.",
      "Generar recomendaciones personalizadas mediante el algoritmo de compatibilidad.",
      "Enviarte notificaciones sobre el estado de tus solicitudes (no publicidad sin tu consentimiento).",
      "Mejorar la plataforma mediante análisis agregados y anónimos de uso.",
      "Cumplir obligaciones legales aplicables.",
    ],
  },
  {
    id: "base",
    title: "4. Base legal",
    content: [
      "Ejecución del contrato de uso de la plataforma para datos necesarios para operar tu cuenta.",
      "Consentimiento explícito para el envío de comunicaciones opcionales.",
      "Interés legítimo para análisis de uso interno y mejora del servicio.",
      "Cumplimiento de obligaciones legales cuando aplique.",
    ],
  },
  {
    id: "compartir",
    title: "5. Compartición de datos",
    content: [
      "Con refugios: al enviar una solicitud de adopción, el refugio destinatario recibe los datos que incluiste en el formulario.",
      "Con proveedores de servicio: usamos servicios de infraestructura en la nube y análisis que actúan como encargados del tratamiento bajo acuerdos de confidencialidad.",
      "Nunca vendemos datos personales a terceros con fines comerciales.",
      "Podemos divulgar datos cuando lo exija una autoridad competente conforme a la ley.",
    ],
  },
  {
    id: "conservacion",
    title: "6. Conservación",
    content:
      "Conservamos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de tu cuenta, borraremos o anonimizaremos tus datos en un plazo máximo de 30 días hábiles, salvo que debamos conservarlos por obligación legal.",
  },
  {
    id: "derechos",
    title: "7. Tus derechos (ARCO)",
    content: [
      "Acceso: solicita una copia de los datos personales que tenemos sobre ti.",
      "Rectificación: corrige datos inexactos o incompletos.",
      "Cancelación: solicita la eliminación de tus datos cuando ya no sean necesarios.",
      "Oposición: oponte al tratamiento en determinadas circunstancias.",
      "Para ejercer cualquiera de estos derechos, escríbenos a contacto@adogme.org desde el correo asociado a tu cuenta.",
    ],
  },
  {
    id: "seguridad",
    title: "8. Seguridad",
    content:
      "Implementamos medidas técnicas y organizativas proporcionales al riesgo: cifrado HTTPS en tránsito, contraseñas hasheadas con bcrypt, acceso restringido a datos sensibles y revisiones periódicas de seguridad. Ningún sistema es 100% infalible; en caso de incidente notificaremos a los afectados conforme a la ley.",
  },
  {
    id: "cookies",
    title: "9. Cookies",
    content:
      "Usamos cookies propias y de terceros para el funcionamiento de la plataforma y análisis de uso. Consulta nuestra Política de Cookies para más detalle.",
  },
  {
    id: "menores",
    title: "10. Menores de edad",
    content:
      "La plataforma no está dirigida a menores de 18 años y no recopilamos conscientemente datos de menores. Si detectamos una cuenta registrada por un menor, la eliminaremos de inmediato.",
  },
  {
    id: "cambios",
    title: "11. Cambios en esta política",
    content:
      "Podemos actualizar esta Política cuando sea necesario. Los cambios significativos se notificarán por correo electrónico con al menos 15 días de anticipación.",
  },
];

export default function PrivacidadView() {
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
          Política de privacidad
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
          marginBottom: "2.5rem",
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
          shield
        </span>
        <p
          style={{
            color: "var(--fg, #0f172a)",
            fontSize: "0.9rem",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Tus datos están protegidos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Solo recopilamos lo estrictamente necesario
          para facilitar adopciones y nunca los vendemos a terceros.
        </p>
      </div>

      {/* Table of contents */}
      <nav
        aria-label="Índice"
        style={{
          background: "#f8fafc",
          border: "1px solid var(--border, #e2e8f0)",
          borderRadius: 16,
          padding: "1.25rem 1.5rem",
          marginBottom: "3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--muted, #475569)",
            margin: "0 0 0.75rem",
          }}
        >
          Contenido
        </p>
        <ol
          style={{
            margin: 0,
            padding: "0 0 0 1.1rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.3rem 1rem",
          }}
        >
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-[#FA5252] transition-colors duration-150"
                style={{
                  color: "var(--muted, #475569)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  lineHeight: 1.5,
                }}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} style={{ scrollMarginTop: 80 }}>
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "var(--fg, #0f172a)",
                margin: "0 0 0.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              {s.title}
            </h2>
            {Array.isArray(s.content) ? (
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
                {s.content.map((item, i) => (
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
            ) : (
              <p
                style={{
                  color: "var(--muted, #475569)",
                  fontSize: "0.93rem",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {s.content}
              </p>
            )}
          </section>
        ))}
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
        <p
          style={{
            color: "var(--muted, #475569)",
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          ¿Dudas sobre tus datos?{" "}
          <a
            href="mailto:contacto@adogme.org"
            style={{
              color: "var(--brand, #FA5252)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            contacto@adogme.org
          </a>
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/terminos"
            style={{
              color: "var(--muted, #475569)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Términos
          </Link>
          <Link
            href="/cookies"
            style={{
              color: "var(--muted, #475569)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
}
