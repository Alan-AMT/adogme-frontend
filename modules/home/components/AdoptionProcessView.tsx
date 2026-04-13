// modules/home/components/AdoptionProcessView.tsx
"use client";

import Link from "next/link";
import "../styles/adoptionProcess.css";

const ADOPTION_STEPS = [
  {
    id: 1, step: 1, icon: "search",
    title: "Explora los perfiles",
    subtitle: "Conoce a los perritos disponibles",
    description: "Navega el catálogo de perros en refugios de Gustavo A. Madero. Filtra por tamaño, energía o compatibilidad con tu estilo de vida para encontrar a tu compañero ideal.",
    tips: ["Usa los filtros de tamaño y nivel de energía", "Lee con calma la descripción de cada perfil", "Guarda tus favoritos con el ícono de corazón"],
    duration: "~10 min",
  },
  {
    id: 2, step: 2, icon: "quiz",
    title: "Responde la encuesta",
    subtitle: "Cuéntanos sobre tu hogar",
    description: "Completa un breve cuestionario sobre tu vivienda, rutinas y experiencia con mascotas. Con esta información generamos sugerencias de compatibilidad personalizadas.",
    tips: ["Responde con honestidad para mejores resultados", "Toma en cuenta el espacio disponible en casa", "Considera tu nivel de actividad diaria"],
    duration: "~5 min",
  },
  {
    id: 3, step: 3, icon: "description",
    title: "Envía tu solicitud",
    subtitle: "Da el primer paso oficial",
    description: "Completa el formulario de adopción con tus datos y adjunta los documentos requeridos. El refugio revisará tu solicitud y se pondrá en contacto contigo en 2–3 días hábiles.",
    tips: ["Ten a la mano tu identificación oficial", "Adjunta comprobante de domicilio reciente", "Describe brevemente tu motivación para adoptar"],
    duration: "~15 min",
  },
  {
    id: 4, step: 4, icon: "handshake",
    title: "Visita al refugio",
    subtitle: "Conoce a tu futuro compañero",
    description: "Agenda una visita presencial para interactuar con el perrito y confirmar la compatibilidad. El equipo del refugio estará contigo para resolver dudas y guiarte en el proceso.",
    tips: ["Lleva a todos los miembros del hogar a la visita", "Si tienes otra mascota, consulta si puede asistir", "Prepara preguntas sobre hábitos y salud del perro"],
    duration: "1–2 horas",
  },
  {
    id: 5, step: 5, icon: "favorite",
    title: "¡Bienvenido a casa!",
    subtitle: "El inicio de una nueva historia",
    description: "Una vez aprobada la solicitud, coordina con el refugio la fecha de entrega. Asegúrate de tener listo el espacio, comida, agua y un veterinario de confianza para la primera revisión.",
    tips: ["Prepara un área tranquila para los primeros días", "Ten paciencia durante el período de adaptación", "Programa una visita al veterinario en la primera semana"],
    duration: "A tu ritmo",
  },
];

export default function AdoptionProcessView() {
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
      <ol className="ap-timeline">
        {ADOPTION_STEPS.map((step) => (
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
