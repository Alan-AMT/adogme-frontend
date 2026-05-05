// modules/shelter/application/hooks/useShelterProfile.ts
// Archivo 171 — hook para cargar y actualizar el perfil del refugio.
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Shelter } from "@/modules/shared/domain/Shelter";
import { shelterService } from "../../infrastructure/ShelterServiceFactory";
import { useAuthStore } from "@/modules/shared/infrastructure/store/authStore";
import { ShelterUser } from "@/modules/shared/domain";

export interface UploadProgress {
  current: number;
  total: number;
}

export interface UseShelterProfileReturn {
  shelter: Shelter | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: boolean;
  uploadProgress: UploadProgress | null;
  saveProfile: (
    data: Partial<Shelter>,
    logoFile?: File | null,
    bannerFile?: File | null,
  ) => Promise<void>;
}

export function useShelterProfile(): UseShelterProfileReturn {
  const user = useAuthStore((s) => s.user);
  const shelterID = useRef("");
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );

  useEffect(() => {
    if (user != null) {
      setIsLoading(true);
      const { shelterId } = user as ShelterUser;
      shelterID.current = shelterId ?? "";
      shelterService
        .getShelterProfile(shelterId ?? "")
        .then((s) => setShelter(s))
        .catch((e: Error) => setError(e.message))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const saveProfile = useCallback(
    async (
      data: Partial<Shelter>,
      logoFile?: File | null,
      bannerFile?: File | null,
    ) => {
      setIsSaving(true);
      setError(null);
      setSuccess(false);
      try {
        const { shelter: updated, uploadUrls } =
          await shelterService.updateShelterProfile(shelterID.current, {
            ...data,
            newLogo: !!logoFile,
            newImageUrl: !!bannerFile,
          });

        if (uploadUrls.length > 0) {
          const files: File[] = [];
          if (logoFile) files.push(logoFile);
          if (bannerFile) files.push(bannerFile);

          setUploadProgress({ current: 0, total: files.length });
          try {
            await shelterService.uploadDogImages(
              files,
              uploadUrls,
              (current, total) => setUploadProgress({ current, total }),
            );
          } finally {
            setUploadProgress(null);
          }
        }

        setShelter(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (e: unknown) {
        setError((e as Error).message ?? "Error al guardar perfil");
        throw e;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return {
    shelter,
    isLoading,
    isSaving,
    error,
    success,
    uploadProgress,
    saveProfile,
  };
}
