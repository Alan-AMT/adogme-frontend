// modules/messaging/infrastructure/MessageServiceFactory.ts
import { MockMessageService }  from './MockMessageService'
import type { IMessageService } from '../domain/IMessageService'

// Singleton — mantiene el estado mutable durante toda la sesión
export const messageService: IMessageService = new MockMessageService()
