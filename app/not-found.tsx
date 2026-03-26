// app/not-found.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Página 404 global — se activa con notFound() o rutas inexistentes.
// Standalone: no hereda Navbar/Footer del (public)/layout porque vive en
// la raíz de /app, fuera de los route groups.
// ─────────────────────────────────────────────────────────────────────────────

import Image from 'next/image'
import Link  from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col">

      {/* ── Contenido principal ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-4xl w-full">

          {/* Ilustración — perro confundido */}
          <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px]">
            <Image
              src="/assets/ui/not-found.jpg"
              alt="Perro confundido buscando la página"
              width={420}
              height={420}
              className="w-full h-auto rounded-[24px] object-cover"
              style={{ boxShadow: '0 20px 48px rgba(17,24,39,0.12)' }}
              priority
            />
          </div>

          {/* Texto y acciones */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Número 404 */}
            <p
              className="font-[950] leading-none tracking-tighter select-none"
              style={{ fontSize: 'clamp(88px, 16vw, 152px)', color: '#ff6b6b' }}
              aria-hidden="true"
            >
              404
            </p>

            {/* Headline */}
            <h1
              className="font-[950] text-[#111827] tracking-tight leading-[1.1] mb-3 -mt-1"
              style={{ fontSize: 'clamp(22px, 3.8vw, 36px)' }}
            >
              ¡Esta página se escapó del refugio!
            </h1>

            {/* Descripción */}
            <p className="text-[15px] text-[#6b7280] leading-[1.7] mb-8 max-w-[400px]">
              La ruta que buscas no existe o fue movida. Pero no te preocupes,
              hay muchos perritos esperándote en la plataforma.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              {/* Primario — ir al inicio */}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full
                           bg-[#ff6b6b] text-white font-[950] text-[13px]
                           hover:bg-[#fa5252] hover:-translate-y-0.5 transition-all duration-150"
                style={{ boxShadow: '0 12px 22px rgba(255,107,107,0.28)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}
                >
                  home
                </span>
                Volver al inicio
              </Link>

              {/* Secundario — catálogo */}
              <Link
                href="/perros"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full
                           border border-[#e5e7eb] bg-white text-[#111827] font-[950] text-[13px]
                           hover:bg-[#f9fafb] hover:-translate-y-0.5 transition-all duration-150"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 18" }}
                >
                  pets
                </span>
                Ver perritos
              </Link>
            </div>

            {/* Código de error — sutil */}
            <p className="mt-6 text-[12px] font-[700] text-[#d1d5db] tracking-[0.12em] uppercase">
              Error 404 · Página no encontrada
            </p>
          </div>

        </div>
      </main>

    </div>
  )
}
