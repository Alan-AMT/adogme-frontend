// modules/adoption/application/hooks/useMyRequests.ts
// Lista y detalle de solicitudes del adoptante autenticado
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  AdoptionRequest,
  AdoptionRequestListItem,
} from "../../../shared/domain/AdoptionRequest";
import type { Adoptante } from "../../../shared/domain/User";
import { adoptionService } from "../../infrastructure/AdoptionServiceFactory";
import { useAuthStore } from "../../../shared/infrastructure/store/authStore";

// ─── Lista de mis solicitudes ─────────────────────────────────────────────────

export function useMyRequests(limit = 12) {
  const applicantId = useAuthStore((s) =>
    s.user?.role === "applicant"
      ? (s.user as Adoptante).applicantId
      : undefined,
  );

  const [requests, setRequests] = useState<AdoptionRequestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    if (!applicantId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await adoptionService.getMyRequests(
        applicantId,
        page,
        limit,
      );
      setRequests(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar solicitudes");
    } finally {
      setIsLoading(false);
    }
  }, [applicantId, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    requests,
    isLoading,
    error,
    refetch: load,
    page,
    setPage,
    totalPages,
    total,
  };
}

// ─── Detalle de una solicitud ─────────────────────────────────────────────────

export function useRequestDetail(id: string) {
  const applicantId = useAuthStore((s) =>
    s.user?.role === "applicant"
      ? (s.user as Adoptante).applicantId
      : undefined,
  );
  const [request, setRequest] = useState<AdoptionRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    // D1 — pasar adoptanteId para validar ownership en el servicio
    adoptionService
      .getById(id)
      .then(setRequest)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Error al cargar solicitud"),
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  const cancel = useCallback(async () => {
    if (!request) return;
    setCancelling(true);
    setError(null);
    if (!applicantId) {
      return;
    }
    try {
      // D2 — pasar adoptanteId requerido para validar ownership
      const updated = await adoptionService.cancel(request.id, applicantId);
      setRequest(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cancelar");
    } finally {
      setCancelling(false);
    }
  }, [request]);

  return { request, isLoading, error, cancelling, cancel };
}
