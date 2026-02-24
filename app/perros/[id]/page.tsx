import { Dog } from "@/modules/perros/domain/dog";
import { MockDogsList } from "@/modules/perros/infrastructure/MockDogsList";
import "@/modules/perros/styles/dogProfile.css";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ── Helpers ── */
function edadLabel(meses: number) {
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? "año" : "años"}`;
}

const ESTADO_STYLES: Record<string, string> = {
  disponible: "dp-badge--green",
  en_proceso: "dp-badge--amber",
  adoptado:   "dp-badge--gray",
};

const ESTADO_LABELS: Record<string, string> = {
  disponible: "Disponible",
  en_proceso: "En proceso",
  adoptado:   "Adoptado",
};

/* ── Info Row con Material Symbols (igual que home) ── */
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="dp-info-row">
      <span className="material-symbols-outlined dp-info-row__icon">{icon}</span>
      <span className="dp-info-row__label">{label}</span>
      <span className="dp-info-row__value">{value}</span>
    </div>
  );
}

/* ── Tag ── */
function Tag({ text }: { text: string }) {
  return <span className="dp-tag">{text}</span>;
}

/* ── Page ── */
export default async function PerroProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  const repo = new MockDogsList();

  const all = await repo.getDogs({
    queryText: null, tamano: null, sexo: null,
    cachorro: null, nivelEnergia: null, estado: null,
    raza: null, refugioId: null,
  });

  const dog: Dog | undefined = all.find((d) => d.id === id);
  if (!dog) notFound();

  const {
    nombre, raza, edad, sexo, tamano, nivelEnergia,
    salud, estado, descripcion, fechaRegistro,
    imageUrl, shelterName, refugioId,
  } = dog;

  const tags: string[] = [
    sexo === "macho" ? "Macho" : "Hembra",
    tamano.charAt(0).toUpperCase() + tamano.slice(1),
    edad < 12 ? "Cachorro" : "Adulto",
    salud.toLowerCase().includes("esteril") ? "Esterilizado" : "",
    salud.toLowerCase().includes("vacun")   ? "Vacunado"     : "",
  ].filter(Boolean);

  const sexoIcon   = sexo === "macho" ? "male" : "female";
  const energiaIcon: Record<string, string> = { baja: "psychiatry", media: "bolt", alta: "local_fire_department" };

  return (
    <div className="dp-page">
      {/* Breadcrumb */}
      <nav className="dp-breadcrumb">
        <Link href="/"       className="dp-breadcrumb__link">Inicio</Link>
        <span className="dp-breadcrumb__sep">/</span>
        <Link href="/perros" className="dp-breadcrumb__link">Buscar perros</Link>
        <span className="dp-breadcrumb__sep">/</span>
        <span className="dp-breadcrumb__current">{nombre}</span>
      </nav>

      <div className="dp-layout">
        {/* ── Aside izquierdo ── */}
        <aside className="dp-aside">
          <div className="dp-photo-frame">
            <div className="dp-photo-panel">
              <div className="dp-photo-inner">
                <Image
                  src={imageUrl}
                  alt={`Foto de ${nombre}`}
                  fill
                  className="dp-photo-img"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Refugio card */}
          <div className="dp-shelter-card">
            <div className="dp-shelter-card__header">
              <span className="dp-shelter-card__icon"><span className="material-symbols-outlined" style={{ fontSize: 22, lineHeight: 1 }}>home</span></span>
              <div>
                <p className="dp-shelter-card__name">{shelterName}</p>
                <p className="dp-shelter-card__sub">Refugio · GAM, CDMX</p>
              </div>
            </div>
            <Link href={`/refugios/${refugioId}`} className="dp-shelter-card__btn">
              Ver perfil del refugio
            </Link>
          </div>

          {/* Acciones secundarias */}
          <div className="dp-secondary-actions">
            <button className="dp-action-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
              Compartir
            </button>
            <button className="dp-action-btn dp-action-btn--danger">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>flag</span>
              Reportar
            </button>
          </div>
        </aside>

        {/* ── Contenido derecho ── */}
        <section className="dp-content">
          <div className="dp-content__header">
            <div>
              <span className={`dp-badge ${ESTADO_STYLES[estado] ?? "dp-badge--gray"}`}>
                {ESTADO_LABELS[estado] ?? estado}
              </span>
              <h1 className="dp-name">{nombre}</h1>
              <p className="dp-subtitle">
                {raza} · {edadLabel(edad)} · {sexo.charAt(0).toUpperCase() + sexo.slice(1)}
              </p>
            </div>

            {estado === "disponible" && (
              <button className="dp-adopt-btn">
                Adoptar a {nombre}&nbsp;🐾
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="dp-tags">
            {tags.map((t) => <Tag key={t} text={t} />)}
          </div>

          {/* Info grid */}
          <div className="dp-info-card">
            <h2 className="dp-section-title">Información</h2>
            <div className="dp-info-grid">
              <InfoRow icon="cake"             label="Edad"             value={edadLabel(edad)} />
              <InfoRow icon="straighten"       label="Tamaño"           value={tamano.charAt(0).toUpperCase() + tamano.slice(1)} />
              <InfoRow icon={sexoIcon}         label="Sexo"             value={sexo.charAt(0).toUpperCase() + sexo.slice(1)} />
              <InfoRow icon={energiaIcon[nivelEnergia] ?? "bolt"} label="Energía" value={nivelEnergia.charAt(0).toUpperCase() + nivelEnergia.slice(1)} />
              <InfoRow icon="medical_services" label="Salud"            value={salud} />
              <InfoRow icon="calendar_month"   label="En refugio desde" value={new Date(fechaRegistro).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} />
              <InfoRow icon="location_on"      label="Refugio"          value={shelterName} />
            </div>
          </div>

          {/* Descripción */}
          <div className="dp-desc-card">
            <h2 className="dp-section-title">Sobre {nombre}</h2>
            <p className="dp-desc-text">{descripcion}</p>
          </div>

          {/* CTA mobile */}
          {estado === "disponible" && (
            <button className="dp-adopt-btn dp-adopt-btn--mobile">
              Adoptar a {nombre}&nbsp;🐾
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
