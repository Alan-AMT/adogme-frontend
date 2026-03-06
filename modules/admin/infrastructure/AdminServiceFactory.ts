// modules/admin/infrastructure/AdminServiceFactory.ts
// Singleton del servicio de administración.

import { MockAdminService } from './MockAdminService'
import type { IAdminService } from './IAdminService'

export const adminService: IAdminService = new MockAdminService()
