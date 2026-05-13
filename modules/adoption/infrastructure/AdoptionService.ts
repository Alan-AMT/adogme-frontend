// modules/adoption/infrastructure/AdoptionService.ts
// Implementación real que conecta con la API (applications-ms).

import axios from "axios";

import type {
  AdoptionFormData,
  AdoptionRequest,
  AdoptionRequestListItem,
  PaginatedResult,
  RequestStatus,
  StatusChange,
} from "../../shared/domain/AdoptionRequest";
import { calculateCompatibilityScore } from "../../shared/domain/Dog";
import { apiClient } from "../../shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "../../shared/infrastructure/api/endpoints";

import type {
  ExistingApplicationCheck,
  IAdoptionService,
  SubmitAdoptionPayload,
  SubmitAdoptionResult,
} from "./IAdoptionService";

// ─── Backend response shapes ──────────────────────────────────────────────────

interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface ApplicationFindAllItem {
  id: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogImage: string | null;
  shelterId: string;
  shelterName: string;
  shelterLogo: string | null;
  applicantName: string;
  status: RequestStatus;
  createdAt: string;
}

interface ApplicationReviewApi {
  id: string;
  applicationId: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  note: string | null;
  createdAt: string;
}

export interface ApplicationApi {
  id: string;
  applicantId: string;
  dogId: string;
  shelterId: string;
  dogName: string;
  dogBreed: string;
  dogImage: string | null;
  shelterName: string;
  shelterLogo: string | null;
  applicantName: string;
  formData: AdoptionRequest["formulario"];
  formVersion: number;
  status: RequestStatus;
  compatibilityScore: number | null;
  reviews: ApplicationReviewApi[];
  images?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateApplicationApiResponse {
  application: ApplicationApi;
  uploadLinks: string[];
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseReview(raw: ApplicationReviewApi): StatusChange {
  return {
    id: raw.id,
    applicationId: raw.applicationId,
    fromStatus: raw.fromStatus,
    toStatus: raw.toStatus,
    note: raw.note,
    createdAt: raw.createdAt,
  };
}

export function parseApplication(raw: ApplicationApi): AdoptionRequest {
  return {
    id: raw.id,
    adoptanteId: raw.applicantId,
    perroId: raw.dogId,
    refugioId: raw.shelterId,
    fecha: raw.createdAt,
    estado: raw.status,
    formulario: raw.formData,
    formVersion: raw.formVersion,
    compatibilityScore: raw.compatibilityScore,
    revisiones: (raw.reviews ?? []).map(parseReview),
    images: raw.images ?? [],
    perroNombre: raw.dogName,
    perroFoto: raw.dogImage,
    refugioNombre: raw.shelterName,
    refugioLogo: raw.shelterLogo,
    adoptanteNombre: raw.applicantName,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class AdoptionService implements IAdoptionService {
  async submit(
    payload: SubmitAdoptionPayload,
    applicantId: string,
  ): Promise<SubmitAdoptionResult> {
    const body = {
      applicantId,
      dogId: payload.perroId,
      shelterId: payload.refugioId,
      dogName: payload.perroNombre,
      dogBreed: payload.perroRaza,
      dogImage: payload.perroFoto,
      shelterName: payload.refugioNombre,
      shelterLogo: payload.refugioLogo,
      applicantName: payload.formulario.nombreCompleto,
      formData: payload.formulario,
      compatibilityScore: calculateCompatibilityScore(
        payload.userVector,
        payload.dogVector,
        payload.adoptionSpeed,
      ),
      amountImages: payload.amountImages,
    };

    try {
      const { data } = await apiClient.post<CreateApplicationApiResponse>(
        API_ENDPOINTS.ADOPTIONS.CREATE,
        body,
      );
      return {
        application: parseApplication(data.application),
        uploadLinks: data.uploadLinks ?? [],
      };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al enviar la solicitud";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al enviar la solicitud", { cause: e });
    }
  }

  async uploadApplicationImages(
    files: File[],
    uploadLinks: string[],
    onProgress?: (current: number, total: number) => void,
  ): Promise<{ failedIndices: number[] }> {
    const total = uploadLinks.length;
    if (total === 0) return { failedIndices: [] };

    async function putOnce(file: File, url: string): Promise<void> {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: file,
      });
      if (!res.ok) {
        throw new Error(`PUT ${url} → ${res.status}`);
      }
    }

    let completed = 0;
    const results = await Promise.allSettled(
      uploadLinks.map(async (url, i) => {
        const file = files[i];
        try {
          await putOnce(file, url);
        } catch {
          // Reintenta una vez antes de marcar como fallida.
          await putOnce(file, url);
        } finally {
          completed += 1;
          onProgress?.(completed, total);
        }
      }),
    );

    const failedIndices = results
      .map((r, i) => (r.status === "rejected" ? i : -1))
      .filter((i) => i !== -1);

    return { failedIndices };
  }

  async getMyRequests(
    applicantId: string,
    page = 1,
    limit = 12,
  ): Promise<PaginatedResult<AdoptionRequestListItem>> {
    try {
      const { data: res } = await apiClient.get<
        PaginatedApiResponse<ApplicationFindAllItem>
      >(API_ENDPOINTS.ADOPTIONS.APPLICATIONS_BY_APPLICANT(applicantId), {
        params: { page, limit },
      });
      return {
        data: res.data.map((item) => ({
          id: item.id,
          fecha: item.createdAt,
          estado: item.status,
          perroNombre: item.dogName,
          perroFoto: item.dogImage,
          refugioNombre: item.shelterName,
          adoptanteNombre: item.applicantName,
        })),
        total: res.total,
        page: res.page,
        totalPages: res.totalPages,
        limit: res.limit,
      };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al obtener las solicitudes";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al obtener las solicitudes", { cause: e });
    }
  }

  async getById(id: string): Promise<AdoptionRequest | null> {
    try {
      const { data } = await apiClient.get<ApplicationApi>(
        API_ENDPOINTS.ADOPTIONS.APPLICATION_BY_ID(id),
      );
      return parseApplication(data);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) return null;
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al obtener la solicitud";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al obtener la solicitud", { cause: e });
    }
  }

  async cancel(id: string, applicantId: string): Promise<AdoptionRequest> {
    try {
      await apiClient.delete(API_ENDPOINTS.ADOPTIONS.APPLICATION_BY_ID(id), {
        data: {
          applicantId,
        },
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al cancelar la solicitud";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al cancelar la solicitud", { cause: e });
    }

    const updated = await this.getById(id);
    if (!updated) throw new Error("No se pudo obtener la solicitud cancelada");
    return updated;
  }

  async checkNotExistingRequest(
    dogId: string,
    applicantId: string,
  ): Promise<ExistingApplicationCheck> {
    try {
      const { data } = await apiClient.get<ExistingApplicationCheck>(
        API_ENDPOINTS.ADOPTIONS.APPLICATIONS_CHECK,
        { params: { dogId, applicantId } },
      );
      return {
        exists: Boolean(data?.exists),
        applicationId: data?.applicationId,
      };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return { exists: false };
      }
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al verificar solicitudes existentes";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al verificar solicitudes existentes", {
        cause: e,
      });
    }
  }

  async getRecentFormData(
    applicantId: string,
  ): Promise<Partial<AdoptionFormData> | null> {
    try {
      const { data } = await apiClient.get<
        | Partial<AdoptionFormData>
        | { formData?: Partial<AdoptionFormData> }
        | null
      >(API_ENDPOINTS.ADOPTIONS.APPLICATIONS_RECENT_FORM_DATA(applicantId));

      if (!data) return null;
      // El backend podría envolverlo en { formData } o devolverlo plano.
      if (typeof data === "object" && "formData" in data && data.formData) {
        return data.formData;
      }
      return data as Partial<AdoptionFormData>;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) return null;
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          "Error al obtener datos de la solicitud previa";
        throw new Error(msg, { cause: e });
      }
      throw new Error("Error al obtener datos de la solicitud previa", {
        cause: e,
      });
    }
  }
}
