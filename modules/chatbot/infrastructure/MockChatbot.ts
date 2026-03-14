export type ChatMessage = {
  id: number;
  adoptante_id: number;
  pregunta: string;
  respuesta: string;
  fecha: string;
};

export type UIMessage = {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
};

/* ── Respuestas predefinidas por palabras clave ── */
const RESPUESTAS: { keywords: string[]; respuesta: string }[] = [
  {
    keywords: ["adoptar", "adopción", "como adopto", "proceso"],
    respuesta:
      "¡Qué buena decisión! 🐾 El proceso de adopción en aDOGme es sencillo: primero completa tu perfil de adoptante, luego explora nuestro catálogo y elige al perrito que más te llame. Después agenda una visita al refugio y si todo va bien, ¡el perrito es tuyo! ¿Quieres que te ayude a encontrar uno según tu estilo de vida?",
  },
  {
    keywords: ["requisistos", "requisitos", "necesito", "qué necesito"],
    respuesta:
      "Para adoptar necesitas: ser mayor de 18 años, tener una identificación oficial vigente, contar con un espacio adecuado para el perro y comprometerte con su bienestar. ¡No se requiere jardín obligatoriamente! 🏠 ¿Tienes alguna duda sobre algún requisito en específico?",
  },
  {
    keywords: ["costo", "precio", "cuánto", "cuanto", "pago", "gratis"],
    respuesta:
      "La adopción en los refugios asociados a aDOGme no tiene ningun costo de recuperación 💰",
  },
  {
    keywords: ["cachorro", "bebé", "pequeño", "chiquito"],
    respuesta:
      "¡Los cachorros son adorables pero también demandan mucho tiempo y paciencia! 🐶 Tenemos varios cachorros disponibles. Te recomiendo visitar el catálogo y filtrar por 'Cachorro'. ¿Tienes experiencia previa con perros?",
  },
  {
    keywords: ["grande", "tamaño", "raza"],
    respuesta:
      "Tenemos perros de todos los tamaños: pequeños, medianos y grandes. Cada uno tiene su encanto ✨ ¿Tienes alguna preferencia de tamaño o raza en mente? Puedo ayudarte a encontrar el compañero perfecto.",
  },
  {
    keywords: ["gam", "gustavo", "madero", "refugio", "donde", "dónde"],
    respuesta:
      "Trabajamos con refugios en Gustavo A. Madero, Coyoacán e Iztapalapa 📍. Puedes ver todos los refugios disponibles en la sección 'Refugios' de nuestra plataforma. ¿Hay algún refugio cercano a tu colonia?",
  },
  {
    keywords: ["hola", "hi", "buenas", "buenos", "saludos"],
    respuesta:
      "¡Hola! 👋 Soy el asistente de aDOGme. Estoy aquí para ayudarte a encontrar a tu nuevo mejor amigo y resolver todas tus dudas sobre el proceso de adopción. ¿En qué te puedo ayudar hoy?",
  },
  {
    keywords: ["gracias", "thank", "perfecto", "excelente", "genial"],
    respuesta:
      "¡Con mucho gusto! 😊 Recuerda que cada adopción cambia dos vidas: la del perrito y la tuya. Si tienes más preguntas, aquí estaré. ¡Mucho éxito en tu proceso de adopción! 🐾",
  },
  {
    keywords: ["visita", "conocer", "ver", "agenda"],
    respuesta:
      "Para agendar una visita al refugio, primero encuentra al perrito que te interese en el catálogo y da clic en 'Ver perfil'. Desde ahí podrás contactar directamente al refugio para coordinar tu visita. 📅 ¿Ya tienes algún perrito en mente?",
  },
];

const RESPUESTA_DEFAULT =
  "Hmm, no estoy seguro de cómo ayudarte con eso específicamente 🤔. Te recomiendo revisar nuestro catálogo de perros o contactar directamente a uno de nuestros refugios. ¿Puedo ayudarte con algo más sobre el proceso de adopción?";

export function getBotResponse(pregunta: string): string {
  const lower = pregunta.toLowerCase();
  for (const { keywords, respuesta } of RESPUESTAS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return respuesta;
    }
  }
  return RESPUESTA_DEFAULT;
}

/* ── Historial de ejemplo (mock DB) ── */
export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 1,
    adoptante_id: 1,
    pregunta: "Hola, ¿cómo puedo adoptar un perro?",
    respuesta:
      "¡Hola! 👋 El proceso es sencillo: crea tu perfil, elige tu perrito en el catálogo y agenda una visita al refugio.",
    fecha: "2025-02-20",
  },
  {
    id: 2,
    adoptante_id: 1,
    pregunta: "¿Cuánto cuesta la adopción?",
    respuesta:
      "El costo de recuperación varía entre $500 y $1,500 MXN e incluye vacunas, desparasitación y esterilización.",
    fecha: "2025-02-20",
  },
];
