# Analisis de Diagramas — aDOGme Frontend

> Documento de seguimiento: cumplimiento de diagramas de secuencia y casos de uso
> frente a la implementacion actual (mock). Sirve como referencia para la
> integracion real con el backend.
>
> **Estado general:** Mock funcional. Backend pendiente.
> **Rama activa:** `chatbot-design`
> **Ultima revision:** 2026-03-06

---

## Indice

- [DS1 — Encontrar Perro Ideal con IA (Recomendaciones)](#ds1--encontrar-perro-ideal-con-ia-recomendaciones)
- [DS2 — Proceso de Adopcion Completo](#ds2--proceso-de-adopcion-completo)
- [DS3 — Interaccion con el Chatbot](#ds3--interaccion-con-el-chatbot)
- [DS4 — Proceso de Donacion a Refugio](#ds4--proceso-de-donacion-a-refugio)

---

## DS1 — Encontrar Perro Ideal con IA (Recomendaciones)

### Descripcion del flujo

El usuario responde un cuestionario de estilo de vida (7 pasos). Al completarlo,
sus respuestas se envian al modelo de compatibilidad IA, que evalua todos los
perros disponibles, calcula un score por criterios y devuelve una lista ordenada
de perros compatibles para que el usuario la visualice.

**Actores del diagrama:** Usuario, Cuestionario, ModeloIACompatibilidad, Perro

---

### Paso a paso: cumplimiento del diagrama

---

#### FASE 1 — Inicio del proceso

```
Usuario → iniciarCuestionario() → Cuestionario → obtenerPreguntas() → listaPreguntas() → Usuario
```

**Estado: CUMPLE CON VARIACION**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `iniciarCuestionario()` | Navegacion a `/mi-match/quiz` monta `LifestyleQuizView` | `app/(applicant)/mi-match/quiz/page.tsx` |
| `obtenerPreguntas()` | Las preguntas NO se obtienen de un servicio externo. Estan hardcodeadas como componentes React (Step1–Step7) | `modules/recommendations/components/quiz-steps/` |
| `listaPreguntas()` | El quiz renderiza los 7 pasos estaticos al montar | `LifestyleQuizView.tsx` |

**Variacion importante:**
El diagrama implica que `Cuestionario` es un objeto con identidad que expone preguntas
dinamicas (potencialmente variables segun el adoptante o version). En la implementacion
actual las preguntas son estaticas y viven en el frontend. El dominio `QuizQuestion` esta
definido en `LifestyleProfile.ts` con estructura lista para recibirlas del backend, pero
ningun servicio las consume aun.

**Notas para el backend:**
- El backend debera exponer un endpoint como `GET /api/cuestionario/preguntas` que retorne
  el conjunto de preguntas activo segun la version vigente.
- La interfaz `QuizQuestion` en `modules/shared/domain/LifestyleProfile.ts` ya define los
  campos esperados: `id`, `cuestionarioId`, `texto`, `tipo`, `opciones`, `respuesta`,
  `orden`, `categoria`, `esRequerida`.
- Los tipos de pregunta definidos son: `single_choice`, `multi_choice`, `scale`, `boolean`, `text`.
- Con backend real, `LifestyleQuizView` debera hidratar los steps desde el servicio en lugar
  de renderizar componentes estaticos.

---

#### FASE 2 — Responder cuestionario

```
Usuario → responderCuestionario(respuestas) → Cuestionario → guardarRespuestas(respuestas)
```

**Estado: CUMPLE**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `responderCuestionario(respuestas)` | `setAnswer(key, value)` actualiza el estado por cada campo que el usuario selecciona | `useLifestyleQuiz.ts:130` |
| `guardarRespuestas(respuestas)` | Cada cambio persiste en `localStorage` bajo la clave `quiz-draft-{userId}` | `useLifestyleQuiz.ts:135` |

**Detalles de implementacion:**
- La persistencia es en `localStorage`, no en base de datos. El borrador sobrevive recargas
  y cierre de pestaña, pero no entre dispositivos ni si el usuario limpia el storage.
- Al montar el hook, se recupera el borrador guardado si existe (`useEffect` en linea 121).
- La validacion por paso usa `STEP_VALIDATORS` (8 validadores, uno por paso). Si un paso
  no esta completo, el boton "Siguiente" queda deshabilitado y aparece el hint
  "Completa todas las opciones para continuar".
- `canAdvance` y `isComplete` se derivan reactivamente en cada render.

**Notas para el backend:**
- El backend debera tener un endpoint `POST /api/cuestionario` para crear un cuestionario
  vinculado al adoptante, y `PUT /api/cuestionario/{id}/respuestas` para guardar respuestas
  por paso (o todas al final).
- La entidad `Cuestionario` en `LifestyleProfile.ts` tiene: `id`, `adoptanteId`, `fecha`,
  `descripcion`, `version`, `completado`, `preguntas[]`, `respuestas?`.
- El campo `version` en `Cuestionario` es importante para migraciones: si el quiz cambia,
  las respuestas viejas deben seguir siendo validas con su version de preguntas.
- Con backend real, el draft ya no debe guardarse solo en localStorage sino que cada step
  completado debe persistirse en el servidor (para tolerancia a fallos y multi-dispositivo).

---

#### FASE 3 — Envio de datos al modelo

```
Cuestionario → enviarDatosUsuario(usuario, respuestas) → ModeloIACompatibilidad
    → procesarDatos(usuario, respuestas)
    → obtenerPerfilesDisponibles()    →→  Perro
                                      ←← listaPerrosDisponibles()
    → calcularCompatibilidad(usuario, perros)
```

**Estado: CUMPLE CON DESVIACION ARQUITECTONICA**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `enviarDatosUsuario(usuario, respuestas)` | `submitQuiz()` llama `mlService.generateRecommendations(user.id, fullAnswers)` | `useLifestyleQuiz.ts:177` |
| `procesarDatos(usuario, respuestas)` | `MockMLService.generateRecommendations()` recibe ambos parametros | `MockMLService.ts:351` |
| `obtenerPerfilesDisponibles()` | **DESVIACION:** importa `MOCK_DOGS` directamente en lugar de llamar a un servicio | `MockMLService.ts:28, 357` |
| `listaPerrosDisponibles()` | `MOCK_DOGS.filter(d => d.estado === 'disponible')` — filtra en memoria | `MockMLService.ts:357` |
| `calcularCompatibilidad(usuario, perros)` | Funcion `scoreDog()` con 8 criterios ponderados (100 pts total) | `MockMLService.ts:301` |

**Desviacion arquitectonica detectada (PRIORIDAD ALTA):**

El diagrama muestra que `ModeloIACompatibilidad` llama a `Perro` como entidad separada
para obtener los perros disponibles. En la implementacion actual, `MockMLService` importa
`MOCK_DOGS` directamente, acoplando el servicio ML con los datos crudos de perros:

```ts
// ACTUAL — acoplado:
import { MOCK_DOGS } from '@/modules/shared/mockData/dogs.mock'
const disponibles = MOCK_DOGS.filter(d => d.estado === 'disponible')

// CORRECTO segun diagrama — desacoplado:
const disponibles = await dogService.getDogs({ estado: 'disponible' })
```

Esto funciona en el mock pero rompe la separacion de responsabilidades. Cuando se conecte
el backend, el servicio ML no puede conocer directamente la fuente de datos de perros.

**Algoritmo de scoring actual (8 criterios ponderados):**

| Criterio | Peso | Campo del quiz | Campo del perro |
|---|---|---|---|
| Energia | 25 pts | `actividadFisica` + `energiaPreferida` | `nivelEnergia` |
| Espacio + Jardin | 20 pts | `tipoVivienda` + `tieneJardin` | `tamano` + `necesitaJardin` |
| Tamano preferido | 15 pts | `tamanoPreferido[]` | `tamano` |
| Ninos | 10 pts | `conviveConNinos` | `aptoNinos` |
| Mascotas | 10 pts | `conviveConMascotas` | `aptoPerros` |
| Experiencia | 10 pts | `experienciaPrevia` | `nivelEnergia === muy_alta` |
| Edad preferida | 5 pts | `edadPreferida[]` | `edadCategoria` |
| Sexo preferido | 5 pts | `sexoPreferido` | `sexo` |

Cada criterio puede generar una `MatchReason` (positiva o negativa) que se muestra al
usuario en la tarjeta del resultado.

**Campos del quiz que NO impactan el scoring actual:**
- `horasLibresParaPerro` — se captura pero no se usa en `scoreDog`
- `tamanoEspacio` — se captura pero no se usa en `scoreDog` (solo `tipoVivienda`)
- `presupuestoMensualMXN` — se captura pero no se usa en `scoreDog`
- `disponibilidadEntrenamiento` — se captura pero no se usa en `scoreDog`
- `aceptaPerroConNecesidadesEspeciales` — se captura pero no se usa en `scoreDog`

Estos campos se guardan en el perfil del adoptante via `profileService.saveLifestylePreferences()`
pero no influyen en el ranking actual. El backend/ML real debera incorporarlos.

**Notas para el backend:**
- El backend debera exponer `POST /api/recomendaciones/generar` recibiendo `{ adoptanteId, cuestionarioId }`.
- El servicio ML (backend) es quien llama internamente a la fuente de perros disponibles.
  El frontend solo envia los identificadores; no le manda la lista de perros.
- `IMLService` en el frontend debe adaptarse para solo enviar datos del usuario y recibir
  `MLRecommendationResponse`. La logica de scoring debe residir 100% en el backend.
- El campo `compatibilidad` en `DogRecommendation` esta definido como `float 0-1 en BD`
  pero se usa como `0-100` en el frontend. La normalizacion debe estar clara en el contrato
  de API (preferible que el backend entregue 0-100 directamente para evitar confusion).
- `razonesMatch` actualmente se genera en el frontend (MockMLService). Con backend real,
  el ML debera generar estas razones y devolverlas serializadas en JSON.
- `TOP_N = 10` (se devuelven los 10 mejores). Este parametro deberia ser configurable
  desde el backend o la llamada API.

---

#### FASE 4 — Resultados

```
ModeloIACompatibilidad → devolverRecomendaciones(listaPerrosCompatibles) → Usuario
Usuario → visualizarRecomendaciones()
```

**Estado: CUMPLE CON OBSERVACIONES**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `devolverRecomendaciones(listaPerrosCompatibles)` | `generateRecommendations()` retorna `MLRecommendationResponse` con `recomendaciones[]` ordenadas | `MockMLService.ts:388` |
| Persistencia del resultado | Se guarda en `localStorage` bajo `ml-results-{userId}` | `useLifestyleQuiz.ts:181` |
| `visualizarRecomendaciones()` | `RecommendationsView` muestra grid de cards con % compatibilidad y razones | `RecommendationsView.tsx` |

**Detalles de la vista de resultados:**
- Muestra skeleton loading mientras se lee localStorage al montar.
- Si no hay resultados: `EmptyState` con CTA directo al quiz.
- Si hay resultados: grid de `RecommendationCard` ordenadas por `compatibilidad` desc.
- Cada card muestra: foto, nombre, raza, refugio, badge con % compatibilidad (color
  segun rango: verde >= 75%, amarillo >= 50%, rojo < 50%), y hasta 2 razones del match
  (1 positiva + 1 negativa si existe).
- Badge de ranking `#N` en la foto. Top 3 tienen estilo destacado.
- Header de la vista muestra: total de perros evaluados, numero de resultados, y boton
  "Actualizar preferencias" que lleva al quiz.
- Texto resumen generado por el modelo (`result.resumen`) se muestra como bloque informativo.

**Observacion — `fechaGeneracion` no se muestra:**
El campo `fechaGeneracion` existe en `MLRecommendationResponse` y en `DogRecommendation`,
pero no se renderiza en ninguna parte de `RecommendationsView`. El usuario no sabe
cuando se generaron sus recomendaciones (pueden ser de hace semanas).

**Observacion — riesgo de hydration race condition:**
`RecommendationsView` lee `user?.id` del store Zustand para acceder a localStorage.
Si el store no ha hidratado el token de cookie aun (operacion asincrona), `user` sera
`null` en el primer render y el resultado nunca se carga aunque exista en localStorage.
El componente hace `setLoaded(true)` inmediatamente si `!user?.id`, descartando la
lectura sin reintentar.

**Notas para el backend:**
- Con backend real, `RecommendationsView` no debe leer de `localStorage` sino hacer
  `GET /api/recomendaciones?adoptanteId={id}` que retorne la ultima generacion guardada.
- El backend debe guardar el resultado de cada generacion en la tabla `Recomendacion`
  (FK a `Cuestionario` y a `Adoptante`). El frontend solo es un viewer.
- La persistencia en localStorage es una solucion temporal de mock. NO debe usarse
  en produccion porque: no es persistente entre dispositivos, puede corromperse, y
  expone datos del usuario en texto plano en el navegador.
- El endpoint de resultados debera soportar paginacion si en el futuro se quieren ver
  historiales de multiples generaciones de recomendaciones.

---

### Resumen de gaps vs. backend real

| # | Gap | Impacto | Accion requerida en backend |
|---|---|---|---|
| 1 | Preguntas del quiz hardcodeadas en frontend | Medio | Endpoint `GET /api/cuestionario/preguntas` que retorne preguntas dinamicas por version |
| 2 | `MockMLService` importa `MOCK_DOGS` directamente (no llama a dogService) | Alto | El servicio ML del backend consulta internamente la BD de perros disponibles |
| 3 | `cuestionarioId` generado con `Date.now()` sin persistencia real | Alto | El backend crea el cuestionario en BD y retorna su `id` real |
| 4 | Resultados en `localStorage` | Alto | Endpoint `GET /api/recomendaciones` y `POST /api/recomendaciones/generar` |
| 5 | Draft del quiz solo en `localStorage` | Medio | Endpoint `PUT /api/cuestionario/{id}/draft` para persistir borradores |
| 6 | `compatibilidad` en escala 0-100 en FE vs 0-1 definido en dominio | Medio | Definir contrato de API: el backend entrega 0-100 o 0-1, documentar y normalizar |
| 7 | Campos capturados pero sin uso en scoring: `horasLibresParaPerro`, `tamanoEspacio`, `presupuestoMensualMXN`, `disponibilidadEntrenamiento`, `aceptaPerroConNecesidadesEspeciales` | Bajo | El ML real debe incorporarlos al algoritmo de compatibilidad |
| 8 | `fechaGeneracion` disponible en el modelo pero no visible al usuario | Bajo | Mostrar en UI cuando se generaron las recomendaciones |
| 9 | Race condition de hydration en `RecommendationsView` | Medio | Con backend, pasar a fetch async con loading state; no depender de localStorage |
| 10 | Quiz solo accesible para `applicant` autenticado | Bajo | Evaluar si visitantes pueden hacer el quiz y se les pide login al ver resultados |

---

### Flujo de datos completo (mock actual)

```
[Usuario en /mi-match/quiz]
    |
    v
LifestyleQuizView (7 steps estaticos)
    |
    | setAnswer(key, value)
    v
useLifestyleQuiz → localStorage quiz-draft-{userId}
    |
    | submitQuiz() — al completar paso 7
    v
mlService.generateRecommendations(userId, fullAnswers)
    |
    v
MockMLService
    |-- MOCK_DOGS.filter('disponible')  [ACOPLAMIENTO]
    |-- scoreDog(dog, answers) x N perros
    |-- sort desc + slice top 10
    |-- buildResumen(answers, topScore)
    |
    v
MLRecommendationResponse
    |
    | guardado en localStorage ml-results-{userId}
    | profileService.saveLifestylePreferences(userId, answers)
    v
router.push('/mi-match')
    |
    v
RecommendationsView
    |-- lee localStorage ml-results-{userId}
    |-- muestra grid de RecommendationCard
    |-- cada card enlaza a /perros/{perroId}
```

---

### Flujo de datos esperado (con backend real)

```
[Usuario en /mi-match/quiz]
    |
    v
GET /api/cuestionario/preguntas?version=latest
    |
    v
LifestyleQuizView (steps dinamicos desde respuesta API)
    |
    | POST /api/cuestionario  → { cuestionarioId }
    | PUT  /api/cuestionario/{id}/draft (por paso)
    v
useLifestyleQuiz — draft en servidor
    |
    | submitQuiz() — al completar paso 7
    | PUT /api/cuestionario/{id}/completar
    v
POST /api/recomendaciones/generar  { adoptanteId, cuestionarioId }
    |
    v
[Backend ML]
    |-- Consulta BD perros disponibles (internamente)
    |-- Algoritmo de compatibilidad con todos los campos del quiz
    |-- Guarda en tabla Recomendacion
    |-- Retorna MLRecommendationResponse con recomendaciones[]
    v
router.push('/mi-match')
    |
    v
GET /api/recomendaciones?adoptanteId={id}
    |
    v
RecommendationsView (fetch directo, sin localStorage)
```

---

---

## DS2 — Proceso de Adopcion Completo

### Descripcion del flujo

El usuario ve el perfil de un perro y decide adoptarlo. Llena un formulario de solicitud
multi-paso. Al enviarlo, el perro pasa a estado "en proceso" y el refugio recibe una
notificacion. El refugio revisa la solicitud y la aprueba o rechaza, actualizando el
estado del perro en consecuencia. El usuario puede consultar el listado de sus solicitudes
y el detalle de cada una.

**Actores del diagrama:** Usuario, Perro, SolicitudAdopcion, Refugio

---

### Paso a paso: cumplimiento del diagrama

---

#### FASE 1 — Inicio del proceso

```
Usuario → verDetallePerro(perroId) → Perro → obtenerCaracteristicas() → Usuario
```

**Estado: CUMPLE CON VARIACION**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `verDetallePerro(perroId)` | `dogService.getDogBySlug(slug)` — la ruta usa `slug` (nombre URL-amigable), no `perroId` numerico | `app/(public)/perros/[slug]/page.tsx:44` |
| `obtenerCaracteristicas()` | Retorna el objeto `Dog` completo con todos sus campos y renders `DogDetailView` | `modules/dogs/components/DogDetailView.tsx` |

**Variacion — slug vs. perroId:**
El diagrama identifica al perro por `perroId` (numerico). La implementacion usa `slug`
derivado del nombre del perro (`nombre.toLowerCase().replace(/\s+/g, '-')`). Esto es
una decision de UX correcta (URLs legibles), pero implica que el backend debe:
- Soportar lookup por `slug` ademas de por `id`
- Garantizar unicidad del `slug` en BD (o generarlo con sufijo numerico si hay colision)

El formulario de adopcion en cambio SI recibe el `dogId` numerico al navegar a
`/adoptar/[dogId]`, por lo que ambos identificadores coexisten.

**Detalles del perfil del perro mostrado:**
- Foto, nombre, raza, edad, sexo, tamano, nivel de energia
- Estado (disponible / en proceso / adoptado)
- Descripcion, temperamento, necesidades especiales
- Datos del refugio (nombre, ciudad)
- `AdoptButton`: componente client que lee el authStore — si es `applicant` navega a
  `/adoptar/[dogId]`, si es visitor redirige a `/login?redirect=...`

---

#### FASE 2 — Creacion de la solicitud

```
Usuario → realizarSolicitudAdopcion(perroId)
    → SolicitudAdopcion → actualizarEstadoPerro("EN_PROCESO") → Perro → setEstado("EN_PROCESO")
                       ← confirmacionCambio()
    → setEstado("EN_PROCESO")
```

**Estado: CUMPLE PARCIALMENTE — DOS GAPS CRITICOS**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `realizarSolicitudAdopcion(perroId)` | `AdoptionFormView` — 6 pasos: PersonalData (RO), Vivienda, Rutina, Experiencia, Compromisos, Resumen. Al enviar llama `adoptionService.submit(payload, user.id)` | `modules/adoption/components/AdoptionFormView.tsx` |
| `actualizarEstadoPerro("EN_PROCESO")` | **GAP CRITICO**: El mock NO actualiza el estado del perro al crear la solicitud | `MockAdoptionService.ts:53-89` |
| `confirmacionCambio()` | No existe; el mock simplemente crea el request y retorna | — |
| `setEstado("EN_PROCESO") en SolicitudAdopcion` | La solicitud se crea con `estado: 'pending'` (no hay un estado "EN_PROCESO" en la solicitud; ese termino del diagrama mapea al estado del PERRO) | `MockAdoptionService.ts:65` |

**GAP CRITICO 1 — El perro no cambia a "en_proceso" al crear la solicitud:**

El diagrama exige que cuando se crea una solicitud, el perro pase inmediatamente a
estado `EN_PROCESO`. El mock solo crea la entidad `AdoptionRequest` pero no toca
el estado del perro. Resultado: un perro puede recibir multiples solicitudes
simultaneas sin que su estado refleje que ya tiene una en curso.

```ts
// ACTUAL — MockAdoptionService.submit() no hace esto:
// await dogService.updateDog(payload.perroId, { estado: 'en_proceso' })

// CORRECTO segun diagrama — el backend debe:
// 1. Crear la SolicitudAdopcion con estado = 'pending'
// 2. Actualizar Perro.estado = 'en_proceso'
// 3. Retornar confirmacion de ambas operaciones (en transaccion atomica)
```

**GAP CRITICO 2 — Terminology mismatch entre diagrama e implementacion:**

| Concepto | Diagrama | Implementacion |
|---|---|---|
| Solicitud recien enviada | "EN_PROCESO" (de la solicitud) | `pending` |
| Solicitud bajo evaluacion | (implicito) | `in_review` |
| Solicitud aprobada | "APROBADA" | `approved` |
| Solicitud rechazada | "RECHAZADA" | `rejected` |
| Solicitud cancelada | (no en diagrama) | `cancelled` |
| Perro con solicitud activa | "EN_PROCESO" | `en_proceso` |
| Perro adoptado | "ADOPTADO" | `adoptado` |
| Perro libre de nuevo | "DISPONIBLE" | `disponible` |

El diagrama nombra el estado de la solicitud y del perro con el mismo texto "EN_PROCESO",
lo que puede confundir. La implementacion los separa correctamente: la solicitud tiene
su propio ciclo de estados (`pending → in_review → approved/rejected/cancelled`)
y el perro tiene el suyo (`disponible → en_proceso → adoptado / disponible`).

**Formulario de adopcion — 6 pasos implementados:**

| Paso | Label | Campos clave |
|---|---|---|
| 0 | Datos personales | Solo lectura desde authStore (nombre, correo) |
| 1 | Vivienda | tipo, esPropietario, tieneJardin, tamanoJardinM2, tieneRejaOCerca |
| 2 | Rutina | horasEnCasa, actividadFisica, conviveConNinos, conviveConMascotas |
| 3 | Experiencia | motivacion, experienciaPrevia, descripcionExperiencia |
| 4 | Compromisos | aceptaVisitaPrevia (requerido), aceptaTerminos (requerido) |
| 5 | Resumen | Review + submit — sin campos nuevos |

El borrador se persiste en `localStorage` bajo la clave `adoption-draft-{perroId}` con
cada cambio de campo. Al enviar con exito se limpia el draft y se muestra un modal de
confirmacion con el numero de solicitud.

**Notas para el backend:**
- `POST /api/solicitudes` debe ser una transaccion atomica que:
  1. Crea la solicitud con `estado = 'pending'`
  2. Actualiza `perros.estado = 'en_proceso'` para el `perroId` indicado
  3. Si cualquiera falla, hace rollback de ambas operaciones
- El campo `slug` del perro debe existir en BD y ser indexado para el lookup rapido.
- El backend debe validar que el perro aun este en estado `disponible` antes de crear
  la solicitud. Si ya tiene estado `en_proceso`, retornar error `409 Conflict`.
- El campo `fotosVivienda: string[]` en `HousingInfo` implica un endpoint de subida
  de archivos: `POST /api/uploads/vivienda`. El frontend actualmente muestra un
  placeholder en `HousingStep` sin implementacion real de upload.
- El `refugioId` se obtiene del objeto `Dog` (`dog.refugioId`) al montar el form.
  El backend debe validar que ese refugioId sea coherente con el perroId.

---

#### FASE 3 — Notificacion al refugio

```
SolicitudAdopcion → notificarSolicitud(perro, usuario) → Refugio
```

**Estado: NO IMPLEMENTADO**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `notificarSolicitud(perro, usuario)` | **NO EXISTE**: El mock no tiene ningun mecanismo de notificacion. El refugio solo se entera porque la solicitud aparece en su dashboard al hacer polling manual | — |

**Gap:**
No existe servicio de notificaciones en el frontend ni en el mock. El refugio descubre
las nuevas solicitudes solo navegando a su dashboard (`/refugio/solicitudes`), donde
`useShelterRequests` hace un fetch al montar.

En el contexto de un mock frontend-only esto es aceptable, pero la ausencia de este
mecanismo es notable porque es explicito en el diagrama como parte del flujo principal.

**Notas para el backend:**
- La notificacion puede implementarse de varias formas:
  - **Email**: el backend envia un correo al email del refugio tras crear la solicitud.
  - **Notificacion in-app**: el backend crea una entrada en tabla `Notificacion` vinculada
    al usuario del refugio; el frontend la consume via polling o WebSocket.
  - **Push notification**: requiere service worker + FCM o similar.
- Para el MVP, email es suficiente. La tabla `Notificacion` puede agregarse despues.
- El frontend debera mostrar un badge de notificaciones no leidas en el sidebar del
  refugio (actualmente el sidebar tiene el campo `badge?` en `SidebarItem` listo para
  esto pero sin datos reales).

---

#### FASE 4 — Revision del refugio

```
Refugio → aprobarSolicitud() / rechazarSolicitud()
    → SolicitudAdopcion → setEstado("APROBADA") / setEstado("RECHAZADA")
    → SolicitudAdopcion → actualizarEstadoPerro("ADOPTADO") / actualizarEstadoPerro("DISPONIBLE")
                       → Perro → setEstado("ADOPTADO") / setEstado("DISPONIBLE")
```

**Estado: CUMPLE PARCIALMENTE — UN GAP CRITICO**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `aprobarSolicitud() / rechazarSolicitud()` | Panel de accion en `ShelterRequestDetailView` — botones para cambiar estado con comentario opcional | `modules/shelter/components/ShelterRequestDetailView.tsx` |
| `setEstado("APROBADA") / setEstado("RECHAZADA")` | `adoptionService.updateStatus(id, newStatus, comentario)` valida transicion via `ALLOWED_TRANSITIONS` y agrega entrada al `historial` | `MockAdoptionService.ts:122-159` |
| `actualizarEstadoPerro("ADOPTADO") / actualizarEstadoPerro("DISPONIBLE")` | **GAP CRITICO**: El mock NO actualiza el estado del perro al aprobar o rechazar | `MockAdoptionService.ts:122-159` |
| `setEstado("ADOPTADO") / setEstado("DISPONIBLE") en Perro` | No ocurre en el mock | — |

**GAP CRITICO — El perro no cambia de estado al resolver la solicitud:**

El diagrama establece claramente que al aprobar una solicitud el perro debe pasar a
`"ADOPTADO"`, y al rechazar debe volver a `"DISPONIBLE"`. El mock solo actualiza la
solicitud pero no el perro. Esto rompe la coherencia de datos.

Impacto real: en el mock, un perro rechazado seguiria mostrando `en_proceso` en su
perfil aunque ya haya sido rechazado, y un perro aprobado seguiria en `en_proceso`
en lugar de `adoptado`.

```ts
// ACTUAL — updateStatus() no hace esto:
// if (newStatus === 'approved')  dogService.updateDog(req.perroId, { estado: 'adoptado' })
// if (newStatus === 'rejected')  dogService.updateDog(req.perroId, { estado: 'disponible' })
// if (newStatus === 'cancelled') dogService.updateDog(req.perroId, { estado: 'disponible' })

// CORRECTO segun diagrama — transaccion atomica en backend:
// 1. Actualiza SolicitudAdopcion.estado = newStatus
// 2. Si approved  → Perro.estado = 'adoptado'
// 3. Si rejected  → Perro.estado = 'disponible'
// 4. Si cancelled → Perro.estado = 'disponible'
```

**Transiciones de estado del refugio implementadas:**

| Estado actual | Puede pasar a |
|---|---|
| `pending` | `in_review`, `rejected` |
| `in_review` | `approved`, `rejected` |
| `approved` | (terminal) |
| `rejected` | (terminal) |
| `cancelled` | (terminal) |

El mapa `ALLOWED_TRANSITIONS` en `AdoptionRequest.ts` y `NEXT_STATUSES` en
`ShelterRequestDetailView.tsx` son coherentes entre si y con el diagrama.

**Detalles del panel de accion del refugio (implementado):**
- El refugio puede cambiar el estado con un comentario opcional.
- Al aprobar/rechazar se agrega una entrada al `historial[]` con `estadoAnterior`,
  `estadoNuevo`, `cambiadoPor`, `rol`, `comentario`, y `fecha`.
- El timeline del historial es visible tanto para el adoptante como para el refugio.
- El adoptante NO puede aprobar ni rechazar; solo puede `cancelar` (su propia accion).

**Notas para el backend:**
- `PUT /api/solicitudes/{id}/estado` debe ser una transaccion atomica:
  1. Valida que la transicion sea permitida por `ALLOWED_TRANSITIONS`
  2. Actualiza `solicitudes.estado = newStatus`
  3. Inserta en tabla `historial_estados` (equivalente a `StatusChange`)
  4. Actualiza `perros.estado` segun regla:
     - `approved` → `adoptado`
     - `rejected` → `disponible` (si no tiene otra solicitud activa)
     - `cancelled` → `disponible` (si no tiene otra solicitud activa)
- El punto 4 tiene una sutileza: si el perro tiene MULTIPLES solicitudes simultane as
  (lo cual no deberia ocurrir con el GAP CRITICO 1 resuelto, pero puede pasar si hay
  un race condition), el backend debe verificar que no quede ninguna solicitud
  `pending` o `in_review` antes de volver el perro a `disponible`.
- `cambiadoPor` en `StatusChange` debe ser el `userId` real del usuario del refugio
  autenticado, no hardcoded a 0 como en el mock.
- El campo `rol` en `StatusChange` debe determinarse desde el token del usuario autenticado,
  no asumirse siempre `'shelter'` como en el mock.

---

#### FASE 5 — Cierre del proceso

```
Usuario → verListadoSolicitudes() → SolicitudAdopcion
Usuario → verDetallesDeSolicitud() → SolicitudAdopcion
```

**Estado: CUMPLE**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `verListadoSolicitudes()` | `AdoptionStatusView` — lista con tabs por estado, cada item enlaza al detalle | `modules/adoption/components/AdoptionStatusView.tsx` |
| `verDetallesDeSolicitud()` | `AdoptionDetailView` — sidebar con estado actual + boton cancelar + chat, main con timeline + datos del formulario | `modules/adoption/components/AdoptionDetailView.tsx` |

**Detalles del listado de solicitudes:**
- Tabs: Todas / Pendientes / En revision / Aprobadas / Rechazadas / Canceladas
- Solo se muestran tabs con al menos 1 solicitud en ese estado
- Cada card muestra: foto del perro, nombre, refugio, fecha, badge de estado
- Estado vacio con CTA directo a `/perros`

**Detalles del detalle de solicitud:**
- Sidebar: foto del perro, estado actual con descripcion textual, fecha de envio,
  boton "Chatear con el refugio" (visible solo si esta activa), boton "Cancelar solicitud"
  con confirmacion de 2 pasos
- Main: banner de rechazo (si aplica con el comentario del refugio), timeline del
  historial cronologico, datos personales, vivienda, rutina, experiencia, comentarios
- Boton de chat actualmente es un `<button>` sin funcionalidad real (pendiente del
  modulo de mensajeria)

**Observacion — boton de chat sin implementacion:**
En `AdoptionDetailView.tsx:199`, el boton "Chatear con el refugio" es visible cuando la
solicitud esta activa pero no tiene `href` ni `onClick` funcional. Lleva al usuario a
una experiencia rota si hace click.

**Notas para el backend:**
- `GET /api/solicitudes?adoptanteId={id}` para el listado (con filtro opcional por estado).
- `GET /api/solicitudes/{id}` para el detalle completo con `historial[]`.
- El backend debe garantizar que solo el adoptante dueno de la solicitud pueda verla
  (autorizacion por ownership). Actualmente el mock no valida esto en `getById`.
- El chat de la fase 5 requiere que el modulo de mensajeria este integrado. Ver DS[N]
  para el diagrama de mensajeria cuando se analice.

---

### Resumen de gaps vs. backend real

| # | Gap | Impacto | Fase | Accion requerida en backend |
|---|---|---|---|---|
| 1 | Al crear solicitud, el perro NO cambia a `en_proceso` | Alto | F2 | Transaccion atomica: crear solicitud + actualizar perro |
| 2 | Al resolver solicitud, el perro NO cambia a `adoptado`/`disponible` | Alto | F4 | Transaccion atomica: actualizar solicitud + actualizar perro |
| 3 | No existe notificacion al refugio | Alto | F3 | Email transaccional o notificacion in-app al aprobar solicitud |
| 4 | El perro puede recibir multiples solicitudes simultaneas | Alto | F2 | Validar `perro.estado === 'disponible'` antes de aceptar nueva solicitud |
| 5 | Boton "Chatear con el refugio" sin funcionalidad | Medio | F5 | Integrar modulo de mensajeria; la ruta existe en `app/(applicant)/chat/[conversationId]` |
| 6 | `fotosVivienda` en HousingInfo sin upload real | Medio | F2 | Endpoint `POST /api/uploads/vivienda` + almacenamiento en cloud |
| 7 | Draft del formulario solo en localStorage | Medio | F2 | Endpoint de guardado de borradores o autoguardado por paso |
| 8 | `cambiadoPor` y `rol` hardcodeados en mock | Medio | F4 | Backend extrae userId y rol del JWT autenticado |
| 9 | `getById` no valida ownership del adoptante | Medio | F5 | Middleware de autorizacion: solo el dueno de la solicitud puede ver su detalle |
| 10 | Terminologia: diagrama usa "EN_PROCESO" para solicitud y perro | Bajo | F2/F4 | Documentado — la implementacion separa correctamente los dos ciclos de estados |

---

### Flujo de datos completo (mock actual)

```
[Usuario en /perros/{slug}]
    |
    v
dogService.getDogBySlug(slug)   →   DogDetailView
    |
    | AdoptButton (si applicant)
    v
Navegacion a /adoptar/{dogId}
    |
    v
AdoptionFormView (6 pasos)
    |-- LocalStorage draft por campo
    |-- Validacion por paso antes de avanzar
    |
    | submitForm() → adoptionService.submit(payload, userId)
    v
MockAdoptionService.submit()
    |-- Crea AdoptionRequest con estado = 'pending'
    |-- Enriquece con datos del perro (getDogById)
    |-- Agrega entrada inicial al historial[]
    |-- [NO actualiza perro.estado] ← GAP
    |-- [NO envia notificacion al refugio] ← GAP
    |
    v
Modal de exito con ID de solicitud
    |
    v
[Refugio en /refugio/solicitudes/{id}]
    |
    | Cambia estado via panel de accion
    v
adoptionService.updateStatus(id, newStatus, comentario)
    |-- Valida ALLOWED_TRANSITIONS
    |-- Actualiza solicitud.estado
    |-- Agrega entrada al historial[]
    |-- [NO actualiza perro.estado] ← GAP
    |
    v
[Usuario en /mis-solicitudes]
    |
    v
adoptionService.getMyRequests(userId)  →  AdoptionStatusView (tabs)
    |
    | Click en solicitud
    v
adoptionService.getById(id)  →  AdoptionDetailView (timeline + formulario)
```

---

### Flujo de datos esperado (con backend real)

```
[Usuario en /perros/{slug}]
    |
    v
GET /api/perros/{slug}  →  DogDetailView

[Usuario en /adoptar/{dogId}]
    |
    | POST /api/solicitudes  (transaccion atomica)
    |   └─ INSERT solicitudes (estado='pending')
    |   └─ UPDATE perros SET estado='en_proceso' WHERE id={dogId} AND estado='disponible'
    |   └─ Si perro no disponible → 409 Conflict
    |   └─ Trigger: envia email/notificacion al refugio
    |
    v
AdoptionRequest creada

[Refugio en /refugio/solicitudes/{id}]
    |
    | PUT /api/solicitudes/{id}/estado  (transaccion atomica)
    |   └─ Valida ALLOWED_TRANSITIONS
    |   └─ UPDATE solicitudes SET estado={newStatus}
    |   └─ INSERT historial_estados
    |   └─ Si approved  → UPDATE perros SET estado='adoptado'
    |   └─ Si rejected  → UPDATE perros SET estado='disponible' (si sin otras solicitudes activas)
    |   └─ Trigger: notificacion/email al adoptante

[Usuario en /mis-solicitudes]
    |
GET /api/solicitudes?adoptanteId={id}&page=1  →  AdoptionStatusView
    |
GET /api/solicitudes/{id}  →  AdoptionDetailView (con historial completo)
```

---

---

## DS3 — Interaccion con el Chatbot

### Descripcion del flujo

El usuario envia un mensaje al chatbot. Este procesa la pregunta buscando en su base
de conocimiento. Segun el tipo de pregunta, sigue uno de dos caminos alternativos:
si la pregunta es sobre adopcion, consulta al `ModeloIACompatibilidad` que a su vez
obtiene perros disponibles de `Perro` y genera una respuesta con recomendaciones;
si es una pregunta general, genera una respuesta predefinida. En ambos casos registra
la conversacion y muestra la respuesta al usuario.

**Actores del diagrama:** Usuario, Chatbot, ModeloIACompatibilidad, Perro

---

### Paso a paso: cumplimiento del diagrama

---

#### FASE 1 — Inicio de conversacion y procesamiento

```
Usuario → enviarMensaje(pregunta) → Chatbot
    → procesarPregunta(pregunta)
    → buscarEnBaseConocimiento()
```

**Estado: CUMPLE**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `enviarMensaje(pregunta)` | `useChatbot.sendMessage(text)` — agrega mensaje del usuario al historial y llama al servicio | `useChatbot.ts:62` |
| `procesarPregunta(pregunta)` | `chatbotService.getResponse(message)` — delega al `MockChatbotService` | `useChatbot.ts:79` |
| `buscarEnBaseConocimiento()` | Tokenizacion del mensaje y busqueda de coincidencias en el array `INTENTS` (12 intents definidos) | `MockChatbotService.ts:140-153` |

**Detalles de la base de conocimiento actual:**

El `MockChatbotService` implementa un motor de matching por keywords en dos niveles:
1. Busqueda de frase completa: `lower.includes(kw)` — detecta frases multi-palabra
2. Busqueda de token: `tokens.includes(kw)` — detecta palabras sueltas despues de tokenizar

Los 12 intents definidos cubren: `saludo`, `adoptar`, `requisitos`, `costo`, `quiz`,
`refugios`, `visita`, `cachorro`, `tamano`, `solicitud`, `favoritos`, `gracias`.

Si ninguna keyword coincide, se retorna `RESPONSE_DEFAULT` con links al catalogo y refugios.

**Variaciones de diseno:**
- El chatbot muestra un **mensaje de bienvenida automatico** al montar (sin que el
  usuario lo solicite), con 3 sugerencias rapidas. Esto no aparece en el diagrama
  pero mejora la UX significativamente.
- Cada respuesta del bot puede incluir **links clickeables** dentro de la burbuja
  y **chips de sugerencias** debajo para guiar la siguiente pregunta.
- Hay un **indicador de escritura** (3 puntos animados) con delay de 800–1400ms para
  simular naturalidad.
- La burbuja flotante muestra un **badge de no leidos** que se resetea al abrir el panel.

---

#### FASE 2 — Alternativas segun tipo de pregunta

```
alt [pregunta relacionada con adopcion]:
    Chatbot → obtenerPerfilesDisponibles() → ModeloIACompatibilidad
    ModeloIACompatibilidad → listarPerrosDisponibles() → Perro
    Perro → listaPerros → ModeloIACompatibilidad
    ModeloIACompatibilidad → generarRespuesta(perrosRecomendados) → Chatbot

[pregunta general]:
    Chatbot → generarRespuestaPredefinida()
```

**Estado: GAP CRITICO — rama de adopcion NO conecta con ML ni con Perros**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| Deteccion [pregunta relacionada con adopcion] | El chatbot detecta keywords como `adoptar`, `quiz`, `tamano`, `cachorro`, pero NO distingue si debe consultar al ML o al catalogo | `MockChatbotService.ts:144-153` |
| `obtenerPerfilesDisponibles()` | **NO IMPLEMENTADO**: El chatbot nunca llama a `mlService` ni a `dogService` | — |
| `listarPerrosDisponibles()` | **NO IMPLEMENTADO**: No hay llamada al modulo `Perro` | — |
| `generarRespuesta(perrosRecomendados)` | **NO IMPLEMENTADO**: El chatbot nunca incluye datos reales de perros en sus respuestas | — |
| `generarRespuestaPredefinida()` | `return intent.response` o `return RESPONSE_DEFAULT` — toda respuesta es predefinida | `MockChatbotService.ts:152-155` |

**Gap arquitectonico central:**

El diagrama define dos ramas claramente distintas: respuestas con datos reales de
perros (consultando `ModeloIACompatibilidad` + `Perro`) vs. respuestas predefinidas.
En la implementacion actual **TODO es predefinido**. El chatbot nunca consulta perros
reales ni el modelo ML — solo devuelve texto fijo con links al catalogo.

Esto significa que el chatbot actual es un FAQ interactivo, no un asistente con IA
que conozca el inventario real de perros. El `ModeloIACompatibilidad` del diagrama
no tiene equivalente funcional en el chatbot; el `mlService` existe en el modulo
de recomendaciones pero el chatbot nunca lo invoca.

**Intents relacionados con adopcion que deberian consultar datos reales:**

| Intent | Keywords detectadas | Lo que deberia hacer segun diagrama | Lo que hace actualmente |
|---|---|---|---|
| `adoptar` | quiero adoptar, proceso | Buscar perros disponibles para el usuario | Texto fijo + link a /perros |
| `quiz` | compatible, match, recomendacion | Obtener perfil ML del usuario y sugerir perros | Texto fijo + link a /mi-match/quiz |
| `tamano` | grande, mediano, raza | Listar perros filtrando por tamano del catalogo | Texto fijo + links |
| `cachorro` | cachorro, joven, bebe | Listar cachorros disponibles actualmente | Texto fijo + link a /perros |
| `solicitud` | mis solicitudes, estado | Mostrar solicitudes activas del usuario | Texto fijo + link a /mis-solicitudes |

---

#### FASE 3 — Registro de la conversacion

```
Chatbot → registrarConversacion(usuario, pregunta, respuesta)
```

**Estado: NO IMPLEMENTADO**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `registrarConversacion(usuario, pregunta, respuesta)` | **NO EXISTE**: El historial de mensajes vive unicamente en el `useState` del hook `useChatbot`. Al cerrar el panel o recargar la pagina, se pierde todo | `useChatbot.ts:52` |

**Consecuencias del gap:**
- No hay analytics del chatbot: no se sabe que preguntan los usuarios con mas frecuencia.
- No hay mejora continua basada en conversaciones reales.
- Si el usuario cierra el panel y lo reabre, el chat reinicia (vuelve al mensaje de bienvenida).
- El `sessionId` (UUID generado en el hook) existe pero nunca se envia al servicio:
  `IChatbotService.getResponse(message)` solo recibe `message`, ignorando la sesion.

**Notas para el backend:**
- El backend debera exponer `POST /api/chatbot/mensajes` para registrar cada intercambio
  con `{ sesionId, usuarioId, pregunta, respuesta, timestamp, intentId }`.
- Opcionalmente: `GET /api/chatbot/historial?sesionId={id}` para recuperar el historial
  al reabrir el panel.
- La tabla de conversaciones permite entrenamiento futuro del modelo y metricas de uso.

---

#### FASE 4 — Mostrar respuesta

```
Chatbot → mostrarRespuesta() → Usuario
```

**Estado: CUMPLE**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `mostrarRespuesta()` | El mensaje del bot se agrega al array `messages` y se renderiza en `ChatbotPanel` como burbuja con texto, links y sugerencias | `useChatbot.ts:81-91`, `ChatbotPanel.tsx:97-133` |

**Detalles de la renderizacion de respuestas:**
- El texto soporta saltos de linea (`\n` → `<br/>`).
- Los links se renderizan como chips dentro de la burbuja con icono de flecha.
- Las sugerencias se muestran debajo del ultimo mensaje del bot como `ChatbotSuggestions`.
- Al hacer click en una sugerencia, se envia como mensaje nuevo del usuario.
- Cada mensaje muestra timestamp (`HH:MM`).

---

### Observaciones adicionales de diseno (fuera del diagrama)

**Restriccion de acceso — solo `applicant`:**
`ChatbotWrapper` renderiza `null` si `user?.role !== 'applicant'`. El diagrama muestra
un "Usuario" generico sin restriccion. Esto implica que:
- Visitantes no autenticados NO tienen acceso al chatbot (podria ser valido segun
  la decision de negocio, pero no esta especificado en el diagrama).
- Refugios y admins tampoco ven el chatbot (correcto — no lo necesitan).

Si el chatbot debe estar disponible para visitantes (para responder dudas antes de
registrarse), `ChatbotWrapper` debe cambiar su guardia de rol.

**`IChatbotService` demasiado simplificado:**
La interfaz actual es:
```ts
interface IChatbotService {
  getResponse(message: string): Promise<BotResponse>
}
```
Para el backend real, esta interfaz necesita contexto adicional:
```ts
interface IChatbotService {
  getResponse(
    message:   string,
    sessionId: string,     // contexto de la conversacion
    userId?:   number,     // para personalizar con perfil del usuario
    context?:  ChatContext // historial reciente para LLM con memoria
  ): Promise<BotResponse>
}
```

**Contexto del usuario no aprovechado:**
El `ChatbotWrapper` tiene acceso al `user` del `authStore` pero nunca lo pasa al
servicio. El chatbot responde igual para cualquier adoptante, sin considerar:
- Si ya hizo el quiz de compatibilidad
- Sus solicitudes activas
- Sus perros favoritos
- Su historial de conversaciones previas

---

### Resumen de gaps vs. backend real

| # | Gap | Impacto | Accion requerida en backend |
|---|---|---|---|
| 1 | Chatbot no consulta `ModeloIACompatibilidad` ni `dogService` para preguntas de adopcion | Alto | Endpoint `POST /api/chatbot/mensaje` que internamente llama al ML/catalogo segun intent clasificado |
| 2 | `registrarConversacion` no implementado — historial solo en memoria | Alto | Tabla `conversacion_chatbot` con campos: sesionId, usuarioId, pregunta, respuesta, intentId, timestamp |
| 3 | `IChatbotService.getResponse()` no recibe `sessionId` ni contexto de usuario | Alto | Redisenar la interfaz del servicio para incluir sesion, userId y contexto del historial |
| 4 | Historial se pierde al cerrar el panel o recargar | Medio | `GET /api/chatbot/historial?sesionId={id}` para restaurar conversacion al reabrir |
| 5 | Chatbot no disponible para visitantes no autenticados | Medio | Evaluar si visitantes deben tener acceso; cambiar guardia de rol en `ChatbotWrapper` |
| 6 | Contexto del usuario ignorado en respuestas | Medio | Backend personaliza respuestas usando perfil del adoptante (quiz, solicitudes, favoritos) |
| 7 | Motor de matching por keywords es fragil (sin NLP real) | Alto | Reemplazar con LLM o clasificador de intents (Claude API, OpenAI, Dialogflow, etc.) |
| 8 | Sin metricas de uso del chatbot | Bajo | Dashboard de analytics: intents mas frecuentes, mensajes sin respuesta adecuada, tasa de derivacion al catalogo |

---

### Flujo de datos completo (mock actual)

```
[Usuario (rol applicant) — burbuja flotante visible]
    |
    | onClick burbuja → openChatbot() + markRead()
    v
ChatbotPanel (panel expandido)
    |
    | Usuario escribe mensaje o selecciona sugerencia
    v
useChatbot.sendMessage(text)
    |-- Agrega UIMessage{role:'user'} al estado
    |-- setIsLoading(true)
    |-- delay aleatorio 800-1400ms
    v
chatbotService.getResponse(message)  [MockChatbotService]
    |-- Tokeniza el mensaje
    |-- Busca en INTENTS[] por keywords
    |-- Si coincide → retorna intent.response (texto fijo + links + sugerencias)
    |-- Si no coincide → retorna RESPONSE_DEFAULT
    |-- [NUNCA llama a mlService ni dogService] ← GAP
    |-- [NUNCA persiste la conversacion] ← GAP
    v
UIMessage{role:'bot', text, links, suggestions}
    |-- Se agrega al estado messages[]
    |-- Se renderiza en ChatbotPanel
    |-- Las sugerencias se muestran como chips
    |-- unreadCount++ (si el panel estaba cerrado)
```

---

### Flujo de datos esperado (con backend real)

```
[Usuario (cualquier rol o visitante)]
    |
    v
POST /api/chatbot/mensaje
    {
      sesionId: UUID,
      usuarioId: number | null,
      mensaje: string,
      historialReciente: UIMessage[]  // contexto para el LLM
    }
    |
    v
[Backend Chatbot]
    |
    |-- Clasificador de intents (LLM o ML)
    |
    |-- Si intent = adopcion/perros:
    |     |-- Consulta catalogo de perros disponibles
    |     |-- Opcionalmente: llama al motor de compatibilidad con perfil del usuario
    |     |-- Genera respuesta con perros reales + links a perfiles
    |
    |-- Si intent = general:
    |     |-- Genera respuesta con base de conocimiento / FAQ
    |
    |-- Registra en tabla conversacion_chatbot
    |
    v
BotResponse {
  text: string,
  links: ChatLink[],    // links a perros reales o paginas
  suggestions: string[],
  perrosRecomendados?: DogCard[]  // opcional: cards de perros
}
    |
    v
ChatbotPanel renderiza respuesta
```

---

---

## DS4 — Proceso de Donacion a Refugio

### Descripcion del flujo

El usuario inicia una donacion eligiendo monto, metodo de pago y refugio destino.
El sistema procesa y valida el pago retornando una confirmacion booleana. Si es exitosa,
notifica al refugio con el ID de donacion, monto y datos del usuario; el refugio
registra la donacion y confirma la recepcion. Finalmente el usuario puede ver su
historial de donaciones.

**Actores del diagrama:** Usuario, Donacion, Refugio

---

### Paso a paso: cumplimiento del diagrama

---

#### FASE 1 — Inicio del proceso

```
Usuario → registrarDonacion(monto, metodoPago, refugio) → Donacion
    → procesarPago()
    → validarDonacion()
← confirmarPago(boolean)
```

**Estado: CUMPLE CON VARIACIONES**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `registrarDonacion(monto, metodoPago, refugio)` | Flujo de 3 pasos: `AmountSelector` → `PaymentForm` → `donationService.initiateDonation(data, refugioId, adoptanteId, shelterInfo)` | `DonationView.tsx:84-106` |
| `procesarPago()` | `await delay(1500)` — simula la latencia del gateway de pago (1.5s) | `MockDonationService.ts:45` |
| `validarDonacion()` | `if (Math.random() < 0.05) throw new Error(...)` — 5% de rechazo aleatorio + validacion Luhn/expiry/CVV en cliente | `MockDonationService.ts:48`, `PaymentForm.tsx:151-160` |
| `confirmarPago(boolean)` | `true` → `setStep('confirmed')` con pantalla de exito y recibo; `false` → `setStep('error')` con mensaje y boton de reintento | `DonationView.tsx:98-104` |

**Variacion — flujo multi-paso previo al `registrarDonacion`:**
El diagrama comprime en una sola llamada lo que la implementacion divide en dos pantallas
interactivas antes de enviar al servicio:

- **Pantalla 1 — `AmountSelector`**: chips de montos predefinidos + campo libre.
  Montos sugeridos: $50, $100, $200, $500 MXN. Monto recomendado configurable por refugio.
  Minimo $20 MXN para poder continuar.
- **Pantalla 2 — `PaymentForm`**: preview visual de la tarjeta (flip animado), campos
  de numero (con deteccion de marca Visa/Mastercard/Amex y validacion Luhn), nombre,
  vencimiento, CVV, mensaje opcional (concepto, max 150 chars) y toggle de donacion
  anonima. Enlace externo a PayPal si el refugio tiene `paypalEmail` configurado.

**Variacion — solo `tarjeta` plenamente implementado:**
El dominio define 4 metodos: `tarjeta`, `paypal`, `transferencia`, `efectivo`. El
`PaymentForm` hardcodea `metodoPago: 'tarjeta'` al hacer submit. PayPal solo se ofrece
como link externo (`paypal.me/...`). SPEI y efectivo existen en el dominio pero no
tienen UI ni flujo propio.

**Variacion — donacion publica (sin login obligatorio):**
La ruta `app/(public)/refugios/[slug]/donar/page.tsx` esta en el grupo `(public)`,
por lo que cualquier visitante puede donar sin autenticarse. En ese caso `adoptanteId = 0`
(fallback de `user?.id ?? 0`). El diagrama muestra "Usuario" generico, lo que es coherente,
pero el backend real necesita decidir si las donaciones anonimas/sin cuenta son validas
y como las gestiona en BD.

**Detalles de la pantalla de confirmacion exitosa (`DonationConfirmation`):**
- Animacion CSS-only: circulo con checkmark SVG dibujado + 6 puntos de confetti
- Recibo con: monto, refugio (nombre + logo), fecha, metodo, donante (o "Anonimo"), ID de transaccion, concepto
- CTAs: "Ver mas perros de este refugio" (link a `/refugios/{slug}`) + "Volver al inicio"

**Notas para el backend:**
- `POST /api/donaciones` debera recibir `{ refugioId, monto, metodoPago, concepto, esAnonima }`.
- El backend integra con el gateway de pago (Stripe, PayPal) y retorna el resultado real.
  El frontend NO debe enviar datos de tarjeta al backend propio — deben ir directamente
  al gateway (Stripe.js tokeniza en cliente y envia solo el `paymentMethodId` al backend).
- El campo `transactionId` debera ser el ID real del gateway (ej. `pi_3Nbx...` de Stripe).
- `confirmado` en BD debe ser `true` solo tras confirmacion del webhook del gateway,
  no inmediatamente al crear la donacion. El flujo correcto es:
  1. FE envia `paymentMethodId` (token Stripe) + datos al backend
  2. Backend crea `PaymentIntent` en Stripe
  3. Stripe confirma (sync o via webhook) → backend actualiza `donaciones.confirmado = true`
- Para SPEI: el banco no confirma en tiempo real; la donacion queda `pending` hasta
  recibir el webhook de confirmacion bancaria.
- Para visitantes sin cuenta (`adoptanteId = 0`): definir si se permite o se redirige a login.

---

#### FASE 2 — Registro en el refugio

```
Donacion → notificarRefugio(idDonacion, monto, usuario) → Refugio
    → registrarDonacion()
← confirmacionRecibida()
```

**Estado: GAP TOTAL — las 3 llamadas de esta fase no existen**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `notificarRefugio(idDonacion, monto, usuario)` | **NO IMPLEMENTADO**: El mock no envia ninguna notificacion al refugio tras confirmar la donacion | — |
| `registrarDonacion()` en Refugio | El refugio ve donaciones en `ShelterDonationsView` leyendo `MOCK_DONATIONS` directamente (sin llamar al servicio) | `ShelterDonationsView.tsx:7` |
| `confirmacionRecibida()` | **NO IMPLEMENTADO**: No existe ninguna confirmacion de vuelta del Refugio hacia Donacion | — |

**Gap arquitectonico — `ShelterDonationsView` acopla directamente con `MOCK_DONATIONS`:**
Identico al gap de `MockMLService` con `MOCK_DOGS` (DS1). La vista del refugio no usa
`donationService.getDonationSummary(refugioId)` sino que importa los datos crudos:

```ts
// ACTUAL — acoplado:
import { MOCK_DONATIONS } from '@/modules/shared/mockData/donations.mock'

// CORRECTO — via servicio:
const summary = await donationService.getDonationSummary(refugioId)
```

Esto significa que las donaciones nuevas registradas via `initiateDonation()` (que se
agregan al array `_donations` mutable) NO aparecen en el dashboard del refugio, porque
`ShelterDonationsView` lee directamente `MOCK_DONATIONS` (el array estatico original).

**Notas para el backend:**
- `notificarRefugio()` debera implementarse como:
  - Email automatico al refugio: "Nueva donacion de $X MXN de {donante o Anonimo}".
  - Notificacion in-app en el dashboard del refugio (badge en sidebar).
- `registrarDonacion()` en Refugio es equivalente a que el backend guarde la donacion
  en BD y la relacione al `refugioId`. Con BD real, el refugio solo hace un `GET /api/donaciones?refugioId={id}`.
- `confirmacionRecibida()` en el contexto de pagos digitales es el webhook del gateway
  (Stripe → backend → BD `confirmado = true`). No es una accion manual del refugio.
- El refugio no "acepta" ni "rechaza" donaciones — son transacciones financieras que
  se confirman automaticamente via gateway. Esto es una diferencia conceptual
  importante respecto al flujo de adopcion donde el refugio si tiene agencia.

**Configuracion de donaciones del refugio (implementada en mock):**
El `ShelterDonationsView` incluye un formulario de configuracion local con:
- Toggle `aceptaDonaciones` (habilita/deshabilita la pagina de donacion)
- `metaMensual` (objetivo en MXN, muestra barra de progreso)
- `paypalEmail` (genera link externo `paypal.me/...`)
- `stripeAccountId` (para Stripe Connect — no integrado aun)
- `descripcionCausa` (texto motivacional en la pagina de donacion)
Este formulario hace `setIsEditing(false)` al guardar pero NO llama a ningun servicio.
Con backend: `PUT /api/refugios/{id}/donacion-config`.

---

#### FASE 3 — Cierre

```
Usuario → verHistorialDonaciones()
```

**Estado: IMPLEMENTADO EN SERVICIO, SIN UI PARA EL ADOPTANTE**

| Llamada del diagrama | Implementacion actual | Archivo |
|---|---|---|
| `verHistorialDonaciones()` | `donationService.getDonationsByAdoptante(adoptanteId)` — metodo existe en `IDonationService` y `MockDonationService` | `IDonationService.ts:19`, `MockDonationService.ts:76` |
| Vista del historial para el adoptante | **NO EXISTE**: No hay pagina ni componente que muestre el historial de donaciones al adoptante | — |

**Gap — el adoptante no tiene donde ver su historial:**
El metodo `getDonationsByAdoptante()` esta completamente implementado en el servicio
(filtra por `adoptanteId` y ordena por fecha descendente) pero ningun componente lo
consume desde la perspectiva del adoptante. El modulo de `perfil` (`ProfileView.tsx`)
no incluye seccion de donaciones. No hay ruta `app/(applicant)/mis-donaciones/`.

El refugio si tiene `ShelterDonationsView` con listado e historial de sus donaciones
recibidas, pero esto es la perspectiva del receptor, no del donante.

**Notas para el backend:**
- Crear la pagina `app/(applicant)/mis-donaciones/page.tsx` que consuma
  `GET /api/donaciones?adoptanteId={id}`.
- Alternativamente, integrar el historial de donaciones en la seccion `mi-perfil`
  como un tab adicional.
- El recibo de la pantalla de confirmacion actual puede complementarse con un link
  "Ver historial de donaciones" que lleve a esa pagina.

---

### Observaciones adicionales

**Guard de `aceptaDonaciones`:**
La pagina del servidor `DonationPage` hace `notFound()` si el refugio no acepta
donaciones (`!shelter.donationConfig.aceptaDonaciones`). Esto es correcto y protege
contra rutas directas a refugios inactivos.

**Donacion anonima:**
- Si `esAnonima = true`, el nombre del adoptante se reemplaza por `'Anonimo'` en el
  objeto `Donation` (`adoptanteNombre: data.esAnonima ? 'Anonimo' : undefined`).
- La FK `adoptanteId` sigue guardandose (para auditoria interna), solo el nombre se
  oculta. Correcto desde el punto de vista de privacidad.

**Metodo de pago vs. gateway real:**
El `PaymentForm` solicita numero de tarjeta, nombre, expiry y CVV directamente.
**Esto es un riesgo de seguridad PCI-DSS** si se envia al backend propio. En produccion
se debe usar Stripe Elements / Stripe.js que tokeniza los datos de tarjeta en el
cliente sin que el servidor de aDOGme los vea jamas.

---

### Resumen de gaps vs. backend real

| # | Gap | Impacto | Fase | Accion requerida en backend |
|---|---|---|---|---|
| 1 | `procesarPago()` es un delay aleatorio sin gateway real | Critico | F1 | Integrar Stripe (tarjeta) + PayPal SDK + SPEI. FE usa Stripe.js para tokenizar |
| 2 | Datos de tarjeta capturados en formulario propio (riesgo PCI-DSS) | Critico | F1 | Reemplazar `PaymentForm` con Stripe Elements. Nunca enviar datos de tarjeta al backend propio |
| 3 | `notificarRefugio()` no implementado | Alto | F2 | Email/notificacion in-app automatica al confirmar donacion |
| 4 | `confirmacionRecibida()` no existe — confirmacion es via webhook del gateway | Alto | F2 | Backend implementa webhook handler de Stripe/PayPal para actualizar `confirmado = true` |
| 5 | `ShelterDonationsView` lee `MOCK_DONATIONS` directamente, bypaseando el servicio | Alto | F2 | Migrar a `donationService.getDonationSummary(refugioId)` o endpoint `GET /api/donaciones?refugioId={id}` |
| 6 | No hay UI de historial de donaciones para el adoptante | Medio | F3 | Crear `app/(applicant)/mis-donaciones/page.tsx` que llame `GET /api/donaciones?adoptanteId={id}` |
| 7 | Solo `tarjeta` tiene flujo completo; SPEI y efectivo sin UI | Medio | F1 | Implementar flujo de SPEI (referencia + webhook) y efectivo (presencial en refugio) |
| 8 | Donaciones de visitantes no autenticados (`adoptanteId = 0`) | Medio | F1 | Definir politica: requerir login, o permitir donaciones de visitantes con email como identificador |
| 9 | Configuracion de donaciones del refugio no llama a ningun servicio | Medio | F2 | Endpoint `PUT /api/refugios/{id}/donacion-config` para persistir la configuracion |
| 10 | Donacion nueva via `initiateDonation` no aparece en dashboard del refugio | Bajo | F2 | Resuelto al migrar `ShelterDonationsView` del gap #5 |

---

### Flujo de datos completo (mock actual)

```
[Usuario en /refugios/{slug}/donar]
    |
    v
DonationPage (server) → getShelterBySlug(slug)
    |-- Si !shelter o !aceptaDonaciones → 404
    |
    v
DonationView (client)
    |
    | Paso 1: AmountSelector
    |   Selecciona monto (chips + campo libre, min $20)
    |   → setStep('payment')
    |
    | Paso 2: PaymentForm
    |   Llena numero tarjeta + nombre + expiry + CVV + concepto + esAnonima
    |   Validacion cliente: Luhn + expiry + CVV + nombre requerido
    |   → handlePayment(formData)
    |
    v
donationService.initiateDonation(data, refugioId, adoptanteId, shelterInfo)
    |-- await delay(1500)  ← simula gateway
    |-- if Math.random() < 0.05 → throw Error  ← 5% rechazo
    |-- Crea Donation con transactionId = 'TXN-{ts}-{rnd}'
    |-- status: 'confirmed', confirmado: true
    |-- _donations.push(donation)
    |-- [NO notifica al refugio] ← GAP
    |-- Retorna Donation
    |
    |-- Si exito: setStep('confirmed') → DonationConfirmation
    |     Animacion checkmark + confetti
    |     Recibo: monto, refugio, fecha, metodo, donante, transactionId
    |     CTA: Ver refugio / Volver inicio
    |
    |-- Si error: setStep('error')
    |     Mensaje de error
    |     Boton "Intentar de nuevo" → setStep('payment')

[Refugio en /refugio/donaciones]
    |
    v
ShelterDonationsView
    |-- Lee MOCK_DONATIONS directamente [ACOPLAMIENTO]  ← GAP
    |-- [NO ve donaciones nuevas del flujo anterior]    ← GAP
    |-- Muestra: total mes, total historico, ultima 5 donaciones

[Adoptante — verHistorialDonaciones]
    |
    v
[NO EXISTE UI]  ← GAP
donationService.getDonationsByAdoptante(adoptanteId) — metodo existe pero sin consumidor
```

---

### Flujo de datos esperado (con backend real)

```
[Usuario en /refugios/{slug}/donar]
    |
    v
GET /api/refugios/{slug}  (incluye donationConfig)
    |-- Si !aceptaDonaciones → 404
    |
    v
DonationView
    | Paso 1: AmountSelector
    | Paso 2: Stripe Elements (no PaymentForm propio)
    |   → stripe.createPaymentMethod() → paymentMethodId (token)
    |
    v
POST /api/donaciones
    { refugioId, monto, paymentMethodId, concepto, esAnonima, adoptanteId? }
    |
    v
[Backend]
    |-- stripe.paymentIntents.create({ amount, currency, payment_method })
    |-- stripe.paymentIntents.confirm()
    |-- INSERT donaciones (confirmado=false, status='pending')
    |-- Retorna { donacionId, clientSecret? }
    |
    v
Stripe webhook → POST /api/webhooks/stripe
    |-- payment_intent.succeeded → UPDATE donaciones SET confirmado=true, status='confirmed'
    |-- Envia email/notificacion al refugio
    |-- Envia email de recibo al adoptante (si tiene cuenta)
    |
    v
DonationConfirmation (polling o redirect con donacionId)

[Adoptante en /mis-donaciones]
    |
GET /api/donaciones?adoptanteId={id}  →  lista de donaciones con recibos

[Refugio en /refugio/donaciones]
    |
GET /api/donaciones?refugioId={id}&resumen=true  →  DonationSummary
```

---

*Documento actualizado progresivamente. Cada nuevo diagrama analizado se agrega como seccion.*

---

## Resumen de Correcciones Pendientes en el Frontend

> Esta seccion consolida todos los gaps corregibles desde el frontend (sin necesidad
> de backend real) identificados en DS1-DS4. Se excluyen los que requieren
> gateway de pagos, notificaciones, LLM o persistencia en BD — esos se resuelven
> en la integracion con el backend.

---

### BLOQUE A — Coherencia del modelo de datos (mock)

Correcciones que eliminan inconsistencias entre entidades que ya deberian coordinarse
segun los diagramas, pero el mock no conecta.

---

**A1 — DS2: Al crear una solicitud, el perro no cambia a `en_proceso`**

- **Archivo a modificar:** `modules/adoption/infrastructure/MockAdoptionService.ts`
- **Metodo:** `submit()`
- **Que hace actualmente:** Crea la `AdoptionRequest` con `estado: 'pending'` y no toca el perro.
- **Que debe hacer:** Despues de crear el request, llamar a `dogService.updateDog(payload.perroId, { estado: 'en_proceso' })`.
- **Condicion adicional:** Antes de crear el request, verificar que el perro tenga `estado === 'disponible'`. Si ya esta `en_proceso` o `adoptado`, lanzar error `'Este perro ya no esta disponible para adopcion'`.
- **Impacto en diagrama:** Resuelve `actualizarEstadoPerro("EN_PROCESO")` de la FASE 2 de DS2.

---

**A2 — DS2: Al resolver una solicitud, el perro no actualiza su estado**

- **Archivo a modificar:** `modules/adoption/infrastructure/MockAdoptionService.ts`
- **Metodo:** `updateStatus()`
- **Que hace actualmente:** Actualiza `solicitud.estado` y agrega al historial, pero no toca el perro.
- **Que debe hacer:** Despues de actualizar la solicitud, ejecutar segun el nuevo estado:
  - `approved`  → `dogService.updateDog(req.perroId, { estado: 'adoptado' })`
  - `rejected`  → `dogService.updateDog(req.perroId, { estado: 'disponible' })`
  - `cancelled` → `dogService.updateDog(req.perroId, { estado: 'disponible' })`
- **Impacto en diagrama:** Resuelve `actualizarEstadoPerro("ADOPTADO") / actualizarEstadoPerro("DISPONIBLE")` de la FASE 4 de DS2.

---




**A3 — DS1: `MockMLService` importa `MOCK_DOGS` directamente en lugar de usar `dogService`**

- **Archivo a modificar:** `modules/recommendations/infrastructure/MockMLService.ts`
- **Metodo:** `generateRecommendations()`
- **Que hace actualmente:** `import { MOCK_DOGS } from '@/modules/shared/mockData/dogs.mock'` y filtra en memoria.
- **Que debe hacer:** Importar `dogService` desde `DogServiceFactory` y llamar `await dogService.getDogs({ estado: 'disponible' })` para obtener los perros a evaluar.
- **Impacto en diagrama:** Resuelve la separacion entre `ModeloIACompatibilidad` y `Perro` del DS1. El ML ya no conoce la fuente de datos directamente.

---

**A4 — DS4: `ShelterDonationsView` importa `MOCK_DONATIONS` directamente en lugar de usar el servicio**

- **Archivo a modificar:** `modules/shelter/components/ShelterDonationsView.tsx`
- **Que hace actualmente:** `import { MOCK_DONATIONS } from '@/modules/shared/mockData/donations.mock'` y filtra en el componente.
- **Que debe hacer:** Usar `donationService.getDonationSummary(CURRENT_SHELTER_ID)` al montar con `useEffect`. Agregar estado `isLoading` / `error`.
- **Efecto secundario:** Las donaciones nuevas creadas via `initiateDonation()` apareceran automaticamente en el dashboard del refugio (porque el mock guarda en `_donations` mutable que el servicio ya consulta).
- **Impacto en diagrama:** Resuelve `registrarDonacion()` en la FASE 2 de DS4 — el refugio ve las donaciones en tiempo real dentro de la misma sesion.

---





**A5 — DS1: Campos capturados en el quiz no contribuyen al scoring del mock**

- **Archivo a modificar:** `modules/recommendations/infrastructure/MockMLService.ts`
- **Funcion:** `scoreDog()`
- **Campos sin usar actualmente:** `horasLibresParaPerro`, `tamanoEspacio`, `presupuestoMensualMXN`, `disponibilidadEntrenamiento`, `aceptaPerroConNecesidadesEspeciales`
- **Que debe hacer:** Agregar sub-criterios al scoring para cada campo:
  - `horasLibresParaPerro`: bonus/penalizacion segun nivel de energia del perro vs horas disponibles
  - `presupuestoMensualMXN`: penalizacion si el perro tiene necesidades especiales y el presupuesto es bajo
  - `aceptaPerroConNecesidadesEspeciales`: filtrar o penalizar fuertemente si es `false` y el perro requiere cuidados especiales
  - `disponibilidadEntrenamiento`: ajustar peso de experiencia segun si el usuario esta dispuesto a entrenar
- **Impacto en diagrama:** El mock refleja mejor el `calcularCompatibilidad()` completo del DS1.

---

### BLOQUE B — Vistas faltantes que el diagrama requiere explicitamente

---

**B1 — DS4: No existe historial de donaciones para el adoptante**

- **Archivos a crear:**
  - `app/(applicant)/mis-donaciones/page.tsx` — page server con metadata
  - `modules/donations/components/DonationHistoryView.tsx` — vista client con lista de donaciones
  - `modules/donations/application/hooks/useDonationHistory.ts` — hook que llama `donationService.getDonationsByAdoptante(user.id)`
- **Que debe mostrar:** Lista de donaciones ordenadas por fecha, con: nombre del refugio, monto, fecha, metodo, estado (`confirmed`/`pending`/`failed`), ID de transaccion. Estado vacio con CTA a `/refugios`.
- **Impacto en diagrama:** Resuelve `verHistorialDonaciones()` de la FASE 3 (Cierre) de DS4.

---

**B2 — DS2: Boton "Chatear con el refugio" en `AdoptionDetailView` no tiene funcionalidad**

- **Archivo a modificar:** `modules/adoption/components/AdoptionDetailView.tsx`
- **Linea afectada:** `AdoptionDetailView.tsx:199` — `<button>` sin `onClick` ni `href`
- **Que debe hacer:** Convertirlo en un `<Link>` que navegue a la conversacion correspondiente. La ruta ya existe: `app/(applicant)/chat/[conversationId]/page.tsx`. Necesita derivar o crear el `conversationId` a partir del `request.refugioId` + `user.id`.
- **Dependencia:** Requiere que el modulo de mensajeria tenga un hook para obtener o crear una conversacion entre adoptante y refugio dado un par de IDs.
- **Impacto en diagrama:** El cierre del proceso de adopcion (DS2 FASE 5) queda completo con la comunicacion entre partes.

---




### BLOQUE C — Mejoras de interfaz alineadas con los diagramas

---

**C1 — DS1: `fechaGeneracion` no se muestra en `RecommendationsView`**

- **Archivo a modificar:** `modules/recommendations/components/RecommendationsView.tsx`
- **Donde agregarlo:** En el bloque `rec-header` junto a `totalEvaluados`, despues del conteo de resultados.
- **Formato:** "Generadas el {fecha formateada}" en texto secundario.
- **Impacto:** El usuario sabe si sus recomendaciones son recientes o si debe volver a hacer el quiz.

---

**C2 — DS1: Race condition de hydration en `RecommendationsView`**

- **Archivo a modificar:** `modules/recommendations/components/RecommendationsView.tsx`
- **Problema:** Si `user` es `null` al primer render (store no hidratado), `setLoaded(true)` se ejecuta sin haber leido localStorage, descartando resultados existentes.
- **Solucion:** Agregar un segundo `useEffect` que observe `user?.id` y reintente la lectura de localStorage cuando el ID se establezca, o usar `useAuthStore` con `hydrate()` antes de marcar `loaded`.

---

**C3 — DS3: `IChatbotService.getResponse()` no recibe `sessionId` ni contexto**

- **Archivos a modificar:**
  - `modules/chatbot/infrastructure/IChatbotService.ts` — agregar `sessionId: string` y `userId?: number` como parametros
  - `modules/chatbot/infrastructure/MockChatbotService.ts` — actualizar firma del metodo (puede ignorar los params en mock)
  - `modules/chatbot/application/hooks/useChatbot.ts` — pasar `sessionId` y `user?.id` en la llamada
- **Impacto:** La interfaz queda lista para el backend real sin cambios adicionales en el contrato.

---

**C4 — DS3: Historial del chatbot se pierde al cerrar el panel**

- **Archivo a modificar:** `modules/chatbot/application/hooks/useChatbot.ts`
- **Que debe hacer:** Al montar, leer el historial guardado de `localStorage` bajo la clave `chatbot-session-{sessionId}`. Al agregar cada mensaje, persistir el array `messages` en localStorage. Al llamar `clearHistory()`, limpiar el storage.
- **Limite:** Guardar solo los ultimos N mensajes (ej. 50) para no saturar el storage.
- **Impacto en diagrama:** Aproxima el comportamiento de `registrarConversacion()` del DS3 con medios disponibles en el frontend.

---

**C5 — DS4: Configuracion de donaciones del refugio no llama a ninguna funcion del servicio**

- **Archivo a modificar:** `modules/shelter/components/ShelterDonationsView.tsx`
- **Funcion:** `handleSave()` en `DonationConfigSection`
- **Que hace actualmente:** `setIsEditing(false)` y `setSaved(true)` — sin persistencia.
- **Que debe hacer:** Llamar a un metodo del `shelterService` para guardar la configuracion. En el mock, simplemente actualizar el estado en memoria del servicio. Agregar estado de carga y mensaje de error.
- **Impacto en diagrama:** El ciclo de configuracion del refugio queda cerrado.

---

### BLOQUE D — Correcciones de acceso y seguridad del mock

---

**D1 — DS2: `MockAdoptionService.getById()` no valida que el adoptante sea el dueno**

- **Archivo a modificar:** `modules/adoption/infrastructure/MockAdoptionService.ts`
- **Metodo:** `getById()`
- **Que debe hacer:** Recibir `adoptanteId` como segundo parametro y validar que `request.adoptanteId === adoptanteId`. Si no coincide, retornar `null`.
- **Impacto:** Evita que un adoptante pueda ver solicitudes de otro en el mock.

---

**D2 — DS2: `MockAdoptionService.cancel()` usa `adoptanteId = 0` como default inseguro**

- **Archivo a modificar:** `modules/adoption/infrastructure/MockAdoptionService.ts`
- **Metodo:** `cancel()` — `adoptanteId = 0` permite cancelar cualquier solicitud si no se pasa el ID.
- **Que debe hacer:** Requerir `adoptanteId` como parametro obligatorio (sin default). Actualizar `useRequestDetail` para pasarlo desde `useAuthStore`.

---

### Lo que NO es corregible desde el frontend

Por referencia, estos gaps se resuelven unicamente con backend real:

| Gap | Motivo |
|---|---|
| Gateway de pagos real (Stripe/PayPal) | Requiere backend, cuentas de pago, webhooks |
| Notificaciones al refugio (DS2, DS3, DS4) | Requiere servidor de emails o WebSockets |
| Registro real de conversaciones del chatbot | Requiere BD y autenticacion de sesion |
| Motor de IA/NLP real para el chatbot | Requiere LLM (Claude API, OpenAI, etc.) |
| Subida de fotos de vivienda (`fotosVivienda`) | Requiere bucket de almacenamiento (S3, GCS) |
| Webhooks de confirmacion de pago | Requiere endpoint publico en servidor |
| Transacciones atomicas perro+solicitud | Requiere BD con transacciones |

---

## Plan de Trabajo — Correcciones Frontend

> Ordenado por prioridad: primero las que mayor impacto tienen en el cumplimiento de
> los diagramas, luego las de UX, finalmente las de limpieza de interfaces.
> Cada tarea incluye estimacion de complejidad: **B** = Baja, **M** = Media, **A** = Alta.

---

### Sprint 1 — Coherencia critica del modelo (Bloque A)

Estas correcciones eliminan los gaps mas graves: entidades del diagrama que deben
coordinarse y actualmente no lo hacen. Son las que mas afectan la demostracion del
flujo completo.

| # | Tarea | Archivo(s) | Complejidad |
|---|---|---|---|
| 1 | **A1** — Validar disponibilidad del perro antes de crear solicitud y cambiar su estado a `en_proceso` al crear | `MockAdoptionService.ts` | B |
| 2 | **A2** — Cambiar estado del perro a `adoptado` / `disponible` al aprobar / rechazar / cancelar solicitud | `MockAdoptionService.ts` | B |
| 3 | **A3** — Reemplazar `MOCK_DOGS` directo en `MockMLService` por llamada a `dogService.getDogs()` | `MockMLService.ts` | B |
| 4 | **A4** — Migrar `ShelterDonationsView` de `MOCK_DONATIONS` a `donationService.getDonationSummary()` | `ShelterDonationsView.tsx` | M |

**Resultado esperado del Sprint 1:** Los cuatro flujos de secuencia tienen sus entidades
coordinadas correctamente. Una solicitud aprobada cambia el perro a adoptado. El ML
obtiene perros via servicio. Las donaciones nuevas aparecen en el dashboard del refugio.

---

### Sprint 2 — Vistas faltantes (Bloque B)

Crean las pantallas que el diagrama requiere explicitamente y que aun no existen.

| # | Tarea | Archivo(s) a crear | Complejidad |
|---|---|---|---|
| 5 | **B1** — Hook `useDonationHistory` que llame `donationService.getDonationsByAdoptante()` | `modules/donations/application/hooks/useDonationHistory.ts` | B |
| 6 | **B1** — Vista `DonationHistoryView` con lista, estados, filtros y empty state | `modules/donations/components/DonationHistoryView.tsx` | M |
| 7 | **B1** — Page de historial de donaciones del adoptante | `app/(applicant)/mis-donaciones/page.tsx` | B |
| 8 | **B2** — Convertir boton de chat en `AdoptionDetailView` en `Link` funcional a la ruta de chat | `AdoptionDetailView.tsx` | B |

**Resultado esperado del Sprint 2:** El adoptante puede ver su historial de donaciones.
El boton de chat en el detalle de solicitud navega correctamente.

---

### Sprint 3 — Mejoras de interfaz y UX (Bloque C)

Mejoran la calidad de la experiencia y cierran detalles de los diagramas en la UI.

| # | Tarea | Archivo(s) | Complejidad |
|---|---|---|---|
| 9 | **C1** — Mostrar `fechaGeneracion` en el header de `RecommendationsView` | `RecommendationsView.tsx` | B |
| 10 | **C2** — Corregir race condition de hydration al leer localStorage en `RecommendationsView` | `RecommendationsView.tsx` | M |
| 11 | **C3** — Actualizar `IChatbotService`, `MockChatbotService` y `useChatbot` para incluir `sessionId` y `userId` | `IChatbotService.ts`, `MockChatbotService.ts`, `useChatbot.ts` | B |
| 12 | **C4** — Persistir historial del chatbot en localStorage por sesion | `useChatbot.ts` | M |
| 13 | **C5** — `DonationConfigSection.handleSave()` debe llamar al servicio en lugar de solo cambiar estado local | `ShelterDonationsView.tsx` | B |
| 14 | **A5** — Incorporar campos no usados al algoritmo de scoring del mock (`horasLibresParaPerro`, `presupuestoMensualMXN`, `aceptaPerroConNecesidadesEspeciales`, `disponibilidadEntrenamiento`) | `MockMLService.ts` | M |

**Resultado esperado del Sprint 3:** La UI es mas precisa y completa. El chatbot mantiene
contexto entre aperturas del panel. El scoring del quiz usa todos los campos capturados.

---

### Sprint 4 — Limpieza de acceso y seguridad del mock (Bloque D)

Correcciones menores de robustez que evitan comportamientos inseguros en el mock.

| # | Tarea | Archivo(s) | Complejidad |
|---|---|---|---|
| 15 | **D1** — `MockAdoptionService.getById()` debe validar ownership del adoptante | `MockAdoptionService.ts` | B |
| 16 | **D2** — `MockAdoptionService.cancel()` debe requerir `adoptanteId` obligatorio | `MockAdoptionService.ts`, `useMyRequests.ts` | B |

**Resultado esperado del Sprint 4:** El mock respeta las reglas de autorizacion basicas.
Un adoptante no puede ver ni cancelar solicitudes de otros.

---

### Resumen ejecutivo del plan

| Sprint | Tareas | Foco | Diagramas impactados |
|---|---|---|---|
| Sprint 1 | 1 – 4 | Coherencia critica del modelo | DS1, DS2, DS4 |
| Sprint 2 | 5 – 8 | Vistas faltantes del diagrama | DS2, DS4 |
| Sprint 3 | 9 – 14 | UI/UX y mejoras de algoritmo | DS1, DS3, DS4 |
| Sprint 4 | 15 – 16 | Seguridad y robustez del mock | DS2 |
| **Total** | **16 tareas** | | **DS1, DS2, DS3, DS4** |

---

### Criterios de "listo" por diagrama

Al completar los sprints, cada diagrama debera cumplirse asi:

**DS1 — Recomendaciones:** El ML obtiene perros via `dogService`, todos los campos del quiz
impactan el score, los resultados muestran su fecha de generacion y el store hidrata
correctamente antes de leer localStorage.

**DS2 — Adopcion:** El perro cambia a `en_proceso` al crear la solicitud. Al aprobar cambia
a `adoptado`, al rechazar/cancelar vuelve a `disponible`. El boton de chat en el
detalle navega a la conversacion. El mock valida que solo el dueno cancele su solicitud.

**DS3 — Chatbot:** El servicio recibe `sessionId` y `userId`. El historial sobrevive al
cerrar y reabrir el panel dentro de la misma sesion.

**DS4 — Donaciones:** El adoptante puede ver su historial de donaciones. Las donaciones
nuevas aparecen en el dashboard del refugio. La configuracion del refugio se guarda
via servicio. El dashboard lee datos via `donationService` y no desde datos crudos.

---

*Plan sujeto a revision conforme se analicen los diagramas de casos de uso.*
