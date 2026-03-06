// modules/dogs/components/DogDetailView.tsx
import Image from "next/image";
import Link from "next/link";
import type { Dog } from "../../shared/domain/Dog";
import DogShareReport from "./DogShareReport";
import AdoptButton from "./AdoptButton";
import "../styles/dogProfile.css";

/* ── Helpers ── */
function edadLabel(meses: number) {
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? "año" : "años"}`;
}

const ESTADO_BADGE: Record<string, { cls: string; label: string }> = {
  disponible: { cls: "dp-badge--green", label: "Disponible" },
  en_proceso: { cls: "dp-badge--amber", label: "En proceso" },
  adoptado: { cls: "dp-badge--gray", label: "Adoptado" },
  no_disponible: { cls: "dp-badge--gray", label: "No disponible" },
};

/* ── Info row ── */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="dp-info-row">
      <div className="dp-info-row__icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="dp-info-row__label">{label}</span>
      <span className="dp-info-row__value">{value}</span>
    </div>
  );
}

/* ── Component ── */
export default function DogDetailView({ dog }: { dog: Dog }) {
  const badge = ESTADO_BADGE[dog.estado] ?? {
    cls: "dp-badge--gray",
    label: dog.estado,
  };

  return (
    <div className="dp-page">
      {/* Breadcrumb */}
      <nav className="dp-breadcrumb">
        <Link href="/" className="dp-breadcrumb__link">
          Inicio
        </Link>
        <span className="dp-breadcrumb__sep">›</span>
        <Link href="/perros" className="dp-breadcrumb__link">
          Perros
        </Link>
        <span className="dp-breadcrumb__sep">›</span>
        <span className="dp-breadcrumb__current">{dog.nombre}</span>
      </nav>

      <div className="dp-layout">
        {/* ── Aside ── */}
        <aside className="dp-aside">
          {/* Foto */}
          <div className="dp-photo-frame">
            <div className="dp-photo-panel">
              <div className="dp-photo-inner">
                <Image
                  src={dog.foto}
                  alt={`Foto de ${dog.nombre}`}
                  fill
                  className="dp-photo-img"
                  sizes="340px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Refugio */}
          {dog.refugioNombre && (
            <div className="dp-shelter-card">
              <div className="dp-shelter-card__header">
                {dog.refugioLogo ? (
                  <div className="dp-shelter-card__logo">
                    <Image
                      src={dog.refugioLogo}
                      alt={`Logo de ${dog.refugioNombre}`}
                      fill
                      className="dp-photo-img"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="dp-shelter-card__icon">
                    <span className="material-symbols-outlined">pets</span>
                  </div>
                )}
                <div>
                  <p className="dp-shelter-card__name">{dog.refugioNombre}</p>
                  {dog.refugioCiudad && (
                    <p className="dp-shelter-card__sub">{dog.refugioCiudad}</p>
                  )}
                </div>
              </div>
              {dog.refugioSlug && (
                <Link
                  href={`/refugios/${dog.refugioSlug}`}
                  className="dp-shelter-card__btn"
                >
                  Ver refugio
                </Link>
              )}
            </div>
          )}

          {/* Compartir / Reportar */}
          <DogShareReport nombre={dog.nombre} />

          {/* Botón adoptar mobile */}
          {dog.estado === "disponible" && (
            <AdoptButton
              dogId={dog.id}
              dogNombre={dog.nombre}
              className="dp-adopt-btn--mobile"
            />
          )}
        </aside>

        {/* ── Content ── */}
        <div className="dp-content">
          {/* Header */}
          <div className="dp-content__header">
            <div>
              <span className={`dp-badge ${badge.cls}`}>{badge.label}</span>
              <h1 className="dp-name">{dog.nombre}</h1>
              <p className="dp-subtitle">
                {dog.raza} ·{" "}
                {dog.tamano.charAt(0).toUpperCase() + dog.tamano.slice(1)} ·{" "}
                {edadLabel(dog.edad)}
              </p>
            </div>
            {dog.estado === "disponible" && (
              <AdoptButton dogId={dog.id} dogNombre={dog.nombre} />
            )}
          </div>

          {/* Personality tags */}
          {dog.personalidad.length > 0 && (
            <div className="dp-tags">
              {dog.personalidad.map((tag) => (
                <span key={tag.id} className="dp-tag">
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Info card */}
          <div className="dp-info-card">
            <h2 className="dp-section-title">Información</h2>
            <div className="dp-info-grid">
              <InfoRow icon="cake" label="Edad" value={edadLabel(dog.edad)} />
              <InfoRow
                icon="straighten"
                label="Tamaño"
                value={
                  dog.tamano.charAt(0).toUpperCase() + dog.tamano.slice(1)
                }
              />
              <InfoRow
                icon="bolt"
                label="Energía"
                value={
                  dog.nivelEnergia === "muy_alta"
                    ? "Muy alta"
                    : dog.nivelEnergia.charAt(0).toUpperCase() +
                      dog.nivelEnergia.slice(1)
                }
              />
              <InfoRow
                icon={dog.sexo === "macho" ? "male" : "female"}
                label="Sexo"
                value={dog.sexo.charAt(0).toUpperCase() + dog.sexo.slice(1)}
              />
              {dog.pesoKg !== undefined && (
                <InfoRow
                  icon="monitor_weight"
                  label="Peso"
                  value={`${dog.pesoKg} kg`}
                />
              )}
              <InfoRow
                icon="check_circle"
                label="Castrado"
                value={dog.castrado ? "Sí" : "No"}
              />
              <InfoRow
                icon="qr_code_scanner"
                label="Microchip"
                value={dog.microchip ? "Sí" : "No"}
              />
              <InfoRow
                icon={dog.aptoNinos ? "check_circle" : "cancel"}
                label="Apto niños"
                value={dog.aptoNinos ? "Sí" : "No"}
              />
              <InfoRow
                icon={dog.aptoPerros ? "check_circle" : "cancel"}
                label="Apto perros"
                value={dog.aptoPerros ? "Sí" : "No"}
              />
              <InfoRow
                icon={dog.aptoGatos ? "check_circle" : "cancel"}
                label="Apto gatos"
                value={dog.aptoGatos ? "Sí" : "No"}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="dp-desc-card">
            <h2 className="dp-section-title">Acerca de {dog.nombre}</h2>
            <p className="dp-desc-text">{dog.descripcion}</p>
            {dog.salud && (
              <>
                <h3
                  className="dp-section-title"
                  style={{ marginTop: "1.25rem" }}
                >
                  Salud
                </h3>
                <p className="dp-desc-text">{dog.salud}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
