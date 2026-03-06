// modules/home/components/AdoptionProcessView.tsx
"use client";

import Link from "next/link";
import { useAdoptionProcess } from "../application/hooks/useHomeContent";
import "../styles/adoptionProcess.css";

function Skeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="ap-skel-step">
          <div className="ap-skel-circle" />
          <div className="ap-skel-card" />
        </div>
      ))}
    </div>
  );
}

export default function AdoptionProcessView() {
  const { process, loading } = useAdoptionProcess();

  return (
    <div className="ap-page">
      {/* Hero */}
      <header className="ap-hero">
        <p className="ap-kicker">Proceso de adopción</p>
        <h1 className="ap-title">
          Adoptar es más fácil<br />de lo que crees
        </h1>
        <p className="ap-subtitle">
          Te guiamos paso a paso para encontrar al compañero ideal
          y darle un hogar para siempre.
        </p>
      </header>

      {/* Timeline */}
      {loading ? (
        <Skeleton />
      ) : (
        <ol className="ap-timeline">
          {process.map((step) => (
            <li key={step.id} className="ap-step">
              <div className="ap-step__indicator">
                <span className="ap-step__circle">{step.step}</span>
                <div className="ap-step__line" />
              </div>

              <div className="ap-step__content">
                <div className="ap-step__header">
                  <div className="ap-step__icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {step.icon}
                    </span>
                  </div>
                  <span className="ap-step__duration">{step.duration}</span>
                </div>

                <h2 className="ap-step__title">{step.title}</h2>
                <p className="ap-step__subtitle">{step.subtitle}</p>
                <p className="ap-step__desc">{step.description}</p>

                <ul className="ap-step__tips">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="ap-step__tip">
                      <span className="material-symbols-outlined ap-step__tip-icon">
                        check_circle
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* CTA bottom */}
      <div className="ap-cta">
        <h2 className="ap-cta__title">¿Listo para empezar?</h2>
        <p className="ap-cta__desc">
          Explora los perritos disponibles y encuentra a tu compañero ideal.
        </p>
        <Link href="/perros" className="ap-cta__btn">
          Ver perros disponibles
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
