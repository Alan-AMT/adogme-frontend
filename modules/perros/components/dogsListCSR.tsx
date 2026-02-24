"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dog, DogEnergyLevel, DogSex, DogSize, DogStatus } from "../domain/dog";
import { DogFilters } from "../domain/dogFilters";
import { MOCK_DOGS, REFUGIOS } from "../infrastructure/MockDogsList";
import "../styles/catalog.css";
import DogsList from "./dogsList";

/* ── Helpers ── */
const RAZAS = [...new Set(MOCK_DOGS.map((d) => d.raza))].sort();

const EMPTY_FILTERS: DogFilters = {
  queryText: null,
  tamano: null,
  sexo: null,
  cachorro: null,
  nivelEnergia: null,
  estado: null,
  raza: null,
  refugioId: null,
};

function applyFilters(dogs: Dog[], f: DogFilters): Dog[] {
  return dogs.filter((d) => {
    if (f.queryText) {
      const q = f.queryText.toLowerCase();
      if (
        !d.nombre.toLowerCase().includes(q) &&
        !d.raza.toLowerCase().includes(q) &&
        !d.shelterName.toLowerCase().includes(q)
      )
        return false;
    }
    if (f.tamano && d.tamano !== f.tamano) return false;
    if (f.sexo && d.sexo !== f.sexo) return false;
    if (f.nivelEnergia && d.nivelEnergia !== f.nivelEnergia) return false;
    if (f.estado && d.estado !== f.estado) return false;
    if (f.raza && d.raza.toLowerCase() !== f.raza.toLowerCase()) return false;
    if (f.refugioId && d.refugioId !== f.refugioId) return false;
    if (f.cachorro === true && d.edad >= 12) return false;
    if (f.cachorro === false && d.edad < 12) return false;
    return true;
  });
}

/* ── Sub-components ── */
type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};
function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`cat-chip ${active ? "cat-chip--active" : ""}`}
    >
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

/* ── Main ── */
interface DogsListCSRProps {
  initialDogs: Dog[];
}

export default function DogsListCSR({ initialDogs }: DogsListCSRProps) {
  const [filters, setFilters] = useState<DogFilters>(EMPTY_FILTERS);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Dog[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  /* Filtered results (reactive, sin botón) */
  const filteredDogs = useMemo(
    () => applyFilters(initialDogs, { ...filters, queryText: searchText || null }),
    [initialDogs, filters, searchText],
  );

  /* Suggestions while typing */
  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchText(val);
      if (val.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const q = val.toLowerCase();
      const matches = initialDogs.filter(
        (d) =>
          d.nombre.toLowerCase().includes(q) ||
          d.raza.toLowerCase().includes(q),
      );
      setSuggestions(matches.slice(0, 5));
      setShowSuggestions(true);
    },
    [initialDogs],
  );

  /* Close suggestions on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setFilter = <K extends keyof DogFilters>(key: K, val: DogFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchText("");
  };

  const activeCount = Object.values(filters).filter((v) => v !== null).length + (searchText ? 1 : 0);

  /* ── Sidebar content ── */
  const SidebarContent = () => (
    <div className="cat-sidebar__inner">
      {/* Tamaño */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Tamaño</p>
        <div className="cat-chip-row">
          {(["pequeño", "mediano", "grande"] as DogSize[]).map((s) => (
            <Chip
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              active={filters.tamano === s}
              onClick={() => setFilter("tamano", s)}
            />
          ))}
        </div>
      </div>

      {/* Edad */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Edad</p>
        <div className="cat-chip-row">
          <Chip
            label="Cachorro"
            active={filters.cachorro === true}
            onClick={() =>
              setFilters((p) => ({ ...p, cachorro: p.cachorro === true ? null : true }))
            }
          />
          <Chip
            label="Adulto"
            active={filters.cachorro === false}
            onClick={() =>
              setFilters((p) => ({ ...p, cachorro: p.cachorro === false ? null : false }))
            }
          />
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

      {/* Energía */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Nivel de energía</p>
        <div className="cat-chip-row">
          {(["baja", "media", "alta"] as DogEnergyLevel[]).map((e) => (
            <Chip
              key={e}
              label={e.charAt(0).toUpperCase() + e.slice(1)}
              active={filters.nivelEnergia === e}
              onClick={() => setFilter("nivelEnergia", e)}
            />
          ))}
        </div>
      </div>

      {/* Estado */}
      <div className="cat-filter-group">
        <p className="cat-filter-group__title">Estado</p>
        <div className="cat-chip-row">
          {(
            [
              { val: "disponible", label: "Disponible" },
              { val: "en_proceso", label: "En proceso" },
              { val: "adoptado", label: "Adoptado" },
            ] as { val: DogStatus; label: string }[]
          ).map(({ val, label }) => (
            <Chip
              key={val}
              label={label}
              active={filters.estado === val}
              onClick={() => setFilter("estado", val)}
            />
          ))}
        </div>
      </div>

      {/* Raza */}
      <div className="cat-filter-group">
        <FilterSelect
          label="Raza"
          value={filters.raza ?? ""}
          options={RAZAS.map((r) => ({ value: r, label: r }))}
          onChange={(v) => setFilters((p) => ({ ...p, raza: v || null }))}
        />
      </div>

      {/* Refugio */}
      <div className="cat-filter-group">
        <FilterSelect
          label="Refugio"
          value={filters.refugioId?.toString() ?? ""}
          options={REFUGIOS.map((r) => ({ value: r.id.toString(), label: r.nombre }))}
          onChange={(v) =>
            setFilters((p) => ({ ...p, refugioId: v ? parseInt(v) : null }))
          }
        />
      </div>

      {/* Actions */}
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
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            tune
          </span>
          Filtros
          {activeCount > 0 && (
            <span className="cat-filter-badge">{activeCount}</span>
          )}
        </div>
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile (drawer) ── */}
      {sidebarOpen && (
        <div className="cat-drawer-overlay" onClick={() => setSidebarOpen(false)}>
          <aside
            className="cat-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-drawer__header">
              <span className="cat-sidebar__header">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  tune
                </span>
                Filtros
              </span>
              <button onClick={() => setSidebarOpen(false)} className="cat-drawer__close">
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
            <h1 className="cat-main__title">Encuentra a tu nuevo mejor amigo</h1>
            <p className="cat-main__subtitle">
              Explora nuestra selección de perros en busca de un hogar amoroso
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div ref={searchRef} className="cat-search-wrap">
          <div className="cat-search">
            <span className="material-symbols-outlined cat-search__icon">search</span>
            <input
              type="search"
              className="cat-search__input"
              placeholder="Busca por nombre, raza o refugio..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
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
                  <div className="cat-suggestion-item__main">
                    <span className="cat-suggestion-item__name">{dog.nombre}</span>
                    <span className="cat-suggestion-item__raza">{dog.raza}</span>
                  </div>
                  <span className="cat-suggestion-item__shelter">{dog.shelterName}</span>
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
            {filteredDogs.length} {filteredDogs.length === 1 ? "resultado" : "resultados"}
          </p>
        </div>

        {/* Results header desktop */}
        <div className="cat-results-header">
          <p className="cat-results-count cat-results-count--desktop">
            {filteredDogs.length} {filteredDogs.length === 1 ? "resultado" : "resultados"}
          </p>
          {activeCount > 0 && (
            <button className="cat-clear-inline" onClick={clearFilters}>
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {/* Dogs grid */}
        <DogsList dogs={filteredDogs} />

        {/* Pagination placeholder */}
        <div className="cat-pagination">
          <button className="cat-page-btn">«</button>
          <button className="cat-page-btn cat-page-btn--active">1</button>
          <button className="cat-page-btn">2</button>
          <button className="cat-page-btn cat-page-btn--disabled">...</button>
          <button className="cat-page-btn">»</button>
        </div>
      </main>
    </div>
  );
}
