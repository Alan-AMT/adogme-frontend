"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const navLinkBase =
  "rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition";
const navLinkActive =
  "rounded-full px-4 py-2 text-sm font-semibold text-[#ff6b6b] bg-[#ff6b6b]/10 ring-1 ring-[#ff6b6b]/25 transition";

/* ─── Mobile drawer via React Portal ──────────────────────────────
   Renderizado directamente en document.body para escapar del
   stacking context del header sticky y funcionar en cualquier
   posicion de scroll.
   ─────────────────────────────────────────────────────────────── */
function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Bloquear scroll del body cuando el menu esta abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay oscuro */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel lateral deslizante */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegacion"
        className={`fixed top-0 right-0 z-[9999] h-full w-80 max-w-[90vw]
          bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Cabecera del panel */}
        <div className="px-5 py-4 border-b border-zinc-200 bg-gradient-to-r from-[#fff1f2] via-white to-[#fff7ed] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
              <Image
                src="/assets/logos/adogme-logo.png"
                alt="aDOGme"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <p className="font-black text-lg leading-tight text-zinc-900">aDOGme</p>
              <p className="text-xs text-zinc-500">Encuentra a tu compañero ideal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar menu"
            className="btn btn-sm btn-ghost rounded-full w-9 h-9 min-h-0 p-0 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Links de navegacion */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="menu gap-1 p-0">
            <li>
              <Link
                href="/perros"
                onClick={onClose}
                className={
                  isActive(pathname, "/perros")
                    ? "text-[#ff6b6b] font-semibold flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <span className="material-symbols-outlined text-[20px] leading-none">pets</span>
                Catalogo
              </Link>
            </li>

            <li>
              <Link href="/#proceso" onClick={onClose} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] leading-none">checklist</span>
                Proceso
              </Link>
            </li>

            <li>
              <Link
                href="/refugios"
                onClick={onClose}
                className={
                  isActive(pathname, "/refugios")
                    ? "text-[#ff6b6b] font-semibold flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <span className="material-symbols-outlined text-[20px] leading-none">home_work</span>
                Refugios
              </Link>
            </li>

            <li>
              <Link href="/#acerca" onClick={onClose} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] leading-none">info</span>
                Acerca
              </Link>
            </li>

            <div className="my-3 border-t border-zinc-200" />

            <li>
              <Link href="/login" onClick={onClose} className="font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] leading-none">login</span>
                Entrar
              </Link>
            </li>

            <li>
              <Link
                href="/registro"
                onClick={onClose}
                className="font-semibold text-[#ff6b6b] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">person_add</span>
                Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>,
    document.body
  );
}

/* ─── Header principal ─────────────────────────────────────────── */
const AdogmeHeader = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Cerrar el drawer automaticamente al navegar
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* TOP BAR */}
        <div className="border-b border-[#ff6b6b]/25 bg-gradient-to-r from-[#ffe4e6] via-[#fff7ed] to-[#ffe4e6]">
          <div className="container-page min-h-10 px-4 py-2 flex items-center justify-center text-sm text-zinc-900 text-center">
            <span className="font-semibold">
              Adopta, no compres.
              <span className="ml-2 font-medium text-zinc-700">
                Dale una segunda oportunidad.
              </span>
            </span>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="bg-white/90 backdrop-blur border-b border-zinc-200">
          <div className="container-page px-4">
            <div className="relative flex items-center py-3">

              {/* IZQUIERDA: Logo + nombre */}
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
                  <Image
                    src="/assets/logos/adogme-logo.png"
                    alt="aDOGme"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <div className="leading-none">
                  <p className="font-black text-xl tracking-tight text-zinc-900">aDOGme</p>
                </div>
              </Link>

              {/* CENTRO: links (desktop) */}
              <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
                <Link href="/perros" className={isActive(pathname, "/perros") ? navLinkActive : navLinkBase}>
                  Catálogo
                </Link>
                <Link href="/#proceso" className={navLinkBase}>Proceso</Link>
                <Link href="/refugios" className={isActive(pathname, "/refugios") ? navLinkActive : navLinkBase}>
                  Refugios
                </Link>
                <Link href="/#acerca" className={navLinkBase}>Acerca</Link>
              </nav>

              {/* DERECHA: auth buttons (desktop) */}
              <div className="hidden md:flex items-center gap-2 ml-auto">
                <Link
                  href="/login"
                  className="btn btn-sm rounded-full bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">login</span>
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  className="btn btn-sm rounded-full bg-[#ff6b6b] border-0 text-white hover:bg-[#ff5252] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] leading-none">person_add</span>
                  Registrarse
                </Link>
              </div>

              {/* MOBILE: boton hamburguesa */}
              <div className="md:hidden ml-auto">
                <button
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Abrir menu"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-nav"
                  className="btn btn-sm rounded-full bg-zinc-100 border border-zinc-200 hover:bg-zinc-200"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Portal: renderizado en document.body, completamente fuera del header */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default AdogmeHeader;
