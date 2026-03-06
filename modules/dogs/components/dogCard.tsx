import Image from "next/image";
import Link from "next/link";
import type { DogListItem } from "../domain/dog";

/* ── helpers ── */
function edadLabel(meses: number) {
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? "año" : "años"}`;
}

const ESTADO_STYLES: Record<string, string> = {
  disponible: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  en_proceso: "bg-amber-100 text-amber-700 ring-amber-200",
  adoptado: "bg-zinc-100 text-zinc-500 ring-zinc-200",
  no_disponible: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

const ESTADO_LABELS: Record<string, string> = {
  disponible: "Disponible",
  en_proceso: "En proceso",
  adoptado: "Adoptado",
  no_disponible: "No disponible",
};

const ENERGIA_ICON: Record<string, string> = {
  baja: "psychiatry",
  moderada: "bolt",
  alta: "local_fire_department",
  muy_alta: "whatshot",
};

/* ── Info row ── */
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="cat-dog-info">
      <span className="material-symbols-outlined cat-dog-info__icon">{icon}</span>
      <span className="cat-dog-info__label">{label}</span>
      <span className="cat-dog-info__value">{value}</span>
    </div>
  );
}

/* ── Component ── */
export default function DogCard(dog: DogListItem) {
  const { id, nombre, raza, refugioNombre, foto, edad, tamano, sexo, nivelEnergia, estado } = dog;

  return (
    <Link href={`/perros/${id}`} className="cat-dog-frame group">
      <div className="cat-dog-panel">
        {/* Imagen */}
        <div className="cat-dog-media">
          <div className="cat-dog-photo">
            <Image
              src={foto}
              alt={`Fotografía de ${nombre}`}
              fill
              className="cat-dog-photo__img group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>
        </div>

        {/* Body */}
        <div className="cat-dog-body">
          <span className={`cat-dog-badge ring-1 ${ESTADO_STYLES[estado] ?? "bg-zinc-100 text-zinc-500 ring-zinc-200"}`}>
            {ESTADO_LABELS[estado] ?? estado}
          </span>

          <h3 className="cat-dog-name">{nombre}</h3>
          <p className="cat-dog-breed">{raza}</p>
          {refugioNombre && <p className="cat-dog-shelter">{refugioNombre}</p>}

          <div className="cat-dog-infoList">
            <InfoRow icon="cake" label="Edad" value={edadLabel(edad)} />
            <InfoRow
              icon="straighten"
              label="Tamaño"
              value={tamano.charAt(0).toUpperCase() + tamano.slice(1)}
            />
            <InfoRow
              icon={ENERGIA_ICON[nivelEnergia] ?? "bolt"}
              label="Energía"
              value={nivelEnergia === "muy_alta" ? "Muy alta" : nivelEnergia.charAt(0).toUpperCase() + nivelEnergia.slice(1)}
            />
            <InfoRow
              icon={sexo === "macho" ? "male" : "female"}
              label="Sexo"
              value={sexo.charAt(0).toUpperCase() + sexo.slice(1)}
            />
          </div>

          <span className="cat-dog-cta">Ver perfil</span>
        </div>
      </div>
    </Link>
  );
}
