// modules/home/application/hooks/useHomeContent.ts
"use client";

import { useEffect, useState } from "react";
import type { AdoptionStory } from "../../domain/AdoptionStory";
import type { DogCard } from "../../domain/DogCard";
import type { ShelterCard } from "../../domain/ShelterCard";
import { homeService } from "../../infrastructure/HomeServiceFactory";

interface SheltersPagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function useHomeDogs() {
  const [dogs, setDogs] = useState<DogCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService
      .getMainDogs()
      .then(setDogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { dogs, loading };
}

const SHELTERS_LIST_LIMIT = 10;
const CAROUSEL_LIMIT = 5;

export function useHomeShelters() {
  const [shelters, setShelters] = useState<ShelterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<SheltersPagination>({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 0,
  });

  useEffect(() => {
    setLoading(true);
    homeService
      .getHomeSheltersList(page, SHELTERS_LIST_LIMIT)
      .then((result) => {
        setShelters(result.data);
        setPagination({
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
          limit: result.limit,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return { shelters, loading, pagination, setPage };
}

export function useCarouselShelters() {
  const [shelters, setShelters] = useState<ShelterCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService
      .getHomeSheltersList(1, CAROUSEL_LIMIT)
      .then((result) => setShelters(result.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { shelters, loading };
}

export function useAdoptionStories() {
  const [stories, setStories] = useState<AdoptionStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService
      .getLatestStories()
      .then(setStories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stories, loading };
}
