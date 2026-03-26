// modules/dogs/application/hooks/useDogDetail.ts
// Archivo 117 — carga un perro por slug y gestiona favoritos via favoritesStore.
// La hidratación del store se hace aquí para que el corazón muestre el estado
// correcto desde el primer render del componente que use este hook.
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dog } from "../../../shared/domain/Dog";
import { dogService } from "../../infrastructure/DogServiceFactory";
import { useFavoritesStore } from "../../../shared/infrastructure/store/favoritesStore";

export function useDogDetail(slug: string) {
  const [dog,     setDog]     = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // ── Favoritos desde el store persistido en localStorage ──────────────────
  const { isFavorite, toggleFavorite: storeToggle, hydrate } = useFavoritesStore();

  // Hidratar el store una sola vez al montar (lee localStorage)
  useEffect(() => { hydrate(); }, [hydrate]);

  // ── Fetch del perro por slug ──────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setDog(null);

    dogService
      .getDogBySlug(slug)
      .then((d) => { if (!cancelled) setDog(d); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  // ── Toggle favorito (solo cuando tenemos el id del perro) ─────────────────
  const toggleFavorite = useCallback(() => {
    if (dog) storeToggle(dog.id);
  }, [dog, storeToggle]);

  return {
    dog,
    loading,
    error,
    isFavorite: dog ? isFavorite(dog.id) : false,
    toggleFavorite,
  };
}
