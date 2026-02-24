"use client";


import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MockHomeSheltersListRepository } from "../infrastructure/MockHomeSheltersList";

type ShelterCard = {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  correo: string;
  telefono: string;
  logo: string;
  imagenPortada: string;
  fechaRegistro: string;
  aprobado: boolean;
  imageUrl?: string;
};

function StatusPill({ aprobado }: { aprobado: boolean }) {
  return (
    <span className={`hs-pill ${aprobado ? "is-ok" : "is-pending"}`}>
      {aprobado ? "✓ Aprobado" : "⏳ En revisión"}
    </span>
  );
}

/** Normaliza rutas como /logos/x.png → /assets/logos/x.png */
function fixLogoPath(path: string): string {
  if (!path) return "/assets/logos/adogme-logo.png";
  if (path.startsWith("/assets")) return path;
  if (path.startsWith("/logos")) return `/assets${path}`;
  return path;
}

export default function HomeSheltersSection() {
  const [shelters, setShelters] = useState<ShelterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (shelters.length <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % shelters.length), 9000);
    return () => clearInterval(id);
  }, [shelters.length]);

  useEffect(() => {
    (async () => {
      try {
        const repo = new MockHomeSheltersListRepository();
        const list = await repo.getHomeSheltersList();
        setShelters(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const slides = useMemo(() => shelters, [shelters]);

  return (
    <section className="hs-section">
      {/* Header */}
      <div className="hs-header">
        <div>
          <p className="hs-kicker">Refugios</p>
          <h2 className="hs-title">Refugios aliados</h2>
          <p className="hs-subtitle">
            Conoce a quienes rescatan y acompañan el proceso de adopción
          </p>
        </div>

        <Link href="/refugios" className="hs-all">
          Ver todos
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Carousel */}
      <div className="hs-carousel">
        {loading ? (
          <div className="hs-skelFrame">
            <div className="hs-skelPanel">
              <div className="hs-skelLeft" />
              <div className="hs-skelCenter" />
              <div className="hs-skelRight" />
            </div>
          </div>
        ) : (
          <>
            <div className="hs-track" style={{ transform: `translateX(-${active * 100}%)` }}>
              {slides.map((r) => {
                const heroImg = r.imageUrl || r.imagenPortada || "/shelter.jpg";

                return (
                  <article key={r.id} className="hs-frame" aria-label={`Refugio ${r.nombre}`}>
                    <div className="hs-panel">
                      {/* Estado: ARRIBA DERECHA de TODA la card */}
                      <div className="hs-statusTopRight">
                        <StatusPill aprobado={r.aprobado} />
                      </div>

                      {/* ── COLUMNA IZQUIERDA: Contactos ── */}
                      <aside className="hs-left">
                        <div className="hs-logoWrap">
                          <Image
                            src={fixLogoPath(r.logo)}
                            alt={`Logo ${r.nombre}`}
                            fill
                            className="hs-logo"
                          />
                        </div>

                        <p className="hs-contactsLabel">Contactos</p>
                        <h3 className="hs-name">{r.nombre}</h3>
                        <p className="hs-location">{r.ubicacion}</p>

                        {/* Íconos clickables */}
                        <div className="hs-contactIcons">
                          <a href={`tel:${r.telefono}`} className="hs-contactIcon" title={r.telefono}>
                            <span className="material-symbols-outlined">call</span>
                          </a>
                          <a href={`mailto:${r.correo}`} className="hs-contactIcon" title={r.correo}>
                            <span className="material-symbols-outlined">mail</span>
                          </a>
                          <Link
                            href={`/refugios/${r.id}`}
                            className="hs-contactIcon"
                            title="Ver refugio"
                          >
                            <span className="material-symbols-outlined">location_on</span>
                          </Link>
                        </div>

                        {/* Datos en texto */}
                        <div className="hs-contacts">
                          <div className="hs-contact">
                            <span className="material-symbols-outlined">call</span>
                            <span>{r.telefono}</span>
                          </div>
                          <div className="hs-contact">
                            <span className="material-symbols-outlined">mail</span>
                            <span className="hs-ellipsis">{r.correo}</span>
                          </div>
                          <div className="hs-contact">
                            <span className="material-symbols-outlined">calendar_month</span>
                            <span>Desde {r.fechaRegistro?.slice(0, 4) || "2024"}</span>
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="hs-leftCtas">
                          <Link href={`/refugios/${r.id}`} className="hs-btn hs-btn--primary">
                            Ver refugio
                          </Link>
                          <a href={`mailto:${r.correo}`} className="hs-btn hs-btn--ghost">
                            Contactar
                          </a>
                        </div>
                      </aside>

                      {/* ── DERECHA: 2×2 ── */}
                      <section className="hs-quadWrap" aria-label="Detalles del refugio en cuadrícula">
                        {/* 1) Arriba-izq: Rojo sólido */}
                        <div className="hs-quad hs-quad--red">
                          <p className="hs-centerKicker">SOBRE NUESTRO REFUGIO</p>
                          <p className="hs-centerTitle">{r.nombre}</p>
                          <p className="hs-centerDesc">{r.descripcion}</p>
                        </div>

                        {/* 2) Arriba-der: Imagen */}
                        <div className="hs-quad hs-quad--img">
                          <Image
                            src={heroImg}
                            alt={`Imagen ${r.nombre}`}
                            fill
                            className="hs-heroImg"
                            sizes="(max-width: 1024px) 100vw, 720px"
                          />
                        </div>

                        {/* 3) Abajo-izq: Imagen */}
                        <div className="hs-quad hs-quad--img">
                          <Image
                            src={heroImg}
                            alt={`Imagen secundaria ${r.nombre}`}
                            fill
                            className="hs-heroImg"
                            sizes="(max-width: 1024px) 100vw, 720px"
                          />
                        </div>

                        {/* 4) Abajo-der: TEXTO directo sobre fondo blanco (sin card interna) */}
                        <div className="hs-quad hs-quad--plain">
                          <span className="hs-plain__kicker">REFUGIO ADOGME</span>
                          <p className="hs-plain__title">{r.nombre}</p>
                          <p className="hs-plain__sub">¡Dale una segunda oportunidad!</p>
                          <div className="hs-plain__paws">🐾</div>
                        </div>
                      </section>
                    </div>
                  </article>
                );
              })}
            </div>

            {slides.length > 1 && (
              <div className="hs-indicators">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`hs-dot ${active === idx ? "is-active" : ""}`}
                    onClick={() => setActive(idx)}
                    aria-label={`Ir al refugio ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
