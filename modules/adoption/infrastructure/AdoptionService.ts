// modules/adoption/infrastructure/AdoptionService.ts
// Implementación real que conecta con la API (applications-ms).

import axios from "axios";

import type {
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
  IAdoptionService,
  SubmitAdoptionPayload,
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
  dogName: string;
  dogBreed: string;
  dogImage: string | null;
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

interface ApplicationApi {
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
  createdAt: string;
  updatedAt: string;
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

function parseApplication(raw: ApplicationApi): AdoptionRequest {
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
  ): Promise<AdoptionRequest> {
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
      ),
    };

    try {
      const { data } = await apiClient.post<ApplicationApi>(
        API_ENDPOINTS.ADOPTIONS.APPLICATIONS_CREATE,
        body,
      );
      return parseApplication(data);
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
          adoptanteId: applicantId,
          perroId: "",
          refugioId: "",
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
}
