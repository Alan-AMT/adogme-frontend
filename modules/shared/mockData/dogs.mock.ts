// modules/shared/mockData/dogs.mock.ts
// 30 perros mock — imágenes en /public/assets/dogs/
// Cada raza usa la misma imagen base (dog1–dog8)

import type { Dog, DogListItem, PersonalityTag, Vaccination } from '../domain/Dog'

// ─── Rutas de imágenes por raza ───────────────────────────────────────────────

const IMGS = {
  labrador:  ['/assets/dogs/dog1.jpg'],
  beagle:    ['/assets/dogs/dog2.jpg'],
  husky:     ['/assets/dogs/dog3.jpg'],
  mestizo:   ['/assets/dogs/dog4.jpg'],
  pitbull:   ['/assets/dogs/dog5.jpg'],
  golden:    ['/assets/dogs/dog6.jpg'],
  salchicha: ['/assets/dogs/dog7.jpg'],
  bulldog:   ['/assets/dogs/dog8.jpg'],
}

// ─── Logos de refugios ────────────────────────────────────────────────────────

const SHELTER_LOGOS: Record<string, string> = {
  'huellitas-mx':       '/assets/shelters/shelter1-logo.jpg',
  'patitas-libres':     '/assets/shelters/shelter2-logo.jpg',
  'amigos-4-patas':     '/assets/shelters/shelter3-logo.jpg',
  'refugio-esperanza':  '/assets/shelters/shelter4-logo.jpg',
  'segunda-oportunidad':'/assets/shelters/shelter5-logo.jpg',
}

// ─── Tags de personalidad reutilizables ──────────────────────────────────────

// icon = nombre de Material Symbol (se renderiza con <DogAttributeIcon iconName={tag.icon} />)
const TAGS: Record<string, PersonalityTag> = {
  jugueton:     { id: 1,  label: 'Juguetón',        icon: 'sports_tennis',    categoria: 'caracter' },
  tranquilo:    { id: 2,  label: 'Tranquilo',        icon: 'self_care',        categoria: 'caracter' },
  protector:    { id: 3,  label: 'Protector',        icon: 'security',         categoria: 'caracter' },
  curioso:      { id: 4,  label: 'Curioso',          icon: 'search',           categoria: 'caracter' },
  leal:         { id: 5,  label: 'Leal',             icon: 'favorite',         categoria: 'caracter' },
  energico:     { id: 6,  label: 'Enérgico',         icon: 'bolt',             categoria: 'actividad' },
  relajado:     { id: 7,  label: 'Relajado',         icon: 'weekend',          categoria: 'actividad' },
  sociable:     { id: 8,  label: 'Sociable',         icon: 'pets',             categoria: 'socialización' },
  timido:       { id: 9,  label: 'Tímido',           icon: 'hide',             categoria: 'socialización' },
  independiente:{ id: 10, label: 'Independiente',    icon: 'flight',           categoria: 'caracter' },
  obediente:    { id: 11, label: 'Obediente',        icon: 'check_circle',     categoria: 'entrenamiento' },
  terco:        { id: 12, label: 'Terco',            icon: 'sentiment_neutral',categoria: 'entrenamiento' },
  cariñoso:     { id: 13, label: 'Cariñoso',         icon: 'volunteer_activism',categoria: 'caracter' },
  activo:       { id: 14, label: 'Activo',           icon: 'directions_run',   categoria: 'actividad' },
  cazador:      { id: 15, label: 'Instinto cazador', icon: 'track_changes',    categoria: 'caracter' },
}

// ─── Vacunas reutilizables ────────────────────────────────────────────────────

const VAC_COMPLETAS: Vaccination[] = [
  { id: 1, nombre: 'Rabia',       fecha: '2024-03-15', proximaDosis: '2025-03-15', verificada: true },
  { id: 2, nombre: 'Parvovirus',  fecha: '2024-03-15', proximaDosis: '2025-03-15', verificada: true },
  { id: 3, nombre: 'Distemper',   fecha: '2024-03-15', proximaDosis: '2025-03-15', verificada: true },
  { id: 4, nombre: 'Leptospirosis', fecha: '2024-06-01', proximaDosis: '2025-06-01', verificada: true },
]

const VAC_INCOMPLETAS: Vaccination[] = [
  { id: 1, nombre: 'Rabia',      fecha: '2024-03-15', proximaDosis: '2025-03-15', verificada: true },
  { id: 2, nombre: 'Parvovirus', fecha: '2024-03-15', verificada: false },
]

const VAC_BASICAS: Vaccination[] = [
  { id: 1, nombre: 'Rabia',     fecha: '2024-08-10', proximaDosis: '2025-08-10', verificada: true },
  { id: 2, nombre: 'Parvovirus',fecha: '2024-08-10', verificada: true },
]

// ─── 30 Perros mock ──────────────────────────────────────────────────────────

export const MOCK_DOGS: Dog[] = [

  // ── REFUGIO 1 — Huellitas MX (shelter-001) ──────────────────────────────

  {
    id: 1, refugioId: 1, nombre: 'Max', edad: 24, raza: 'Labrador',
    tamano: 'grande', nivelEnergia: 'alta', sexo: 'macho',
    salud: 'Vacunado, desparasitado, microchip',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Max es un Labrador cariñoso y lleno de energía. Le encanta correr y jugar con niños. Busca una familia activa con jardín.',
    foto: IMGS.labrador[0], fotos: IMGS.labrador, fechaRegistro: '2024-10-01',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.jugueton, TAGS.energico, TAGS.sociable, TAGS.cariñoso],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: false,
    necesitaJardin: true, pesoKg: 28,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },
  {
    id: 2, refugioId: 1, nombre: 'Luna', edad: 8, raza: 'Beagle',
    tamano: 'mediano', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, desparasitada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Luna es una cachorra curiosa y juguetona. Se lleva bien con todos. Ideal para apartamento si se le hace ejercicio diario.',
    foto: IMGS.beagle[0], fotos: IMGS.beagle, fechaRegistro: '2024-11-15',
    edadCategoria: 'cachorro', vacunas: VAC_BASICAS,
    personalidad: [TAGS.curioso, TAGS.jugueton, TAGS.sociable],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 9,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },
  {
    id: 3, refugioId: 1, nombre: 'Thor', edad: 36, raza: 'Husky Siberiano',
    tamano: 'grande', nivelEnergia: 'muy_alta', sexo: 'macho',
    salud: 'Vacunado, necesita refuerzo de leptospirosis',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Thor es un Husky impresionante, lleno de vida. Necesita mucho ejercicio diario y espacio. No apto para primeros dueños sin experiencia.',
    foto: IMGS.husky[0], fotos: IMGS.husky, fechaRegistro: '2024-09-20',
    edadCategoria: 'joven', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.energico, TAGS.independiente, TAGS.curioso, TAGS.terco],
    castrado: true, microchip: true, aptoNinos: false, aptoPerros: true, aptoGatos: false,
    necesitaJardin: true, pesoKg: 25,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },
  {
    id: 4, refugioId: 1, nombre: 'Coco', edad: 60, raza: 'Mestizo',
    tamano: 'pequeño', nivelEnergia: 'baja', sexo: 'hembra',
    salud: 'Vacunada, desparasitada, esterilizada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Coco es una perrita adulta tranquila y leal. Perfecta para departamento. Lleva 2 años en el refugio esperando un hogar.',
    foto: IMGS.mestizo[0], fotos: IMGS.mestizo, fechaRegistro: '2023-06-10',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.leal, TAGS.cariñoso],
    castrado: true, microchip: false, aptoNinos: true, aptoPerros: false, aptoGatos: true,
    necesitaJardin: false, pesoKg: 7,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },
  {
    id: 5, refugioId: 1, nombre: 'Rocky', edad: 18, raza: 'Pitbull',
    tamano: 'mediano', nivelEnergia: 'alta', sexo: 'macho',
    salud: 'Vacunado, desparasitado',
    estado: 'en_proceso', compatibilidad: 0, descripcion: 'Rocky es un Pitbull muy sociable y cariñoso. Desmiente todos los mitos de su raza. Necesita dueño con experiencia.',
    foto: IMGS.pitbull[0], fotos: IMGS.pitbull, fechaRegistro: '2024-08-05',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.sociable, TAGS.energico, TAGS.leal, TAGS.jugueton],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: false, aptoGatos: false,
    necesitaJardin: false, pesoKg: 20,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },
  {
    id: 6, refugioId: 1, nombre: 'Bella', edad: 48, raza: 'Golden Retriever',
    tamano: 'grande', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, desparasitada, microchip',
    estado: 'adoptado', compatibilidad: 0, descripcion: 'Bella fue adoptada en enero. Una historia de éxito.',
    foto: IMGS.golden[0], fotos: IMGS.golden, fechaRegistro: '2024-01-15',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.cariñoso, TAGS.obediente, TAGS.sociable],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 26,
    refugioNombre: 'Huellitas MX', refugioSlug: 'huellitas-mx', refugioCiudad: 'Gustavo A. Madero', refugioLogo: SHELTER_LOGOS['huellitas-mx'],
  },

  // ── REFUGIO 2 — Patitas Libres (shelter-002) ─────────────────────────────

  {
    id: 7, refugioId: 2, nombre: 'Churro', edad: 6, raza: 'Salchicha',
    tamano: 'pequeño', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Primera vacuna aplicada, pendiente refuerzo',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Churro es un cachorro Salchicha adorable. Pequeño, curioso y muy apegado a las personas. Ideal para departamento.',
    foto: IMGS.salchicha[0], fotos: IMGS.salchicha, fechaRegistro: '2024-12-01',
    edadCategoria: 'cachorro', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.curioso, TAGS.cariñoso, TAGS.jugueton],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 4,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },
  {
    id: 8, refugioId: 2, nombre: 'Nala', edad: 30, raza: 'Bulldog Francés',
    tamano: 'pequeño', nivelEnergia: 'baja', sexo: 'hembra',
    salud: 'Vacunada, desparasitada, problema respiratorio leve',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Nala tiene un soplo leve pero lleva vida normal. Tranquila, perfecta para personas mayores o que trabajan desde casa.',
    foto: IMGS.bulldog[0], fotos: IMGS.bulldog, fechaRegistro: '2024-07-20',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.relajado, TAGS.cariñoso],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 10,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },
  {
    id: 9, refugioId: 2, nombre: 'Lobo', edad: 84, raza: 'Mestizo',
    tamano: 'grande', nivelEnergia: 'baja', sexo: 'macho',
    salud: 'Vacunado, artritis leve en patas traseras',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Lobo es un perro senior tranquilo. Su artritis no le impide dar paseos cortos. Merece pasar sus últimos años en familia.',
    foto: IMGS.mestizo[0], fotos: IMGS.mestizo, fechaRegistro: '2023-03-05',
    edadCategoria: 'senior', vacunas: VAC_BASICAS,
    personalidad: [TAGS.tranquilo, TAGS.leal, TAGS.relajado],
    castrado: true, microchip: false, aptoNinos: false, aptoPerros: true, aptoGatos: false,
    necesitaJardin: false, pesoKg: 30,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },
  {
    id: 10, refugioId: 2, nombre: 'Mia', edad: 12, raza: 'Beagle',
    tamano: 'mediano', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, desparasitada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Mia es una Beagle joven y equilibrada. Sigue muy bien órdenes básicas. Ideal para familia con niños.',
    foto: IMGS.beagle[0], fotos: IMGS.beagle, fechaRegistro: '2024-10-30',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.obediente, TAGS.sociable, TAGS.cariñoso],
    castrado: false, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 11,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },
  {
    id: 11, refugioId: 2, nombre: 'Simba', edad: 15, raza: 'Labrador',
    tamano: 'grande', nivelEnergia: 'alta', sexo: 'macho',
    salud: 'Vacunado, desparasitado',
    estado: 'en_proceso', compatibilidad: 0, descripcion: 'Simba es un Labrador amarillo juvenil, muy activo. Ya tiene solicitud en revisión.',
    foto: IMGS.labrador[0], fotos: IMGS.labrador, fechaRegistro: '2024-11-01',
    edadCategoria: 'joven', vacunas: VAC_BASICAS,
    personalidad: [TAGS.energico, TAGS.jugueton, TAGS.sociable],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: false,
    necesitaJardin: true, pesoKg: 22,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },
  {
    id: 12, refugioId: 2, nombre: 'Canela', edad: 96, raza: 'Golden Retriever',
    tamano: 'grande', nivelEnergia: 'baja', sexo: 'hembra',
    salud: 'Vacunada, hipotiroidismo controlado con medicación',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Canela es una Golden senior dulcísima. Su hipotiroidismo está 100% controlado. Pide una casita tranquila para descansar.',
    foto: IMGS.golden[0], fotos: IMGS.golden, fechaRegistro: '2023-08-12',
    edadCategoria: 'senior', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.cariñoso, TAGS.leal],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 27,
    refugioNombre: 'Patitas Libres', refugioSlug: 'patitas-libres', refugioCiudad: 'Coyoacán', refugioLogo: SHELTER_LOGOS['patitas-libres'],
  },

  // ── REFUGIO 3 — Amigos de 4 Patas (shelter-003) ──────────────────────────

  {
    id: 13, refugioId: 3, nombre: 'Dante', edad: 20, raza: 'Pitbull',
    tamano: 'mediano', nivelEnergia: 'alta', sexo: 'macho',
    salud: 'Vacunado, desparasitado, microchip',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Dante llegó de una situación de abandono. Ha recuperado la confianza con paciencia. Necesita dueño tranquilo y firme.',
    foto: IMGS.pitbull[0], fotos: IMGS.pitbull, fechaRegistro: '2024-06-18',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.timido, TAGS.leal, TAGS.cariñoso],
    castrado: true, microchip: true, aptoNinos: false, aptoPerros: false, aptoGatos: false,
    necesitaJardin: false, pesoKg: 19,
    refugioNombre: 'Amigos de 4 Patas', refugioSlug: 'amigos-4-patas', refugioCiudad: 'Iztapalapa', refugioLogo: SHELTER_LOGOS['amigos-4-patas'],
  },
  {
    id: 14, refugioId: 3, nombre: 'Fiona', edad: 10, raza: 'Husky Siberiano',
    tamano: 'grande', nivelEnergia: 'muy_alta', sexo: 'hembra',
    salud: 'Vacunada, desparasitada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Fiona es una Husky joven con muchísima energía. Necesita ejercicio intenso diario. Hará a alguien muy feliz si puede seguirle el ritmo.',
    foto: IMGS.husky[0], fotos: IMGS.husky, fechaRegistro: '2024-09-05',
    edadCategoria: 'joven', vacunas: VAC_BASICAS,
    personalidad: [TAGS.energico, TAGS.curioso, TAGS.activo, TAGS.independiente],
    castrado: false, microchip: false, aptoNinos: false, aptoPerros: true, aptoGatos: false,
    necesitaJardin: true, pesoKg: 22,
    refugioNombre: 'Amigos de 4 Patas', refugioSlug: 'amigos-4-patas', refugioCiudad: 'Iztapalapa', refugioLogo: SHELTER_LOGOS['amigos-4-patas'],
  },
  {
    id: 15, refugioId: 3, nombre: 'Pepito', edad: 5, raza: 'Salchicha',
    tamano: 'pequeño', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Primera vacuna aplicada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Pepito es un cachorro pequeñísimo con mucha personalidad. Muy vocal y expresivo. Se adapta bien a espacios pequeños.',
    foto: IMGS.salchicha[0], fotos: IMGS.salchicha, fechaRegistro: '2024-12-10',
    edadCategoria: 'cachorro', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.curioso, TAGS.terco, TAGS.jugueton],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: false,
    necesitaJardin: false, pesoKg: 3,
    refugioNombre: 'Amigos de 4 Patas', refugioSlug: 'amigos-4-patas', refugioCiudad: 'Iztapalapa', refugioLogo: SHELTER_LOGOS['amigos-4-patas'],
  },
  {
    id: 16, refugioId: 3, nombre: 'Princesa', edad: 42, raza: 'Bulldog Francés',
    tamano: 'pequeño', nivelEnergia: 'baja', sexo: 'hembra',
    salud: 'Vacunada, esterilizada, microchip',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Princesa es una Bulldog adulta muy tranquila. Ama los sofás y los mimos. Perfecta para personas que buscan compañía sin mucha actividad.',
    foto: IMGS.bulldog[0], fotos: IMGS.bulldog, fechaRegistro: '2024-05-20',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.relajado, TAGS.cariñoso, TAGS.tranquilo],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 12,
    refugioNombre: 'Amigos de 4 Patas', refugioSlug: 'amigos-4-patas', refugioCiudad: 'Iztapalapa', refugioLogo: SHELTER_LOGOS['amigos-4-patas'],
  },
  {
    id: 17, refugioId: 3, nombre: 'Bruno', edad: 55, raza: 'Labrador',
    tamano: 'grande', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Vacunado, desparasitado',
    estado: 'adoptado', compatibilidad: 0, descripcion: 'Bruno fue adoptado por una familia de la CDMX.',
    foto: IMGS.labrador[0], fotos: IMGS.labrador, fechaRegistro: '2023-11-10',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.leal, TAGS.obediente, TAGS.sociable],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 30,
    refugioNombre: 'Amigos de 4 Patas', refugioSlug: 'amigos-4-patas', refugioCiudad: 'Iztapalapa', refugioLogo: SHELTER_LOGOS['amigos-4-patas'],
  },

  // ── REFUGIO 4 — Refugio Esperanza (shelter-004) ───────────────────────────

  {
    id: 18, refugioId: 4, nombre: 'Kira', edad: 14, raza: 'Mestizo',
    tamano: 'mediano', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, desparasitada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Kira es una mestiza equilibrada y cariñosa. Se adapta a casi cualquier hogar. Muy buena con niños mayores.',
    foto: IMGS.mestizo[0], fotos: IMGS.mestizo, fechaRegistro: '2024-10-15',
    edadCategoria: 'joven', vacunas: VAC_BASICAS,
    personalidad: [TAGS.cariñoso, TAGS.sociable, TAGS.obediente],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 14,
    refugioNombre: 'Refugio Esperanza', refugioSlug: 'refugio-esperanza', refugioCiudad: 'Tlalpan', refugioLogo: SHELTER_LOGOS['refugio-esperanza'],
  },
  {
    id: 19, refugioId: 4, nombre: 'Oreo', edad: 3, raza: 'Bulldog Francés',
    tamano: 'pequeño', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Primera vacuna esta semana',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Oreo llegó hace poco, aún muy bebé. Blanco y negro como su nombre. Tierno y dormilón.',
    foto: IMGS.bulldog[0], fotos: IMGS.bulldog, fechaRegistro: '2025-01-02',
    edadCategoria: 'cachorro', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.curioso, TAGS.jugueton],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 2,
    refugioNombre: 'Refugio Esperanza', refugioSlug: 'refugio-esperanza', refugioCiudad: 'Tlalpan', refugioLogo: SHELTER_LOGOS['refugio-esperanza'],
  },
  {
    id: 20, refugioId: 4, nombre: 'Sasha', edad: 72, raza: 'Husky Siberiano',
    tamano: 'grande', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, esterilizada, microchip. Ojos azules',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Sasha ya no tiene la energía de antes. Una Husky adulta que prefiere caminatas tranquilas. Impresionante y noble.',
    foto: IMGS.husky[0], fotos: IMGS.husky, fechaRegistro: '2024-04-22',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.independiente, TAGS.leal],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: false,
    necesitaJardin: false, pesoKg: 24,
    refugioNombre: 'Refugio Esperanza', refugioSlug: 'refugio-esperanza', refugioCiudad: 'Tlalpan', refugioLogo: SHELTER_LOGOS['refugio-esperanza'],
  },
  {
    id: 21, refugioId: 4, nombre: 'Rex', edad: 18, raza: 'Pitbull',
    tamano: 'mediano', nivelEnergia: 'alta', sexo: 'macho',
    salud: 'Vacunado, desparasitado',
    estado: 'en_proceso', compatibilidad: 0, descripcion: 'Rex está en proceso de adopción con una familia de Tlalpan.',
    foto: IMGS.pitbull[0], fotos: IMGS.pitbull, fechaRegistro: '2024-08-30',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.protector, TAGS.leal, TAGS.energico],
    castrado: true, microchip: true, aptoNinos: false, aptoPerros: false, aptoGatos: false,
    necesitaJardin: true, pesoKg: 21,
    refugioNombre: 'Refugio Esperanza', refugioSlug: 'refugio-esperanza', refugioCiudad: 'Tlalpan', refugioLogo: SHELTER_LOGOS['refugio-esperanza'],
  },
  {
    id: 22, refugioId: 4, nombre: 'Gala', edad: 36, raza: 'Golden Retriever',
    tamano: 'grande', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, desparasitada, microchip',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Gala es una Golden clásica: dulce, gentil y paciente. Excelente con niños de cualquier edad.',
    foto: IMGS.golden[0], fotos: IMGS.golden, fechaRegistro: '2024-07-10',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.cariñoso, TAGS.obediente, TAGS.sociable, TAGS.leal],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 25,
    refugioNombre: 'Refugio Esperanza', refugioSlug: 'refugio-esperanza', refugioCiudad: 'Tlalpan', refugioLogo: SHELTER_LOGOS['refugio-esperanza'],
  },

  // ── REFUGIO 5 — Segunda Oportunidad (shelter-005) ────────────────────────

  {
    id: 23, refugioId: 5, nombre: 'Toby', edad: 48, raza: 'Beagle',
    tamano: 'mediano', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Vacunado, desparasitado, microchip',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Toby tiene 4 años y sigue tan curioso como el primer día. Olfato increíble. Le encanta explorar parques.',
    foto: IMGS.beagle[0], fotos: IMGS.beagle, fechaRegistro: '2024-09-12',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.curioso, TAGS.activo, TAGS.cazador, TAGS.sociable],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: false,
    necesitaJardin: false, pesoKg: 12,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 24, refugioId: 5, nombre: 'Nina', edad: 7, raza: 'Mestizo',
    tamano: 'pequeño', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, primera dosis',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Nina es una cachorrota mestiza diminuta. Muy lista, aprende trucos rápido. Primera vacuna hace 2 semanas.',
    foto: IMGS.mestizo[0], fotos: IMGS.mestizo, fechaRegistro: '2024-12-20',
    edadCategoria: 'cachorro', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.curioso, TAGS.jugueton, TAGS.sociable],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 5,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 25, refugioId: 5, nombre: 'Duke', edad: 60, raza: 'Labrador',
    tamano: 'grande', nivelEnergia: 'moderada', sexo: 'macho',
    salud: 'Vacunado, microchip, displasia leve en cadera',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Duke tiene displasia leve controlada. Camina bien con tratamiento mensual. Necesita familia comprometida y paciente.',
    foto: IMGS.labrador[0], fotos: IMGS.labrador, fechaRegistro: '2023-09-01',
    edadCategoria: 'adulto', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.leal, TAGS.obediente],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 29,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 26, refugioId: 5, nombre: 'Panda', edad: 22, raza: 'Bulldog Francés',
    tamano: 'pequeño', nivelEnergia: 'baja', sexo: 'macho',
    salud: 'Vacunado, desparasitado',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Panda es blanco y negro, rechoncho y adorable. Le gustan las siestas largas y los abrazos. Bajo mantenimiento.',
    foto: IMGS.bulldog[0], fotos: IMGS.bulldog, fechaRegistro: '2024-11-08',
    edadCategoria: 'joven', vacunas: VAC_BASICAS,
    personalidad: [TAGS.relajado, TAGS.cariñoso, TAGS.tranquilo],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 11,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 27, refugioId: 5, nombre: 'Alaska', edad: 16, raza: 'Husky Siberiano',
    tamano: 'grande', nivelEnergia: 'muy_alta', sexo: 'hembra',
    salud: 'Vacunada, desparasitada',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Alaska es una Husky jovencísima, pura energía. Ojos celestes hipnóticos. Solo para gente muy activa con experiencia en la raza.',
    foto: IMGS.husky[0], fotos: IMGS.husky, fechaRegistro: '2024-10-25',
    edadCategoria: 'joven', vacunas: VAC_BASICAS,
    personalidad: [TAGS.energico, TAGS.curioso, TAGS.independiente, TAGS.activo],
    castrado: false, microchip: false, aptoNinos: false, aptoPerros: true, aptoGatos: false,
    necesitaJardin: true, pesoKg: 20,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 28, refugioId: 5, nombre: 'Manchas', edad: 108, raza: 'Mestizo',
    tamano: 'mediano', nivelEnergia: 'baja', sexo: 'macho',
    salud: 'Vacunado, microchip, sordera parcial',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Manchas tiene 9 años y sordera parcial. Responde a señas. El más veterano del refugio — lleva 3 años esperando. Merece un hogar.',
    foto: IMGS.mestizo[0], fotos: IMGS.mestizo, fechaRegistro: '2022-04-15',
    edadCategoria: 'senior', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.tranquilo, TAGS.leal, TAGS.relajado],
    castrado: true, microchip: true, aptoNinos: false, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 16,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 29, refugioId: 5, nombre: 'Frida', edad: 28, raza: 'Salchicha',
    tamano: 'pequeño', nivelEnergia: 'moderada', sexo: 'hembra',
    salud: 'Vacunada, esterilizada, microchip',
    estado: 'en_proceso', compatibilidad: 0, descripcion: 'Frida tiene solicitud activa. Pequeña pero con carácter. Le fascina cavar.',
    foto: IMGS.salchicha[0], fotos: IMGS.salchicha, fechaRegistro: '2024-08-18',
    edadCategoria: 'joven', vacunas: VAC_COMPLETAS,
    personalidad: [TAGS.curioso, TAGS.terco, TAGS.cariñoso],
    castrado: true, microchip: true, aptoNinos: true, aptoPerros: false, aptoGatos: true,
    necesitaJardin: false, pesoKg: 6,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
  {
    id: 30, refugioId: 5, nombre: 'Goldie', edad: 4, raza: 'Golden Retriever',
    tamano: 'grande', nivelEnergia: 'alta', sexo: 'hembra',
    salud: 'Primera vacuna aplicada, pendiente esquema completo',
    estado: 'disponible', compatibilidad: 0, descripcion: 'Goldie es la más nueva del refugio. Cachorra Golden que promete ser la mejor amiga de alguien muy afortunado.',
    foto: IMGS.golden[0], fotos: IMGS.golden, fechaRegistro: '2025-01-10',
    edadCategoria: 'cachorro', vacunas: VAC_INCOMPLETAS,
    personalidad: [TAGS.jugueton, TAGS.curioso, TAGS.sociable],
    castrado: false, microchip: false, aptoNinos: true, aptoPerros: true, aptoGatos: true,
    necesitaJardin: false, pesoKg: 8,
    refugioNombre: 'Segunda Oportunidad', refugioSlug: 'segunda-oportunidad', refugioCiudad: 'Benito Juárez', refugioLogo: SHELTER_LOGOS['segunda-oportunidad'],
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getDogById = (id: number): Dog | undefined =>
  MOCK_DOGS.find(d => d.id === id)

export const getDogBySlug = (slug: string): Dog | undefined =>
  MOCK_DOGS.find(d => d.nombre.toLowerCase().replace(/\s+/g, '-') === slug)

export const getDogsByShelterId = (refugioId: number): Dog[] =>
  MOCK_DOGS.filter(d => d.refugioId === refugioId)

export const getAvailableDogs = (): Dog[] =>
  MOCK_DOGS.filter(d => d.estado === 'disponible')

export const getDogListItem = (dog: Dog): DogListItem => ({
  id: dog.id,
  refugioId: dog.refugioId,
  nombre: dog.nombre,
  edad: dog.edad,
  edadCategoria: dog.edadCategoria,
  raza: dog.raza,
  tamano: dog.tamano,
  sexo: dog.sexo,
  nivelEnergia: dog.nivelEnergia,
  estado: dog.estado,
  foto: dog.foto,
  compatibilidad: dog.compatibilidad,
  aptoNinos: dog.aptoNinos,
  aptoPerros: dog.aptoPerros,
  refugioNombre: dog.refugioNombre,
  refugioSlug: dog.refugioSlug,
  refugioCiudad: dog.refugioCiudad,
})

export const MOCK_DOGS_LIST: DogListItem[] = MOCK_DOGS.map(getDogListItem)
