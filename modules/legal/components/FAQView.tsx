"use client";

import Link from "next/link";
import { useState } from "react";
import { MOCK_CHATBOT_FAQS, type ChatbotFAQ } from "@/modules/shared/mockData/content.mock";

type Categoria = ChatbotFAQ["categoria"] | "todas";

const CATEGORIAS: { id: Categoria; label: string; icon: string }[] = [
  { id: "todas",     label: "Todas",      icon: "apps" },
  { id: "adopcion",  label: "Adopción",   icon: "pets" },
  { id: "requisitos",label: "Requisitos", icon: "checklist" },
  { id: "proceso",   label: "Proceso",    icon: "route" },
  { id: "cuidados",  label: "Cuidados",   icon: "favorite" },
  { id: "plataforma",label: "Plataforma", icon: "laptop" },
  { id: "donaciones",label: "Donaciones", icon: "volunteer_activism" },
];

export default function FAQView() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("todas");
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());

  const filtradas =
    categoriaActiva === "todas"
      ? MOCK_CHATBOT_FAQS
      : MOCK_CHATBOT_FAQS.filter((f) => f.categoria === categoriaActiva);

  function toggle(id: number) {
    setAbiertos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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
          Ayuda
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
          Preguntas frecuentes
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
          Todo lo que necesitas saber sobre adopción, requisitos y cómo
          funciona aDOGme.
        </p>
      </header>

      {/* Category filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}
        role="tablist"
        aria-label="Filtrar por categoría"
      >
        {CATEGORIAS.map((cat) => {
          const active = categoriaActiva === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active}
              onClick={() => setCategoriaActiva(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.45rem 0.9rem",
                borderRadius: 999,
                border: active
                  ? "1.5px solid var(--brand, #FA5252)"
                  : "1.5px solid var(--border, #e2e8f0)",
                background: active ? "rgba(250,82,82,0.08)" : "transparent",
                color: active ? "var(--brand, #FA5252)" : "var(--muted, #475569)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 15,
                  fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 16",
                }}
              >
                {cat.icon}
              </span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--muted, #475569)",
          marginBottom: "1.25rem",
          textAlign: "center",
        }}
      >
        {filtradas.length} pregunta{filtradas.length !== 1 ? "s" : ""}
      </p>

      {/* Accordion */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        role="tabpanel"
      >
        {filtradas.map((faq) => {
          const open = abiertos.has(faq.id);
          return (
            <div
              key={faq.id}
              style={{
                border: open
                  ? "1.5px solid rgba(250,82,82,0.3)"
                  : "1.5px solid var(--border, #e2e8f0)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 150ms",
              }}
            >
              <button
                aria-expanded={open}
                onClick={() => toggle(faq.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: open ? "rgba(250,82,82,0.04)" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 150ms",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.93rem",
                    color: "var(--fg, #0f172a)",
                    lineHeight: 1.45,
                  }}
                >
                  {faq.pregunta}
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    color: open ? "var(--brand, #FA5252)" : "var(--muted, #475569)",
                    flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms, color 150ms",
                  }}
                >
                  expand_more
                </span>
              </button>

              {open && (
                <div
                  style={{
                    padding: "0 1.25rem 1.1rem",
                    background: "rgba(250,82,82,0.04)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--muted, #475569)",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {faq.respuesta}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: "3.5rem",
          padding: "1.75rem",
          background: "#f8fafc",
          border: "1px solid var(--border, #e2e8f0)",
          borderRadius: 20,
          textAlign: "center",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 32,
            color: "var(--brand, #FA5252)",
            fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 32",
          }}
        >
          chat
        </span>
        <p
          style={{
            fontWeight: 800,
            fontSize: "1rem",
            color: "var(--fg, #0f172a)",
            margin: "0.5rem 0 0.4rem",
          }}
        >
          ¿No encontraste tu respuesta?
        </p>
        <p
          style={{
            color: "var(--muted, #475569)",
            fontSize: "0.88rem",
            margin: "0 0 1.25rem",
            lineHeight: 1.6,
          }}
        >
          Usa nuestro chatbot o escríbenos directamente.
        </p>
        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/contacto"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 999,
              background: "var(--brand, #FA5252)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              mail
            </span>
            Contactar
          </Link>
          <Link
            href="/terminos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 999,
              border: "1.5px solid var(--border, #e2e8f0)",
              color: "var(--muted, #475569)",
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
              background: "#fff",
            }}
          >
            Ver términos
          </Link>
        </div>
      </div>
    </div>
  );
}
