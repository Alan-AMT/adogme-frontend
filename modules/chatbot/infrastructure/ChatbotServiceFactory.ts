// modules/chatbot/infrastructure/ChatbotServiceFactory.ts
import { MockChatbotService } from './MockChatbotService'
import type { IChatbotService } from './IChatbotService'

export const chatbotService: IChatbotService = new MockChatbotService()
