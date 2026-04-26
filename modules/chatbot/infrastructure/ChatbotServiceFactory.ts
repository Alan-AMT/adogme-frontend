// modules/chatbot/infrastructure/ChatbotServiceFactory.ts
import { MockChatbotService } from './MockChatbotService'
import { ChatbotService }     from './ChatbotService'
import type { IChatbotService } from './IChatbotService'

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_CHATBOT === 'true'

export const chatbotService: IChatbotService = useMock
  ? new MockChatbotService()
  : new ChatbotService()
