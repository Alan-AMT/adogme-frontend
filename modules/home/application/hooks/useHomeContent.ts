// modules/home/application/hooks/useHomeContent.ts
"use client";

import { useEffect, useState } from "react";
import type { AdoptionProcess } from "../../domain/AdoptionProcess";
import type { AdoptionStory } from "../../domain/AdoptionStory";
import type { DogCard } from "../../domain/DogCard";
import type { ShelterCard } from "../../domain/ShelterCard";
import { homeService } from "../../infrastructure/HomeServiceFactory";

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

export function useHomeShelters() {
  const [shelters, setShelters] = useState<ShelterCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService
      .getHomeSheltersList()
      .then(setShelters)
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

export function useAdoptionProcess() {
  const [process, setProcess] = useState<AdoptionProcess>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeService
      .getAdoptionProcess()
      .then(setProcess)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { process, loading };
}

