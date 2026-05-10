import Link from "next/link";

const LAST_UPDATED = "1 de mayo de 2025";

interface Section {
  id: string;
  title: string;
  content: string | string[];
}

const SECTIONS: Section[] = [
  {
    id: "objeto",
    title: "1. Objeto y aceptación",
    content:
      "aDOGme es una plataforma digital que conecta personas interesadas en adoptar perros con refugios y organizaciones de rescate verificados. Al acceder o utilizar la plataforma, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, te pedimos que no uses los servicios.",
  },
  {
    id: "elegibilidad",
    title: "2. Elegibilidad",
    content: [
      "Debes ser mayor de 18 años para registrarte como adoptante.",
      "Los refugios deben ser organizaciones legalmente constituidas o grupos de rescate formales.",
      "Cada usuario es responsable de la veracidad de la información proporcionada al registrarse.",
      "aDOGme se reserva el derecho de suspender cuentas que incumplan estos requisitos.",
    ],
  },
  {
    id: "uso",
    title: "3. Uso de la plataforma",
    content: [
      "La plataforma está diseñada exclusivamente para facilitar adopciones responsables de perros.",
      "Queda prohibida la compraventa de animales a través de aDOGme.",
      "No está permitido publicar información falsa, engañosa o que perjudique a terceros.",
      "El uso del chatbot y las herramientas de recomendación es orientativo; no sustituye el juicio del refugio.",
      "Queda prohibido el acceso automatizado, scraping o cualquier uso que sobrecargue los servidores.",
    ],
  },
  {
    id: "refugios",
    title: "4. Refugios y organizaciones",
    content: [
      "Los refugios son responsables de la veracidad de los perfiles de animales publicados.",
      "La aprobación de una solicitud de adopción es decisión exclusiva del refugio.",
      "aDOGme actúa como intermediario y no es parte del contrato de adopción entre usuario y refugio.",
      "Los refugios deben atender las solicitudes en un plazo razonable y comunicar sus decisiones.",
      "aDOGme puede suspender o revocar la verificación de un refugio que incumpla los estándares de bienestar animal.",
    ],
  },
  {
    id: "adopcion",
    title: "5. Proceso de adopción",
    content:
      "Al enviar una solicitud de adopción confirmas que la información proporcionada es veraz y que cumples con los requisitos del refugio. La aceptación de tu solicitud no garantiza la adopción hasta que el refugio lo confirme formalmente. El contrato de adopción lo establece el refugio y es vinculante entre adoptante y organización.",
  },
  {
    id: "contenido",
    title: "6. Contenido del usuario",
    content: [
      "Al subir fotografías, documentos o cualquier contenido, garantizas que tienes los derechos necesarios.",
      "Otorgas a aDOGme una licencia no exclusiva para usar ese contenido con fines operativos de la plataforma.",
      "Queda prohibido subir contenido que muestre maltrato animal, material ilegal o que viole derechos de terceros.",
      "aDOGme puede eliminar contenido que infrinja estas reglas sin previo aviso.",
    ],
  },
  {
    id: "privacidad",
    title: "7. Privacidad y datos personales",
    content:
      "El tratamiento de tus datos personales se rige por nuestra Política de Privacidad. Recopilamos únicamente los datos necesarios para operar la plataforma y facilitar adopciones. Nunca vendemos información personal a terceros. Para conocer tus derechos de acceso, rectificación y cancelación, consulta la Política de Privacidad.",
  },
  {
    id: "responsabilidad",
    title: "8. Limitación de responsabilidad",
    content: [
      "aDOGme no garantiza la disponibilidad ininterrumpida de la plataforma.",
      "No somos responsables de las decisiones de adopción tomadas por refugios o adoptantes.",
      "No nos hacemos responsables por daños derivados del uso incorrecto de la plataforma.",
      "La información sobre perros (salud, comportamiento, historial) es responsabilidad de cada refugio.",
    ],
  },
  {
    id: "modificaciones",
    title: "9. Modificaciones",
    content:
      "aDOGme puede actualizar estos términos cuando sea necesario. Las modificaciones significativas se notificarán por correo electrónico con al menos 15 días de anticipación. El uso continuado de la plataforma tras la entrada en vigor de los nuevos términos implica su aceptación.",
  },
  {
    id: "ley",
    title: "10. Ley aplicable",
    content:
      "Estos Términos se rigen por las leyes vigentes en los Estados Unidos Mexicanos. Cualquier disputa se someterá a los tribunales competentes de la Ciudad de México, renunciando las partes a cualquier otro fuero que pudiera corresponderles.",
  },
];

export default function TerminosView() {
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
          Términos y condiciones
        </h1>
        <p
          style={{
            color: "var(--muted, #475569)",
            fontSize: "0.95rem",
            maxWidth: 480,
            marginInline: "auto",
            lineHeight: 1.6,
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
          info
        </span>
        <p
          style={{
            color: "var(--fg, #0f172a)",
            fontSize: "0.9rem",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Al usar aDOGme aceptas estos términos. Si tienes dudas, escríbenos a{" "}
          <a
            href="mailto:hola@adogme.mx"
            style={{
              color: "var(--brand, #FA5252)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            hola@adogme.mx
          </a>{" "}
          antes de continuar.
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
            marginBottom: "0.75rem",
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
      <div
        style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
      >
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
          ¿Tienes dudas?{" "}
          <a
            href="mailto:hola@adogme.mx"
            style={{
              color: "var(--brand, #FA5252)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Contáctanos
          </a>
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/privacidad"
            style={{
              color: "var(--muted, #475569)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Privacidad
          </Link>
          <Link
            href="/faq"
            style={{
              color: "var(--muted, #475569)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Preguntas frecuentes
          </Link>
        </div>
      </div>
    </div>
  );
}
