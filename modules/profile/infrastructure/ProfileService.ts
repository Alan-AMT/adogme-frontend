// modules/profile/infrastructure/ProfileService.ts
import { apiClient } from "@/modules/shared/infrastructure/api/apiClient";
import { API_ENDPOINTS } from "@/modules/shared/infrastructure/api/endpoints";
import type { Adoptante } from "@/modules/shared/domain/User";
import type { LifestyleQuizAnswers } from "@/modules/shared/domain/LifestyleProfile";
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

  async changePassword(
    _userId: string,
    _currentPassword: string,
    _newPassword: string,
  ): Promise<void> {
    throw new Error("Not implemented");
  }

  async getLifestylePreferences(
    _userId: string,
  ): Promise<LifestyleQuizAnswers | null> {
    throw new Error("Not implemented");
  }

  async saveLifestylePreferences(
    _userId: string,
    _answers: LifestyleQuizAnswers,
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
