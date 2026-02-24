"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { DogCard } from "../domain/DogCard";
import { MockHomedogsListRepository } from "../infrastructure/MockDogsList";

/* ── Badge de estado ──────────────────────────────────────────── */
function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { color: string; label: string }> = {
    Disponible: { color: "bg-emerald-100 text-emerald-700 ring-emerald-200", label: "Disponible" },
    "En adopción": { color: "bg-amber-100 text-amber-700 ring-amber-200", label: "En adopción" },
    "En tratamiento": { color: "bg-sky-100 text-sky-700 ring-sky-200", label: "En tratamiento" },
    Adoptado: { color: "bg-zinc-100 text-zinc-500 ring-zinc-200", label: "Adoptado" },
  };
  const s = map[estado] ?? { color: "bg-zinc-100 text-zinc-500 ring-zinc-200", label: estado };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${s.color}`}>
      {s.label}
    </span>
  );
}

/* ── Info row ─────────────────────────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="home-dog-info">
      <span className="material-symbols-outlined home-dog-info__icon">{icon}</span>
      <span className="home-dog-info__label">{label}</span>
      <span className="home-dog-info__value">{value}</span>
    </div>
  );
}

/* ── Card Principal ───────────────────────────────────────────── */
function DogStampCard({ dog }: { dog: DogCard }) {
  return (
    <article className="home-dog-frame" aria-label={`Perro ${dog.nombre}`}>
      <div className="home-dog-panel">
        {/* Imagen del perro */}
        <div className="home-dog-media">
          <div className="home-dog-photo">
            <Image
              src={dog.imageUrl}
              alt={dog.nombre}
              fill
              className="home-dog-photo__img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
            />
          </div>
        </div>

        {/* Información */}
        <div className="home-dog-body">
          <div className="home-dog-badge">
            <EstadoBadge estado={dog.estado} />
          </div>

          <div>
            <h3 className="home-dog-name">{dog.nombre}</h3>
            <p className="home-dog-breed">{dog.raza}</p>
            <p className="home-dog-desc">{dog.descripcion}</p>
          </div>

          <div className="home-dog-infoList">
            <InfoRow icon="cake" label="Edad" value={`${dog.edad} año${dog.edad === 1 ? "" : "s"}`} />
            <InfoRow icon="straighten" label="Tamaño" value={dog.tamano} />
            <InfoRow icon="bolt" label="Energía" value={dog.nivelEnergia} />
            <InfoRow icon="medical_services" label="Salud" value={dog.salud} />
          </div>

          <Link href={`/perros/${dog.id}`} className="home-dog-cta">
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Skeleton de Carga ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="home-dog-frame">
      <div className="home-dog-panel">
        <div className="home-dog-skel__media animate-pulse" />
        <div className="home-dog-skel__body">
          <div className="home-dog-skel__line is-title animate-pulse" />
          <div className="home-dog-skel__line animate-pulse" style={{ width: "40%" }} />
          <div className="home-dog-skel__line animate-pulse" style={{ marginTop: "1rem" }} />
          <div className="home-dog-skel__line animate-pulse" />
          <div className="home-dog-skel__line is-cta animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ── Exportación Principal ────────────────────────────────────── */
export default function HomeDogsList() {
  const [dogs, setDogs] = useState<DogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const repo = new MockHomedogsListRepository();
        const all = await repo.getMainDogs();
        // Solo mostramos los primeros 3 que no estén adoptados
        const available = all.filter((d) => d.estado !== "Adoptado").slice(0, 3);
        setDogs(available);
      } catch (error) {
        console.error("Error cargando perros:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="home-dogs container mx-auto px-5">
      <div className="home-dogs__header">
        <div>
          <p className="home-dogs__kicker">Adopción</p>
          <h2 className="home-dogs__title">Nuestros perros</h2>
          <p className="home-dogs__subtitle">
            Conoce a quienes esperan un hogar en Gustavo A. Madero
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
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : dogs.map((dog) => <DogStampCard key={dog.id} dog={dog} />)}
      </div>
    </section>
  );
}
