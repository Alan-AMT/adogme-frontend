# Service Interaction Map — aDOGme Frontend

> **Generated:** 2026-04-10
> **Purpose:** Complete mapping of all service calls, data contracts, mock sources, and UI dependencies to facilitate migration from mock services to real backend microservices.
> **Environment toggle:** `NEXT_PUBLIC_USE_MOCK` in `.env` (`true` = mock, `false` = real API)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Auth Service](#2-auth-service)
3. [Dog Service](#3-dog-service)
4. [Adoption Service](#4-adoption-service)
5. [Home Service](#5-home-service)
6. [Shelter Service](#6-shelter-service)
7. [Messaging Service](#7-messaging-service)
8. [Donation Service](#8-donation-service)
9. [Recommendation / ML Service](#9-recommendation--ml-service)
10. [Chatbot Service](#10-chatbot-service)
11. [Admin Service](#11-admin-service)
12. [Profile Service](#12-profile-service)
13. [Media Validation Service](#13-media-validation-service)
14. [Favorites (Client-Only)](#14-favorites-client-only)
15. [Global Infrastructure](#15-global-infrastructure)
16. [Cross-Cutting Migration Risks](#16-cross-cutting-migration-risks)

---

## 1. Architecture Overview

### Pattern

Every module follows **Interface + Mock + Real + Factory**:

```
modules/<module>/
  infrastructure/
    I<Service>.ts          ← interface contract
    Mock<Service>.ts       ← in-memory implementation
    <Service>.ts           ← real API implementation (often missing)
    <Service>Factory.ts    ← singleton, env-based toggle
  application/hooks/
    use<Feature>.ts        ← React hooks consuming the service
  components/
    <View>.tsx             ← UI components consuming hooks
  domain/
    <types>.ts             ← TypeScript interfaces
```

### Current Implementation Status

| Module           | Interface                 | Mock                         | Real Implementation                           | Factory                  |
| ---------------- | ------------------------- | ---------------------------- | --------------------------------------------- | ------------------------ |
| Auth             | `IAuthService`            | `MockAuthService`            | **`AuthService` (partial)**                   | `AuthServiceFactory`     |
| Dogs             | `IDogService`             | `MockDogService`             | Missing                                       | `DogServiceFactory`      |
| Adoption         | `IAdoptionService`        | `MockAdoptionService`        | Missing                                       | `AdoptionServiceFactory` |
| Home             | `IHomeService`            | `MockHomeService`            | **`HomeService` (uses fetch, not apiClient)** | `HomeServiceFactory`     |
| Shelter          | `IShelterService`         | `MockShelterService`         | Missing                                       | `ShelterServiceFactory`  |
| Messaging        | `IMessageService`         | `MockMessageService`         | Missing                                       | `MessageServiceFactory`  |
| Donations        | `IDonationService`        | `MockDonationService`        | Missing                                       | `DonationServiceFactory` |
| Recommendations  | `IMLService`              | `MockMLService`              | Missing                                       | `MLServiceFactory`       |
| Chatbot          | `IChatbotService`         | `MockChatbotService`         | Missing                                       | `ChatbotServiceFactory`  |
| Admin            | `IAdminService`           | `MockAdminService`           | Missing                                       | `AdminServiceFactory`    |
| Profile          | `IProfileService`         | `MockProfileService`         | Missing                                       | `ProfileServiceFactory`  |
| Media Validation | `IMediaValidationService` | `MockMediaValidationService` | Missing                                       | Inline                   |

### API Client Configuration

**File:** `modules/shared/infrastructure/api/apiClient.ts`

```typescript
// Axios instance
baseURL:         process.env.NEXT_PUBLIC_API_URL
timeout:         15_000
headers:         { 'Content-Type': 'application/json', 'x-api-key': NEXT_PUBLIC_API_KEY }
withCredentials: true  // sends HTTP-only cookies

// Request interceptor: adds Authorization: Bearer <window.__authToken>
// Response interceptor:
//   401 → token refresh via POST /auth-ms/user/update-tokens (queue concurrent 401s)
//   403 → redirect to /
//   5xx → dispatches CustomEvent('api:server-error')
```

### API Gateway Base URLs

```
BASE = NEXT_PUBLIC_API_URL   (e.g. https://gateway-config-with-jwt-security-dvelzwzp.uc.gateway.dev)
ML   = NEXT_PUBLIC_ML_API_URL (separate ML microservice)
WS   = NEXT_PUBLIC_WS_URL    (WebSocket for real-time chat)
```

---

## 2. Auth Service

### Service Contract

**Interface:** `modules/auth/infrastructure/IAuthService.ts`
**Mock:** `modules/auth/infrastructure/MockAuthService.ts`
**Real:** `modules/auth/infrastructure/AuthService.ts`
**Factory:** `modules/auth/infrastructure/AuthServiceFactory.ts`

### 2.1 `login(credentials)`

| Property         | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| **Method**       | `POST`                                                         |
| **Endpoint**     | `/auth-ms/user/login`                                          |
| **Called from**  | `useLogin` hook → `modules/auth/application/hooks/useLogin.ts` |
| **UI consumers** | `LoginView` component                                          |

**Request Payload:**

| Field      | Type     | Required | Notes                                    |
| ---------- | -------- | -------- | ---------------------------------------- |
| `email`    | `string` | Yes      | Mock uses `correo`, real maps to `email` |
| `password` | `string` | Yes      | Min 6 chars (UI validation)              |

> **MISMATCH:** Mock accepts `{ correo, password }` (LoginCredentials interface). Real `AuthService` maps `correo` → `email` before sending. Backend expects `{ email, password }`.

**Mock Credentials:**

| Email                   | Password     | Role               | User ID |
| ----------------------- | ------------ | ------------------ | ------- |
| `ana@test.com`          | `test1234`   | applicant          | 101     |
| `refugio@huellitas.com` | `shelter123` | shelter (approved) | 201     |
| `nuevo@refugio.com`     | `pending123` | shelter (pending)  | 202     |
| `admin@plataforma.com`  | `admin123`   | admin              | 301     |

**Response Structure (`AuthResponse`):**

| Field                | Type                                                   | Required         | Used by UI                                           | Notes                                    |
| -------------------- | ------------------------------------------------------ | ---------------- | ---------------------------------------------------- | ---------------------------------------- |
| `user`               | `Adoptante \| ShelterUser \| Administrador`            | Yes              | `authStore.setUser()`                                | Full user object                         |
| `user.id`            | `number`                                               | Yes              | All authenticated hooks                              | Primary identifier                       |
| `user.nombre`        | `string`                                               | Yes              | Navbar, profile                                      | Display name                             |
| `user.correo`        | `string`                                               | Yes              | Profile                                              | Email display                            |
| `user.telefono`      | `string`                                               | Yes              | Profile                                              | Phone display                            |
| `user.role`          | `'applicant' \| 'shelter' \| 'admin'`                  | Yes              | Route redirects, role checks                         | Determines post-login redirect           |
| `user.status`        | `'active' \| 'suspended' \| 'pending_verification'`    | Yes              | Access control                                       |                                          |
| `user.avatarUrl`     | `string?`                                              | No               | Navbar avatar                                        | Optional                                 |
| `user.fechaRegistro` | `string` (ISO)                                         | Yes              | Profile                                              |                                          |
| `user.direccion`     | `string`                                               | Adoptante only   | Profile                                              |                                          |
| `user.shelterId`     | `number`                                               | ShelterUser only | All shelter hooks                                    | Critical — identifies which shelter      |
| `user.shelterStatus` | `'pending' \| 'approved' \| 'rejected' \| 'suspended'` | ShelterUser only | Login flow                                           | `pending` triggers SHELTER_PENDING error |
| `user.puesto`        | `string`                                               | Admin only       | Profile                                              |                                          |
| `token`              | `string`                                               | Yes              | `authStore.setToken()`, cookie, `window.__authToken` |                                          |
| `refreshToken`       | `string`                                               | Yes              | Not used by frontend directly                        | Backend manages refresh                  |
| `expiresAt`          | `string` (ISO)                                         | Yes              | Not used by frontend directly                        |                                          |

> **MISMATCH:** Real `AuthService` receives `{ user, accessToken, refreshToken }` from backend and maps `accessToken` → `token`. The mock generates a base64-encoded JSON payload as a fake JWT.

**Post-login redirect logic (in `useLogin`):**

| Role        | Redirect Target                            |
| ----------- | ------------------------------------------ |
| `admin`     | `/admin`                                   |
| `shelter`   | `/refugio/dashboard`                       |
| `applicant` | `/mis-solicitudes` (or `?redirect=` param) |

**Special behaviors:**

- If shelter user has `shelterStatus === 'pending'`, mock throws `Error('SHELTER_PENDING: ...')` → UI shows pending state card
- Token stored in cookie `auth-token` (24h TTL) AND `window.__authToken`

---

### 2.2 `register(data)`

| Property         | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| **Method**       | `POST`                                                               |
| **Endpoint**     | `/auth-ms/adopter`                                                   |
| **Called from**  | `useRegister` hook → `modules/auth/application/hooks/useRegister.ts` |
| **UI consumers** | `RegisterView` (adoptante variant)                                   |

**Request Payload (frontend `RegisterData`):**

| Field            | Type      | Required | Sent to Backend | Notes                                                        |
| ---------------- | --------- | -------- | --------------- | ------------------------------------------------------------ |
| `nombre`         | `string`  | Yes      | `name`          | Real maps `nombre` → `name`                                  |
| `correo`         | `string`  | Yes      | `email`         | Real maps `correo` → `email`                                 |
| `telefono`       | `string`  | Yes      | **NOT SENT**    | Real implementation only sends email, name, password         |
| `password`       | `string`  | Yes      | `password`      | Min 8 chars (UI validation)                                  |
| `alcaldia`       | `string?` | No       | **NOT SENT**    | Address fields exist in interface but real impl ignores them |
| `colonia`        | `string?` | No       | **NOT SENT**    |                                                              |
| `calle`          | `string?` | No       | **NOT SENT**    |                                                              |
| `numeroExterior` | `string?` | No       | **NOT SENT**    |                                                              |
| `numeroInterior` | `string?` | No       | **NOT SENT**    |                                                              |
| `codigoPostal`   | `string?` | No       | **NOT SENT**    |                                                              |

> **CRITICAL MISMATCH:** The real `AuthService.register()` only sends `{ email, name, password }`. The frontend collects phone, address fields (alcaldia, colonia, calle, numExt, numInt, cp) but the real implementation discards them. Either the backend needs to accept these fields or a second API call is needed to update the profile after registration.

**Response:** `void` (no response body)

---

### 2.3 `registerShelter(data)`

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| **Method**      | `POST` (2 sequential calls)                                 |
| **Endpoints**   | Step 1: `/auth-ms/shelter` → Step 2: `/shelters-ms/shelter` |
| **Called from** | `useRegister` hook (refugio variant)                        |

**Step 1 Payload — Create User:**

| Field      | Type     | Sent to Backend | Notes                |
| ---------- | -------- | --------------- | -------------------- |
| `email`    | `string` | `email`         | Mapped from `correo` |
| `name`     | `string` | `name`          | Mapped from `nombre` |
| `password` | `string` | `password`      |                      |

**Step 1 Response:** `{ user: { id: string } }`

**Step 2 Payload — Create Shelter Profile:**

| Field         | Type      | Sent to Backend | Notes                         |
| ------------- | --------- | --------------- | ----------------------------- |
| `userId`      | `string`  | `userId`        | From step 1 response          |
| `name`        | `string`  | `name`          | Mapped from `nombreRefugio`   |
| `description` | `string?` | `description`   | Mapped from `descripcion`     |
| `phone`       | `string?` | `phone`         | Mapped from `telefonoRefugio` |
| `email`       | `string?` | `email`         | Mapped from `correoRefugio`   |
| `ubicacion`   | `string`  | `ubicacion`     | Mapped from `alcaldia`        |

> **MISMATCH:** Frontend collects `direccion`, `horario`, `capacidad` but the real impl does NOT send these to the shelter creation endpoint. The `telefono` of the user account is also not sent.

**Full frontend form data (`ShelterRegisterData`):**

| Field             | Type      | Required | Notes                                   |
| ----------------- | --------- | -------- | --------------------------------------- |
| `nombre`          | `string`  | Yes      | Account holder name                     |
| `correo`          | `string`  | Yes      | Account email                           |
| `telefono`        | `string`  | Yes      | Account phone — **not sent to backend** |
| `password`        | `string`  | Yes      | Min 8 chars                             |
| `nombreRefugio`   | `string`  | Yes      | Shelter display name                    |
| `alcaldia`        | `string`  | Yes      | Mapped to `ubicacion`                   |
| `direccion`       | `string`  | Yes      | **Not sent to backend**                 |
| `telefonoRefugio` | `string?` | No       | Sent as `phone`                         |
| `correoRefugio`   | `string?` | No       | Sent as `email`                         |
| `horario`         | `string?` | No       | **Not sent to backend**                 |
| `capacidad`       | `number?` | No       | **Not sent to backend**                 |
| `descripcion`     | `string?` | No       | Sent as `description`                   |

---

### 2.4 `forgotPassword(email)` / `resetPassword(token, password)`

| Property                | Value                                                   |
| ----------------------- | ------------------------------------------------------- |
| **Endpoints**           | `/api/auth/forgot-password`, `/api/auth/reset-password` |
| **Real implementation** | `throw new Error('Not implemented')`                    |
| **Mock**                | Returns void (always succeeds)                          |

> **NOT IMPLEMENTED** in real service. Backend endpoints defined but no implementation.

---

### 2.5 `logout()`

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| **Method**      | `POST`                                 |
| **Endpoint**    | `/api/auth/logout`                     |
| **Called from** | `authStore.logout()`, Navbar component |

**Mock behavior:** Clears cookie + `window.__authToken`
**Real behavior:** `POST /api/auth/logout` then clears local state

---

### Mock Source Mapping

| Source           | File                                       | Type                  |
| ---------------- | ------------------------------------------ | --------------------- |
| User objects     | `modules/shared/mockData/users.mock.ts`    | Static (4 users)      |
| Credentials map  | `MOCK_CREDENTIALS` in `users.mock.ts`      | Static                |
| Token generation | `buildMockToken()` in `MockAuthService.ts` | Dynamic (base64 JSON) |
| Alcaldias list   | `ALCALDIAS_CDMX` in `MockAuthService.ts`   | Static (16 items)     |

### Migration Notes — Auth

| Risk                                    | Severity | Description                                                                                                                                                                                                                                                                     |
| --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Field mapping divergence**            | HIGH     | Real `AuthService` maps `correo`→`email`, `nombre`→`name`. If backend field names differ from this mapping, it will break silently.                                                                                                                                             |
| **Registration data loss**              | HIGH     | `register()` discards phone+address. Backend must either accept these in the registration endpoint or the frontend must make a follow-up profile update call.                                                                                                                   |
| **Shelter registration is 2 API calls** | MEDIUM   | If step 1 succeeds but step 2 fails, an orphaned user account is created with no shelter profile. Needs transaction/compensation logic.                                                                                                                                         |
| **Token format**                        | HIGH     | Mock generates base64 JSON. `authStore.hydrate()` + `decodeUserFromToken()` parse the token as base64 JSON to extract user data. Real JWTs have 3 segments (header.payload.signature). The hydrate function will fail on real JWTs unless updated to parse the payload segment. |
| **Cookie management**                   | MEDIUM   | Mock sets cookie client-side. Real backend should set HTTP-only cookies server-side. Current client-side cookie code may conflict.                                                                                                                                              |
| **`forgotPassword` / `resetPassword`**  | HIGH     | Real implementations throw "Not implemented". These features won't work until backend endpoints are connected.                                                                                                                                                                  |
| **Deprecated shim functions**           | LOW      | `mockLogin()`, `mockRegisterAdoptante()`, `mockRegisterRefugio()` still exported. Need to verify no component calls them directly.                                                                                                                                              |

**Suggested Backend Contract — Login:**

```json
// POST /auth-ms/user/login
// Request
{ "email": "string", "password": "string" }

// Response 200
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "applicant | shelter | admin",
    "status": "active | suspended | pending_verification",
    "avatarUrl": "string | null",
    "registeredAt": "ISO datetime",
    // role-specific fields:
    "address": "string | null",        // applicant
    "shelterId": "number | null",      // shelter
    "shelterStatus": "string | null",  // shelter
    "position": "string | null"        // admin
  },
  "accessToken": "string (JWT)",
  "refreshToken": "string",
  "expiresAt": "ISO datetime"
}
```

---

## 3. Dog Service

### Service Contract

**Interface:** `modules/dogs/infrastructure/IDogService.ts`
**Mock:** `modules/dogs/infrastructure/MockDogService.ts`
**Real:** Missing
**Factory:** `modules/dogs/infrastructure/DogServiceFactory.ts`

---

### 3.1 `getDogs(filters?)`

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Method**       | `GET`                                                        |
| **Endpoint**     | `/api/dogs` (with query params)                              |
| **Called from**  | `useDogs` hook → `modules/dogs/application/hooks/useDogs.ts` |
| **UI consumers** | `DogsSearchView`, `DogGrid`, `DogCard` components            |

**Request — Query Parameters (`DogFilters`):**

| Field                   | Type                                                                  | Required | Notes                                           |
| ----------------------- | --------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| `search`                | `string?`                                                             | No       | Free text, searches nombre + raza + descripcion |
| `raza`                  | `string?`                                                             | No       | Breed filter                                    |
| `tamano`                | `'pequeño' \| 'mediano' \| 'grande' \| 'gigante' \| ''`               | No       | Size filter                                     |
| `sexo`                  | `'macho' \| 'hembra' \| ''`                                           | No       |                                                 |
| `edadCategoria`         | `'cachorro' \| 'joven' \| 'adulto' \| 'senior' \| ''`                 | No       |                                                 |
| `nivelEnergia`          | `'baja' \| 'moderada' \| 'alta' \| 'muy_alta' \| ''`                  | No       |                                                 |
| `estado`                | `'disponible' \| 'en_proceso' \| 'adoptado' \| 'no_disponible' \| ''` | No       |                                                 |
| `aptoNinos`             | `boolean?`                                                            | No       |                                                 |
| `aptoPerros`            | `boolean?`                                                            | No       |                                                 |
| `aptoGatos`             | `boolean?`                                                            | No       |                                                 |
| `necesitaJardin`        | `boolean?`                                                            | No       |                                                 |
| `castrado`              | `boolean?`                                                            | No       |                                                 |
| `refugioId`             | `number?`                                                             | No       | Filter by shelter                               |
| `ciudad`                | `string?`                                                             | No       | Filter by shelter city                          |
| `soloConCompatibilidad` | `boolean?`                                                            | No       | Only show dogs with score > 0                   |
| `page`                  | `number?`                                                             | No       | Default: 1                                      |
| `limit`                 | `number?`                                                             | No       | Default: 12                                     |
| `sortBy`                | `'fechaRegistro' \| 'compatibilidad' \| 'nombre'`                     | No       |                                                 |
| `sortOrder`             | `'asc' \| 'desc'`                                                     | No       |                                                 |

**Response (`PaginatedDogs`):**

| Field        | Type            | Required | Used by UI            | Notes                  |
| ------------ | --------------- | -------- | --------------------- | ---------------------- |
| `data`       | `DogListItem[]` | Yes      | Dog cards grid        | Array of dog summaries |
| `total`      | `number`        | Yes      | Results count display | Total matching dogs    |
| `page`       | `number`        | Yes      | Pagination control    | Current page           |
| `totalPages` | `number`        | Yes      | Pagination control    | Total pages            |
| `limit`      | `number`        | Yes      | Pagination control    | Items per page         |

**`DogListItem` fields used by UI:**

| Field            | Type              | Required | UI Component   | Usage                     |
| ---------------- | ----------------- | -------- | -------------- | ------------------------- |
| `id`             | `number`          | Yes      | DogCard, links | Navigation, key           |
| `refugioId`      | `number`          | Yes      | DogCard        | Shelter context           |
| `nombre`         | `string`          | Yes      | DogCard        | Title, alt text           |
| `edad`           | `number` (months) | Yes      | DogCard        | Age label (e.g. "2 años") |
| `edadCategoria`  | `AgeCategory`     | Yes      | DogCard        | Age badge                 |
| `raza`           | `string`          | Yes      | DogCard        | Breed text                |
| `tamano`         | `DogSize`         | Yes      | DogCard        | Size label                |
| `sexo`           | `DogSex`          | Yes      | DogCard        | Gender icon               |
| `nivelEnergia`   | `EnergyLevel`     | Yes      | DogCard        | Energy indicator          |
| `estado`         | `DogStatus`       | Yes      | DogCard        | Status badge, filtering   |
| `foto`           | `string` (URL)    | Yes      | DogCard        | Main image                |
| `compatibilidad` | `number` (0-100)  | Yes      | DogCard        | Match score               |
| `aptoNinos`      | `boolean`         | Yes      | DogCard        | Compatibility icon        |
| `aptoPerros`     | `boolean`         | Yes      | DogCard        | Compatibility icon        |
| `necesitaJardin` | `boolean`         | Yes      | DogCard        | Compatibility icon        |
| `refugioNombre`  | `string?`         | No       | DogCard        | Shelter name              |
| `refugioSlug`    | `string?`         | No       | DogCard        | Shelter link              |
| `refugioCiudad`  | `string?`         | No       | DogCard        | Shelter location          |

---

### 3.2 `getDogById(id)` / `getDogBySlug(slug)`

| Property         | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Method**       | `GET`                                                                  |
| **Endpoints**    | `/api/dogs/{id}`, `/api/dogs/slug/{slug}`                              |
| **Called from**  | `useDogDetail` hook → `modules/dogs/application/hooks/useDogDetail.ts` |
| **UI consumers** | `DogDetailView`, `AdoptionFormView`, `SimilarDogsCarousel`             |

**Response (`Dog`) — Full entity:**

| Field            | Type               | Required | Used by UI                 | Notes     |
| ---------------- | ------------------ | -------- | -------------------------- | --------- |
| `id`             | `number`           | Yes      | Links, adoption form       |           |
| `refugioId`      | `number`           | Yes      | Messaging, donations       |           |
| `nombre`         | `string`           | Yes      | Title, breadcrumb          |           |
| `edad`           | `number` (months)  | Yes      | Age display                |           |
| `raza`           | `string`           | Yes      | Subtitle                   |           |
| `tamano`         | `DogSize`          | Yes      | Info display               |           |
| `nivelEnergia`   | `EnergyLevel`      | Yes      | Energy display             |           |
| `sexo`           | `DogSex`           | Yes      | Gender display             |           |
| `salud`          | `string`           | Yes      | Health section             | Free text |
| `estado`         | `DogStatus`        | Yes      | Status badge, availability |           |
| `compatibilidad` | `number` (0-100)   | Yes      | Score display              |           |
| `descripcion`    | `string`           | Yes      | Description section        |           |
| `foto`           | `string` (URL)     | Yes      | Main image                 |           |
| `fechaRegistro`  | `string` (ISO)     | Yes      | "Available since"          |           |
| `fotos`          | `string[]`         | Yes      | Image gallery              |           |
| `edadCategoria`  | `AgeCategory`      | Yes      | Age badge                  |           |
| `vacunas`        | `Vaccination[]`    | Yes      | Vaccination cards          |           |
| `personalidad`   | `PersonalityTag[]` | Yes      | Personality chips          |           |
| `castrado`       | `boolean`          | Yes      | Info display               |           |
| `microchip`      | `boolean`          | Yes      | Info display               |           |
| `aptoNinos`      | `boolean`          | Yes      | Compatibility section      |           |
| `aptoPerros`     | `boolean`          | Yes      | Compatibility section      |           |
| `aptoGatos`      | `boolean`          | Yes      | Compatibility section      |           |
| `necesitaJardin` | `boolean`          | Yes      | Compatibility section      |           |
| `pesoKg`         | `number?`          | No       | Weight display             | Optional  |
| `refugioNombre`  | `string?`          | No       | Shelter name               |           |
| `refugioSlug`    | `string?`          | No       | Shelter profile link       |           |
| `refugioCiudad`  | `string?`          | No       | Location display           |           |
| `refugioLogo`    | `string?`          | No       | Shelter logo               |           |

**Sub-entities:**

`Vaccination`:

| Field          | Type           | Required | Used by UI    |
| -------------- | -------------- | -------- | ------------- |
| `id`           | `number`       | Yes      | Key           |
| `nombre`       | `string`       | Yes      | Vaccine name  |
| `fecha`        | `string` (ISO) | Yes      | Date display  |
| `proximaDosis` | `string?`      | No       | Next dose     |
| `verificada`   | `boolean`      | Yes      | Badge styling |

`PersonalityTag`:

| Field       | Type                                                              | Required | Used by UI    |
| ----------- | ----------------------------------------------------------------- | -------- | ------------- |
| `id`        | `number`                                                          | Yes      | Key           |
| `label`     | `string`                                                          | Yes      | Chip text     |
| `icon`      | `string`                                                          | Yes      | Emoji display |
| `categoria` | `'caracter' \| 'socialización' \| 'actividad' \| 'entrenamiento'` | Yes      | Chip color    |

---

### 3.3 `createDog(data)` / `updateDog(id, data)`

| Property         | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Method**       | `POST` / `PUT`                                                        |
| **Endpoints**    | `POST /api/dogs`, `PUT /api/dogs/{id}`                                |
| **Called from**  | `useDogForm` hook → `modules/shelter/application/hooks/useDogForm.ts` |
| **UI consumers** | Dog form (6-step wizard in shelter portal)                            |

**Request Payload (`DogCreateData`):**

| Field            | Type                | Required | Notes                    |
| ---------------- | ------------------- | -------- | ------------------------ |
| `refugioId`      | `number`            | Yes      | Auto-set from auth       |
| `nombre`         | `string`            | Yes      |                          |
| `edad`           | `number`            | Yes      | In months                |
| `raza`           | `string`            | Yes      |                          |
| `tamano`         | `DogSize`           | Yes      |                          |
| `nivelEnergia`   | `EnergyLevel`       | Yes      |                          |
| `sexo`           | `DogSex`            | Yes      |                          |
| `descripcion`    | `string`            | Yes      |                          |
| `foto`           | `string` (URL)      | Yes      | Main image URL           |
| `fotos`          | `string[]?`         | No       | Gallery URLs             |
| `salud`          | `string?`           | No       |                          |
| `edadCategoria`  | `AgeCategory?`      | No       | Mock auto-calculates     |
| `castrado`       | `boolean?`          | No       |                          |
| `microchip`      | `boolean?`          | No       |                          |
| `aptoNinos`      | `boolean?`          | No       |                          |
| `aptoPerros`     | `boolean?`          | No       |                          |
| `aptoGatos`      | `boolean?`          | No       |                          |
| `necesitaJardin` | `boolean?`          | No       |                          |
| `pesoKg`         | `number?`           | No       |                          |
| `personalidad`   | `PersonalityTag[]?` | No       | Full tag objects         |
| `vacunas`        | `Vaccination[]?`    | No       | Full vaccination records |

**`DogUpdateData`** = `Partial<Omit<DogCreateData, 'refugioId'>> & { estado?: DogStatus }`

**Response:** Full `Dog` object (same as getDogById)

---

### 3.4 `deleteDog(id)` / `publishDog(id)` / `unpublishDog(id)`

| Method             | Endpoint         | Response                               |
| ------------------ | ---------------- | -------------------------------------- |
| `DELETE`           | `/api/dogs/{id}` | `void`                                 |
| `PATCH` (inferred) | `/api/dogs/{id}` | `Dog` (with `estado: 'disponible'`)    |
| `PATCH` (inferred) | `/api/dogs/{id}` | `Dog` (with `estado: 'no_disponible'`) |

---

### 3.5 `validateMedia(urls)`

| Property        | Value                          |
| --------------- | ------------------------------ |
| **Endpoint**    | `/api/media/upload` (inferred) |
| **Called from** | `useDogForm` hook              |

**Request:** `string[]` (array of image URLs)
**Response:** `MediaValidationResult[]`

| Field   | Type                                                               | Notes             |
| ------- | ------------------------------------------------------------------ | ----------------- |
| `url`   | `string`                                                           | The validated URL |
| `valid` | `boolean`                                                          | Pass/fail         |
| `error` | `'not_found' \| 'too_large' \| 'invalid_format' \| 'unreachable'?` | Failure reason    |

---

### Mock Source Mapping — Dogs

| Source       | File                                            | Type                             |
| ------------ | ----------------------------------------------- | -------------------------------- |
| Dog data     | `modules/shared/mockData/dogs.mock.ts`          | Static (30 dogs)                 |
| Mock service | `modules/dogs/infrastructure/MockDogService.ts` | Dynamic (mutable in-memory copy) |
| Re-export    | `modules/dogs/infrastructure/MockDogsList.ts`   | Re-exports MOCK_DOGS             |

### Migration Notes — Dogs

| Risk                               | Severity | Description                                                                                                                                                                              |
| ---------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`edadCategoria` computation**    | MEDIUM   | Mock auto-computes age category from `edad` (months). Backend must either compute this server-side or the frontend must add a transformation layer.                                      |
| **`compatibilidad` scale**         | HIGH     | Domain comment says "float 0-1 en BD; 0-100 en FE". If backend returns 0-1 floats, frontend needs a `* 100` transformation.                                                              |
| **`personalidad` as full objects** | MEDIUM   | Mock sends/receives full `PersonalityTag` objects. Backend may store as IDs requiring a lookup/join.                                                                                     |
| **Shelter join data**              | HIGH     | `refugioNombre`, `refugioSlug`, `refugioCiudad`, `refugioLogo` are denormalized join fields. Backend must include these in responses or frontend must make additional shelter API calls. |
| **Full-text search**               | MEDIUM   | Mock does client-side search across nombre+raza+descripcion. Backend needs equivalent search capability.                                                                                 |
| **Sorting**                        | LOW      | Mock sorts by `fechaRegistro`, `compatibilidad`, `nombre`. Backend needs to support these sort options.                                                                                  |

---

## 4. Adoption Service

### Service Contract

**Interface:** `modules/adoption/infrastructure/IAdoptionService.ts`
**Mock:** `modules/adoption/infrastructure/MockAdoptionService.ts`
**Real:** Missing
**Factory:** `modules/adoption/infrastructure/AdoptionServiceFactory.ts`

---

### 4.1 `submit(payload, adoptanteId)`

| Property         | Value                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| **Method**       | `POST`                                                                           |
| **Endpoint**     | `/api/adoptions`                                                                 |
| **Called from**  | `useAdoptionForm` hook → `modules/adoption/application/hooks/useAdoptionForm.ts` |
| **UI consumers** | `AdoptionFormView` (6-step wizard)                                               |

**Request Payload (`SubmitAdoptionPayload`):**

| Field         | Type               | Required | Notes                     |
| ------------- | ------------------ | -------- | ------------------------- |
| `perroId`     | `number`           | Yes      | Dog being adopted         |
| `refugioId`   | `number`           | Yes      | Shelter owning the dog    |
| `comentarios` | `string`           | Yes      | Free text from adoptante  |
| `formulario`  | `AdoptionFormData` | Yes      | Complete form (see below) |

**`AdoptionFormData` (nested in payload):**

| Field                      | Type                                                     | Required | Notes                                                |
| -------------------------- | -------------------------------------------------------- | -------- | ---------------------------------------------------- |
| `motivacion`               | `string`                                                 | Yes      | Why this dog                                         |
| `experienciaPrevia`        | `boolean`                                                | Yes      | Prior pet experience                                 |
| `descripcionExperiencia`   | `string?`                                                | No       | If experienced                                       |
| `vivienda.tipo`            | `HousingType`                                            | Yes      | `'casa' \| 'departamento' \| 'casa_campo' \| 'otro'` |
| `vivienda.esPropietario`   | `boolean`                                                | Yes      | Owner vs renter                                      |
| `vivienda.tieneJardin`     | `boolean`                                                | Yes      |                                                      |
| `vivienda.tamanoJardinM2`  | `number?`                                                | No       | If has garden                                        |
| `vivienda.tieneRejaOCerca` | `boolean`                                                | Yes      |                                                      |
| `vivienda.fotosVivienda`   | `string[]`                                               | Yes      | Photo URLs                                           |
| `vivienda.permiteAnimales` | `boolean?`                                               | No       | If renter                                            |
| `horasEnCasa`              | `number`                                                 | Yes      | Daily hours at home                                  |
| `actividadFisica`          | `'sedentario' \| 'moderado' \| 'activo' \| 'muy_activo'` | Yes      |                                                      |
| `conviveConNinos`          | `boolean`                                                | Yes      |                                                      |
| `edadesNinos`              | `number[]?`                                              | No       | If has children                                      |
| `conviveConMascotas`       | `boolean`                                                | Yes      |                                                      |
| `descripcionMascotas`      | `string?`                                                | No       | If has other pets                                    |
| `aceptaVisitaPrevia`       | `boolean`                                                | Yes      |                                                      |
| `aceptaTerminos`           | `boolean`                                                | Yes      | Must be true                                         |
| `comentariosAdicionales`   | `string?`                                                | No       |                                                      |

**Response:** Full `AdoptionRequest` object

---

### 4.2 `getMyRequests(adoptanteId)`

| Property         | Value                |
| ---------------- | -------------------- |
| **Method**       | `GET`                |
| **Endpoint**     | `/api/adoptions/me`  |
| **Called from**  | `useMyRequests` hook |
| **UI consumers** | `AdoptionStatusView` |

**Response:** `AdoptionRequestListItem[]`

| Field             | Type            | Used by UI | Usage                   |
| ----------------- | --------------- | ---------- | ----------------------- |
| `id`              | `number`        | Yes        | Key, link               |
| `adoptanteId`     | `number`        | Yes        | Ownership               |
| `perroId`         | `number`        | Yes        | Dog link                |
| `refugioId`       | `number`        | Yes        | Shelter context         |
| `fecha`           | `string` (ISO)  | Yes        | Date display            |
| `estado`          | `RequestStatus` | Yes        | Status badge, filtering |
| `perroNombre`     | `string?`       | Yes        | Dog name display        |
| `perroFoto`       | `string?`       | Yes        | Dog thumbnail           |
| `refugioNombre`   | `string?`       | Yes        | Shelter name            |
| `adoptanteNombre` | `string?`       | Yes        | (Shelter view)          |

---

### 4.3 `getById(id, adoptanteId?)`

| Property         | Value                              |
| ---------------- | ---------------------------------- |
| **Method**       | `GET`                              |
| **Endpoint**     | `/api/adoptions/{id}`              |
| **Called from**  | `useMyRequests` hook (detail mode) |
| **UI consumers** | `AdoptionDetailView`               |

**Response:** Full `AdoptionRequest`

All fields from `AdoptionRequestListItem` plus:

| Field             | Type               | Used by UI | Usage                    |
| ----------------- | ------------------ | ---------- | ------------------------ |
| `comentarios`     | `string`           | Yes        | Comments display         |
| `formulario`      | `AdoptionFormData` | Yes        | Full form review section |
| `historial`       | `StatusChange[]`   | Yes        | Timeline display         |
| `perroSlug`       | `string?`          | Yes        | Dog profile link         |
| `adoptanteCorreo` | `string?`          | Yes        | (Shelter view)           |

**`StatusChange` fields used by UI:**

| Field         | Type            | Used by UI           |
| ------------- | --------------- | -------------------- |
| `id`          | `number`        | Key                  |
| `estadoNuevo` | `RequestStatus` | Timeline entry label |
| `fecha`       | `string` (ISO)  | Timeline timestamp   |
| `comentario`  | `string?`       | Timeline comment     |

---

### 4.4 `cancel(id, adoptanteId, motivo?)`

| Property        | Value                        |
| --------------- | ---------------------------- |
| **Method**      | `PATCH` / `POST`             |
| **Endpoint**    | `/api/adoptions/{id}/cancel` |
| **Called from** | `useMyRequests` hook         |

**Request:** `{ motivo?: string }` (in body)
**Response:** Updated `AdoptionRequest`

---

### 4.5 `updateStatus(id, newStatus, comentario?)`

| Property        | Value                                           |
| --------------- | ----------------------------------------------- |
| **Method**      | `PATCH`                                         |
| **Endpoint**    | `/api/adoptions/{id}/status`                    |
| **Called from** | `useShelterRequestDetail`, `useShelterRequests` |

**Request:** `{ status: RequestStatus, comentario?: string }`

**Allowed Transitions (defined in `modules/adoption/domain/AdoptionRequest.ts`):**

| From        | Allowed Next States                 |
| ----------- | ----------------------------------- |
| `pending`   | `in_review`, `cancelled`            |
| `in_review` | `approved`, `rejected`, `cancelled` |
| `approved`  | `rejected`                          |
| `rejected`  | (none)                              |
| `cancelled` | (none)                              |

---

### Mock Source Mapping — Adoption

| Source            | File                                                     | Type                 |
| ----------------- | -------------------------------------------------------- | -------------------- |
| Adoption requests | `modules/shared/mockData/adoptions.mock.ts`              | Static (12 requests) |
| Mock service      | `modules/adoption/infrastructure/MockAdoptionService.ts` | Dynamic (mutable)    |

### Migration Notes — Adoption

| Risk                        | Severity | Description                                                                                                                                                              |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dog state coupling**      | HIGH     | Mock updates dog `estado` to `en_proceso` when adoption submitted, and back to `disponible` on rejection/cancel. Backend must implement this cross-entity state machine. |
| **`adoptanteId` parameter** | MEDIUM   | All methods receive `adoptanteId` as parameter. Real API should derive this from the JWT token on the server side rather than trusting client-sent IDs.                  |
| **Form data complexity**    | MEDIUM   | `AdoptionFormData` is a deeply nested object. Backend needs to store and return it as-is.                                                                                |
| **Draft persistence**       | LOW      | Frontend saves form drafts in localStorage (`adoption-form-draft-{perroId}`). Not a backend concern but noted for completeness.                                          |

---

## 5. Home Service

### Service Contract

**Interface:** `modules/home/infrastructure/IHomeService.ts`
**Mock:** `modules/home/infrastructure/MockHomeService.ts`
**Real:** `modules/home/infrastructure/HomeService.ts` (uses `fetch`, NOT `apiClient`)
**Factory:** `modules/home/infrastructure/HomeServiceFactory.ts`

---

### 5.1 `getMainDogs()`

| Property            | Value                                  |
| ------------------- | -------------------------------------- |
| **Method**          | `GET`                                  |
| **Endpoint (real)** | `{BASE}/dogs?limit=4&status=available` |
| **Endpoint (mock)** | N/A — filters MOCK_DOGS locally        |
| **Called from**     | `useHomeDogs` hook                     |
| **UI consumers**    | `FeaturedDogsSection`, `HeroSection`   |

**Response (`DogCard[]`):**

| Field             | Type      | Required | Used by UI            | Notes                                   |
| ----------------- | --------- | -------- | --------------------- | --------------------------------------- |
| `id`              | `number`  | Yes      | Key, link             |                                         |
| `nombre`          | `string`  | Yes      | Card title            |                                         |
| `raza`            | `string`  | Yes      | Breed display         |                                         |
| `descripcion`     | `string`  | Yes      | Card description      |                                         |
| `edad`            | `number`  | Yes      | Age label             |                                         |
| `tamano`          | `string`  | Yes      | Size display          |                                         |
| `nivelEnergia`    | `string`  | Yes      | Energy display        |                                         |
| `salud`           | `string`  | Yes      | Health info           |                                         |
| `estado`          | `string`  | Yes      | Status badge          |                                         |
| `imageUrl`        | `string`  | Yes      | Card image            | **Different from `foto` in Dog entity** |
| `tamanoRaw`       | `string?` | No       | Client-side filtering |                                         |
| `nivelEnergiaRaw` | `string?` | No       | Client-side filtering |                                         |
| `edadCat`         | `string?` | No       | Client-side filtering |                                         |

> **MISMATCH:** `DogCard` uses `imageUrl` while `Dog` uses `foto`. The mock maps `foto` → `imageUrl`. Real backend response must either use `imageUrl` or the frontend needs a transformation.

---

### 5.2 `getHomeSheltersList()`

| Property            | Value                     |
| ------------------- | ------------------------- |
| **Method**          | `GET`                     |
| **Endpoint (real)** | `{BASE}/shelters?limit=5` |
| **Called from**     | `useHomeShelters` hook    |
| **UI consumers**    | `SheltersCarousel`        |

**Response (`ShelterCard[]`):**

| Field                  | Type      | Required | Used by UI     |
| ---------------------- | --------- | -------- | -------------- |
| `id`                   | `number`  | Yes      | Key            |
| `nombre`               | `string`  | Yes      | Card title     |
| `slug`                 | `string`  | Yes      | Link           |
| `ubicacion`            | `string`  | Yes      | Location       |
| `ciudad`               | `string`  | Yes      | City display   |
| `descripcion`          | `string`  | Yes      | Card text      |
| `correo`               | `string`  | Yes      | Contact        |
| `telefono`             | `string`  | Yes      | Contact        |
| `logo`                 | `string`  | Yes      | Logo image     |
| `imagenPortada`        | `string`  | Yes      | Banner image   |
| `fechaRegistro`        | `string`  | Yes      |                |
| `aprobado`             | `boolean` | Yes      |                |
| `imageUrl`             | `string`  | Yes      | Fallback image |
| `adopcionesRealizadas` | `number`  | Yes      | Stat display   |
| `perrosDisponibles`    | `number`  | Yes      | Stat display   |
| `calificacion`         | `number?` | No       | Rating badge   |

---

### 5.3 `getLatestStories()`

| Property            | Value                     |
| ------------------- | ------------------------- |
| **Endpoint (real)** | `{BASE}/stories?limit=3`  |
| **Called from**     | `useAdoptionStories` hook |

**Response (`AdoptionStory[]`):**

| Field         | Type     | Required | Used by UI   |
| ------------- | -------- | -------- | ------------ |
| `id`          | `number` | Yes      | Key          |
| `dogName`     | `string` | Yes      | Title        |
| `adopterName` | `string` | Yes      | Author       |
| `storyShort`  | `string` | Yes      | Preview text |
| `imageUrl`    | `string` | Yes      | Image        |

> **NOTE:** This entity has NO backend endpoint defined in `endpoints.ts`. The real `HomeService` calls `{BASE}/stories?limit=3` which doesn't exist in the endpoints map.

---

## Esta ya la eliminé - Alan

### 5.4 `getAdoptionProcess()`

| Property            | Value                     |
| ------------------- | ------------------------- |
| **Endpoint (real)** | `{BASE}/adoption-process` |
| **Called from**     | `useAdoptionProcess` hook |

**Response (`AdoptionStep[]`):**

| Field         | Type       | Required | Used by UI         |
| ------------- | ---------- | -------- | ------------------ |
| `id`          | `number`   | Yes      | Key                |
| `step`        | `number`   | Yes      | Step number        |
| `icon`        | `string`   | Yes      | Material icon name |
| `title`       | `string`   | Yes      | Step title         |
| `subtitle`    | `string`   | Yes      | Step subtitle      |
| `description` | `string`   | Yes      | Step description   |
| `tips`        | `string[]` | Yes      | Tip bullets        |
| `duration`    | `string`   | Yes      | Duration text      |

> **TYPE MISMATCH:** The Home domain `AdoptionStep` has fields `{id, step, icon, title, subtitle, description, tips, duration}` but the content mock `AdoptionStep` has `{numero, titulo, descripcion, icono, documentos, duracionEstimada}`. Different field names and structure. The mock `MockHomeService` likely transforms the data.

---

## Esta ya la eliminé - Alan

### 5.5 `getGlobalStats()`

| Property            | Value                 |
| ------------------- | --------------------- |
| **Endpoint (real)** | `{BASE}/stats`        |
| **Called from**     | `useGlobalStats` hook |

**Response (`GlobalStats` — Home domain version):**

| Field              | Type     | Required | Used by UI |
| ------------------ | -------- | -------- | ---------- |
| `totalAdopciones`  | `number` | Yes      | Hero stat  |
| `refugiosActivos`  | `number` | Yes      | Hero stat  |
| `perrosEnEspera`   | `number` | Yes      | Hero stat  |
| `porcentajeExito`  | `number` | Yes      | Hero stat  |
| `aniosEnOperacion` | `number` | Yes      | Hero stat  |

> **TYPE CONFLICT:** The Home domain `GlobalStats` has 5 fields. The content mock `GlobalStats` has 8 different fields (`adopcionesTotales`, `refugiosActivos`, `perrosDisponibles`, `usuariosRegistrados`, `adopcionesEsteMes`, `tasaExito`, `ciudadesCubiertas`, `promedioTiempoAdopcion`). Field names differ significantly. The `MockHomeService` likely maps between them.

---

### Migration Notes — Home

| Risk                                          | Severity | Description                                                                                                                                      |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Real service uses `fetch` not `apiClient`** | HIGH     | `HomeService.ts` uses raw `fetch()` without auth headers, interceptors, or error handling. Should be migrated to `apiClient`.                    |
| **Endpoints not in central map**              | HIGH     | `/stories`, `/adoption-process`, `/stats` are not in `endpoints.ts`. Need to be defined.                                                         |
| **Type divergence**                           | HIGH     | Two different `GlobalStats` types exist (Home domain vs content mock). Two different `AdoptionStep` types exist. Backend must pick one contract. |
| **`imageUrl` vs `foto`**                      | MEDIUM   | Home types use `imageUrl`, Dog entity uses `foto`. Transformation needed.                                                                        |
| **Hardcoded stories**                         | LOW      | Adoption stories are hardcoded in mock. Backend may not have a stories table/endpoint.                                                           |

---

## 6. Shelter Service

### Service Contract

**Interface:** `modules/shelter/infrastructure/IShelterService.ts`
**Mock:** `modules/shelter/infrastructure/MockShelterService.ts`
**Real:** Missing
**Factory:** `modules/shelter/infrastructure/ShelterServiceFactory.ts`

---

### 6.1 `getShelterProfile(refugioId)` / `updateShelterProfile(refugioId, data)`

| Property         | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Endpoints**    | `GET /shelters-ms/shelter/{id}`, `PUT /shelters-ms/shelter/{id}` |
| **Called from**  | `useShelterProfile` hook                                         |
| **UI consumers** | `ShelterProfileView`                                             |

**Response (`Shelter`):**

| Field                  | Type                                        | Required | Used by UI        |
| ---------------------- | ------------------------------------------- | -------- | ----------------- |
| `id`                   | `number`                                    | Yes      |                   |
| `nombre`               | `string`                                    | Yes      | Title             |
| `ubicacion`            | `string`                                    | Yes      | Location          |
| `descripcion`          | `string`                                    | Yes      | About section     |
| `correo`               | `string`                                    | Yes      | Contact, editable |
| `telefono`             | `string`                                    | Yes      | Contact, editable |
| `logo`                 | `string`                                    | Yes      | Logo display      |
| `imagenPortada`        | `string`                                    | Yes      | Banner display    |
| `fechaRegistro`        | `string`                                    | Yes      | Since date        |
| `aprobado`             | `boolean`                                   | Yes      | Status            |
| `status`               | `ShelterStatus`                             | Yes      | Status badge      |
| `slug`                 | `string`                                    | Yes      | Public URL        |
| `ciudad`               | `string`                                    | Yes      | City              |
| `estado`               | `string`                                    | Yes      | State             |
| `redesSociales`        | `{ facebook?, instagram?, twitter?, web? }` | No       | Social links      |
| `donationConfig`       | `DonationConfig`                            | Yes      | Donation settings |
| `totalPerros`          | `number?`                                   | No       | Stat              |
| `perrosDisponibles`    | `number?`                                   | No       | Stat              |
| `adopcionesRealizadas` | `number?`                                   | No       | Stat              |
| `calificacion`         | `number?`                                   | No       | Rating            |

**`DonationConfig` (nested):**

| Field              | Type      | Required |
| ------------------ | --------- | -------- |
| `aceptaDonaciones` | `boolean` | Yes      |
| `descripcionCausa` | `string?` | No       |
| `cuentaClabe`      | `string?` | No       |
| `banco`            | `string?` | No       |
| `titularCuenta`    | `string?` | No       |
| `paypalLink`       | `string?` | No       |
| `mercadoPagoLink`  | `string?` | No       |

---

### 6.2 `getDashboardStats(refugioId)`

| Property         | Value                      |
| ---------------- | -------------------------- |
| **Endpoint**     | `/api/shelters/{id}/stats` |
| **Called from**  | `useShelterDashboard` hook |
| **UI consumers** | `ShelterDashboardView`     |

**Response (`ShelterDashboardStats`):**

| Field                   | Type      | Required | Used by UI      |
| ----------------------- | --------- | -------- | --------------- |
| `perrosTotales`         | `number`  | Yes      | StatsCard       |
| `perrosDisponibles`     | `number`  | Yes      | StatsCard       |
| `perrosEnProceso`       | `number`  | Yes      | StatsCard       |
| `adopcionesTotales`     | `number`  | Yes      | StatsCard       |
| `solicitudesPendientes` | `number`  | Yes      | StatsCard       |
| `solicitudesEnRevision` | `number`  | Yes      | StatsCard       |
| `donacionesEstemes`     | `number?` | No       | StatsCard (MXN) |
| `calificacion`          | `number?` | No       | Rating display  |

---

### 6.3 `getShelterDogs(refugioId, filters?)` / `getDogById(id)` / CRUD

Same interface as Dog Service but scoped to the shelter's dogs. See [Dog Service](#3-dog-service) for field details.

### 6.4 `togglePublish(id)`

| Property        | Value                 |
| --------------- | --------------------- |
| **Method**      | `PATCH` (inferred)    |
| **Called from** | `useShelterDogs` hook |

Toggles between `disponible` ↔ `no_disponible`. Returns updated `Dog`.

### 6.5 `getShelterRequests(refugioId)` / `getRequestById(id)` / `updateRequestStatus(...)`

Same interface as Adoption Service but from shelter perspective. See [Adoption Service](#4-adoption-service).

**Called from:** `useShelterRequests`, `useShelterRequestDetail` hooks

---

### Migration Notes — Shelter

| Risk                                      | Severity | Description                                                                                                                                                                       |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mixed microservice URLs**               | HIGH     | Shelter profile CRUD uses `/shelters-ms/shelter/{id}` (dedicated shelter microservice) while stats use `/api/shelters/{id}/stats` (API gateway). These may be different services. |
| **Dashboard chart data**                  | MEDIUM   | `useShelterDashboard` has hardcoded chart data for period-based stats (week/month/year). Backend needs a time-series stats endpoint.                                              |
| **Request status updates cross entities** | HIGH     | Approving/rejecting adoption requests also updates the dog's `estado`. Backend needs transactional cross-entity updates.                                                          |

---

## COMPLETELY REMOVED - ALAN

## 7. Messaging Service

### Service Contract

**Interface:** `modules/messaging/domain/IMessageService.ts`
**Mock:** `modules/messaging/infrastructure/MockMessageService.ts`
**Real:** Missing
**Factory:** `modules/messaging/infrastructure/MessageServiceFactory.ts`

---

### 7.1 `getConversations(adoptanteId)` / `getConversationsByShelterId(refugioId)`

| Property         | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| **Endpoints**    | `/api/conversations/me`, `/api/conversations/shelter/{id}` |
| **Called from**  | `useConversations`, `useShelterConversations` hooks        |
| **UI consumers** | `ConversationList`                                         |

**Response (`Conversation[]`):**

| Field                  | Type            | Required | Used by UI                  |
| ---------------------- | --------------- | -------- | --------------------------- |
| `id`                   | `number`        | Yes      | Key, selection, link        |
| `solicitudId`          | `number?`       | No       | Link to adoption request    |
| `perroId`              | `number`        | Yes      | Dog profile link            |
| `adoptanteId`          | `number`        | Yes      |                             |
| `refugioId`            | `number`        | Yes      |                             |
| `ultimoMensaje`        | `string?`       | Yes      | Preview text                |
| `ultimoMensajeEn`      | `string?` (ISO) | Yes      | Timestamp display           |
| `noLeidosPorAdoptante` | `number`        | Yes      | Unread badge                |
| `noLeidosPorRefugio`   | `number`        | Yes      | Unread badge (shelter view) |
| `creadaEn`             | `string` (ISO)  | Yes      |                             |
| `perroNombre`          | `string?`       | Yes      | Conversation title          |
| `perroFoto`            | `string?`       | Yes      | Thumbnail                   |
| `refugioNombre`        | `string?`       | Yes      | Subtitle                    |
| `refugioLogo`          | `string?`       | No       |                             |
| `adoptanteNombre`      | `string?`       | No       | (Shelter view)              |
| `adoptanteAvatar`      | `string?`       | No       | (Shelter view)              |

---

### 7.2 `getMessages(conversationId)`

| Property         | Value                                  |
| ---------------- | -------------------------------------- |
| **Endpoint**     | `/api/conversations/{convId}/messages` |
| **Called from**  | `useChat` hook (polls every 4 seconds) |
| **UI consumers** | `ChatWindow`                           |

**Response (`Message[]`):**

| Field            | Type                                | Required | Used by UI       |
| ---------------- | ----------------------------------- | -------- | ---------------- |
| `id`             | `number`                            | Yes      | Key              |
| `conversationId` | `number`                            | Yes      |                  |
| `senderId`       | `number`                            | Yes      | Bubble alignment |
| `senderRole`     | `'applicant' \| 'shelter' \| 'bot'` | Yes      | Styling          |
| `senderNombre`   | `string`                            | Yes      | Avatar alt       |
| `senderAvatar`   | `string?`                           | No       | Avatar image     |
| `texto`          | `string`                            | Yes      | Message body     |
| `adjuntos`       | `MessageAttachment[]?`              | No       | File display     |
| `leidoEn`        | `string?` (ISO)                     | No       | Read receipt     |
| `creadoEn`       | `string` (ISO)                      | Yes      | Timestamp        |

**`MessageAttachment`:**

| Field      | Type                      | Required |
| ---------- | ------------------------- | -------- |
| `id`       | `number`                  | Yes      |
| `url`      | `string`                  | Yes      |
| `tipo`     | `'imagen' \| 'documento'` | Yes      |
| `nombre`   | `string`                  | Yes      |
| `tamanoKb` | `number`                  | Yes      |

---

### 7.3 `sendMessage(conversationId, senderId, texto, senderNombre, senderAvatar?)`

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| **Method**      | `POST`                                 |
| **Endpoint**    | `/api/conversations/{convId}/messages` |
| **Called from** | `useChat` hook                         |

**Request Payload:**

| Field          | Type      | Required |
| -------------- | --------- | -------- |
| `senderId`     | `number`  | Yes      |
| `texto`        | `string`  | Yes      |
| `senderNombre` | `string`  | Yes      |
| `senderAvatar` | `string?` | No       |

**Response:** Created `Message` object

> **UI behavior:** Uses optimistic updates — message appears instantly, gets replaced by server response or reverted on error.

---

### 7.4 `createConversation(data)` / `getOrCreateConversation(data)`

| Property        | Value                     |
| --------------- | ------------------------- |
| **Method**      | `POST`                    |
| **Endpoint**    | `/api/conversations`      |
| **Called from** | `useConversationFor` hook |

**Request (`CreateConversationData`):**

| Field             | Type      | Required |
| ----------------- | --------- | -------- |
| `perroId`         | `number`  | Yes      |
| `adoptanteId`     | `number`  | Yes      |
| `refugioId`       | `number`  | Yes      |
| `solicitudId`     | `number?` | No       |
| `perroNombre`     | `string?` | No       |
| `perroFoto`       | `string?` | No       |
| `refugioNombre`   | `string?` | No       |
| `refugioLogo`     | `string?` | No       |
| `adoptanteNombre` | `string?` | No       |
| `adoptanteAvatar` | `string?` | No       |

---

### 7.5 `markAsRead(conversationId, role)`

| Property     | Value                              |
| ------------ | ---------------------------------- |
| **Method**   | `PATCH` / `POST`                   |
| **Endpoint** | `/api/conversations/{convId}/read` |

**Request:** `{ role: 'applicant' | 'shelter' }` (in body)

---

### Mock Source Mapping — Messaging

| Source                   | File                                                     | Type                                          |
| ------------------------ | -------------------------------------------------------- | --------------------------------------------- |
| Conversations + Messages | `modules/shared/mockData/messages.mock.ts`               | Static (4 conversations, 40+ messages)        |
| Mock service             | `modules/messaging/infrastructure/MockMessageService.ts` | Dynamic (deep-copied, mutable)                |
| Auto-reply               | Built into MockMessageService                            | Dynamic (3-5s delay, random from 5 templates) |

### Migration Notes — Messaging

| Risk                         | Severity | Description                                                                                                                                                                                                         |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Polling vs WebSocket**     | HIGH     | `useChat` polls every 4 seconds via `setInterval`. Endpoint `WS_CONNECT` is defined for WebSocket (`/ws/conversations/{convId}`). Backend should support WebSocket for real-time; polling is a mock-era workaround. |
| **Auto-reply removal**       | LOW      | Mock auto-replies won't exist in production. Shelter users will respond manually.                                                                                                                                   |
| **Denormalized sender data** | MEDIUM   | Messages include `senderNombre`, `senderAvatar` denormalized. Backend must include these or the frontend needs user lookups.                                                                                        |
| **Optimistic updates**       | LOW      | `useChat` does optimistic updates with fake IDs (`Date.now()`). Backend must return the real ID so the UI can reconcile.                                                                                            |

---

## COMPLETELY REMOVED (only links left) - ALAN

## 8. Donation Service

### Service Contract

**Interface:** `modules/donations/infrastructure/IDonationService.ts`
**Mock:** `modules/donations/infrastructure/MockDonationService.ts`
**Real:** Missing
**Factory:** `modules/donations/infrastructure/DonationServiceFactory.ts`

---

### 8.1 `initiateDonation(data, refugioId, adoptanteId, shelterInfo?)`

| Property        | Value                                                         |
| --------------- | ------------------------------------------------------------- |
| **Method**      | `POST`                                                        |
| **Endpoint**    | `/api/donations` (+ `/api/payments/stripe/intent` for Stripe) |
| **Called from** | Donation form component                                       |

**Request (`DonationFormData` + context):**

| Field                | Type                                                     | Required | Notes          |
| -------------------- | -------------------------------------------------------- | -------- | -------------- |
| `monto`              | `number`                                                 | Yes      | Amount in MXN  |
| `metodoPago`         | `'tarjeta' \| 'paypal' \| 'transferencia' \| 'efectivo'` | Yes      |                |
| `concepto`           | `string?`                                                | No       | Donor message  |
| `esAnonima`          | `boolean`                                                | Yes      | Anonymous flag |
| `refugioId`          | `number`                                                 | Yes      | Target shelter |
| `adoptanteId`        | `number`                                                 | Yes      | Donor ID       |
| `shelterInfo.nombre` | `string?`                                                | No       | For receipt    |
| `shelterInfo.logo`   | `string?`                                                | No       | For receipt    |

**Response (`Donation`):**

| Field             | Type             | Required | Used by UI           |
| ----------------- | ---------------- | -------- | -------------------- |
| `id`              | `number`         | Yes      |                      |
| `adoptanteId`     | `number`         | Yes      |                      |
| `refugioId`       | `number`         | Yes      |                      |
| `monto`           | `number`         | Yes      | Amount display (MXN) |
| `metodoPago`      | `PaymentMethod`  | Yes      | Method label         |
| `fecha`           | `string` (ISO)   | Yes      | Date                 |
| `confirmado`      | `boolean`        | Yes      |                      |
| `status`          | `DonationStatus` | Yes      | Status badge         |
| `transactionId`   | `string?`        | No       | Receipt number       |
| `concepto`        | `string?`        | No       | Note display         |
| `esAnonima`       | `boolean`        | Yes      |                      |
| `refugioNombre`   | `string?`        | No       | Shelter name         |
| `refugioLogo`     | `string?`        | No       | Shelter logo         |
| `adoptanteNombre` | `string?`        | No       | Donor name           |

---

### 8.2 `getDonationsByAdoptante(adoptanteId)` / `getDonationsByRefugio(refugioId)`

| Endpoint                      | Called from               |
| ----------------------------- | ------------------------- |
| `/api/donations/me`           | `useDonationHistory` hook |
| `/api/donations/shelter/{id}` | Shelter dashboard         |

**Response:** `Donation[]` (same fields as above)

---

### 8.3 `getDonationSummary(refugioId, metaMensual?)`

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Endpoint**    | `/api/donations/shelter/{id}/summary` |
| **Called from** | Shelter dashboard                     |

**Response (`DonationSummary`):**

| Field               | Type         | Required | Used by UI            |
| ------------------- | ------------ | -------- | --------------------- |
| `totalMes`          | `number`     | Yes      | Monthly total (MXN)   |
| `totalHistorico`    | `number`     | Yes      | All-time total        |
| `totalDonaciones`   | `number`     | Yes      | Count                 |
| `progresoMeta`      | `number?`    | No       | Progress bar (0-100%) |
| `ultimasDonaciones` | `Donation[]` | Yes      | Recent list           |

---

### Mock Source Mapping — Donations

| Source           | File                                                      | Type                             |
| ---------------- | --------------------------------------------------------- | -------------------------------- |
| Donation records | `modules/shared/mockData/donations.mock.ts`               | Static (20 donations)            |
| Mock service     | `modules/donations/infrastructure/MockDonationService.ts` | Dynamic (1.5s delay, 5% failure) |

### Migration Notes — Donations

| Risk                            | Severity | Description                                                                                                                                          |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Payment gateway integration** | HIGH     | Mock simulates a 5% failure rate and generates fake transaction IDs. Real implementation needs Stripe integration via `/api/payments/stripe/intent`. |
| **Two-phase payment**           | HIGH     | Real flow likely needs: (1) create payment intent, (2) confirm payment, (3) create donation record. Mock does it in one call.                        |
| **Currency**                    | LOW      | All amounts are in MXN. Backend must enforce this.                                                                                                   |
| **Anonymous donations**         | MEDIUM   | `esAnonima` hides donor info. Backend must enforce this in responses.                                                                                |

---

## 9. Recommendation / ML Service

### Service Contract

**Interface:** `modules/recommendations/infrastructure/IMLService.ts`
**Mock:** `modules/recommendations/infrastructure/MockMLService.ts`
**Real:** Missing
**Factory:** `modules/recommendations/infrastructure/MLServiceFactory.ts`

---

### 9.1 `generateRecommendations(adoptanteId, answers)`

| Property         | Value                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Method**       | `POST`                                                                                    |
| **Endpoint**     | `{ML_BASE}/api/ml/recommendations`                                                        |
| **Called from**  | `useLifestyleQuiz` hook → `modules/recommendations/application/hooks/useLifestyleQuiz.ts` |
| **UI consumers** | `RecommendationsView`                                                                     |

**Request Payload (`LifestyleQuizAnswers`):**

| Field                                 | Type                                                                       | Required | Notes                   |
| ------------------------------------- | -------------------------------------------------------------------------- | -------- | ----------------------- |
| `actividadFisica`                     | `'sedentario' \| 'moderado' \| 'activo' \| 'muy_activo'`                   | Yes      |                         |
| `horasEnCasaDiarias`                  | `number` (0-24)                                                            | Yes      |                         |
| `horasLibresParaPerro`                | `number`                                                                   | Yes      | Hours/day for dog       |
| `tipoVivienda`                        | `'casa' \| 'departamento' \| 'casa_campo' \| 'otro'`                       | Yes      |                         |
| `tieneJardin`                         | `boolean`                                                                  | Yes      |                         |
| `tamanoEspacio`                       | `'pequeño' \| 'mediano' \| 'grande'`                                       | Yes      |                         |
| `experienciaPrevia`                   | `boolean`                                                                  | Yes      |                         |
| `tiposPerrosAnteriores`               | `string[]?`                                                                | No       | Breeds/sizes had before |
| `conviveConNinos`                     | `boolean`                                                                  | Yes      |                         |
| `edadMenorNino`                       | `number?`                                                                  | No       | Age of youngest child   |
| `conviveConMascotas`                  | `boolean`                                                                  | Yes      |                         |
| `tiposMascotas`                       | `('perros' \| 'gatos' \| 'otros')[]?`                                      | No       |                         |
| `tamanoPreferido`                     | `('pequeño' \| 'mediano' \| 'grande' \| 'gigante' \| 'sin_preferencia')[]` | Yes      | Multi-select            |
| `energiaPreferida`                    | `'baja' \| 'moderada' \| 'alta' \| 'sin_preferencia'`                      | Yes      |                         |
| `sexoPreferido`                       | `'macho' \| 'hembra' \| 'sin_preferencia'`                                 | Yes      |                         |
| `edadPreferida`                       | `('cachorro' \| 'joven' \| 'adulto' \| 'senior' \| 'sin_preferencia')[]`   | Yes      | Multi-select            |
| `presupuestoMensualMXN`               | `number`                                                                   | Yes      | Monthly budget          |
| `disponibilidadEntrenamiento`         | `boolean`                                                                  | Yes      | Willing to train        |
| `aceptaPerroConNecesidadesEspeciales` | `boolean`                                                                  | Yes      | Accepts special needs   |

**Response (`MLRecommendationResponse`):**

| Field             | Type                  | Required | Used by UI                |
| ----------------- | --------------------- | -------- | ------------------------- |
| `adoptanteId`     | `number`              | Yes      |                           |
| `cuestionarioId`  | `number`              | Yes      |                           |
| `recomendaciones` | `DogRecommendation[]` | Yes      | Recommendation cards      |
| `resumen`         | `string`              | Yes      | AI-generated summary text |
| `totalEvaluados`  | `number`              | Yes      | "X dogs evaluated"        |
| `fechaGeneracion` | `string` (ISO)        | Yes      | Generation timestamp      |
| `version`         | `string`              | Yes      | ML model version          |

**`DogRecommendation` fields used by UI:**

| Field            | Type             | Required | Used by UI                |
| ---------------- | ---------------- | -------- | ------------------------- |
| `id`             | `number`         | Yes      | Key                       |
| `perroId`        | `number`         | Yes      | Dog profile link          |
| `compatibilidad` | `number` (0-100) | Yes      | Score badge (color-coded) |
| `razonesMatch`   | `MatchReason[]`  | Yes      | Reasons list              |
| `perroNombre`    | `string?`        | Yes      | Card title                |
| `perroFoto`      | `string?`        | Yes      | Card image                |
| `perroRaza`      | `string?`        | Yes      | Breed                     |
| `refugioNombre`  | `string?`        | Yes      | Shelter name              |

**`MatchReason`:**

| Field        | Type      | Required | Used by UI        |
| ------------ | --------- | -------- | ----------------- |
| `categoria`  | `string`  | Yes      | Categorization    |
| `texto`      | `string`  | Yes      | Reason text       |
| `esPositivo` | `boolean` | Yes      | Green/red styling |

---

### Mock Source Mapping — Recommendations

| Source            | File                                                      | Type                    |
| ----------------- | --------------------------------------------------------- | ----------------------- |
| Scoring algorithm | `modules/recommendations/infrastructure/MockMLService.ts` | Dynamic (deterministic) |
| Dog data          | `modules/shared/mockData/dogs.mock.ts`                    | Reads available dogs    |
| Quiz answers      | Passed as parameter + stored in localStorage              | Dynamic                 |

### Mock ML Scoring Algorithm (10 criteria, 100pts base):

| Criterion              | Max Points | Logic                                                            |
| ---------------------- | ---------- | ---------------------------------------------------------------- |
| Energy match           | 25         | Compares dog `nivelEnergia` with user activity + available hours |
| Space compatibility    | 20         | Housing type × dog size matrix                                   |
| Size preference        | 15         | Matches `tamanoPreferido` multi-select                           |
| Children compatibility | 10         | `aptoNinos` vs `conviveConNinos`                                 |
| Pet cohabitation       | 10         | `aptoPerros`/`aptoGatos` vs existing pets                        |
| Experience required    | 10         | Bonus if `disponibilidadEntrenamiento`                           |
| Age preference         | 5          | Matches `edadPreferida` multi-select                             |
| Sex preference         | 5          | Matches `sexoPreferido`                                          |
| Special needs penalty  | -10        | If senior dog and not `aceptaPerroConNecesidadesEspeciales`      |
| Budget penalty         | -4 to -8   | If `presupuestoMensualMXN` insufficient for dog size             |

### Migration Notes — Recommendations

| Risk                         | Severity | Description                                                                                                                                 |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Separate ML microservice** | HIGH     | Uses `NEXT_PUBLIC_ML_API_URL`, a separate service. May have different auth requirements, response times, and error patterns.                |
| **Score scale**              | MEDIUM   | Mock returns 0-100 integers. ML service may return 0-1 floats. Frontend displays as percentage.                                             |
| **Dog data dependency**      | HIGH     | Mock scoring reads from the same in-memory dog list. Real ML service needs access to the dogs database or receives dog data in the request. |
| **Response latency**         | MEDIUM   | Mock is instant. Real ML computation may take seconds. UI already has loading states.                                                       |
| **Quiz persistence**         | LOW      | Quiz answers saved to localStorage and via `profileService.saveLifestylePreferences()`. Backend needs a quiz/preferences storage endpoint.  |

---

## 10. Chatbot Service

### Service Contract

**Interface:** `modules/chatbot/infrastructure/IChatbotService.ts`
**Mock:** `modules/chatbot/infrastructure/MockChatbotService.ts`
**Real:** Missing
**Factory:** `modules/chatbot/infrastructure/ChatbotServiceFactory.ts`

---

### 10.1 `getResponse(message, sessionId, userId?)`

| Property         | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Method**       | `POST`                                                                |
| **Endpoint**     | `/api/chatbot/message`                                                |
| **Called from**  | `useChatbot` hook → `modules/chatbot/application/hooks/useChatbot.ts` |
| **UI consumers** | `ChatbotPanel`, `BubbleChatbot`                                       |

**Request:**

| Field       | Type      | Required | Notes                     |
| ----------- | --------- | -------- | ------------------------- |
| `message`   | `string`  | Yes      | User's message text       |
| `sessionId` | `string`  | Yes      | UUID for session tracking |
| `userId`    | `number?` | No       | Authenticated user ID     |

**Response (`BotResponse`):**

| Field         | Type          | Required | Used by UI                   |
| ------------- | ------------- | -------- | ---------------------------- |
| `text`        | `string`      | Yes      | Message body (split by `\n`) |
| `links`       | `ChatLink[]?` | No       | Clickable links              |
| `suggestions` | `string[]?`   | No       | Quick-reply chips            |

**`ChatLink`:**

| Field   | Type     | Required | Used by UI |
| ------- | -------- | -------- | ---------- |
| `label` | `string` | Yes      | Link text  |
| `href`  | `string` | Yes      | Link URL   |

---

### Mock Source Mapping — Chatbot

| Source              | File                                                   | Type                |
| ------------------- | ------------------------------------------------------ | ------------------- |
| Intent definitions  | `modules/chatbot/infrastructure/MockChatbotService.ts` | Static (13 intents) |
| FAQ data            | `modules/shared/mockData/content.mock.ts`              | Static (20 FAQs)    |
| Session persistence | localStorage (`chatbot-session-{sid}`)                 | Dynamic             |

### Mock Intent List:

| Intent     | Keywords                                 | Has Links | Has Suggestions |
| ---------- | ---------------------------------------- | --------- | --------------- |
| saludo     | hola, buenos, hey                        | No        | Yes (4)         |
| adoptar    | adoptar, quiero, busco                   | Yes (2)   | Yes (3)         |
| requisitos | requisitos, documentos, necesito         | No        | Yes (3)         |
| costo      | costo, precio, cuánto, gratis            | No        | Yes (2)         |
| quiz       | quiz, test, cuestionario, compatibilidad | Yes (1)   | Yes (2)         |
| refugios   | refugio, albergue, dónde                 | Yes (1)   | Yes (2)         |
| visita     | visita, ir, conocer, presencial          | No        | Yes (2)         |
| cachorro   | cachorro, bebé, pequeño, chiquito        | Yes (1)   | Yes (2)         |
| tamaño     | grande, mediano, pequeño, gigante        | Yes (1)   | Yes (2)         |
| solicitud  | solicitud, estado, pendiente, aprobada   | Yes (1)   | Yes (2)         |
| favoritos  | favorito, guardar, lista                 | Yes (1)   | Yes (1)         |
| gracias    | gracias, genial, perfecto                | No        | No              |
| (default)  | N/A                                      | Yes (1)   | Yes (3)         |

### Migration Notes — Chatbot

| Risk                   | Severity | Description                                                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| **Intent vs NLU**      | MEDIUM   | Mock uses simple keyword matching. Real backend likely uses NLU/LLM. Response format must remain compatible. |
| **Session management** | LOW      | Frontend persists chat history in localStorage. Backend may want server-side session storage.                |
| **History endpoint**   | LOW      | `/api/chatbot/history` is defined but not used by the current frontend.                                      |

---

## 11. Admin Service

### Service Contract

**Interface:** `modules/admin/infrastructure/IAdminService.ts`
**Mock:** `modules/admin/infrastructure/MockAdminService.ts`
**Real:** Missing
**Factory:** `modules/admin/infrastructure/AdminServiceFactory.ts`

---

### 11.1 `getStats()`

| Property        | Value                    |
| --------------- | ------------------------ |
| **Endpoint**    | `/api/admin/stats`       |
| **Called from** | `useAdminDashboard` hook |

**Response (`AdminStats`):**

| Field                    | Type     | Required | Used by UI |
| ------------------------ | -------- | -------- | ---------- |
| `adopcionesTotales`      | `number` | Yes      | StatsCard  |
| `refugiosActivos`        | `number` | Yes      | StatsCard  |
| `perrosDisponibles`      | `number` | Yes      | StatsCard  |
| `usuariosRegistrados`    | `number` | Yes      | StatsCard  |
| `adopcionesEsteMes`      | `number` | Yes      | StatsCard  |
| `tasaExito`              | `number` | Yes      | StatsCard  |
| `ciudadesCubiertas`      | `number` | Yes      | StatsCard  |
| `promedioTiempoAdopcion` | `number` | Yes      | StatsCard  |
| `refugiosPendientes`     | `number` | Yes      | StatsCard  |
| `refugiosAprobados`      | `number` | Yes      | StatsCard  |
| `refugiosSuspendidos`    | `number` | Yes      | StatsCard  |
| `refugiosRechazados`     | `number` | Yes      | StatsCard  |
| `perrosEnProceso`        | `number` | Yes      | StatsCard  |
| `perrosAdoptados`        | `number` | Yes      | StatsCard  |

---

### 11.2 `getAllShelters()` / `getShelterById(id)`

| Endpoints       | `/api/admin/shelters`, `/api/admin/shelters/{id}` |
| --------------- | ------------------------------------------------- |
| **Called from** | `useAdminShelters`, `useAdminShelterDetail` hooks |

**Response:** `Shelter[]` or `Shelter | null` (see [Shelter type](#61-getshelterprofilerefugioid--updateshelterprofilerefugioid-data))

---

### 11.3 `approveShelter(id, nota?)` / `rejectShelter(id, nota?)` / `suspendShelter(id, nota?)`

| Endpoints       | `/api/admin/shelters/{id}/approve`, `/api/admin/shelters/{id}/reject` |
| --------------- | --------------------------------------------------------------------- |
| **Called from** | `useAdminShelters`, `useAdminShelterDetail` hooks                     |

**Request:** `{ nota?: string }` (optional admin note)
**Response:** Updated `Shelter`

> **NOTE:** No endpoint for `suspend` is defined in `endpoints.ts`. Only `approve` and `reject` exist.

---

### 11.4 `getAllDogs()` / `updateDogStatus(id, status)`

| Endpoints       | `/api/admin/dogs`, `/api/admin/dogs/{id}` |
| --------------- | ----------------------------------------- |
| **Called from** | `useAdminDogs` hook                       |

**updateDogStatus Request:** `{ status: DogStatus }`
**Response:** Updated `Dog`

---

### 11.5 `getAdoptionProcess()` / `updateAdoptionProcess(steps)`

| Endpoint        | `/api/admin/content`   |
| --------------- | ---------------------- |
| **Called from** | `useAdminContent` hook |

**Request/Response:** `AdoptionStep[]` (content mock version)

---

### 11.6 `getChatbotFAQs()` / `updateChatbotFAQs(faqs)`

| Endpoint        | `/api/admin/content` (shared with adoption process) |
| --------------- | --------------------------------------------------- |
| **Called from** | `useAdminContent` hook                              |

**`ChatbotFAQ`:**

| Field       | Type                                                                                    | Required |
| ----------- | --------------------------------------------------------------------------------------- | -------- |
| `id`        | `number`                                                                                | Yes      |
| `pregunta`  | `string`                                                                                | Yes      |
| `respuesta` | `string`                                                                                | Yes      |
| `keywords`  | `string[]`                                                                              | Yes      |
| `categoria` | `'adopcion' \| 'requisitos' \| 'proceso' \| 'cuidados' \| 'plataforma' \| 'donaciones'` | Yes      |

---

### Migration Notes — Admin

| Risk                            | Severity | Description                                                                                                                                   |
| ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Missing suspend endpoint**    | MEDIUM   | No `/api/admin/shelters/{id}/suspend` in endpoints. Need to add or use a generic status update endpoint.                                      |
| **Content endpoint overloaded** | MEDIUM   | Both adoption process and chatbot FAQs use `/api/admin/content`. Backend needs separate sub-endpoints or a unified content API.               |
| **Cross-module data access**    | HIGH     | Admin reads all shelters, all dogs, all users across the entire platform. Backend must have admin-scoped endpoints with proper authorization. |

---

## 12. Profile Service

### Service Contract

**Interface:** `modules/profile/infrastructure/IProfileService.ts`
**Mock:** `modules/profile/infrastructure/MockProfileService.ts`
**Real:** Missing
**Factory:** `modules/profile/infrastructure/ProfileServiceFactory.ts`

---

### 12.1 `updateProfile(userId, data)`

| Property        | Value                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| **Endpoint**    | (Not defined in endpoints.ts — needs `/api/auth/me` or `/api/users/{id}`) |
| **Called from** | `useProfile` hook                                                         |

**Request (`ProfileUpdateData`):**

| Field       | Type      | Required            |
| ----------- | --------- | ------------------- |
| `nombre`    | `string?` | No                  |
| `telefono`  | `string?` | No                  |
| `direccion` | `string?` | No (Adoptante only) |
| `avatarUrl` | `string?` | No                  |

**Response:** `Adoptante | ShelterUser | Administrador` (updated user)

---

### 12.2 `changePassword(userId, currentPassword, newPassword)`

| Property        | Value                                            |
| --------------- | ------------------------------------------------ |
| **Endpoint**    | (Not defined — needs a password change endpoint) |
| **Called from** | `useProfile` hook                                |

**Request:** `{ currentPassword: string, newPassword: string }`
**Response:** `void`

---

### 12.3 `getLifestylePreferences(userId)` / `saveLifestylePreferences(userId, answers)`

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| **Endpoint**    | (Not defined — quiz answers storage)   |
| **Called from** | `useProfile`, `useLifestyleQuiz` hooks |

**Request/Response:** `LifestyleQuizAnswers | null`

> **NOTE:** Mock stores preferences in localStorage (`lifestyle-profile-{userId}`). Backend needs a preferences/quiz endpoint.

---

### Migration Notes — Profile

| Risk                       | Severity | Description                                                                                                                                          |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No endpoints defined**   | HIGH     | Profile service has no endpoints in `endpoints.ts`. Needs `PATCH /api/users/me`, `POST /api/users/me/password`, `GET/PUT /api/users/me/preferences`. |
| **Mock uses localStorage** | MEDIUM   | Lifestyle preferences are persisted in localStorage. Backend needs persistent storage.                                                               |
| **User type polymorphism** | MEDIUM   | Response returns different user types based on role. Backend needs to handle role-specific fields.                                                   |

---

## COMPLETELY REMOVED - ALAN

## 13. Media Validation Service

### Service Contract

**Interface/Mock:** `modules/shelter/infrastructure/MockMediaValidationService.ts`
**Real:** Missing

### `validate(file: File)`

| Property        | Value                          |
| --------------- | ------------------------------ |
| **Method**      | `POST` (multipart)             |
| **Endpoint**    | `/api/media/upload` (inferred) |
| **Called from** | `useDogForm` hook              |

**Request:** `File` object (image)
**Response:** `{ valid: boolean, reason?: string }`

**Mock behavior:** 2s delay, 90% pass rate, 10% detection failure

### Migration Notes

| Risk                           | Severity | Description                                                                                                              |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Computer Vision dependency** | HIGH     | Mock simulates a CV microservice. Real implementation needs actual image validation (dog detection, content moderation). |
| **File upload**                | HIGH     | Mock validates URLs. Real service needs multipart file upload support.                                                   |

---

## 14. Favorites (Client-Only)

### Implementation

**Store:** `modules/shared/infrastructure/store/favoritesStore.ts`
**Persistence:** localStorage (`adogme:favorites`)

| Field         | Type       | Notes            |
| ------------- | ---------- | ---------------- |
| `favoriteIds` | `number[]` | Array of dog IDs |

**Methods:** `toggleFavorite(id)`, `isFavorite(id)`, `clearFavorites()`, `hydrate()`

### API Endpoints (defined but NOT used by frontend):

| Method   | Endpoint                 |
| -------- | ------------------------ |
| `GET`    | `/api/favorites`         |
| `POST`   | `/api/favorites/{dogId}` |
| `DELETE` | `/api/favorites/{dogId}` |

### Migration Notes

| Risk                  | Severity | Description                                                                                                                            |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **localStorage only** | MEDIUM   | Favorites are purely client-side. When migrating, needs sync with backend API for cross-device persistence. Endpoints already defined. |
| **No user scoping**   | MEDIUM   | Current store doesn't scope favorites by user. All users on the same browser share favorites. Backend API is user-scoped.              |

---

## 15. Global Infrastructure

### Authentication Store (`authStore.ts`)

**Location:** `modules/shared/infrastructure/store/authStore.ts`

| Action                    | Description                           | Persistence                   |
| ------------------------- | ------------------------------------- | ----------------------------- |
| `login(correo, password)` | Authenticates (mock or real)          | Cookie + `window.__authToken` |
| `logout()`                | Clears all auth state                 | Clears cookie + window        |
| `setUser(user)`           | Sets user object                      | In-memory only                |
| `setToken(token)`         | Sets token + cookie                   | Cookie + `window.__authToken` |
| `hydrate()`               | Reads token from cookie, decodes user | Called on app mount           |

> **CRITICAL:** `hydrate()` calls `decodeUserFromToken()` which does `JSON.parse(atob(token))`. This works with mock base64 tokens but will FAIL with real JWTs (3-segment format). Must be updated to parse only the payload segment of a real JWT.

### UI Store (`uiStore.ts`)

**Location:** `modules/shared/infrastructure/store/uiStore.ts`

| Feature                                 | Used by                    |
| --------------------------------------- | -------------------------- |
| `toasts[]` / `addToast()`               | All service error handlers |
| `chatbotOpen` / `toggleChatbot()`       | Chatbot widget             |
| `mobileMenuOpen` / `toggleMobileMenu()` | Mobile navigation          |

### Middleware (`middleware.ts`)

Protected route groups check for `auth-token` cookie:

- `/adoptar/*`, `/mis-solicitudes/*`, `/favoritos/*`, `/mi-match/*`, `/mi-perfil/*`, `/chat/*`, `/mis-donaciones/*` → applicant
- `/refugio/*` → shelter
- `/admin/*` → admin

Unauthenticated → redirect to `/login?redirect={path}`

---

## 16. Cross-Cutting Migration Risks

### Priority 1 — CRITICAL (Will break the app)

| #   | Risk                                     | Description                                                                                                                             | Affected Services                |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | **Token format incompatibility**         | `authStore.hydrate()` parses token as base64 JSON. Real JWTs need segment-aware parsing. App won't restore sessions after page refresh. | Auth, all authenticated services |
| 2   | **Registration data loss**               | `AuthService.register()` only sends `{email, name, password}`. Phone and all address fields are silently discarded.                     | Auth                             |
| 3   | **Missing real service implementations** | 10 of 12 services have no real implementation. Only Auth (partial) and Home (uses wrong HTTP client) exist.                             | All except Auth                  |
| 4   | **`compatibilidad` scale mismatch**      | Frontend assumes 0-100. Backend DB stores 0-1 float. No transformation layer exists.                                                    | Dogs, Recommendations            |

### Priority 2 — HIGH (Major feature regression)

| #   | Risk                                      | Description                                                                                                                                            | Affected Services         |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| 5   | **Denormalized join data**                | Dog cards need `refugioNombre`, `refugioSlug`, etc. Messages need `senderNombre`. Backend must include these or the frontend needs multiple API calls. | Dogs, Messaging, Adoption |
| 6   | **Cross-entity state machines**           | Adoption status changes must update dog `estado`. Shelter approval must update user `shelterStatus`. Backend needs transactional cross-entity updates. | Adoption, Admin           |
| 7   | **HomeService uses fetch, not apiClient** | No auth headers, no error handling, no interceptors. Will fail on authenticated endpoints.                                                             | Home                      |
| 8   | **WebSocket for real-time chat**          | Frontend polls every 4s. Backend has WebSocket endpoint defined but frontend doesn't use it. Needs WebSocket client implementation.                    | Messaging                 |
| 9   | **Payment gateway integration**           | Mock simulates payments. Real Stripe integration needs client secret flow, webhooks, confirmation.                                                     | Donations                 |
| 10  | **ML service on separate URL**            | Different base URL, possibly different auth. Needs dedicated API client configuration.                                                                 | Recommendations           |

### Priority 3 — MEDIUM (Feature degradation)

| #   | Risk                                 | Description                                                                   | Affected Services |
| --- | ------------------------------------ | ----------------------------------------------------------------------------- | ----------------- |
| 11  | **Type divergence**                  | Two `GlobalStats` types, two `AdoptionStep` types with different field names. | Home, Admin       |
| 12  | **No profile/preferences endpoints** | `endpoints.ts` has no profile CRUD or preferences endpoints.                  | Profile           |
| 13  | **No suspend endpoint for admin**    | Missing `/api/admin/shelters/{id}/suspend`.                                   | Admin             |
| 14  | **edadCategoria computation**        | Mock auto-calculates from months. Backend or transformation layer needed.     | Dogs              |
| 15  | **Client-side favorites**            | localStorage-only. Endpoints defined but not wired.                           | Favorites         |

### Priority 4 — LOW (Polish / cleanup)

| #   | Risk                                             | Description                                                                                                    |
| --- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 16  | **Deprecated shim functions** in MockAuthService | `mockLogin()`, `mockRegisterAdoptante()`, `mockRegisterRefugio()` may still be referenced.                     |
| 17  | **Mock latency removal**                         | All mocks add artificial delays (150ms-2000ms). Real services have natural latency.                            |
| 18  | **ALCALDIAS_CDMX hardcoded**                     | Location options are hardcoded in MockAuthService. Should come from a backend lookup or be moved to constants. |
| 19  | **chatbot/history endpoint**                     | Defined but not used by frontend.                                                                              |

---

## Appendix A: Complete Endpoint Map

```
AUTH:
  POST /auth-ms/user/login            ← login
  POST /auth-ms/adopter               ← register adoptante
  POST /auth-ms/shelter               ← register shelter user
  POST /shelters-ms/shelter            ← create shelter profile (step 2)
  POST /auth-ms/user/update-tokens    ← token refresh
  POST /api/auth/logout               ← logout
  POST /api/auth/forgot-password      ← forgot password (NOT IMPLEMENTED)
  POST /api/auth/reset-password       ← reset password (NOT IMPLEMENTED)
  GET  /api/auth/me                   ← get current user (NOT USED)

DOGS:
  GET    /api/dogs                    ← list with filters
  GET    /api/dogs/{id}               ← detail by ID
  GET    /api/dogs/slug/{slug}        ← detail by slug
  GET    /api/dogs/shelter/{id}       ← by shelter
  POST   /api/dogs                    ← create
  PUT    /api/dogs/{id}               ← update
  DELETE /api/dogs/{id}               ← delete
  POST   /api/media/upload            ← upload media

SHELTERS:
  GET    /shelters-ms/shelters        ← list all
  POST   /shelters-ms/shelter         ← create
  GET    /shelters-ms/shelter/{id}    ← detail by ID
  GET    /api/shelters/slug/{slug}    ← detail by slug
  PUT    /shelters-ms/shelter/{id}    ← update
  GET    /api/shelters/{id}/stats     ← dashboard stats
  POST   /api/media/shelter/logo      ← upload logo
  POST   /api/media/shelter/cover     ← upload cover

ADOPTIONS:
  GET    /api/adoptions               ← list all
  GET    /api/adoptions/me            ← my requests
  GET    /api/adoptions/shelter/{id}  ← by shelter
  GET    /api/adoptions/{id}          ← detail
  POST   /api/adoptions               ← create
  PATCH  /api/adoptions/{id}/status   ← update status
  POST   /api/adoptions/{id}/cancel   ← cancel

MESSAGES:
  GET    /api/conversations           ← list all
  GET    /api/conversations/me        ← my conversations
  GET    /api/conversations/shelter/{id} ← shelter conversations
  GET    /api/conversations/{id}/messages ← messages in conversation
  POST   /api/conversations/{id}/messages ← send message
  PATCH  /api/conversations/{id}/read ← mark as read
  WS     /ws/conversations/{id}       ← WebSocket (NOT USED)

DONATIONS:
  POST   /api/donations               ← create
  GET    /api/donations/shelter/{id}   ← by shelter
  GET    /api/donations/me             ← my donations
  GET    /api/donations/shelter/{id}/summary ← shelter summary
  POST   /api/payments/stripe/intent   ← Stripe payment intent
  POST   /api/payments/confirm/{id}    ← confirm payment

RECOMMENDATIONS:
  POST   {ML}/api/ml/recommendations   ← generate (ML service)
  GET    {ML}/api/ml/recommendations/me ← my recommendations (NOT USED)
  GET    /api/quiz                      ← list quizzes (NOT USED)
  GET    /api/quiz/{id}                 ← quiz detail (NOT USED)

CHATBOT:
  POST   /api/chatbot/message          ← send message
  GET    /api/chatbot/history           ← chat history (NOT USED)

FAVORITES:
  GET    /api/favorites                 ← list (NOT USED - localStorage)
  POST   /api/favorites/{dogId}         ← add (NOT USED)
  DELETE /api/favorites/{dogId}         ← remove (NOT USED)

ADMIN:
  GET    /api/admin/stats               ← dashboard stats
  GET    /api/admin/shelters            ← all shelters
  GET    /api/admin/shelters/{id}       ← shelter detail
  POST   /api/admin/shelters/{id}/approve ← approve
  POST   /api/admin/shelters/{id}/reject  ← reject
  GET    /api/admin/dogs                ← all dogs
  PATCH  /api/admin/dogs/{id}           ← update dog status
  GET    /api/admin/users               ← all users (NOT USED)
  GET    /api/admin/content             ← content management
```

---

## Appendix B: Mock Data Inventory

| File                                              | Entity                          | Count                  | Notes                         |
| ------------------------------------------------- | ------------------------------- | ---------------------- | ----------------------------- |
| `modules/shared/mockData/dogs.mock.ts`            | Dogs                            | 30                     | Distributed across 5 shelters |
| `modules/shared/mockData/shelters.mock.ts`        | Shelters                        | 5 approved + 3 pending | With full profiles            |
| `modules/shared/mockData/users.mock.ts`           | Users                           | 4                      | One per role                  |
| `modules/shared/mockData/adoptions.mock.ts`       | Adoption Requests               | 12                     | All states represented        |
| `modules/shared/mockData/messages.mock.ts`        | Conversations / Messages        | 4 / ~40                | With auto-reply               |
| `modules/shared/mockData/donations.mock.ts`       | Donations                       | 20                     | Nov 2024 - Jan 2025           |
| `modules/shared/mockData/recommendations.mock.ts` | Scoring algorithm               | N/A                    | Deterministic, no mock data   |
| `modules/shared/mockData/content.mock.ts`         | Adoption Process + FAQs + Stats | 5 steps + 20 FAQs      | Static content                |

---

## Appendix C: Data Transformation Requirements

When migrating to real APIs, the following transformations are needed between backend responses and frontend consumption:

| Transformation          | Where             | Backend Format             | Frontend Format                                   |
| ----------------------- | ----------------- | -------------------------- | ------------------------------------------------- |
| `compatibilidad`        | Dog entity        | `float 0.0-1.0`            | `number 0-100`                                    |
| `correo` ↔ `email`      | Auth endpoints    | `email`                    | `correo`                                          |
| `nombre` ↔ `name`       | Auth endpoints    | `name`                     | `nombre`                                          |
| `foto` → `imageUrl`     | Home DogCard      | `foto` (string)            | `imageUrl` (string)                               |
| `edadCategoria`         | Dog entity        | Computed or stored         | Derived from `edad` (months)                      |
| JWT token parsing       | authStore.hydrate | `header.payload.signature` | Currently expects raw base64 JSON                 |
| `accessToken` → `token` | Login response    | `accessToken`              | `token`                                           |
| Shelter join fields     | Dog entity        | Separate entities          | Denormalized `refugioNombre`, `refugioSlug`, etc. |
| Sender join fields      | Message entity    | Separate entities          | Denormalized `senderNombre`, `senderAvatar`       |
