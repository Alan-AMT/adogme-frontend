// modules/chatbot/infrastructure/MockChatbotService.ts
// Refactor de MockChatbot.ts — mapa de intents con keywords → respuesta + links + sugerencias.
// Detección: tokeniza el mensaje y busca coincidencias por palabra clave.

import type { IChatbotService } from './IChatbotService'
import type { BotResponse, ChatbotIntent } from '../domain/Chatbot'

// ─── Mapa de intents ───────────────────────────────────────────────────────

const INTENTS: ChatbotIntent[] = [
  {
    id: 'saludo',
    keywords: ['hola', 'hi', 'hey', 'buenas', 'buenos', 'saludos', 'buen dia', 'buen día'],
    response: {
      text: '¡Hola! 👋 Soy el asistente de aDOGme. Estoy aquí para ayudarte a encontrar a tu nuevo mejor amigo y resolver tus dudas sobre adopción. ¿En qué te puedo ayudar?',
      suggestions: ['¿Cómo adopto?', '¿Cuáles son los requisitos?', 'Hacer el quiz de compatibilidad'],
    },
  },
  {
    id: 'adoptar',
    keywords: ['adoptar', 'adopcion', 'adopción', 'como adopto', 'proceso', 'quiero adoptar', 'quiero un perro'],
    response: {
      text: '¡Qué buena decisión! 🐾 El proceso de adopción en aDOGme es sencillo:\n\n1) Completa tu perfil de adoptante\n2) Explora el catálogo y elige a tu compañero\n3) Envía la solicitud y el refugio te contactará para coordinar la visita\n\n¿Quieres que te ayude a encontrar perros disponibles?',
      links: [
        { label: 'Ver catálogo de perros',    href: '/perros'          },
        { label: 'Quiz de compatibilidad',    href: '/mi-match/quiz'   },
      ],
      suggestions: ['¿Cuáles son los requisitos?', '¿Cuánto tiempo tarda?', '¿Cuánto cuesta adoptar?'],
    },
  },
  {
    id: 'requisitos',
    keywords: ['requisito', 'requisitos', 'necesito', 'que necesito', 'qué necesito', 'documentos', 'papeles'],
    response: {
      text: 'Para adoptar necesitas:\n\n✅ Ser mayor de 18 años\n✅ Identificación oficial vigente\n✅ Espacio adecuado para el perro\n✅ Compromiso con su bienestar\n\n¡No se requiere jardín obligatoriamente! 🏠',
      suggestions: ['¿Cómo es el proceso?', '¿Cuánto cuesta adoptar?', '¿Dónde están los refugios?'],
    },
  },
  {
    id: 'costo',
    keywords: ['costo', 'precio', 'cuanto', 'cuánto', 'pago', 'gratis', 'cuesta', 'cobran', 'tarifa'],
    response: {
      text: 'La adopción en los refugios asociados a aDOGme no tiene costo de recuperación 💰.\n\nTe recomendamos presupuestar para los cuidados iniciales: accesorios, collar, cama y la primera consulta veterinaria de seguimiento.',
      suggestions: ['¿Cómo es el proceso de adopción?', '¿Qué refugios tienen disponibles?'],
    },
  },
  {
    id: 'quiz',
    keywords: ['quiz', 'test', 'compatible', 'compatibilidad', 'match', 'mi match', 'recomendacion', 'recomendación', 'cual me conviene', 'cuál me conviene'],
    response: {
      text: '¡Excelente idea! 🧪 Nuestro quiz de compatibilidad analiza tu estilo de vida, tipo de vivienda, experiencia con mascotas y preferencias para recomendarte los perritos más compatibles contigo. Solo toma unos minutos.',
      links: [{ label: 'Hacer el quiz ahora ✨', href: '/mi-match/quiz' }],
      suggestions: ['¿Cómo es el proceso de adopción?', 'Ver perros disponibles'],
    },
  },
  {
    id: 'refugios',
    keywords: ['refugio', 'refugios', 'donde', 'dónde', 'ubicacion', 'ubicación', 'gam', 'gustavo', 'coyoacan', 'iztapalapa', 'alcaldia', 'alcaldía'],
    response: {
      text: 'Trabajamos con refugios en varias alcaldías de la CDMX: Gustavo A. Madero, Coyoacán e Iztapalapa 📍.\n\nPuedes explorar todos los refugios y ver sus perros disponibles en la plataforma.',
      links: [{ label: 'Ver todos los refugios', href: '/refugios' }],
      suggestions: ['¿Cómo agendo una visita?', '¿Cómo es el proceso de adopción?'],
    },
  },
  {
    id: 'visita',
    keywords: ['visita', 'conocer', 'ver perro', 'agendar', 'agenda', 'cuando puedo ir', 'ir al refugio', 'cita'],
    response: {
      text: 'Para coordinar una visita: busca al perrito que te interese en el catálogo, entra a su perfil y da clic en "Solicitar adopción". El refugio recibirá tu solicitud y se pondrá en contacto contigo para coordinar los detalles. 📅',
      links: [{ label: 'Ver catálogo de perros', href: '/perros' }],
      suggestions: ['¿Qué documentos llevar?', '¿Cuánto tiempo tarda la adopción?'],
    },
  },
  {
    id: 'cachorro',
    keywords: ['cachorro', 'cachorros', 'bebe', 'bebé', 'chiquito', 'chico', 'joven', 'pequeño', 'bebe perro'],
    response: {
      text: '¡Los cachorros son adorables! 🐶 Ten en cuenta que necesitan más tiempo, paciencia y entrenamiento inicial que los perros adultos.\n\nTenemos cachorros disponibles en el catálogo. También puedes usar el quiz de compatibilidad para encontrar el match ideal.',
      links: [{ label: 'Ver perros disponibles', href: '/perros' }],
      suggestions: ['Hacer el quiz de compatibilidad', '¿Cómo es el proceso de adopción?'],
    },
  },
  {
    id: 'tamano',
    keywords: ['grande', 'mediano', 'gigante', 'tamaño', 'tamano', 'raza', 'razas', 'que raza', 'qué raza', 'pastor', 'labrador', 'chihuahua'],
    response: {
      text: 'Tenemos perros de todos los tamaños: pequeños (menos de 10 kg), medianos (10–25 kg), grandes (25–45 kg) y gigantes (más de 45 kg) ✨.\n\nPuedes filtrar por tamaño en el catálogo o usar el quiz de compatibilidad para que el sistema te recomiende el tamaño ideal según tu espacio.',
      links: [
        { label: 'Ver catálogo y filtrar',       href: '/perros'        },
        { label: 'Quiz de compatibilidad',       href: '/mi-match/quiz' },
      ],
      suggestions: ['¿Qué tamaño me conviene?', 'Hacer el quiz de compatibilidad'],
    },
  },
  {
    id: 'solicitud',
    keywords: ['solicitud', 'solicitudes', 'mis solicitudes', 'estado', 'seguimiento', 'cuando me responden', 'cuándo responden', 'esperar'],
    response: {
      text: 'Puedes ver el estado de tus solicitudes en la sección "Mis solicitudes" 📋. Ahí encuentras el historial y el progreso de cada adopción.\n\nLos refugios responden generalmente en 2–5 días hábiles.',
      links: [{ label: 'Ver mis solicitudes', href: '/mis-solicitudes' }],
      suggestions: ['¿Puedo cancelar una solicitud?', '¿Cómo es el proceso?'],
    },
  },
  {
    id: 'favoritos',
    keywords: ['favorito', 'favoritos', 'guardar', 'lista', 'corazon', 'corazón', 'me gusto', 'me gustó', 'me gusta'],
    response: {
      text: '¡Puedes guardar a tus perritos favoritos tocando el corazón ❤️ en la tarjeta de cada perro! Después los encuentras en tu sección de Favoritos para compararlos y decidir.',
      links: [{ label: 'Ver mis favoritos', href: '/favoritos' }],
      suggestions: ['¿Cómo adopto un perro de mis favoritos?', 'Ver catálogo'],
    },
  },
  {
    id: 'gracias',
    keywords: ['gracias', 'thank', 'perfecto', 'excelente', 'genial', 'muchas gracias', 'muy bien', 'chevere'],
    response: {
      text: '¡Con mucho gusto! 😊 Recuerda que cada adopción cambia dos vidas: la del perrito y la tuya. Si tienes más preguntas, aquí estaré. ¡Mucho éxito en tu proceso! 🐾',
      suggestions: ['Ver perros disponibles', '¿Cómo es el proceso de adopción?'],
    },
  },
]

const RESPONSE_DEFAULT: BotResponse = {
  text: 'Hmm, no estoy seguro de cómo ayudarte con eso específicamente 🤔. Te recomiendo revisar nuestro catálogo de perros o contactar directamente a uno de nuestros refugios.',
  links: [
    { label: 'Ver catálogo de perros', href: '/perros'   },
    { label: 'Ver refugios',           href: '/refugios' },
  ],
  suggestions: ['¿Cómo adopto?', '¿Cuáles son los requisitos?', 'Hacer el quiz de compatibilidad'],
}

// ─── Servicio ──────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise<void>(r => setTimeout(r, ms))

export class MockChatbotService implements IChatbotService {
  // C3 — sessionId y userId recibidos para trazabilidad (mock los ignora, backend los usará)
  async getResponse(message: string, _sessionId: string, _userId?: number): Promise<BotResponse> {
    await delay(400)

    const lower  = message.toLowerCase()
    // Tokenizar: separar en palabras (quitar signos) para comparar
    const tokens = lower.split(/[\s,!?¿¡.;:()\-]+/).filter(Boolean)

    for (const intent of INTENTS) {
      const matched = intent.keywords.some(kw => {
        // Primero busca coincidencia de frase completa
        if (lower.includes(kw)) return true
        // Luego busca si el keyword es una sola palabra y está en los tokens
        if (!kw.includes(' ') && tokens.includes(kw)) return true
        return false
      })
      if (matched) return intent.response
    }

    return RESPONSE_DEFAULT
  }
}
