// modules/home/components/SheltersListView.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useHomeShelters } from "../application/hooks/useHomeContent";
import type { ShelterCard } from "../domain/ShelterCard";
import "../styles/sheltersList.css";

const CITIES = ["Todos", "Gustavo A. Madero", "Coyoacán", "Iztapalapa", "Tlalpan", "Benito Juárez"];

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ s }: { s: ShelterCard }) {
  return (
    <Link href={`/refugios/${s.slug}`} className="sl-card">
      <div className="sl-card__media">
        <Image
          src={s.imagenPortada}
          alt={`Imagen de ${s.nombre}`}
          fill
          className="sl-card__img"
          sizes="(max-width: 580px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {s.logo && (
        <div className="sl-card__logo-wrap">
          <Image
            src={s.logo}
            alt={`Logo ${s.nombre}`}
            fill
            style={{ objectFit: "contain", padding: "3px" }}
          />
        </div>
      )}

      <div className="sl-card__body">
        <h3 className="sl-card__name">{s.nombre}</h3>
        <p className="sl-card__city">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            location_on
          </span>
          {s.ciudad}
        </p>

        <div className="sl-card__stats">
          <div className="sl-card__stat">
            <span className="sl-card__stat-val">{s.adopcionesRealizadas}</span>
            <span className="sl-card__stat-lbl">Adopciones</span>
          </div>
          <div className="sl-card__stat">
            <span className="sl-card__stat-val">{s.perrosDisponibles}</span>
            <span className="sl-card__stat-lbl">Disponibles</span>
          </div>
          {s.calificacion && (
            <div className="sl-card__rating">
              <span className="material-symbols-outlined sl-card__rating-icon">
                star
              </span>
              {s.calificacion.toFixed(1)}
            </div>
          )}
        </div>

        <span className="sl-card__cta">Ver refugio</span>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="sl-skel-card">
          <div className="sl-skel-img" />
          <div className="sl-skel-body">
            <div className="sl-skel-line is-name" />
            <div className="sl-skel-line is-city" />
            <div className="sl-skel-line is-cta" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function SheltersListView() {
  const { shelters, loading } = useHomeShelters();
  const [activeCity, setActiveCity] = useState("Todos");

  const filtered =
    activeCity === "Todos"
      ? shelters
      : shelters.filter((s) => s.ciudad === activeCity);

  return (
    <div className="sl-page">
      <header className="sl-hero">
        <p className="sl-kicker">Refugios aliados</p>
        <h1 className="sl-title">Encuentra un refugio</h1>
        <p className="sl-subtitle">
          Conoce a los refugios que hacen posible cada adopción
        </p>
      </header>

      {/* City filter */}
      <div className="sl-filters">
        {CITIES.map((city) => (
          <button
            key={city}
            className={`sl-filter${activeCity === city ? " is-active" : ""}`}
            onClick={() => setActiveCity(city)}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="sl-grid">
        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <p className="sl-empty">No hay refugios en esta ciudad aún.</p>
        ) : (
          filtered.map((s) => <Card key={s.id} s={s} />)
        )}
      </div>
    </div>
  );
}
