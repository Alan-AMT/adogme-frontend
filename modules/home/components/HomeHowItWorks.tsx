"use client";


function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="hiw-svg">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16.2 16.2 21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="hiw-svg">
      <path d="M9 4h6a2 2 0 0 1 2 2v2H7V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 12h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 16h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="hiw-svg">
      <path
        d="M12 21s-7-4.7-9.2-9A5.7 5.7 0 0 1 12 5.8 5.7 5.7 0 0 1 21.2 12C19 16.3 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeHowItWorks() {
  return (
    /* Quitamos 'section' para eliminar paddings automáticos */
    <section className="hiw-section">
      {/* Quitamos 'container-page' para que no fuerce márgenes laterales extra */}
      <div className="w-full">
        <header className="hiw-header">
          <p className="hiw-eyebrow">CÓMO FUNCIONA</p>
          <h2 className="hiw-title">En 3 simples pasos</h2>
        </header>

        <div className="hiw-grid">
          <article className="hiw-card">
            <div className="hiw-icon">
              <IconSearch />
            </div>
            <h3 className="hiw-card-title">Explora</h3>
            <p className="hiw-card-desc">Descubre perros en refugios de Gustavo A. Madero</p>
          </article>

          <article className="hiw-card">
            <div className="hiw-icon">
              <IconClipboard />
            </div>
            <h3 className="hiw-card-title">Encuesta</h3>
            <p className="hiw-card-desc">Rellena el formulario de estilo de vida</p>
          </article>

          <article className="hiw-card">
            <div className="hiw-icon">
              <IconHeart />
            </div>
            <h3 className="hiw-card-title">Adopta</h3>
            <p className="hiw-card-desc">Llena la solicitud y lleva a tu nuevo amigo a casa</p>
          </article>
        </div>
      </div>
    </section>
  );
}
