// modules/profile/infrastructure/ProfileService.ts
import axios from "axios";
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { Adoptante, ShelterUser } from "@/modules/shared/domain/User";
import type { IProfileService, ProfileUser } from "./IProfileService";
import type { ProfileUpdateData } from "../domain/ProfileTypes";

export class ProfileService implements IProfileService {
  async updateProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<ProfileUser> {
    const payload = {
      userName: data.nombre,
      email: data.email,
      phone: data.telefono,
      address: data.direccion,
      postalCode: data.cp,
      avatarUrl: data.avatarUrl,
    };

    const { data: profile } = await apiClient.put<{
      id: string;
      userId: string;
      userName: string;
      address: string;
      postalCode: string;
      phone: string | null;
      email: string | null;
      avatarUrl: string | null;
    }>(API_ENDPOINTS.APPLICANTS.UPDATE(userId), payload);

    const adoptante: Adoptante = {
      id: userId,
      name: profile.userName,
      email: profile.email ?? "",
      role: "applicant",
      applicantId: profile.id,
      phone: profile.phone ?? undefined,
      address: profile.address,
      postalCode: profile.postalCode,
      avatarUrl: profile.avatarUrl ?? undefined,
    };

    return adoptante;
  }

  async updateShelterAdminProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<ProfileUser> {
    const payload = {
      name: data.nombre,
    };

    const { data: profile } = await apiClient.patch<{
      name: string;
      email: string;
      user_id: string;
      role: string;
    }>(API_ENDPOINTS.SHELTERS.UPDATE_ADMIN_DATA(userId), payload);

    const shelter: ShelterUser = {
      id: profile.user_id,
      name: profile.name,
      email: profile.email,
      role: "shelter",
    };

    return shelter;
  }

  async changePassword(
    _userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        throw new Error("La contraseña actual no es válida.");
      }
      throw err;
    }
  }

  async updateUserVector(
    applicantId: string,
    userVector: [number, number, number, number],
  ): Promise<void> {
    await apiClient.patch(
      API_ENDPOINTS.APPLICANTS.UPDATE_USER_VECTOR(applicantId),
      { vector: userVector },
    );
  }
}
