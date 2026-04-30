// modules/home/components/SheltersCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useHomeShelters } from "../application/hooks/useHomeContent";
import type { ShelterCard } from "../domain/ShelterCard";
import "../styles/homeShelters.css";

// ─── Featured card (large, left column, spans 2 rows on desktop) ──────────────

function FeaturedCard({ s }: { s: ShelterCard }) {
  const cover = s.imagenPortada || s.imageUrl || "/assets/shelters/shelter1.jpg";
  return (
    <div className="hs-featured-wrap">
      <Link href={`/refugios/${s.slug}`} className="hs-featured">
        <Image
          src={cover}
          alt={`Imagen de ${s.nombre}`}
          fill
          className="hs-featured__img"
          sizes="(max-width: 1024px) 100vw, 640px"
          priority
        />
        <div className="hs-featured__overlay" />

        {/* Logo badge — top left */}
        {s.logo && (
          <div className="hs-featured__logo-wrap">
            <Image
              src={s.logo}
              alt={`Logo ${s.nombre}`}
              fill
              style={{ objectFit: "contain", padding: "4px" }}
            />
          </div>
        )}

        {/* Content pinned to bottom */}
        <div className="hs-featured__body">
          <h3 className="hs-featured__name">{s.nombre}</h3>
          <p className="hs-featured__city">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              location_on
            </span>
            {s.alcaldia}
          </p>

          <div className="hs-featured__stats">
            <div className="hs-featured__stat">
              <span className="hs-featured__stat-val">{s.adopcionesRealizadas}</span>
              <span className="hs-featured__stat-lbl">Adopciones</span>
            </div>
            <div className="hs-featured__stat">
              <span className="hs-featured__stat-val">{s.perrosDisponibles}</span>
              <span className="hs-featured__stat-lbl">En espera</span>
            </div>
            {s.calificacion && (
              <div className="hs-featured__stat">
                <span className="hs-featured__stat-val">{s.calificacion.toFixed(1)}</span>
                <span className="hs-featured__stat-lbl">Calificación</span>
              </div>
            )}
          </div>

          <span className="hs-featured__cta">
            Ver refugio
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_forward
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}

// ─── Small card (right side grid) ─────────────────────────────────────────────

function SmallCard({ s }: { s: ShelterCard }) {
  const cover = s.imagenPortada || s.imageUrl || "/assets/shelters/shelter1.jpg";
  return (
    <Link href={`/refugios/${s.slug}`} className="hs-small">
      <div className="hs-small__media">
        <Image
          src={cover}
          alt={`Imagen de ${s.nombre}`}
          fill
          className="hs-small__img"
          sizes="(max-width: 580px) 100vw, (max-width: 1024px) 50vw, 260px"
        />
        <div className="hs-small__img-overlay" />
      </div>

      {/* Logo floats at the image/body boundary — outside media so it isn't clipped */}
      {s.logo && (
        <div className="hs-small__logo-wrap">
          <Image
            src={s.logo}
            alt={`Logo ${s.nombre}`}
            fill
            style={{ objectFit: "contain", padding: "3px" }}
          />
        </div>
      )}

      <div className="hs-small__body">
        <p className="hs-small__name">{s.nombre}</p>
        <p className="hs-small__city">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            location_on
          </span>
          {s.alcaldia}
        </p>
        <p className="hs-small__stat">{s.adopcionesRealizadas} adopciones</p>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="hs-skel-grid">
      <div className="hs-skel-card hs-skel-featured" />
      <div className="hs-skel-card" />
      <div className="hs-skel-card" />
      <div className="hs-skel-card" />
      <div className="hs-skel-card" />
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HomeSheltersSection() {
  const { shelters, loading } = useHomeShelters();
  const [featured, ...rest] = shelters;
  const smallCards = rest.slice(0, 4);

  return (
    <section className="hs-section">
      <div className="hs-inner">
        {/* Header */}
        <div className="hs-header">
          <div>
            <p className="hs-kicker">Refugios</p>
            <h2 className="hs-title">Refugios aliados</h2>
            <p className="hs-subtitle">
              Conoce a quienes rescatan y acompañan cada proceso de adopción
            </p>
          </div>
          <Link href="/refugios" className="hs-all">
            Ver todos
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Grid or skeleton */}
        {loading ? (
          <Skeleton />
        ) : (
          <div className="hs-grid">
            {featured && <FeaturedCard s={featured} />}
            {smallCards.map((s) => (
              <SmallCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
