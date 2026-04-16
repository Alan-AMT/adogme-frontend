// modules/shared/mockData/adoptions.mock.ts
// 12 solicitudes en estados variados con formulario completo e historial

import type { AdoptionRequest, AdoptionRequestListItem } from '../domain/AdoptionRequest'
import { SHELTER_IDS } from './shelters.mock'

const ADOPTANTE_ID = "101" // Ana García

export const MOCK_ADOPTION_REQUESTS: AdoptionRequest[] = [

  // ── 1. Pendiente (recién enviada) ────────────────────────────────────────
  {
    id: "1001",
    adoptanteId: ADOPTANTE_ID,
    perroId: "1",           // Max — Labrador
    refugioId: SHELTER_IDS.HUELLITAS,
    fecha: '2025-01-20',
    estado: 'pending',
    comentarios: 'Me enamoré de Max desde que lo vi. Tengo jardín y mucho tiempo libre.',
    formulario: {
      motivacion: 'Siempre quise un Labrador. Max me recuerda a mi perro de infancia.',
      experienciaPrevia: true,
      descripcionExperiencia: 'Tuve un Golden Retriever por 12 años.',
      vivienda: {
        tipo: 'casa', esPropietario: true, tieneJardin: true,
        tamanoJardinM2: 40, tieneRejaOCerca: true, fotosVivienda: [],
      },
      horasEnCasa: 8, actividadFisica: 'activo',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 1, solicitudId: "1001", estadoAnterior: 'pending', estadoNuevo: 'pending',
        cambiadoPor: ADOPTANTE_ID, rol: 'shelter', fecha: '2025-01-20T10:00:00Z' },
    ],
    perroNombre: 'Max', perroFoto: '/assets/dogs/dog1.jpg', perroSlug: 'max',
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Ana García', adoptanteCorreo: 'ana@test.com',
  },

  // ── 2. En revisión ───────────────────────────────────────────────────────
  {
    id: "1002",
    adoptanteId: ADOPTANTE_ID,
    perroId: "18",          // Kira — Mestizo
    refugioId: SHELTER_IDS.ESPERANZA,
    fecha: '2025-01-10',
    estado: 'in_review',
    comentarios: 'Kira parece perfecta para mi departamento.',
    formulario: {
      motivacion: 'Vivo sola y quiero compañía. Kira parece tranquila y cariñosa.',
      experienciaPrevia: false,
      vivienda: {
        tipo: 'departamento', esPropietario: false, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [], permiteAnimales: true,
      },
      horasEnCasa: 10, actividadFisica: 'moderado',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 2, solicitudId: "1002", estadoAnterior: 'pending', estadoNuevo: 'in_review',
        cambiadoPor: "201", rol: 'shelter', comentario: 'Revisando documentos.',
        fecha: '2025-01-12T09:30:00Z' },
    ],
    perroNombre: 'Kira', perroFoto: '/assets/dogs/dog4.jpg', perroSlug: 'kira',
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Ana García', adoptanteCorreo: 'ana@test.com',
  },

  // ── 3. Aprobada ──────────────────────────────────────────────────────────
  {
    id: "1003",
    adoptanteId: ADOPTANTE_ID,
    perroId: "7",           // Churro — Salchicha
    refugioId: SHELTER_IDS.PATITAS,
    fecha: '2024-12-05',
    estado: 'approved',
    comentarios: 'Churro es exactamente lo que buscaba.',
    formulario: {
      motivacion: 'Quiero un perro pequeño que pueda llevar a todos lados.',
      experienciaPrevia: true,
      descripcionExperiencia: 'Tuve una Salchicha por 8 años.',
      vivienda: {
        tipo: 'departamento', esPropietario: true, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [],
      },
      horasEnCasa: 12, actividadFisica: 'moderado',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 3, solicitudId: "1003", estadoAnterior: 'pending', estadoNuevo: 'in_review',
        cambiadoPor: "201", rol: 'shelter', fecha: '2024-12-07T10:00:00Z' },
      { id: 4, solicitudId: "1003", estadoAnterior: 'in_review', estadoNuevo: 'approved',
        cambiadoPor: "201", rol: 'shelter', comentario: '¡Excelente perfil! Aprobada.',
        fecha: '2024-12-10T14:00:00Z' },
    ],
    perroNombre: 'Churro', perroFoto: '/assets/dogs/dog7.jpg', perroSlug: 'churro',
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Ana García', adoptanteCorreo: 'ana@test.com',
  },

  // ── 4. Rechazada ─────────────────────────────────────────────────────────
  {
    id: "1004",
    adoptanteId: ADOPTANTE_ID,
    perroId: "3",           // Thor — Husky
    refugioId: SHELTER_IDS.HUELLITAS,
    fecha: '2024-11-20',
    estado: 'rejected',
    comentarios: 'Thor me llamó la atención por sus ojos azules.',
    formulario: {
      motivacion: 'Siempre quise un Husky.',
      experienciaPrevia: false,
      vivienda: {
        tipo: 'departamento', esPropietario: false, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [], permiteAnimales: true,
      },
      horasEnCasa: 6, actividadFisica: 'sedentario',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 5, solicitudId: "1004", estadoAnterior: 'pending', estadoNuevo: 'rejected',
        cambiadoPor: "201", rol: 'shelter',
        comentario: 'Thor necesita dueño con experiencia en la raza y espacio para ejercicio intenso.',
        fecha: '2024-11-22T11:00:00Z' },
    ],
    perroNombre: 'Thor', perroFoto: '/assets/dogs/dog3.jpg', perroSlug: 'thor',
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'Ana García', adoptanteCorreo: 'ana@test.com',
  },

  // ── 5. Cancelada ─────────────────────────────────────────────────────────
  {
    id: "1005",
    adoptanteId: ADOPTANTE_ID,
    perroId: "8",           // Nala — Bulldog
    refugioId: SHELTER_IDS.PATITAS,
    fecha: '2024-10-15',
    estado: 'cancelled',
    comentarios: 'Me interesa Nala.',
    formulario: {
      motivacion: 'Quiero un perro tranquilo.',
      experienciaPrevia: false,
      vivienda: {
        tipo: 'casa', esPropietario: true, tieneJardin: false,
        tieneRejaOCerca: true, fotosVivienda: [],
      },
      horasEnCasa: 9, actividadFisica: 'moderado',
      conviveConNinos: true, edadesNinos: [8, 11], conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 6, solicitudId: "1005", estadoAnterior: 'pending', estadoNuevo: 'cancelled',
        cambiadoPor: ADOPTANTE_ID, rol: 'shelter',
        comentario: 'El adoptante canceló por cambio de situación personal.',
        fecha: '2024-10-18T08:00:00Z' },
    ],
    perroNombre: 'Nala', perroFoto: '/assets/dogs/dog8.jpg', perroSlug: 'nala',
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Ana García', adoptanteCorreo: 'ana@test.com',
  },

  // ── 6–12. Solicitudes de otros adoptantes (para dashboard del refugio) ───

  {
    id: "2001", adoptanteId: "102", perroId: "14", refugioId: SHELTER_IDS.AMIGOS,
    fecha: '2025-01-18', estado: 'pending', comentarios: 'Fiona parece increíble.',
    formulario: {
      motivacion: 'Corro maratones, necesito un compañero de entrenamiento.',
      experienciaPrevia: true, descripcionExperiencia: 'Tuve un Malamute.',
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: true,
        tamanoJardinM2: 80, tieneRejaOCerca: true, fotosVivienda: [] },
      horasEnCasa: 5, actividadFisica: 'muy_activo',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [],
    perroNombre: 'Fiona', perroFoto: '/assets/dogs/dog3.jpg',
    refugioNombre: 'Amigos de 4 Patas', adoptanteNombre: 'Carlos Méndez',
  },
  {
    id: "2002", adoptanteId: "103", perroId: "22", refugioId: SHELTER_IDS.ESPERANZA,
    fecha: '2025-01-16', estado: 'in_review', comentarios: 'Gala es perfecta para mi familia.',
    formulario: {
      motivacion: 'Mis hijos llevan años pidiendo un perro. Gala es perfecta.',
      experienciaPrevia: true, descripcionExperiencia: 'Un Labrador por 10 años.',
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: true,
        tamanoJardinM2: 60, tieneRejaOCerca: true, fotosVivienda: [] },
      horasEnCasa: 7, actividadFisica: 'activo',
      conviveConNinos: true, edadesNinos: [5, 8, 12], conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 10, solicitudId: "2002", estadoAnterior: 'pending', estadoNuevo: 'in_review',
        cambiadoPor: "201", rol: 'shelter', fecha: '2025-01-17T09:00:00Z' },
    ],
    perroNombre: 'Gala', perroFoto: '/assets/dogs/dog6.jpg',
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Laura Soto',
  },
  {
    id: "2003", adoptanteId: "104", perroId: "4", refugioId: SHELTER_IDS.HUELLITAS,
    fecha: '2025-01-14', estado: 'approved', comentarios: 'Coco necesita un hogar y yo necesito compañía.',
    formulario: {
      motivacion: 'Soy adulta mayor, busco compañía tranquila.',
      experienciaPrevia: true,
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [] },
      horasEnCasa: 20, actividadFisica: 'sedentario',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 11, solicitudId: "2003", estadoAnterior: 'pending', estadoNuevo: 'approved',
        cambiadoPor: "201", rol: 'shelter', comentario: 'Perfil ideal para Coco.',
        fecha: '2025-01-16T15:00:00Z' },
    ],
    perroNombre: 'Coco', perroFoto: '/assets/dogs/dog4.jpg',
    refugioNombre: 'Huellitas MX', adoptanteNombre: 'María Hernández',
  },
  {
    id: "2004", adoptanteId: "105", perroId: "25", refugioId: SHELTER_IDS.SEGUNDA,
    fecha: '2025-01-08', estado: 'in_review', comentarios: 'Duke a pesar de su displasia me encanta.',
    formulario: {
      motivacion: 'Me identifico con Duke, también tengo una lesión crónica.',
      experienciaPrevia: true,
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: true,
        tamanoJardinM2: 30, tieneRejaOCerca: true, fotosVivienda: [] },
      horasEnCasa: 11, actividadFisica: 'moderado',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [
      { id: 12, solicitudId: "2004", estadoAnterior: 'pending', estadoNuevo: 'in_review',
        cambiadoPor: "201", rol: 'shelter', fecha: '2025-01-10T10:00:00Z' },
    ],
    perroNombre: 'Duke', perroFoto: '/assets/dogs/dog1.jpg',
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'Roberto Díaz',
  },
  {
    id: "2005", adoptanteId: "106", perroId: "28", refugioId: SHELTER_IDS.SEGUNDA,
    fecha: '2025-01-05', estado: 'pending', comentarios: 'Manchas lleva demasiado tiempo esperando.',
    formulario: {
      motivacion: 'Vi que Manchas lleva 3 años en el refugio. Eso me rompió el corazón.',
      experienciaPrevia: false,
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: true,
        tamanoJardinM2: 20, tieneRejaOCerca: true, fotosVivienda: [] },
      horasEnCasa: 8, actividadFisica: 'moderado',
      conviveConNinos: false, conviveConMascotas: true, descripcionMascotas: 'Un gato adulto tranquilo.',
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [],
    perroNombre: 'Manchas', perroFoto: '/assets/dogs/dog4.jpg',
    refugioNombre: 'Segunda Oportunidad', adoptanteNombre: 'Sofía Torres',
  },
  {
    id: "2006", adoptanteId: "107", perroId: "9", refugioId: SHELTER_IDS.PATITAS,
    fecha: '2024-12-28', estado: 'rejected', comentarios: 'Lobo me llamó la atención.',
    formulario: {
      motivacion: 'Quiero un perro grande que acompañe a mis hijos pequeños.',
      experienciaPrevia: false,
      vivienda: { tipo: 'departamento', esPropietario: false, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [], permiteAnimales: true },
      horasEnCasa: 4, actividadFisica: 'sedentario',
      conviveConNinos: true, edadesNinos: [2, 4], conviveConMascotas: false,
      aceptaVisitaPrevia: false, aceptaTerminos: true,
    },
    historial: [
      { id: 13, solicitudId: "2006", estadoAnterior: 'pending', estadoNuevo: 'rejected',
        cambiadoPor: "201", rol: 'shelter',
        comentario: 'Lobo no es apto para niños pequeños. Además necesita espacio para caminar.',
        fecha: '2024-12-30T12:00:00Z' },
    ],
    perroNombre: 'Lobo', perroFoto: '/assets/dogs/dog4.jpg',
    refugioNombre: 'Patitas Libres', adoptanteNombre: 'Pedro Ramírez',
  },
  {
    id: "2007", adoptanteId: "108", perroId: "20", refugioId: SHELTER_IDS.ESPERANZA,
    fecha: '2025-01-22', estado: 'pending', comentarios: 'Sasha es preciosa.',
    formulario: {
      motivacion: 'Soy fotógrafo, quiero un perro fotogénico para mis paseos.',
      experienciaPrevia: true, descripcionExperiencia: 'Siempre tuve perros grandes.',
      vivienda: { tipo: 'casa', esPropietario: true, tieneJardin: false,
        tieneRejaOCerca: false, fotosVivienda: [] },
      horasEnCasa: 6, actividadFisica: 'activo',
      conviveConNinos: false, conviveConMascotas: false,
      aceptaVisitaPrevia: true, aceptaTerminos: true,
    },
    historial: [],
    perroNombre: 'Sasha', perroFoto: '/assets/dogs/dog3.jpg',
    refugioNombre: 'Refugio Esperanza', adoptanteNombre: 'Javier Morales',
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getRequestsByAdoptante = (adoptanteId: string): AdoptionRequest[] =>
  MOCK_ADOPTION_REQUESTS.filter(r => r.adoptanteId === adoptanteId)

export const getRequestsByShelterId = (refugioId: string): AdoptionRequest[] =>
  MOCK_ADOPTION_REQUESTS.filter(r => r.refugioId === refugioId)

export const getRequestById = (id: string): AdoptionRequest | undefined =>
  MOCK_ADOPTION_REQUESTS.find(r => r.id === id)

export const MOCK_REQUESTS_LIST: AdoptionRequestListItem[] = MOCK_ADOPTION_REQUESTS.map(r => ({
  id: r.id, adoptanteId: r.adoptanteId, perroId: r.perroId, refugioId: r.refugioId,
  fecha: r.fecha, estado: r.estado, perroNombre: r.perroNombre,
  perroFoto: r.perroFoto, refugioNombre: r.refugioNombre, adoptanteNombre: r.adoptanteNombre,
}))
