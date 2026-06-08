// modules/shared/components/layout/Footer.tsx
// Server Component — sin 'use client'

import Image from "next/image";
import Link from "next/link";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface FooterLink {
  label: string;
  href: string;
}
interface FooterCol {
  title: string;
  links: FooterLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const COLS: FooterCol[] = [
  {
    title: "Explorar",
    links: [
      { label: "Perros en adopción", href: "/perros" },
      { label: "Refugios verificados", href: "/refugios" },
      { label: "Cómo funciona", href: "/proceso-adopcion" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos y condiciones", href: "/terminos" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/faq" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

// Social links — SVGs inline
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/adogme_org/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },

];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        background: "#0f0f11",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: -80,
          width: 560,
          height: 560,
          background:
            "radial-gradient(circle, rgba(255,107,107,0.09) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -80,
          right: -60,
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Textura */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/ui/back.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "180px auto",
          opacity: 0.018,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-14 flex flex-col items-center gap-12">
          {/* Brand — centrado */}
          <div className="flex flex-col items-center gap-5 text-center">
            <Link
              href="/"
              className="flex items-center gap-3 w-fit group"
              aria-label="Ir al inicio"
            >
              <div
                className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 overflow-hidden"
                style={{
                  border: "2px solid #ff6b6b",
                  background: "transparent",
                }}
              >
                <Image
                  src="/assets/logos/adogme-logo.png"
                  alt="aDOGme logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <span className="font-[950] text-[22px] tracking-[-0.02em] text-white leading-none">
                a<span className="text-[#ff6b6b]">DOG</span>me
              </span>
            </Link>

            <p className="text-[14px] leading-[1.65] max-w-[260px] text-[#71717a]">
              Uniendo corazones. Adopta y cambia dos vidas.
            </p>

            {/* Socials — centrados */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {SOCIALS.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-150
                               bg-white/5 border-white/10 text-[#71717a]
                               hover:bg-[#ff6b6b]/15 hover:border-[#ff6b6b]/30 hover:text-[#ff6b6b] hover:-translate-y-[2px]"
                  >
                    {s.icon}
                  </a>
                ) : (
                  <span
                    key={s.label}
                    aria-label={`${s.label} no disponible`}
                    className="w-9 h-9 flex items-center justify-center rounded-full border
                               bg-white/5 border-white/10 text-[#52525b]"
                  >
                    {s.icon}
                  </span>
                ),
              )}
            </div>

          </div>

          {/* Separador */}
          <div
            className="w-full max-w-2xl h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          {/* Cols — centradas */}
          <div className="grid grid-cols-3 gap-16 w-full max-w-2xl">
            {COLS.map((col) => (
              <div
                key={col.title}
                className="group flex flex-col items-center gap-4 text-center"
              >
                {/* TOPBAR TITLE (hover underline) */}
                <p
                  className="
                    relative inline-block
                    text-[13px] sm:text-[14px]
                    font-[950] uppercase tracking-[0.22em]
                    text-white
                    pb-2
                    after:content-['']
                    after:absolute after:left-1/2 after:-translate-x-1/2
                    after:bottom-0 after:h-[2px] after:w-10
                    after:bg-[#ff6b6b]
                    after:rounded-full
                    after:scale-x-0 after:origin-center
                    after:transition-transform after:duration-200
                    group-hover:after:scale-x-100
                  "
                  style={{ fontFamily: "var(--font-body, var(--font-sans))" }}
                >
                  {col.title}
                </p>

                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      {/* OPTIONS (hover rojo + underline) */}
                      <Link
                        href={link.href}
                        className="
                          relative inline-block
                          text-[14px] font-[600]
                          text-[#71717a]
                          transition-colors duration-150
                          hover:text-[#ff6b6b]
                          pb-[2px]
                          after:content-['']
                          after:absolute after:left-0 after:bottom-0
                          after:h-[2px] after:w-full
                          after:bg-[#ff6b6b]
                          after:rounded-full
                          after:scale-x-0 after:origin-left
                          after:transition-transform after:duration-200
                          hover:after:scale-x-100
                        "
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-[12px] font-[600] order-2 sm:order-1 text-[#3f3f46]">
            © {year} aDOGme · Hecho con{" "}
            <span className="text-[#ff6b6b]">♥</span> en Ciudad de México
          </p>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full order-1 sm:order-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 14,
                color: "#22c55e",
                fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 14",
              }}
            >
              verified
            </span>
            <span className="text-[11px] font-[800] tracking-wide text-[#52525b]">
              Refugios verificados · Adopción responsable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
