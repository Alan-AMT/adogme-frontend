// modules/shared/components/layout/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR PRINCIPAL — aDOGme
// 4 estados: visitante | solicitante | refugio | admin
// Top bar alineada al navbar, mobile drawer premium, scroll-aware, avatar dropdown
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type NavRole = "adoptante" | "refugio" | "admin";

interface NavUser {
  role: NavRole;
  name: string;
  email: string;
  avatar?: string;
  shelterName?: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const NAV_VISITOR = [
  { href: "/perros", label: "Catálogo", icon: "pets" },
  { href: "/refugios", label: "Refugios", icon: "home_work" },
  { href: "/proceso-adopcion", label: "Proceso", icon: "checklist" },
];

const NAV_ADOPTANTE = [
  { href: "/perros", label: "Catálogo", icon: "pets" },
  { href: "/refugios", label: "Refugios", icon: "home_work" },
  { href: "/proceso-adopcion", label: "Proceso", icon: "checklist" },
  { href: "/mis-solicitudes", label: "Mis solicitudes", icon: "assignment" },
  { href: "/mi-match", label: "Mi Match", icon: "recommend" },
];

const NAV_REFUGIO = [
  { href: "/refugio/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/refugio/perros", label: "Mis perros", icon: "pets" },
  { href: "/refugio/solicitudes", label: "Solicitudes", icon: "assignment" },
];

const NAV_ADMIN = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/refugios", label: "Refugios", icon: "home_work" },
  { href: "/admin/perros", label: "Perros", icon: "pets" },
  { href: "/admin/contenido", label: "Contenido", icon: "edit_document" },
];

const DROPDOWN_ADOPTANTE = [
  { href: "/mi-perfil", label: "Mi perfil", icon: "person" },
  { href: "/favoritos", label: "Favoritos", icon: "favorite" },
  { href: "/mis-solicitudes", label: "Mis solicitudes", icon: "assignment" },
  { href: "/mi-match", label: "Mi Match", icon: "recommend" },
];

const DROPDOWN_REFUGIO = [
  {
    href: "/refugio/perfil",
    label: "Perfil del refugio",
    icon: "manage_accounts",
  },
];

const DROPDOWN_ADMIN = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/refugios", label: "Refugios", icon: "home_work" },
  { href: "/admin/perros", label: "Perros", icon: "pets" },
  { href: "/admin/contenido", label: "Contenido", icon: "edit_document" },
];

const TICKER_MESSAGES = [
  "Adopta, no compres, dales una segunda oportunidad",
  "Refugios verificados en la GAM",
  "Cada adopción transforma dos vidas",
  "Encuentra tu match perfecto en minutos",
];

function TopBar() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % TICKER_MESSAGES.length);
        setFade(true);
      }, 250);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        background:
          "linear-gradient(90deg, #fff4f4 0%, #fff8f5 35%, #fff4f8 70%, #f6f7ff 100%)",
        borderColor: "rgba(255,107,107,0.14)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#ffd4d4]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="hidden md:grid h-10 items-center grid-cols-[220px_minmax(0,1fr)_260px]">
          <div />

          <div className="flex items-center justify-center">
            <p
              className="text-[7px] lg:text-[7.5px] font-[500] text-[#94a3b8] tracking-[0.04em] text-center transition-all duration-300"
              style={{
                opacity: fade ? 1 : 0,
                transform: fade ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              {TICKER_MESSAGES[idx]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-5">
            <Link
              href="/refugios"
              className="topbar-link topbar-link-black inline-flex items-center gap-1 text-[10px] lg:text-[11px] font-[800] uppercase tracking-[0.08em] text-[#ff6b6b] hover:text-[#fa5252] transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 12,
                  color: "#ff6b6b",
                  fontVariationSettings:
                    "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 12",
                }}
              >
                favorite
              </span>
              Donar
            </Link>

            <Link
              href="/proceso-adopcion"
              className="topbar-link topbar-link-red text-[10px] lg:text-[11px] font-[700] uppercase tracking-[0.08em] text-[#94a3b8] hover:text-[#64748b] transition-colors"
            >
              Cómo funciona
            </Link>
          </div>
        </div>

        <div className="md:hidden h-8 flex items-center justify-center">
          <p
            className="text-[10px] font-[500] text-[#64748b] tracking-[0.02em] text-center transition-all duration-300"
            style={{
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(-3px)",
            }}
          >
            {TICKER_MESSAGES[idx]}
          </p>
        </div>
      </div>
    </div>
  );
}

function AvatarDropdown({
  user,
  onLogout,
}: {
  user: NavUser;
  onLogout: () => void;
}) {
  console.log("user AvatarDropDown", user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const items =
    user.role === "refugio"
      ? DROPDOWN_REFUGIO
      : user.role === "admin"
        ? DROPDOWN_ADMIN
        : DROPDOWN_ADOPTANTE;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#e5e7eb]
                   bg-white hover:bg-[#fafafa] hover:border-[#d4d4d8]
                   transition-all duration-150 group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden
                     bg-gradient-to-br from-[#ff6b6b] to-[#fa5252] text-white text-[12px] font-[900]"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </div>

        <div className="hidden lg:flex flex-col items-start leading-none">
          <span className="text-[13px] font-[800] text-[#18181b] max-w-[120px] truncate">
            {user.shelterName ?? user.name.split(" ")[0]}
          </span>
          <span className="text-[10px] font-[700] text-[#a1a1aa] capitalize">
            {user.role}
          </span>
        </div>

        <span
          className="material-symbols-outlined text-[#a1a1aa] group-hover:text-[#71717a] transition-all duration-200"
          style={{
            fontSize: 16,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          keyboard_arrow_down
        </span>
      </button>

      <div
        className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-[16px] border border-[#e4e4e7]
                   overflow-hidden transition-all duration-200 origin-top-right z-50"
        style={{
          boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          opacity: open ? 1 : 0,
          transform: open
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-[#fff5f5] to-[#fff9f9] border-b border-[#f4f4f5]">
          <p className="text-[13px] font-[900] text-[#18181b] truncate">
            {user.name}
          </p>
          <p className="text-[11px] text-[#a1a1aa] font-[600] truncate">
            {user.email}
          </p>
        </div>

        <div className="p-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] font-[700] text-[#374151]
                         hover:bg-[#fff5f5] hover:text-[#ff6b6b] transition-colors group"
            >
              <span
                className="material-symbols-outlined text-[#a1a1aa] group-hover:text-[#ff6b6b] transition-colors"
                style={{
                  fontSize: 17,
                  fontVariationSettings:
                    "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 17",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="px-1.5 pb-1.5">
          <div className="border-t border-[#f4f4f5] mb-1.5" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] font-[700]
                       text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 17 }}
            >
              logout
            </span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
  user,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  user: NavUser | null;
  onLogout: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!mounted) return null;

  const navItems = !user
    ? NAV_VISITOR
    : user.role === "refugio"
      ? NAV_REFUGIO
      : user.role === "admin"
        ? NAV_ADMIN
        : NAV_ADOPTANTE;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[9998] transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed top-0 right-0 z-[9999] h-full flex flex-col"
        style={{
          width: "min(360px, 92vw)",
          background: "#ffffff",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.14)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="relative px-5 pt-5 pb-4 shrink-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #fff0f0 0%, #fff7f5 50%, #fff0f6 100%)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff6b6b] via-[#fa5252] to-[#ff9999]" />
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#ff6b6b]/6 pointer-events-none" />
          <div className="absolute top-8 -right-4 w-20 h-20 rounded-full bg-[#ff9999]/8 pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{
                  border: "2px solid #ff6b6b",
                  background: "transparent",
                  boxShadow: "0 6px 16px rgba(255,107,107,0.25)",
                }}
              >
                <Image
                  src="/assets/logos/adogme-logo.png"
                  alt="aDOGme logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <p className="font-[950] text-[20px] text-[#111827] tracking-[-0.02em]">
                  a<span className="text-[#ff6b6b]">DOG</span>me
                </p>
                <p className="text-[11px] text-[#9ca3af] font-[600]">
                  Adopción responsable CDMX
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="w-9 h-9 flex items-center justify-center rounded-full
                         bg-white/80 border border-[#e5e7eb] text-[#71717a]
                         hover:bg-white hover:text-[#18181b] hover:border-[#d4d4d8]
                         transition-all duration-150"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                close
              </span>
            </button>
          </div>

          {user && (
            <div className="mt-4 p-3 rounded-[14px] bg-white/70 border border-[#ffe4e4] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                           bg-gradient-to-br from-[#ff6b6b] to-[#fa5252] text-white text-[13px] font-[900]"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-[14px] font-[900] text-[#18181b] truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-[#a1a1aa] font-[600] truncate">
                  {user.email}
                </p>
              </div>
              <span
                className="text-[10px] font-[900] uppercase tracking-wide px-2 py-1 rounded-full"
                style={{
                  background: "rgba(255,107,107,0.1)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255,107,107,0.2)",
                }}
              >
                {user.role}
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[10px] font-[600] uppercase tracking-[0.12em] text-[#c4c4c7] px-3 mb-2 text-center">
            {user?.role === "refugio"
              ? "Portal refugio"
              : user?.role === "admin"
                ? "Administración"
                : user
                  ? "Mi espacio"
                  : "Explorar"}
          </p>

          <ul className="flex flex-col gap-0.5">
            {navItems.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-[12px] transition-all duration-150 group"
                    style={{
                      background: active
                        ? "rgba(255,107,107,0.08)"
                        : "transparent",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined flex-shrink-0 transition-colors"
                      style={{
                        fontSize: 20,
                        color: active ? "#ff6b6b" : "#a1a1aa",
                        fontVariationSettings: `'FILL' ${active ? 1 : 0},'wght' 300,'GRAD' 0,'opsz' 20`,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="text-[14px] transition-colors"
                      style={{
                        fontWeight: active ? 600 : 500,
                        color: active ? "#ff6b6b" : "#4b5563",
                      }}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff6b6b] flex-shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-4 border-t border-[#f4f4f5]" />

          {!user ? (
            <>
              <p className="text-[10px] font-[600] uppercase tracking-[0.12em] text-[#c4c4c7] px-3 mb-2 text-center">
                Cuenta
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 px-4 py-[11px] rounded-full
                             bg-white border border-[#e2e8f0] text-[#374151] text-[13px] font-[500]
                             hover:border-[#cbd5e1] hover:text-[#111827] transition-colors"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 17 }}
                  >
                    login
                  </span>
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 px-4 py-[11px] rounded-full
                             text-white text-[13px] font-[600] transition-all duration-150
                             hover:opacity-90"
                  style={{
                    background: "#ff6b6b",
                    boxShadow: "0 2px 10px rgba(255,107,107,0.28)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 17 }}
                  >
                    person_add
                  </span>
                  Registrarse gratis
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-[600] uppercase tracking-[0.12em] text-[#c4c4c7] px-3 mb-2 text-center">
                Configuración
              </p>
              <ul className="flex flex-col gap-0.5 mb-3">
                {(user.role === "refugio"
                  ? DROPDOWN_REFUGIO
                  : user.role === "admin"
                    ? DROPDOWN_ADMIN
                    : DROPDOWN_ADOPTANTE
                ).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[13px]
                                 font-[500] text-[#4b5563] hover:bg-[#f9fafb] transition-colors group"
                    >
                      <span
                        className="material-symbols-outlined text-[#d4d4d8] group-hover:text-[#ff6b6b] transition-colors"
                        style={{
                          fontSize: 17,
                          fontVariationSettings:
                            "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 17",
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-[11px] rounded-full
                           border border-[#fecaca] bg-[#fef2f2] text-[#ef4444] text-[13px] font-[500]
                           hover:bg-[#fee2e2] transition-colors"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 17 }}
                >
                  logout
                </span>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-[#f4f4f5] bg-[#fafafa] shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#c4c4c7] font-[600]">
              © 2025 aDOGme · CDMX
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/terminos"
                className="text-[11px] text-[#c4c4c7] font-[600] hover:text-[#9ca3af] transition-colors"
              >
                Términos
              </Link>
              <span className="text-[#e5e7eb]">·</span>
              <Link
                href="/privacidad"
                className="text-[11px] text-[#c4c4c7] font-[600] hover:text-[#9ca3af] transition-colors"
              >
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);

  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifs]);

  const user: NavUser | null = authUser
    ? {
        role:
          authUser.role === "applicant"
            ? "adoptante"
            : authUser.role === "shelter"
              ? "refugio"
              : "admin",
        name: (authUser as { name: string }).name,
        email: (authUser as { email: string }).email,
        avatar: (authUser as { avatarUrl?: string }).avatarUrl,
        shelterName:
          authUser.role === "shelter"
            ? (authUser as { nombreRefugio?: string }).nombreRefugio
            : undefined,
      }
    : null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const navLinks = !user
    ? NAV_VISITOR
    : user.role === "refugio"
      ? NAV_REFUGIO
      : user.role === "admin"
        ? NAV_ADMIN
        : NAV_ADOPTANTE;

  const roleBadge =
    user?.role === "refugio"
      ? { label: "Portal Refugio", color: "#7c3aed" }
      : user?.role === "admin"
        ? { label: "Panel Admin", color: "#0ea5e9" }
        : null;

  return (
    <>
      <header className="sticky top-0 z-50">
        <TopBar />

        <div
          className="bg-white/95 backdrop-blur-md border-b border-[#f0f0f0] transition-shadow duration-300"
          style={{
            boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-[78px] gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 shrink-0 group w-[220px]"
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0
                             transition-transform duration-200 group-hover:scale-105 overflow-hidden"
                  style={{
                    border: "2px solid #ff6b6b",
                    background: "transparent",
                  }}
                >
                  <Image
                    src="/assets/logos/adogme-logo.png"
                    alt="aDOGme logo"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>

                <div className="leading-none">
                  <p className="font-[950] text-[20px] text-[#111827] tracking-[-0.02em] leading-none">
                    a<span className="text-[#ff6b6b]">DOG</span>me
                  </p>
                  {roleBadge && (
                    <span
                      className="text-[9px] font-[900] uppercase tracking-[0.15em] leading-none"
                      style={{ color: roleBadge.color }}
                    >
                      {roleBadge.label}
                    </span>
                  )}
                </div>
              </Link>

              <nav
                className="hidden md:flex flex-1 justify-center items-center gap-1.5"
                aria-label="Navegación principal"
              >
                {navLinks.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] lg:text-[13px]
                                 transition-all duration-150"
                      style={{
                        color: active ? "#ffffff" : "#6b7280",
                        background: active ? "#ff6b6b" : "transparent",
                        fontWeight: active ? 700 : 500,
                        letterSpacing: active ? "0" : "0.01em",
                        boxShadow: active
                          ? "0 4px 12px rgba(255,107,107,0.28)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background =
                            "rgba(255,107,107,0.08)";
                          e.currentTarget.style.color = "#ff6b6b";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#52525b";
                        }
                      }}
                    >
                      {active && (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 14,
                            fontVariationSettings:
                              "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 14",
                          }}
                        >
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden md:flex items-center gap-3 shrink-0 w-[260px] justify-center">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-5 py-[7px] rounded-full text-[13px] font-[500] tracking-[0.01em]
                                 text-[#374151] border border-[#e2e8f0]
                                 hover:border-[#cbd5e1] hover:text-[#111827] transition-all duration-150"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                      >
                        login
                      </span>
                      Entrar
                    </Link>

                    <Link
                      href="/registro"
                      className="flex items-center gap-1.5 px-5 py-[7px] rounded-full text-[13px] font-[600] tracking-[0.01em]
                                 hover:opacity-90 transition-all duration-150"
                      style={{
                        background: "#ff6b6b",
                        boxShadow: "0 2px 10px rgba(255,107,107,0.28)",
                        color: "#ffffff",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16, color: "#ffffff" }}
                      >
                        person_add
                      </span>
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    {/* <div className="relative" ref={notifsRef}>
                      <button
                        type="button"
                        onClick={() => setShowNotifs((v) => !v)}
                        className="relative w-9 h-9 flex items-center justify-center rounded-full
                                   border border-[#e5e7eb] bg-white text-[#71717a]
                                   hover:bg-[#fafafa] hover:border-[#d4d4d8] transition-all duration-150"
                        aria-label="Notificaciones"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18 }}
                        >
                          notifications
                        </span>
                        <span
                          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff6b6b]
                                     text-white text-[9px] font-[900] flex items-center justify-center"
                        >
                          3
                        </span>
                      </button>

                      {showNotifs && (
                        <div
                          className="absolute right-0 top-11 w-80 bg-white border border-[#f0f0f0]
                                        rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-50 overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f4f4f5]">
                            <span className="text-sm font-[700] text-[#18181b]">
                              Notificaciones
                            </span>
                            <span className="text-[10px] font-[700] px-2 py-0.5 rounded-full bg-[#fff5f5] text-[#ff6b6b]">
                              3 nuevas
                            </span>
                          </div>
                          <div className="divide-y divide-[#f4f4f5]">
                            {[
                              {
                                icon: "pets",
                                color: "#ff6b6b",
                                bg: "#fff5f5",
                                title: "Solicitud actualizada",
                                desc: "Tu solicitud para adoptar a Thor fue revisada.",
                                time: "hace 5 min",
                              },
                              {
                                icon: "favorite",
                                color: "#ec4899",
                                bg: "#fdf2f8",
                                title: "Nuevo match",
                                desc: "Luna podría ser tu compañera ideal.",
                                time: "hace 1 h",
                              },
                              {
                                icon: "chat",
                                color: "#3b82f6",
                                bg: "#eff6ff",
                                title: "Mensaje del refugio",
                                desc: "Huellitas MX te envió un mensaje.",
                                time: "hace 3 h",
                              },
                            ].map((n, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-[#fafafa] cursor-pointer transition-colors"
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ background: n.bg }}
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 16, color: n.color }}
                                  >
                                    {n.icon}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-[600] text-[#18181b]">
                                    {n.title}
                                  </p>
                                  <p className="text-[12px] text-[#71717a] mt-0.5 leading-snug">
                                    {n.desc}
                                  </p>
                                  <p className="text-[11px] text-[#a1a1aa] mt-1">
                                    {n.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 py-2.5 border-t border-[#f4f4f5]">
                            <button className="text-[12px] font-[600] text-[#ff6b6b] hover:underline w-full text-center">
                              Ver todas las notificaciones
                            </button>
                          </div>
                        </div>
                      )}
                    </div> */}

                    <AvatarDropdown user={user} onLogout={handleLogout} />
                  </>
                )}
              </div>

              <div className="md:hidden ml-auto flex items-center gap-2">
                {user && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                               bg-gradient-to-br from-[#ff6b6b] to-[#fa5252] text-white text-[11px] font-[900]"
                  >
                    {getInitials(user.name)}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Abrir menú"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-nav"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                             border border-[#e5e7eb] bg-white text-[#374151]
                             hover:bg-[#fafafa] hover:border-[#d4d4d8] transition-all duration-150"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    menu
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
