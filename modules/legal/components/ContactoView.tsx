"use client";

import Link from "next/link";
// import { useState } from "react"; // TODO: descomentar cuando se habilite el formulario

const INFO_CARDS = [
  {
    icon: "mail",
    title: "Correo electrónico",
    detail: "contacto@adogme.org",
    href: "mailto:contacto@adogme.org",
    label: "Enviar correo",
  },
  {
    icon: "schedule",
    title: "Horario de atención",
    detail: "Lun – Vie · 9:00 – 18:00 (CDMX)",
    href: null,
    label: null,
  },
  {
    icon: "chat_bubble",
    title: "Preguntas frecuentes",
    detail: "Consulta nuestra sección de ayuda.",
    href: "/faq",
    label: "Ver FAQ",
  },
];

export default function ContactoView() {
  // TODO: descomentar cuando se habilite el formulario
  // const [nombre, setNombre] = useState("");
  // const [correo, setCorreo] = useState("");
  // const [asunto, setAsunto] = useState("");
  // const [mensaje, setMensaje] = useState("");
  // const [enviado, setEnviado] = useState(false);

  // function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   const mailto =
  //     `mailto:contacto@adogme.org` +
  //     `?subject=${encodeURIComponent(asunto || "Contacto desde aDOGme")}` +
  //     `&body=${encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`)}`;
  //   window.location.href = mailto;
  //   setEnviado(true);
  // }

  return (
    <div
      style={{
        maxWidth: 760,
        marginInline: "auto",
        padding: "3rem 1.25rem 5rem",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "2.5rem", textAlign: "center" }}>
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
          Contacto
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
          ¿Tienes alguna duda?
        </h1>
        <p
          style={{
            color: "var(--muted, #475569)",
            fontSize: "0.95rem",
            maxWidth: 480,
            marginInline: "auto",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Estamos aquí para ayudarte. Escríbenos y te responderemos a la
          brevedad.
        </p>
      </header>

      {/* Info cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {INFO_CARDS.map((card) => (
          <div
            key={card.title}
            style={{
              border: "1.5px solid var(--border, #e2e8f0)",
              borderRadius: 16,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              background: "#fff",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 24,
                color: "var(--brand, #FA5252)",
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
              }}
            >
              {card.icon}
            </span>
            <p
              style={{
                fontWeight: 800,
                fontSize: "0.88rem",
                color: "var(--fg, #0f172a)",
                margin: 0,
              }}
            >
              {card.title}
            </p>
            <p
              style={{
                color: "var(--muted, #475569)",
                fontSize: "0.85rem",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {card.detail}
            </p>
            {card.href && card.label && (
              <Link
                href={card.href}
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--brand, #FA5252)",
                  textDecoration: "none",
                }}
              >
                {card.label} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* TODO: formulario de contacto — habilitar cuando haya backend para recibir mensajes
      {enviado ? (
        <div
          style={{
            padding: "2rem",
            borderRadius: 20,
            background: "rgba(250,82,82,0.05)",
            border: "1.5px solid rgba(250,82,82,0.25)",
            textAlign: "center",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 40,
              color: "var(--brand, #FA5252)",
              fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 40",
            }}
          >
            check_circle
          </span>
          <p
            style={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "var(--fg, #0f172a)",
              margin: "0.75rem 0 0.4rem",
            }}
          >
            ¡Mensaje preparado!
          </p>
          <p
            style={{
              color: "var(--muted, #475569)",
              fontSize: "0.88rem",
              margin: 0,
            }}
          >
            Se abrió tu cliente de correo con el mensaje listo para enviar.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1.5px solid var(--border, #e2e8f0)",
            borderRadius: 20,
            padding: "2rem",
            background: "#fff",
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "1rem",
              color: "var(--fg, #0f172a)",
              margin: 0,
            }}
          >
            Envíanos un mensaje
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span style={labelStyle}>Nombre</span>
              <input
                required
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span style={labelStyle}>Correo electrónico</span>
              <input
                required
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={labelStyle}>Asunto</span>
            <input
              required
              type="text"
              placeholder="¿En qué podemos ayudarte?"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={labelStyle}>Mensaje</span>
            <textarea
              required
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: 999,
              background: "var(--brand, #FA5252)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18 }}
            >
              send
            </span>
            Enviar mensaje
          </button>
        </form>
      )}
      */}
    </div>
  );
}

// TODO: descomentar cuando se habilite el formulario
// const labelStyle: React.CSSProperties = {
//   fontSize: "0.8rem",
//   fontWeight: 700,
//   color: "var(--fg, #0f172a)",
// };

// const inputStyle: React.CSSProperties = {
//   padding: "0.6rem 0.85rem",
//   borderRadius: 10,
//   border: "1.5px solid var(--border, #e2e8f0)",
//   fontSize: "0.88rem",
//   color: "var(--fg, #0f172a)",
//   outline: "none",
//   width: "100%",
//   boxSizing: "border-box",
// };
