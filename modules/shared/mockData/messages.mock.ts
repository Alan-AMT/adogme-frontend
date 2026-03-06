// modules/shared/mockData/messages.mock.ts
// 4 conversaciones con 8–15 mensajes cada una
// Timestamps coherentes (últimas 48h desde 2025-01-24)

import type { Conversation, Message } from '../domain/Message'
import { SHELTER_IDS } from './shelters.mock'

const ADOPTANTE_ID = 101
const SHELTER_USER_ID = 201

// ─── Helper para timestamps ───────────────────────────────────────────────────

const hoursAgo = (h: number): string => {
  const d = new Date('2025-01-24T18:00:00Z')
  d.setHours(d.getHours() - h)
  return d.toISOString()
}

// ─── 4 Conversaciones ────────────────────────────────────────────────────────

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1, solicitudId: 1001, perroId: 1, adoptanteId: ADOPTANTE_ID, refugioId: SHELTER_IDS.HUELLITAS,
    ultimoMensaje: 'Perfecto, el sábado a las 11am entonces.', ultimoMensajeEn: hoursAgo(1),
    noLeidosPorAdoptante: 0, noLeidosPorRefugio: 0, creadaEn: hoursAgo(36),
    perroNombre: 'Max', perroFoto: '/assets/dogs/dog1.jpg',
    refugioNombre: 'Huellitas MX', refugioLogo: '/assets/shelters/shelter1-logo.jpg',
    adoptanteNombre: 'Ana García', adoptanteAvatar: '/assets/avatars/avatar1.png',
  },
  {
    id: 2, solicitudId: 1002, perroId: 18, adoptanteId: ADOPTANTE_ID, refugioId: SHELTER_IDS.ESPERANZA,
    ultimoMensaje: 'Entiendo, tomaré en cuenta lo que me dijiste.', ultimoMensajeEn: hoursAgo(5),
    noLeidosPorAdoptante: 2, noLeidosPorRefugio: 0, creadaEn: hoursAgo(48),
    perroNombre: 'Kira', perroFoto: '/assets/dogs/dog4.jpg',
    refugioNombre: 'Refugio Esperanza', refugioLogo: '/assets/shelters/shelter4-logo.jpg',
    adoptanteNombre: 'Ana García', adoptanteAvatar: '/assets/avatars/avatar1.png',
  },
  {
    id: 3, perroId: 7, adoptanteId: 103, refugioId: SHELTER_IDS.PATITAS,
    ultimoMensaje: '¿Pueden enviarme más fotos de Churro?', ultimoMensajeEn: hoursAgo(12),
    noLeidosPorAdoptante: 0, noLeidosPorRefugio: 1, creadaEn: hoursAgo(24),
    perroNombre: 'Churro', perroFoto: '/assets/dogs/dog7.jpg',
    refugioNombre: 'Patitas Libres', refugioLogo: '/assets/shelters/shelter2-logo.jpg',
    adoptanteNombre: 'Laura Soto',
  },
  {
    id: 4, perroId: 22, adoptanteId: 104, refugioId: SHELTER_IDS.ESPERANZA,
    ultimoMensaje: 'Muchas gracias por la información.', ultimoMensajeEn: hoursAgo(20),
    noLeidosPorAdoptante: 0, noLeidosPorRefugio: 0, creadaEn: hoursAgo(44),
    perroNombre: 'Gala', perroFoto: '/assets/dogs/dog6.jpg',
    refugioNombre: 'Refugio Esperanza', refugioLogo: '/assets/shelters/shelter4-logo.jpg',
    adoptanteNombre: 'María Hernández',
  },
]

// ─── Mensajes por conversación ────────────────────────────────────────────────

export const MOCK_MESSAGES: Record<number, Message[]> = {

  // Conversación 1 — Ana & Huellitas sobre Max (12 mensajes)
  1: [
    { id: 1, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Hola, envié mi solicitud para adoptar a Max. ¿Cuándo me dan respuesta?',
      leidoEn: hoursAgo(35), creadoEn: hoursAgo(36) },
    { id: 2, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Hola Ana, bienvenida. Recibimos tu solicitud y la estamos revisando. Usualmente tardamos 2–3 días hábiles.',
      leidoEn: hoursAgo(34), creadoEn: hoursAgo(35) },
    { id: 3, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Perfecto, gracias. Tengo una duda: ¿Max se lleva bien con perros machos? Mi vecino tiene uno.',
      leidoEn: hoursAgo(33), creadoEn: hoursAgo(34) },
    { id: 4, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Max convive con todos los perros del refugio sin problema. Es muy sociable. No debería haber issue con tu vecino.',
      leidoEn: hoursAgo(32), creadoEn: hoursAgo(33) },
    { id: 5, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: '¡Qué bueno! También quería preguntar sobre su alimentación actual, ¿qué croqueta usa?',
      leidoEn: hoursAgo(20), creadoEn: hoursAgo(28) },
    { id: 6, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Actualmente le damos Royal Canin Medium Adult, 300g en la mañana y 300g en la tarde. Le encanta y está en su peso ideal.',
      leidoEn: hoursAgo(19), creadoEn: hoursAgo(20) },
    { id: 7, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Anotado. ¿Tiene algún juguete favorito o algo que le ayude en el proceso de adaptación?',
      leidoEn: hoursAgo(10), creadoEn: hoursAgo(15) },
    { id: 8, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Le fascina una pelota naranja que tiene aquí. Te la vamos a dar con él para que tenga algo familiar en su nuevo hogar. 🐾',
      leidoEn: hoursAgo(8), creadoEn: hoursAgo(10) },
    { id: 9, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Eso es muy lindo, gracias. ¿Cuándo podría venir a conocerlo?',
      leidoEn: hoursAgo(5), creadoEn: hoursAgo(6) },
    { id: 10, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Primero debemos aprobar tu solicitud. Revisando todo, tu perfil se ve muy bien. ¿Puedes venir el sábado a las 11am?',
      leidoEn: hoursAgo(3), creadoEn: hoursAgo(4) },
    { id: 11, conversationId: 1, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: '¡Claro que sí! Estaré ahí. ¿Cuál es la dirección exacta del refugio?',
      leidoEn: hoursAgo(2), creadoEn: hoursAgo(2) },
    { id: 12, conversationId: 1, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Huellitas MX', senderAvatar: '/assets/shelters/shelter1-logo.jpg',
      texto: 'Perfecto, el sábado a las 11am entonces.',
      leidoEn: hoursAgo(1), creadoEn: hoursAgo(1) },
  ],

  // Conversación 2 — Ana & Refugio Esperanza sobre Kira (10 mensajes)
  2: [
    { id: 20, conversationId: 2, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Hola, acabo de enviar mi solicitud para Kira. ¡Me parece perfecta!',
      leidoEn: hoursAgo(47), creadoEn: hoursAgo(48) },
    { id: 21, conversationId: 2, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Hola Ana, gracias por interesarte en Kira. La revisaremos pronto.',
      leidoEn: hoursAgo(45), creadoEn: hoursAgo(46) },
    { id: 22, conversationId: 2, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: '¿Kira está bien adaptada a vivir en departamento?',
      leidoEn: hoursAgo(40), creadoEn: hoursAgo(42) },
    { id: 23, conversationId: 2, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Sí, Kira es muy adaptable. Solo necesita al menos 2 paseos al día de 30 min cada uno. En departamento funciona muy bien.',
      leidoEn: hoursAgo(38), creadoEn: hoursAgo(39) },
    { id: 24, conversationId: 2, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Eso es totalmente manejable para mí. Trabajo desde casa así que estoy disponible todo el día.',
      leidoEn: hoursAgo(30), creadoEn: hoursAgo(35) },
    { id: 25, conversationId: 2, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: '¡Eso es ideal para Kira! Le va a encantar tener compañía todo el día. Tenemos tu solicitud en revisión.',
      leidoEn: hoursAgo(20), creadoEn: hoursAgo(25) },
    { id: 26, conversationId: 2, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: '¿Hay algo específico que deba preparar en casa antes de recibirla?',
      leidoEn: hoursAgo(10), creadoEn: hoursAgo(12) },
    { id: 27, conversationId: 2, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Te recomendamos: cama cómoda, comedero y bebedero de acero, correa y collar ajustable, y algunos juguetes de mordida. También asegura cables y objetos pequeños a su alcance.',
      leidoEn: undefined, creadoEn: hoursAgo(7) },
    { id: 28, conversationId: 2, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Ah, y si puedes, consigue un tapete antiderrapante para la entrada. Los pisos de madera pueden ser difíciles para ella al principio.',
      leidoEn: undefined, creadoEn: hoursAgo(6) },
    { id: 29, conversationId: 2, senderId: ADOPTANTE_ID, senderRole: 'applicant',
      senderNombre: 'Ana García', senderAvatar: '/assets/avatars/avatar1.png',
      texto: 'Entiendo, tomaré en cuenta lo que me dijiste.',
      leidoEn: hoursAgo(5), creadoEn: hoursAgo(5) },
  ],

  // Conversación 3 — Laura & Patitas sobre Churro (8 mensajes)
  3: [
    { id: 40, conversationId: 3, senderId: 103, senderRole: 'applicant',
      senderNombre: 'Laura Soto', texto: 'Hola! Me interesa mucho Churro.',
      leidoEn: hoursAgo(23), creadoEn: hoursAgo(24) },
    { id: 41, conversationId: 3, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Patitas Libres', senderAvatar: '/assets/shelters/shelter2-logo.jpg',
      texto: 'Hola Laura, Churro está disponible. ¿Tienes experiencia con Salchichas?',
      leidoEn: hoursAgo(22), creadoEn: hoursAgo(22) },
    { id: 42, conversationId: 3, senderId: 103, senderRole: 'applicant',
      senderNombre: 'Laura Soto', texto: 'No específicamente, pero sí tengo experiencia con perros pequeños.',
      leidoEn: hoursAgo(20), creadoEn: hoursAgo(21) },
    { id: 43, conversationId: 3, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Patitas Libres', senderAvatar: '/assets/shelters/shelter2-logo.jpg',
      texto: 'Los Salchichas tienen columna vertebral delicada. No deben saltar de muebles altos ni subir escaleras frecuentemente.',
      leidoEn: hoursAgo(18), creadoEn: hoursAgo(19) },
    { id: 44, conversationId: 3, senderId: 103, senderRole: 'applicant',
      senderNombre: 'Laura Soto', texto: 'No sabía eso, gracias por la info. Vivo en planta baja así que no hay escaleras.',
      leidoEn: hoursAgo(15), creadoEn: hoursAgo(16) },
    { id: 45, conversationId: 3, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Patitas Libres', senderAvatar: '/assets/shelters/shelter2-logo.jpg',
      texto: '¡Perfecto! Eso es ideal. Churro necesita también una rampa pequeña para subir al sofá si le permites.',
      leidoEn: hoursAgo(13), creadoEn: hoursAgo(14) },
    { id: 46, conversationId: 3, senderId: 103, senderRole: 'applicant',
      senderNombre: 'Laura Soto', texto: 'Claro que sí, compraré una. ¿Y su esquema de vacunas está completo?',
      leidoEn: hoursAgo(12), creadoEn: hoursAgo(12) },
    { id: 47, conversationId: 3, senderId: 103, senderRole: 'applicant',
      senderNombre: 'Laura Soto', texto: '¿Pueden enviarme más fotos de Churro?',
      leidoEn: undefined, creadoEn: hoursAgo(12) },
  ],

  // Conversación 4 — María & Esperanza sobre Gala (9 mensajes)
  4: [
    { id: 60, conversationId: 4, senderId: 104, senderRole: 'applicant',
      senderNombre: 'María Hernández', texto: 'Buenas tardes, mi solicitud es para Gala. Tengo 3 niños.',
      leidoEn: hoursAgo(43), creadoEn: hoursAgo(44) },
    { id: 61, conversationId: 4, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Hola María, Gala es excelente con niños. ¿Qué edades tienen?',
      leidoEn: hoursAgo(42), creadoEn: hoursAgo(42) },
    { id: 62, conversationId: 4, senderId: 104, senderRole: 'applicant',
      senderNombre: 'María Hernández', texto: '5, 8 y 12 años. Todos mueren de ganas de tener un perro.',
      leidoEn: hoursAgo(40), creadoEn: hoursAgo(41) },
    { id: 63, conversationId: 4, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Son edades ideales. Gala ya convivió con niños en el refugio y fue pacientísima. Le encantará tener a esos tres.',
      leidoEn: hoursAgo(38), creadoEn: hoursAgo(39) },
    { id: 64, conversationId: 4, senderId: 104, senderRole: 'applicant',
      senderNombre: 'María Hernández', texto: 'Mi hijo mayor quiere entrenarla. ¿Ya sabe órdenes básicas?',
      leidoEn: hoursAgo(30), creadoEn: hoursAgo(32) },
    { id: 65, conversationId: 4, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Sabe: sentada, quieta, aquí y dame la pata. Es muy inteligente y aprende rápido. Con constancia su hijo podrá enseñarle mucho más.',
      leidoEn: hoursAgo(25), creadoEn: hoursAgo(27) },
    { id: 66, conversationId: 4, senderId: 104, senderRole: 'applicant',
      senderNombre: 'María Hernández', texto: '¡Qué bien! ¿Cuándo podríamos ir a conocerla?',
      leidoEn: hoursAgo(22), creadoEn: hoursAgo(23) },
    { id: 67, conversationId: 4, senderId: SHELTER_USER_ID, senderRole: 'shelter',
      senderNombre: 'Refugio Esperanza', senderAvatar: '/assets/shelters/shelter4-logo.jpg',
      texto: 'Esta semana tenemos visitas jueves y viernes de 10am a 2pm. ¿Alguno les funciona?',
      leidoEn: hoursAgo(21), creadoEn: hoursAgo(21) },
    { id: 68, conversationId: 4, senderId: 104, senderRole: 'applicant',
      senderNombre: 'María Hernández', texto: 'Muchas gracias por la información.',
      leidoEn: hoursAgo(20), creadoEn: hoursAgo(20) },
  ],
}

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getConversationsByAdoptante = (adoptanteId: number): Conversation[] =>
  MOCK_CONVERSATIONS.filter(c => c.adoptanteId === adoptanteId)

export const getConversationsByShelterId = (refugioId: number): Conversation[] =>
  MOCK_CONVERSATIONS.filter(c => c.refugioId === refugioId)

export const getMessagesByConversation = (conversationId: number): Message[] =>
  MOCK_MESSAGES[conversationId] ?? []
