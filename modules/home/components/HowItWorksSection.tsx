// modules/home/components/HowItWorksSection.tsx
"use client";

import Link from "next/link";
import "../styles/homeHowItWorks.css";

const STEPS = [
  {
    num: 1,
    title: "Crea tu perfil",
    desc: "Regístrate y cuéntanos sobre tu hogar y estilo de vida.",
  },
  {
    num: 2,
    title: "Solicita adopción",
    desc: "Elige a tu compañero ideal y envía tu solicitud en minutos.",
  },
  {
    num: 3,
    title: "Recibe a tu perro",
    desc: "Visita el refugio, completa el proceso y llévalo a casa.",
  },
];

export default function HomeHowItWorks() {
  return (
    <div className="hiw-block">
      {/* ── Left: Cómo adoptar ── */}
      <div className="hiw-left">
        <p className="hiw-kicker">Cómo funciona</p>
        <h2 className="hiw-title">¿Cómo adoptar?</h2>
        <p className="hiw-subtitle">Adoptar es más sencillo de lo que crees.</p>

        <ol className="hiw-steps">
          {STEPS.map((s) => (
            <li key={s.num} className="hiw-step">
              <span className="hiw-step__num">{s.num}</span>
              <div className="hiw-step__text">
                <span className="hiw-step__title">{s.title}</span>
                <span className="hiw-step__desc">{s.desc}</span>
              </div>
            </li>
          ))}
        </ol>

        <Link href="/proceso-adopcion" className="hiw-link">
          Ver proceso completo
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_forward
          </span>
        </Link>
      </div>

      {/* ── Right: Donación CTA ── */}
      <div className="hiw-right">
        <div className="hiw-right__deco" />
        <div className="hiw-right__deco2" />

        <span className="material-symbols-outlined hiw-right__icon">
          volunteer_activism
        </span>

        <p className="hiw-right__kicker">¿No puedes adoptar?</p>
        <h2 className="hiw-right__title">Dona y ayuda a un refugio</h2>
        <p className="hiw-right__desc">
          Cada contribución marca la diferencia para los perros que esperan
          un hogar. Apoya al refugio de tu elección.
        </p>

        <Link href="/refugios" className="hiw-right__cta">
          Donar ahora
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            favorite
          </span>
        </Link>
      </div>
    </div>
  );
}
