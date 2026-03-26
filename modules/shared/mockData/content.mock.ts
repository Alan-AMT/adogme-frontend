// modules/shared/mockData/content.mock.ts
// Contenido estático de la plataforma: proceso de adopción, FAQs del chatbot y estadísticas

// ─── Proceso de adopción ──────────────────────────────────────────────────────

export interface AdoptionStep {
  numero: number
  titulo: string
  descripcion: string
  icono: string
  documentos: string[]
  duracionEstimada: string
}

export const MOCK_ADOPTION_PROCESS: AdoptionStep[] = [
  {
    numero: 1,
    titulo: 'Encuentra tu compañero ideal',
    descripcion: 'Explora nuestro catálogo de perros disponibles. Usa los filtros para encontrar el tamaño, energía y características que mejor se adapten a tu estilo de vida. También puedes hacer el quiz de compatibilidad para recibir recomendaciones personalizadas.',
    icono: 'search',
    documentos: [],
    duracionEstimada: 'Sin límite de tiempo',
  },
  {
    numero: 2,
    titulo: 'Crea tu cuenta y envía tu solicitud',
    descripcion: 'Regístrate en la plataforma y completa el formulario de adopción. Incluye información sobre tu hogar, estilo de vida y experiencia con mascotas. Ser honesto aumenta las probabilidades de un match exitoso.',
    icono: 'assignment',
    documentos: [
      'Identificación oficial vigente (INE o pasaporte)',
      'Comprobante de domicilio (no mayor a 3 meses)',
      'Fotos del espacio donde vivirá el perro',
    ],
    duracionEstimada: '15–30 minutos',
  },
  {
    numero: 3,
    titulo: 'El refugio revisa tu solicitud',
    descripcion: 'El equipo del refugio evalúa tu perfil y lo compara con las necesidades del perro. Pueden contactarte por mensaje para resolver dudas. Este proceso es riguroso porque queremos garantizar adopciones permanentes.',
    icono: 'manage_search',
    documentos: [],
    duracionEstimada: '2–5 días hábiles',
  },
  {
    numero: 4,
    titulo: 'Visita de conocimiento',
    descripcion: 'Si tu solicitud es aprobada, coordinarás una visita al refugio para conocer al perro en persona. En algunos casos, el refugio también puede hacer una visita domiciliaria para asegurarse de que el ambiente es adecuado.',
    icono: 'home_pin',
    documentos: [
      'Identificación oficial (la misma del formulario)',
    ],
    duracionEstimada: '1–2 horas',
  },
  {
    numero: 5,
    titulo: '¡Bienvenido a casa!',
    descripcion: 'Una vez aprobada la adopción, firmas el contrato de adopción responsable y te llevas a tu nuevo compañero. El refugio te dará su historial médico, dieta actual y recomendaciones de adaptación. Recibirás seguimiento durante los primeros 30 días.',
    icono: 'celebration',
    documentos: [
      'Contrato de adopción (lo proporciona el refugio)',
      'Identificación oficial',
      'Portafolios o transportín para llevar al perro',
    ],
    duracionEstimada: '1 hora',
  },
]

// ─── FAQs del Chatbot ─────────────────────────────────────────────────────────

export interface ChatbotFAQ {
  id: number
  pregunta: string
  respuesta: string
  keywords: string[]
  categoria: 'adopcion' | 'requisitos' | 'proceso' | 'cuidados' | 'plataforma' | 'donaciones'
}

export const MOCK_CHATBOT_FAQS: ChatbotFAQ[] = [
  { id: 1, categoria: 'adopcion',
    pregunta: '¿Cuánto cuesta adoptar un perro?',
    respuesta: 'La adopción en sí es gratuita. Sin embargo, algunos refugios cobran una cuota simbólica de $200–$500 MXN que cubre parte de los gastos veterinarios del perro (vacunas, desparasitación, esterilización). Esta información se indica en el perfil de cada refugio.',
    keywords: ['costo', 'precio', 'pagar', 'cuánto', 'gratis', 'cobran'] },
  { id: 2, categoria: 'requisitos',
    pregunta: '¿Qué documentos necesito para adoptar?',
    respuesta: 'Generalmente necesitas: (1) Identificación oficial vigente, (2) Comprobante de domicilio reciente, y (3) Fotos del espacio donde vivirá el perro. Algunos refugios pueden pedir referencias adicionales. Consulta los requisitos específicos en el perfil del refugio.',
    keywords: ['documentos', 'requisitos', 'papeles', 'identificación', 'INE', 'comprobante'] },
  { id: 3, categoria: 'proceso',
    pregunta: '¿Cuánto tiempo tarda el proceso de adopción?',
    respuesta: 'El proceso completo dura entre 1 y 3 semanas. La revisión de la solicitud toma 2–5 días hábiles. Si es aprobada, coordinas la visita y firma del contrato. El tiempo varía según el refugio y la demanda.',
    keywords: ['tiempo', 'cuánto tarda', 'proceso', 'demora', 'espera', 'días'] },
  { id: 4, categoria: 'requisitos',
    pregunta: '¿Puedo adoptar si vivo en departamento?',
    respuesta: 'Sí, muchos perros son perfectos para departamento. Los de tamaño pequeño o mediano con energía baja o moderada se adaptan muy bien. Lo importante es darles suficiente ejercicio diario y enriquecimiento mental. Usa nuestros filtros para encontrar perros compatibles con tu espacio.',
    keywords: ['departamento', 'apartamento', 'espacio', 'pequeño', 'ciudad'] },
  { id: 5, categoria: 'cuidados',
    pregunta: '¿Qué debo preparar en casa antes de adoptar?',
    respuesta: 'Antes de la llegada: cama o colchoneta, comedero y bebedero (preferible acero inoxidable), collar y correa, transportín, juguetes seguros, y asegura cables y objetos pequeños. También recomienda tener ya elegido un veterinario de confianza.',
    keywords: ['preparar', 'casa', 'necesito', 'comprar', 'antes', 'llegue'] },
  { id: 6, categoria: 'cuidados',
    pregunta: '¿Cómo adaptar al perro a su nuevo hogar?',
    respuesta: 'Los primeros días son clave. Dale un espacio propio tranquilo, no lo abrumes con visitas. Mantén su dieta anterior al menos 1–2 semanas antes de cambiarla. Establece rutinas de paseo y comida desde el principio. Es normal que esté nervioso o reservado los primeros días.',
    keywords: ['adaptación', 'adaptar', 'nervioso', 'llegó', 'primeros días', 'nuevo hogar'] },
  { id: 7, categoria: 'adopcion',
    pregunta: '¿Puedo adoptar si tengo otros animales en casa?',
    respuesta: 'Sí, muchos perros conviven perfectamente con otros animales. En el perfil de cada perro encontrarás si es apto con otros perros, gatos u otras mascotas. Siempre se recomienda una presentación gradual y supervisada.',
    keywords: ['otros animales', 'gato', 'mascotas', 'convivir', 'otro perro'] },
  { id: 8, categoria: 'adopcion',
    pregunta: '¿Puedo adoptar si tengo niños en casa?',
    respuesta: 'Sí, varios perros de nuestra plataforma son aptos para convivir con niños. Filtra por "apto con niños" y revisa la descripción de cada perro. En general, razas como Golden Retriever, Labrador y muchos mestizos son excelentes con niños.',
    keywords: ['niños', 'hijos', 'bebé', 'familia', 'pequeños', 'infantes'] },
  { id: 9, categoria: 'proceso',
    pregunta: '¿Por qué me rechazaron la solicitud?',
    respuesta: 'Los rechazos no son personales — el refugio busca el mejor match para el perro. Las razones más comunes: el perro necesita experiencia previa con la raza, el espacio no es adecuado, o el estilo de vida no coincide con las necesidades del animal. Puedes intentar con otro perro más compatible con tu perfil.',
    keywords: ['rechazaron', 'rechazo', 'denegada', 'por qué', 'motivo', 'no aprobaron'] },
  { id: 10, categoria: 'plataforma',
    pregunta: '¿Cómo funciona el quiz de compatibilidad?',
    respuesta: 'El quiz toma ~10 minutos. Pregunta sobre tu estilo de vida, espacio, experiencia y preferencias. Con esas respuestas, nuestro algoritmo calcula qué perros tienen mayor compatibilidad contigo y los muestra ordenados por porcentaje de match.',
    keywords: ['quiz', 'cuestionario', 'compatibilidad', 'match', 'recomendaciones'] },
  { id: 11, categoria: 'donaciones',
    pregunta: '¿Cómo puedo donar a un refugio?',
    respuesta: 'En el perfil de cada refugio encontrarás el botón de donación si aceptan. Puedes donar con tarjeta de crédito/débito o PayPal. Tu donación va directamente al refugio y recibirás un comprobante por correo.',
    keywords: ['donar', 'donación', 'ayudar', 'apoyar', 'dinero', 'contribuir'] },
  { id: 12, categoria: 'requisitos',
    pregunta: '¿Hay límite de edad para adoptar?',
    respuesta: 'Debes ser mayor de 18 años. Algunos refugios pueden tener criterios adicionales relacionados con la edad y el tipo de perro (por ejemplo, no dar cachorros a personas mayores solas). Cada refugio tiene sus propias políticas.',
    keywords: ['edad', 'mayor', 'adulto', 'joven', 'menor de edad', 'años'] },
  { id: 13, categoria: 'cuidados',
    pregunta: '¿Qué vacunas debe tener un perro?',
    respuesta: 'Las vacunas esenciales son: Rabia (anual), Parvovirus, Distemper y Hepatitis (combo, refuerzo anual), y Leptospirosis. El perro que adoptes vendrá con su historial médico del refugio. Continúa con un veterinario de tu confianza.',
    keywords: ['vacunas', 'vacunación', 'rabia', 'parvovirus', 'salud', 'veterinario'] },
  { id: 14, categoria: 'plataforma',
    pregunta: '¿Cómo me registro en la plataforma?',
    respuesta: 'Haz clic en "Registrarse" en la esquina superior derecha. Elige si eres adoptante o refugio. Llena el formulario con tus datos básicos. Verificarás tu correo y listo — puedes empezar a explorar y enviar solicitudes.',
    keywords: ['registrar', 'cuenta', 'crear cuenta', 'registro', 'cómo entro', 'login'] },
  { id: 15, categoria: 'adopcion',
    pregunta: '¿Puedo devolver a un perro si no funciona?',
    respuesta: 'Los refugios responsables siempre prefieren que el perro regrese con ellos antes de que sea abandonado. Si la adopción no funciona, contacta al refugio directamente. Nunca abandones al animal — es ilegal y cruel. El refugio te ayudará a encontrar una solución.',
    keywords: ['devolver', 'regresar', 'no funciona', 'problema', 'no puedo', 'abandonar'] },
  { id: 16, categoria: 'cuidados',
    pregunta: '¿Cuánto cuesta mantener un perro?',
    respuesta: 'El costo mensual estimado en México: alimento de calidad ($500–$1,200), veterinario rutinario (consultas, vacunas anuales ~$200/mes promedio), accesorios y juguetes (~$100–$300). Suma $800–$1,700 MXN/mes promedio, sin contar emergencias.',
    keywords: ['costo', 'gasto', 'mantener', 'mensual', 'dinero', 'presupuesto', 'económico'] },
  { id: 17, categoria: 'proceso',
    pregunta: '¿Puedo adoptar desde otra ciudad?',
    respuesta: 'Sí, pero el refugio generalmente requiere al menos una visita presencial. Algunos refugios coordinan transporte del perro si la distancia es razonable, especialmente si ya tienen adoptantes verificados. Contacta directamente al refugio para coordinarlo.',
    keywords: ['otra ciudad', 'lejos', 'distancia', 'viaje', 'estado', 'fuera'] },
  { id: 18, categoria: 'plataforma',
    pregunta: '¿Cómo registro mi refugio en la plataforma?',
    respuesta: 'Ve a "Registrar refugio" y completa el formulario con los datos de tu organización. Un administrador de la plataforma revisará y aprobará tu solicitud en 2–5 días hábiles. Una vez aprobado, podrás publicar perros y gestionar solicitudes.',
    keywords: ['registrar refugio', 'soy refugio', 'organización', 'publicar perros', 'unirme'] },
  { id: 19, categoria: 'cuidados',
    pregunta: '¿Cuándo esterilizar a mi perro?',
    respuesta: 'La esterilización se recomienda entre los 6 y 12 meses de edad para la mayoría de razas. Muchos perros del refugio ya vienen esterilizados. Si no, consulta con tu veterinario el momento ideal según la raza y tamaño.',
    keywords: ['esterilizar', 'castrar', 'operación', 'sterilize', 'ovario', 'testículos'] },
  { id: 20, categoria: 'adopcion',
    pregunta: '¿Qué pasa con los perros senior o con necesidades especiales?',
    respuesta: 'Los perros mayores y con condiciones médicas son los más difíciles de adoptar y los que más necesitan un hogar. Son igual de cariñosos y agradecidos. Requieren más visitas al veterinario pero ofrecen una conexión única. ¿Los considerarías?',
    keywords: ['senior', 'viejo', 'anciano', 'especiales', 'enfermo', 'discapacidad', 'mayor'] },
]

// ─── Estadísticas globales de la plataforma ──────────────────────────────────

export interface GlobalStats {
  adopcionesTotales: number
  refugiosActivos: number
  perrosDisponibles: number
  usuariosRegistrados: number
  adopcionesEsteMes: number
  tasaExito: number          // porcentaje de adopciones exitosas (no devueltas)
  ciudadesCubiertas: number
  promedioTiempoAdopcion: number // días promedio
}

export const MOCK_GLOBAL_STATS: GlobalStats = {
  adopcionesTotales: 2678,
  refugiosActivos: 5,
  perrosDisponibles: 64,
  usuariosRegistrados: 1243,
  adopcionesEsteMes: 47,
  tasaExito: 94,
  ciudadesCubiertas: 12,
  promedioTiempoAdopcion: 8,
}
