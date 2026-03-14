// modules/home/components/dogsList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useHomeDogs } from "../application/hooks/useHomeContent";
import type { DogCard } from "../domain/DogCard";
import "../styles/homeDogs.css";

/* ── Badge de estado ─────────────────────────────────── */
const ESTADO_STYLES: Record<string, string> = {
  Disponible:     "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  "En adopción":  "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  "En tratamiento": "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  Adoptado:       "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200",
};

function EstadoBadge({ estado }: { estado: string }) {
  const cls = ESTADO_STYLES[estado] ?? "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {estado}
    </span>
  );
}

/* ── Info row ────────────────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="home-dog-info">
      <span className="material-symbols-outlined home-dog-info__icon">{icon}</span>
      <span className="home-dog-info__label">{label}</span>
      <span className="home-dog-info__value">{value}</span>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────── */
function DogCard({ dog }: { dog: DogCard }) {
  return (
    <Link href={`/perros/${dog.nombre.toLowerCase().replace(/\s+/g, '-')}`} className="home-dog-frame group">
      <div className="home-dog-panel">

        {/* Foto */}
        <div className="home-dog-media">
          <div className="home-dog-photo">
            <Image
              src={dog.imageUrl}
              alt={`Fotografía de ${dog.nombre}`}
              fill
              className="home-dog-photo__img group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Body */}
        <div className="home-dog-body">
          <div className="home-dog-badge">
            <EstadoBadge estado={dog.estado} />
          </div>

          <h3 className="home-dog-name">{dog.nombre}</h3>
          <p className="home-dog-breed">{dog.raza}</p>

          <div className="home-dog-infoList">
            <InfoRow icon="cake"       label="Edad"    value={`${dog.edad} año${dog.edad === 1 ? "" : "s"}`} />
            <InfoRow icon="straighten" label="Tamaño"  value={dog.tamano} />
            <InfoRow icon="bolt"       label="Energía" value={dog.nivelEnergia} />
          </div>

          <span className="home-dog-cta">Ver perfil</span>
        </div>

      </div>
    </Link>
  );
}

/* ── Skeleton ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="home-dog-frame">
      <div className="home-dog-panel">
        <div className="home-dog-skel__media animate-pulse" />
        <div className="home-dog-skel__body">
          <div className="home-dog-skel__line is-title animate-pulse" />
          <div className="home-dog-skel__line animate-pulse" style={{ width: "45%" }} />
          <div className="home-dog-skel__line animate-pulse" style={{ marginTop: "0.75rem" }} />
          <div className="home-dog-skel__line animate-pulse" />
          <div className="home-dog-skel__line animate-pulse" />
          <div className="home-dog-skel__line is-cta animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ── Sección principal ───────────────────────────────── */
export default function HomeDogsList() {
  const { dogs: allDogs, loading } = useHomeDogs();
  // 4 perros disponibles
  const dogs = allDogs.filter((d) => d.estado !== "Adoptado").slice(0, 4);

  return (
    <section className="home-dogs container mx-auto px-5">
      <div className="home-dogs__header">
        <div>
          <p className="home-dogs__kicker">Adopción</p>
          <h2 className="home-dogs__title">Nuestros perros</h2>
          <p className="home-dogs__subtitle">
            Conoce a quienes esperan un hogar
          </p>
        </div>

        <Link href="/perros" className="home-dogs__all">
          Ver todos
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="home-dogs__grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : dogs.map((dog) => <DogCard key={dog.id} dog={dog} />)}
      </div>
    </section>
  );
}
