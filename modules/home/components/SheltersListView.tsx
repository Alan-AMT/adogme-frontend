// modules/home/components/SheltersListView.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useHomeShelters } from "../application/hooks/useHomeContent";
import type { ShelterCard } from "../domain/ShelterCard";
import "../styles/sheltersList.css";

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ s }: { s: ShelterCard }) {
  return (
    <Link href={`/refugios/${s.id}`} className="sl-card">
      <div className="sl-card__media">
        <Image
          src={s.imagenPortada || '/assets/shelters/shelter1-cover.jpg'}
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
          {s.alcaldia}
        </p>

        <div className="sl-card__stats">
          {s.adopcionesRealizadas > 0 && (
            <div className="sl-card__stat">
              <span className="sl-card__stat-val">{s.adopcionesRealizadas}</span>
              <span className="sl-card__stat-lbl">Adopciones</span>
            </div>
          )}
          {s.perrosDisponibles > 0 && (
            <div className="sl-card__stat">
              <span className="sl-card__stat-val">{s.perrosDisponibles}</span>
              <span className="sl-card__stat-lbl">Disponibles</span>
            </div>
          )}
          {s.calificacion ? (
            <div className="sl-card__rating">
              <span className="material-symbols-outlined sl-card__rating-icon">
                star
              </span>
              {s.calificacion.toFixed(1)}
            </div>
          ) : null}
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

// ─── Pagination helpers ───────────────────────────────────────────────────────

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const left = current - 2;
  const right = current + 2;
  if (left > 2) pages.push("...");
  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

// ─── View ─────────────────────────────────────────────────────────────────────

export default function SheltersListView() {
  const { shelters, loading, pagination, setPage } = useHomeShelters();

  return (
    <div className="sl-page">
      <header className="sl-hero">
        <p className="sl-kicker">Refugios aliados</p>
        <h1 className="sl-title">Encuentra un refugio</h1>
        <p className="sl-subtitle">
          Conoce a los refugios que hacen posible cada adopción
        </p>
      </header>

      {/* Grid */}
      <div className="sl-grid">
        {loading ? (
          <Skeleton />
        ) : shelters.length === 0 ? (
          <p className="sl-empty">No hay refugios registrados aún.</p>
        ) : (
          shelters.map((s) => <Card key={s.id} s={s} />)
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="sl-pagination">
          <button
            className={`sl-page-btn${pagination.page === 1 ? " sl-page-btn--disabled" : ""}`}
            onClick={() => setPage(pagination.page - 1)}
            aria-label="Página anterior"
          >
            «
          </button>

          {getPageRange(pagination.page, pagination.totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="sl-page-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={`sl-page-btn${p === pagination.page ? " sl-page-btn--active" : ""}`}
                onClick={() => setPage(p)}
                aria-label={`Página ${p}`}
                aria-current={p === pagination.page ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}

          <button
            className={`sl-page-btn${pagination.page === pagination.totalPages ? " sl-page-btn--disabled" : ""}`}
            onClick={() => setPage(pagination.page + 1)}
            aria-label="Página siguiente"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
