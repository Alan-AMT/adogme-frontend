"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AgeCategory,
  DogFilters,
  DogListItem,
  DogSize,
  DogSex,
  EnergyLevel,
} from "../../shared/domain/Dog";
import { useDogs } from "../application/hooks/useDogs";
import "../styles/catalog.css";

/* ── Helpers ── */
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

/* ── Sub-components ── */
type ChipProps = { label: string; active: boolean; onClick: () => void };
function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`cat-chip ${active ? "cat-chip--active" : ""}`}
    >
      {active && <span className="cat-chip__check">✓</span>}
      {label}
    </button>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};
function FilterSelect({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="cat-select-wrap">
      <label className="cat-select-label">{label}</label>
      <select
        className="cat-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Todos</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Dog Card ── */
function DogCard({ dog }: { dog: DogListItem }) {
  return (
    <Link href={`/perros/${dog.nombre.toLowerCase().replace(/\s+/g, "-")}`} className="cat-dog-frame group">
      <div className="cat-dog-panel">
        {/* Imagen */}
        <div className="cat-dog-media">
          <div className="cat-dog-photo">
            <Image
              src={dog.foto}
              alt={`Fotografía de ${dog.nombre}`}
              fill
              className="cat-dog-photo__img group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>
        </div>

        {/* Body */}
        <div className="cat-dog-body">
          <span
            className={`cat-dog-badge ring-1 ${ESTADO_STYLES[dog.estado] ?? "bg-zinc-100 text-zinc-500 ring-zinc-200"}`}
          >
            {ESTADO_LABELS[dog.estado] ?? dog.estado}
          </span>

          <h3 className="cat-dog-name">{dog.nombre}</h3>
          <p className="cat-dog-breed">{dog.raza}</p>
          {dog.refugioNombre && (
            <p className="cat-dog-shelter">{dog.refugioNombre}</p>
          )}

          <div className="cat-dog-infoList">
            <div className="cat-dog-info">
              <span className="material-symbols-outlined cat-dog-info__icon">
                cake
              </span>
              <span className="cat-dog-info__label">Edad</span>
              <span className="cat-dog-info__value">{edadLabel(dog.edad)}</span>
            </div>
            <div className="cat-dog-info">
              <span className="material-symbols-outlined cat-dog-info__icon">
                straighten
              </span>
              <span className="cat-dog-info__label">Tamaño</span>
              <span className="cat-dog-info__value">
                {dog.tamano.charAt(0).toUpperCase() + dog.tamano.slice(1)}
              </span>
            </div>
            <div className="cat-dog-info">
              <span className="material-symbols-outlined cat-dog-info__icon">
                {ENERGIA_ICON[dog.nivelEnergia] ?? "bolt"}
              </span>
              <span className="cat-dog-info__label">Energía</span>
              <span className="cat-dog-info__value">
                {dog.nivelEnergia === "muy_alta"
                  ? "Muy alta"
                  : dog.nivelEnergia.charAt(0).toUpperCase() +
                    dog.nivelEnergia.slice(1)}
              </span>
            </div>
            <div className="cat-dog-info">
              <span className="material-symbols-outlined cat-dog-info__icon">
                {dog.sexo === "macho" ? "male" : "female"}
              </span>
              <span className="cat-dog-info__label">Sexo</span>
              <span className="cat-dog-info__value">
                {dog.sexo.charAt(0).toUpperCase() + dog.sexo.slice(1)}
              </span>
            </div>
          </div>

          <span className="cat-dog-cta">Ver perfil</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="cat-dog-frame" style={{ minHeight: 360 }}>
      <div className="cat-dog-panel">
        <div style={{ height: 200, background: "#f4f4f5" }} />
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              height: 20,
              background: "#f4f4f5",
              borderRadius: 4,
              width: "60%",
            }}
          />
          <div
            style={{
              height: 14,
              background: "#f4f4f5",
              borderRadius: 4,
              width: "40%",
            }}
          />
          <div
            style={{
              height: 36,
              background: "#f4f4f5",
              borderRadius: 999,
              marginTop: "1rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function DogsSearchView({ initialFilters }: { initialFilters?: DogFilters }) {
  const {
    dogs,
    allDogs,
    loading,
    filters,
    setFilter,
    clearFilters,
    searchText,
    setSearchText,
    razas,
    refugios,
    activeCount,
    totalResults,
    pagination,
    setPage,
  } = useDogs(initialFilters);

  // ── Dynamic page range ─────────────────────────────────────────────────────
  function getPageRange(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    const left  = current - 2;
    const right = current + 2;
    if (left > 2)             pages.push("...");
    for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) pages.push(i);
    if (right < total - 1)    pages.push("...");
    pages.push(total);
    return pages;
  }

  const [suggestions, setSuggestions] = useState<DogListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Build suggestions while typing
  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchText(val);
      if (val.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const q = val.toLowerCase();
      const matches = allDogs.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.raza.toLowerCase().includes(q),
      );
      setSuggestions(matches.slice(0, 5));
      setShowSuggestions(true);
    },
    [allDogs, setSearchText],
  );

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Sidebar filters content ── */
  const SidebarContent = () => (
    <div className="cat-sidebar__inner">
      {/* Tamaño */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Tamaño</p>
        <div className="cat-chip-row">
          {(["pequeño", "mediano", "grande", "gigante"] as DogSize[]).map(
            (s) => (
              <Chip
                key={s}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
                active={filters.tamano === s}
                onClick={() => setFilter("tamano", s)}
              />
            ),
          )}
        </div>
      </div>

      {/* Edad */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Edad</p>
        <div className="cat-chip-row">
          {(
            [
              { val: "cachorro", label: "Cachorro" },
              { val: "joven", label: "Joven" },
              { val: "adulto", label: "Adulto" },
              { val: "senior", label: "Senior" },
            ] as { val: AgeCategory; label: string }[]
          ).map(({ val, label }) => (
            <Chip
              key={val}
              label={label}
              active={filters.edadCategoria === val}
              onClick={() => setFilter("edadCategoria", val)}
            />
          ))}
        </div>
      </div>

      {/* Sexo */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Sexo</p>
        <div className="cat-chip-row">
          {(["macho", "hembra"] as DogSex[]).map((s) => (
            <Chip
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              active={filters.sexo === s}
              onClick={() => setFilter("sexo", s)}
            />
          ))}
        </div>
      </div>

      {/* Nivel de energía */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Nivel de energía</p>
        <div className="cat-chip-row">
          {(
            [
              { val: "baja", label: "Baja" },
              { val: "moderada", label: "Moderada" },
              { val: "alta", label: "Alta" },
              { val: "muy_alta", label: "Muy alta" },
            ] as { val: EnergyLevel; label: string }[]
          ).map(({ val, label }) => (
            <Chip
              key={val}
              label={label}
              active={filters.nivelEnergia === val}
              onClick={() => setFilter("nivelEnergia", val)}
            />
          ))}
        </div>
      </div>

      {/* Compatibilidad */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Compatibilidad</p>
        <div className="cat-chip-row">
          <Chip
            label="Con niños"
            active={filters.aptoNinos === true}
            onClick={() =>
              setFilter("aptoNinos", filters.aptoNinos === true ? undefined : true)
            }
          />
          <Chip
            label="Con perros"
            active={filters.aptoPerros === true}
            onClick={() =>
              setFilter("aptoPerros", filters.aptoPerros === true ? undefined : true)
            }
          />
        </div>
      </div>

      {/* Raza */}
      <div className="cat-filter-group">
        <FilterSelect
          label="Raza"
          value={filters.raza ?? ""}
          options={razas.map((r) => ({ value: r, label: r }))}
          onChange={(v) => setFilter("raza", v || undefined)}
        />
      </div>

      {/* Refugio */}
      <div className="cat-filter-group">
        <FilterSelect
          label="Refugio"
          value={filters.refugioId?.toString() ?? ""}
          options={refugios.map((r) => ({
            value: r.id.toString(),
            label: r.nombre,
          }))}
          onChange={(v) =>
            setFilter("refugioId", v || undefined)
          }
        />
      </div>

      {/* Clear */}
      <div className="cat-sidebar__actions">
        <button className="cat-btn-clear" onClick={clearFilters}>
          Limpiar filtros {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="cat-layout">
      {/* ── Sidebar desktop ── */}
      <aside className="cat-sidebar cat-sidebar--desktop">
        <div className="cat-sidebar__header">
          <span className="cat-sidebar__header-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              tune
            </span>
          </span>
          Filtros
          {activeCount > 0 && (
            <span className="cat-filter-badge">{activeCount}</span>
          )}
        </div>
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {sidebarOpen && (
        <div
          className="cat-drawer-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="cat-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-drawer__header">
              <span className="cat-sidebar__header">
                <span className="cat-sidebar__header-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    tune
                  </span>
                </span>
                Filtros
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="cat-drawer__close"
              >
                ✕
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="cat-main">
        {/* Header */}
        <div className="cat-main__header">
          <div>
            <p className="cat-main__kicker">Adopción</p>
            <h1 className="cat-main__title">
              Encuentra a tu nuevo mejor amigo
            </h1>
            <p className="cat-main__subtitle">
              Explora nuestra selección de perros en busca de un hogar amoroso
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div ref={searchRef} className="cat-search-wrap">
          <div className="cat-search">
            <span className="material-symbols-outlined cat-search__icon">
              search
            </span>
            <input
              type="text"
              className="cat-search__input"
              placeholder="Busca por nombre, raza o refugio..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() =>
                suggestions.length > 0 && setShowSuggestions(true)
              }
            />
            {searchText && (
              <button
                className="cat-search__clear"
                onClick={() => {
                  setSearchText("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="cat-suggestions">
              {suggestions.map((dog) => (
                <li
                  key={dog.id}
                  className="cat-suggestion-item"
                  onMouseDown={() => {
                    setSearchText(dog.nombre);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="cat-suggestion-item__photo">
                    <Image
                      src={dog.foto}
                      alt={dog.nombre}
                      fill
                      sizes="38px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="cat-suggestion-item__main">
                    <span className="cat-suggestion-item__name">
                      {dog.nombre}
                    </span>
                    <span className="cat-suggestion-item__raza">
                      {dog.raza} · {edadLabel(dog.edad)}
                    </span>
                  </div>
                  <span className="cat-suggestion-item__shelter">
                    {dog.refugioNombre}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile filter button */}
        <div className="cat-mobile-filter-row">
          <button
            className="cat-mobile-filter-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              tune
            </span>
            Filtros{activeCount > 0 && ` (${activeCount})`}
          </button>
          <p className="cat-results-count">
            {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
          </p>
        </div>

        {/* Desktop results header */}
        <div className="cat-results-header">
          <p className="cat-results-count cat-results-count--desktop">
            {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
          </p>
          {activeCount > 0 && (
            <button className="cat-clear-inline" onClick={clearFilters}>
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {/* Dogs grid */}
        {loading ? (
          <div className="cat-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : dogs.length === 0 ? (
          <div className="cat-empty">
            <p className="cat-empty__icon">🐾</p>
            <p className="cat-empty__text">
              No encontramos perros con esos filtros.
            </p>
            <p className="cat-empty__sub">Intenta ajustar tu búsqueda.</p>
            <button className="cat-btn-clear" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="cat-grid">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}

        {/* Dynamic pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="cat-pagination">
            {/* Anterior */}
            <button
              className={`cat-page-btn ${pagination.page === 1 ? "cat-page-btn--disabled" : ""}`}
              onClick={() => setPage(pagination.page - 1)}
              aria-label="Página anterior"
            >
              «
            </button>

            {/* Números de página */}
            {getPageRange(pagination.page, pagination.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="cat-page-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`cat-page-btn ${p === pagination.page ? "cat-page-btn--active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-label={`Página ${p}`}
                  aria-current={p === pagination.page ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}

            {/* Siguiente */}
            <button
              className={`cat-page-btn ${pagination.page === pagination.totalPages ? "cat-page-btn--disabled" : ""}`}
              onClick={() => setPage(pagination.page + 1)}
              aria-label="Página siguiente"
            >
              »
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
