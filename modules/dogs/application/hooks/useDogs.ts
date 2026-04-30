// modules/dogs/application/hooks/useDogs.ts
// Archivo 116 — hook principal del catálogo de perros.
// Estrategia: paginación server-side (getDogs con filters+page),
//             carga única inicial para metadata (razas, refugios, sugerencias).
// Debounce 300ms sobre searchText antes de disparar fetch.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DogFilters, DogListItem } from "../../../shared/domain/Dog";
import { dogService } from "../../infrastructure/DogServiceFactory";

// ─── Tipos exportados ──────────────────────────────────────────────────────────

export type ViewMode = "grid" | "list";

export interface DogPagination {
  page:       number;
  totalPages: number;
  limit:      number;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 12;
const DEBOUNCE_MS   = 300;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDogs(initialFilters: DogFilters = {}) {

  // ── Resultados paginados ───────────────────────────────────────────────────
  const [dogs,         setDogs]         = useState<DogListItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [pagination,   setPagination]   = useState<DogPagination>({
    page: 1, totalPages: 1, limit: DEFAULT_LIMIT,
  });

  // ── Filtros + búsqueda ─────────────────────────────────────────────────────
  const [filters,    setFiltersState] = useState<DogFilters>(initialFilters);
  const [searchText, setSearchText]   = useState(initialFilters.search ?? "");
  const [page,       setPageState]    = useState(initialFilters.page ?? 1);

  // ── UI ─────────────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // ── Metadata (carga única — para dropdowns y sugerencias) ─────────────────
  const [allDogs,  setAllDogs]  = useState<DogListItem[]>([]);
  const [razas,    setRazas]    = useState<string[]>([]);
  const [refugios, setRefugios] = useState<{ id: string; nombre: string }[]>([]);

  // ── Debounce 300ms sobre searchText ───────────────────────────────────────
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(initialFilters.search ?? "");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPageState(1); // nueva búsqueda → volver a página 1
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchText]);

  // ── Carga inicial: metadata para dropdowns y sugerencias ──────────────────
  useEffect(() => {
    dogService.getDogs({ limit: 999 }).then(({ data }) => {
      setAllDogs(data);
      setRazas([...new Set(data.map((d) => d.raza))].sort());
      const seen = new Set<string>();
      setRefugios(
        data
          .filter((d) => !seen.has(d.refugioId) && seen.add(d.refugioId))
          .map((d) => ({ id: d.refugioId, nombre: d.refugioNombre ?? `Refugio ${d.refugioId}` })),
      );
    });
  }, []);

  // ── Fetch paginado: se dispara cuando cambian filtros, search o página ────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const query: DogFilters = {
      ...filters,
      search: debouncedSearch || undefined,
      page,
      limit: DEFAULT_LIMIT,
    };

    dogService
      .getDogs(query)
      .then(({ data, total, page: p, totalPages, limit }) => {
        if (cancelled) return;
        setDogs(data);
        setTotalResults(total);
        setPagination({ page: p, totalPages, limit });
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filters, debouncedSearch, page]);

  // ── Acciones ──────────────────────────────────────────────────────────────

  /** Togglea un filtro: mismo valor = limpiar, diferente = aplicar. Resetea página. */
  const setFilter = useCallback(<K extends keyof DogFilters>(key: K, val: DogFilters[K]) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: prev[key] === val ? undefined : val,
    }));
    setPageState(1);
  }, []);

  /** Reemplaza todos los filtros de golpe (ej: desde URL params). */
  const setFilters = useCallback((next: DogFilters) => {
    setFiltersState(next);
    setPageState(1);
  }, []);

  /** Navega a una página específica y hace scroll al top. */
  const setPage = useCallback((p: number) => {
    setPageState(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /** Limpia todos los filtros y el texto de búsqueda. */
  const resetFilters = useCallback(() => {
    setFiltersState({});
    setSearchText("");
    setPageState(1);
  }, []);

  /** Alias para compatibilidad con DogsSearchView (será reemplazado en Archivo 118). */
  const clearFilters = resetFilters;

  /** Alterna entre vista grid y lista. */
  const toggleViewMode = useCallback(() => {
    setViewMode((v) => (v === "grid" ? "list" : "grid"));
  }, []);

  const activeCount =
    Object.values(filters).filter((v) => v !== undefined && v !== "").length +
    (searchText.trim() ? 1 : 0);

  return {
    // ── Resultados ────────────────────────────────────────────────────────
    dogs,
    loading,
    error,
    totalResults,
    pagination,

    // ── Metadata (sin paginar — para dropdowns/sugerencias) ───────────────
    allDogs,
    razas,
    refugios,

    // ── Filtros ───────────────────────────────────────────────────────────
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilters,   // alias — mantiene compatibilidad
    activeCount,

    // ── Búsqueda ──────────────────────────────────────────────────────────
    searchText,
    setSearchText,

    // ── Paginación ────────────────────────────────────────────────────────
    page,
    setPage,

    // ── UI ────────────────────────────────────────────────────────────────
    viewMode,
    toggleViewMode,
  };
}
