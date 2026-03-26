# Plan de Pull Requests — aDOGme Frontend

## Estrategia: PR01 primero, luego todos desde `main`

```
                    ┌─ pr/02-auth ──────────────────→ merge a main
                    ├─ pr/03-home ──────────────────→ merge a main
main → pr/01 merge ─┤─ pr/04-dogs ──────────────────→ merge a main
                    ├─ pr/05-applicant ─────────────→ merge a main
                    ├─ pr/06-shelter ───────────────→ merge a main
                    ├─ pr/07-admin ─────────────────→ merge a main
                    ├─ pr/08-chatbot ───────────────→ merge a main
                    ├─ pr/09-donations ─────────────→ merge a main
                    └─ pr/10-polish ────────────────→ merge a main
```

**PR01 es bloqueante** — todos dependen de `modules/shared`. Una vez mergeado,
los PR 02-10 se crean desde `main`, se revisan **en paralelo** y se mergean en orden lógico.

---

## Resumen de PRs

| PR | Nombre | Archivos aprox. | Base | Revisión |
|----|--------|-----------------|------|----------|
| 01 | Fundación compartida | ~260 | `main` | Secuencial (bloqueante) |
| 02 | Autenticación | ~20 | `main` | Paralela |
| 03 | Landing & Páginas Públicas | ~25 | `main` | Paralela |
| 04 | Catálogo y Perfil de Perros | ~20 | `main` | Paralela |
| 05 | Portal del Adoptante | ~30 | `main` | Paralela (mergear después de PR04) |
| 06 | Portal del Refugio | ~25 | `main` | Paralela |
| 07 | Panel Administrador | ~15 | `main` | Paralela |
| 08 | Chatbot | ~8 | `main` | Paralela |
| 09 | Donaciones | ~10 | `main` | Paralela |
| 10 | Loading States & Polish | ~8 | `main` | Última (después de todos) |

### Orden de merge recomendado (para que el build no falle en CI)

```
PR01 → PR02 → PR03 → PR04 → PR05 → PR06 → PR07 → PR08 → PR09 → PR10
```

> Los PRs se **revisan en paralelo** pero se **mergean en este orden**.
> PR05 depende de tipos de `modules/dogs` (PR04), así que esperar que PR04 mergee antes.

---

## PR 01 — Fundación Compartida ⚠️ BLOQUEANTE

**Incluye:** configuración del proyecto, módulo `shared` completo (domain types, UI components,
layout, store, mock data, utils, hooks), assets públicos, globals.

```bash
git checkout main
git pull origin main
git checkout -b pr/01-foundation

# Configuración del proyecto
git checkout chatbot-design -- package.json next.config.ts global.d.ts middleware.ts

# App base (sin páginas de contenido)
git checkout chatbot-design -- app/globals.css app/layout.tsx app/providers.tsx app/error.tsx app/not-found.tsx

# Módulo shared completo
git checkout chatbot-design -- modules/shared/

# Assets públicos
git checkout chatbot-design -- public/assets/

# Eliminar archivos viejos de main
git rm --ignore-unmatch app/page.tsx
git rm --ignore-unmatch "app/perros/[id]/page.tsx"
git rm --ignore-unmatch "app/perros/[id]/adoptar/page.tsx"
git rm --ignore-unmatch app/perros/page.tsx
git rm --ignore-unmatch "app/refugio/dashboard/page.tsx"
git rm --ignore-unmatch "app/refugios/[id]/page.tsx"
git rm --ignore-unmatch public/dog1.jpg public/shelter.jpg
git rm --ignore-unmatch "public/assets/hero/back.jpg"
git rm --ignore-unmatch "public/assets/hero/hero1.png"

git add .
git commit -m "feat: shared foundation - domain types, UI components, auth store, layout system, mock data"
git push -u origin pr/01-foundation

gh pr create \
  --title "feat: Fundación compartida (shared module + config)" \
  --base main \
  --body "$(cat <<'EOF'
## ⚠️ Este PR es bloqueante — los demás dependen de él

## ¿Qué incluye?
- Tipos de dominio: `Dog`, `Shelter`, `User`, `Donation`, `AdoptionRequest`, `Message`
- 30+ componentes UI compartidos: `Button`, `Input`, `Badge`, `Skeleton`, `DashboardLayout`, `Sidebar`, etc.
- Auth store (Zustand): `user`, `token`, `isAuthenticated`, `hydrate()`
- Mock data: 100 perros, 5 refugios, 20 donaciones, usuarios de prueba
- Utils: `formatters.ts`, `validators.ts`, `constants.ts`
- Layout: `Navbar`, `Footer`, `AuthLayout`, `DashboardLayout`
- `middleware.ts`: protección de rutas por rol

## Casos de uso cubiertos
- Base para todos los módulos siguientes
- Eliminación de estructura antigua de `/app`

## Checklist del reviewer
- [ ] Los tipos de dominio reflejan el diagrama ER
- [ ] `authStore.hydrate()` funciona correctamente
- [ ] `DashboardLayout` se ve bien en 375/768/1280px
- [ ] `Skeleton` y `Spinner` animados con Tailwind pulse
- [ ] `middleware.ts` protege rutas según rol sin redirigir loops
EOF
)"
```

---

## ⏸️ Esperar merge de PR01 antes de continuar

```bash
# Verificar que PR01 fue mergeado
gh pr view pr/01-foundation --json state

# Actualizar main local
git checkout main
git pull origin main
```

---

## PR 02 — Módulo Auth

**Incluye:** login, registro (adoptante + refugio), forgot/reset password, email verification, shelter-pending.

```bash
git checkout main   # ← siempre desde main actualizado
git checkout -b pr/02-auth

# Nuevos archivos de auth
git checkout chatbot-design -- modules/auth/
git checkout chatbot-design -- "app/(auth)/"

# Eliminar componentes viejos de auth
git rm --ignore-unmatch modules/auth/components/ForgotPasswordForm.tsx
git rm --ignore-unmatch modules/auth/components/LoginPage.tsx
git rm --ignore-unmatch modules/auth/components/RegisterPage.tsx
git rm --ignore-unmatch modules/auth/domain/AuthUser.ts
git rm --ignore-unmatch app/login/page.tsx
git rm --ignore-unmatch app/registro/page.tsx
git rm --ignore-unmatch app/forgot-password/page.tsx

git add .
git commit -m "feat: auth module - login, registro adoptante/refugio, recuperar contraseña, verificación"
git push -u origin pr/02-auth

gh pr create \
  --title "feat: Módulo de autenticación completo" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `LoginView`: formulario con validación, detección `SHELTER_PENDING`
- `RegisterView`: 3 pasos con Stepper, selector adoptante/refugio
- `ShelterRegisterView`: registro refugio con FileUpload placeholder
- `ForgotPasswordView`: cooldown 60s para reenviar email
- `ResetPasswordView`: token via URL, `useSearchParams` + Suspense
- `EmailVerificationPage`: banner de verificación
- `ShelterPendingView`: timeline del proceso de aprobación
- `useLogin` + `useRegister` hooks
- `MockAuthService`: simula 600ms de latencia

## Diagrama de secuencia — Login
```
Usuario → LoginView → useLogin → authService.login()
       → MockAuthService (600ms) → JWT mock
       → authStore.setToken() → redirect por rol
         applicant  → /mis-solicitudes
         shelter    → /refugio/dashboard
         admin      → /admin
```

## Checklist del reviewer
- [ ] Redirect post-login correcto por rol
- [ ] SHELTER_PENDING detectado y redirige a /shelter-pending
- [ ] Formularios validan en blur, no en submit
- [ ] Reset password requiere token válido en URL
- [ ] `useSearchParams` envuelto en `<Suspense>` (Next.js 15)
EOF
)"
```

---

## PR 03 — Landing & Páginas Públicas

**Incluye:** home, lista de refugios, proceso de adopción, página pública de refugio.

```bash
git checkout main
git checkout -b pr/03-home

git checkout chatbot-design -- modules/home/
git checkout chatbot-design -- "app/(public)/layout.tsx"
git checkout chatbot-design -- "app/(public)/loading.tsx"
git checkout chatbot-design -- "app/(public)/page.tsx"
git checkout chatbot-design -- "app/(public)/proceso-adopcion/"
git checkout chatbot-design -- "app/(public)/refugios/page.tsx"
git checkout chatbot-design -- "app/(public)/refugios/loading.tsx"
git checkout chatbot-design -- "app/(public)/refugios/[slug]/page.tsx"

# Eliminar home viejo
git rm --ignore-unmatch modules/home/application/dogsList.ts
git rm --ignore-unmatch modules/home/application/sheltersList.ts
git rm --ignore-unmatch modules/home/components/Footer.tsx
git rm --ignore-unmatch modules/home/components/HeroCarousel.tsx
git rm --ignore-unmatch modules/home/components/HomeHowItWorks.tsx
git rm --ignore-unmatch modules/home/components/header.tsx
git rm --ignore-unmatch modules/home/components/sheltersList.tsx
git rm --ignore-unmatch modules/home/components/successStories.tsx
git rm --ignore-unmatch modules/home/styles/footer.css
git rm --ignore-unmatch modules/home/styles/hero.css

git add .
git commit -m "feat: home & public pages - landing, listado refugios, proceso adopción, perfil público refugio"
git push -u origin pr/03-home

gh pr create \
  --title "feat: Landing y páginas públicas" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `HomeView`: Hero + stats + featured dogs + how it works + testimonials + donation CTA
- `SheltersListView`: grid de refugios con filtros por ciudad
- `ShelterPublicView`: perfil público del refugio con sus perros disponibles
- `AdoptionProcessView`: pasos visuales del proceso de adopción
- `MockHomeService`: 300-400ms de latencia
- Loading skeletons para home y refugios

## Diagrama de secuencia — Home
```
app/(public)/page.tsx (server)
  → HomeView (client) → useHomeContent()
  → homeService.getContent() (400ms)
  → Render: HeroSection + FeaturedDogsSection + SheltersCarousel
             + HowItWorksSection + TestimonialsSection + DonationCTA
```

## Checklist del reviewer
- [ ] Hero responsive en 375/768/1280px
- [ ] StatsCounter anima números al entrar en viewport
- [ ] SheltersCarousel: scroll horizontal en mobile
- [ ] ShelterPublicView muestra solo perros del refugio filtrados
- [ ] QuickFilterChips en home navegan a `/perros?tamano=...`
EOF
)"
```

---

## PR 04 — Catálogo y Perfil de Perros

**Incluye:** módulo dogs, catálogo con filtros, detalle de perro, botón adoptar.

```bash
git checkout main
git checkout -b pr/04-dogs

git checkout chatbot-design -- modules/dogs/
git checkout chatbot-design -- "app/(public)/perros/"

# Eliminar catálogo viejo (módulo /perros → /dogs)
git rm --ignore-unmatch -r modules/perros/
git rm --ignore-unmatch -r "app/perros/"

git add .
git commit -m "feat: dogs module - catálogo con filtros, detalle de perro, parseSearchParams utility"
git push -u origin pr/04-dogs

gh pr create \
  --title "feat: Catálogo y perfil de perros" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `DogsSearchView`: sidebar filtros + grid, 100 perros cargados y filtrado client-side
- `DogDetailView`: **server component**, galería de fotos, vacunas, personalidad, compatibilidad
- `AdoptButton`: applicant → /adoptar/[id], visitor → /login?redirect=
- `parseDogsSearchParams`: utility en `modules/dogs/application/` — page queda en <10 líneas (Regla 1)
- `MockDogService`: 100 perros mock, filtros funcionando, delay 400-800ms
- Loading skeletons: sidebar + 8 DogCardSkeleton + skeleton de detalle

## Diagrama de secuencia — Filtros
```
URL ?tamano=grande&sexo=macho
  → parseDogsSearchParams() → initialFilters
  → DogsSearchView → useDogs(initialFilters)
  → dogService.getDogs() (800ms, carga todo)
  → filter client-side → render grid
  → Usuario cambia filtro → setState → re-filter (sin petición de red)
```

## Checklist del reviewer
- [ ] Filtros activos persisten en la URL (bookmark-able)
- [ ] `DogDetailView` NO tiene `'use client'` (server component)
- [ ] `AdoptButton` diferencia visitante vs adoptante autenticado
- [ ] Catálogo: 1 col mobile, 2 tablet, 3 desktop
- [ ] Vacunas mostradas como tabla con fecha y nombre
EOF
)"
```

---

## PR 05 — Portal del Adoptante

**Incluye:** formulario de adopción multi-paso, favoritos, quiz de compatibilidad, perfil, mensajería.

> ⚠️ Mergear **después de PR04** (referencia tipos de `modules/dogs`).

```bash
git checkout main
git checkout -b pr/05-applicant

git checkout chatbot-design -- modules/adoption/
git checkout chatbot-design -- modules/favorites/
git checkout chatbot-design -- modules/recommendations/
git checkout chatbot-design -- modules/profile/
git checkout chatbot-design -- modules/messaging/
git checkout chatbot-design -- "app/(applicant)/"

git add .
git commit -m "feat: applicant portal - formulario adopción 6 pasos, favoritos, quiz compatibilidad, mensajería"
git push -u origin pr/05-applicant

gh pr create \
  --title "feat: Portal del adoptante" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `AdoptionFormView`: 6 pasos (PersonalData → Housing → Routine → Experience → Commitments → Review)
  - Draft en localStorage con clave `adoption-draft-{perroId}`
- `AdoptionStatusView`: lista de solicitudes con tabs por estado + badges
- `AdoptionDetailView`: timeline de historial + botón cancelar + vista del formulario enviado
- `FavoritesView`: grid de perros guardados con favoritesStore (Zustand)
- `LifestyleQuizView`: 7 pasos de quiz de compatibilidad de estilo de vida
- `RecommendationsView`: resultados del quiz con score % de compatibilidad
- `ProfileView`: editar perfil, foto, preferencias del adoptante
- `ChatView` + `ConversationList`: mensajería 1:1 con refugio

## Diagrama de secuencia — Formulario de adopción
```
/adoptar/[dogId] (server) → dogService.getDogById(id)
  → AdoptionFormView (client) → useAdoptionForm(perroId)
    → Lee draft de localStorage → reanuda en el paso guardado
  → Paso 0 PersonalData (solo lectura desde authStore)
  → Usuario llena pasos 1-4 → cada cambio guarda en localStorage
  → Paso 5 Review → adoptionService.create() (600ms)
  → redirect /mis-solicitudes
```

## Checklist del reviewer
- [ ] Draft persiste al recargar el navegador
- [ ] Stepper muestra pasos completados en verde
- [ ] Cancelar solicitud requiere motivo (textarea obligatorio)
- [ ] Quiz guarda resultado y navega a /mi-match con resultados
- [ ] Layout `(applicant)` protege rutas: shelter→/refugio/dashboard, admin→/admin
- [ ] Mensajería actualiza en tiempo real (polling mock cada 5s)
EOF
)"
```

---

## PR 06 — Portal del Refugio

**Incluye:** dashboard, gestión de perros (alta/edición), solicitudes, perfil, mensajería y donaciones.

```bash
git checkout main
git checkout -b pr/06-shelter

git checkout chatbot-design -- modules/shelter/
git checkout chatbot-design -- "app/(shelter)/"
git checkout chatbot-design -- "app/(shelter-pending)/"

git add .
git commit -m "feat: shelter portal - dashboard, gestión perros/solicitudes, perfil, mensajes, donaciones"
git push -u origin pr/06-shelter

gh pr create \
  --title "feat: Portal del refugio" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `ShelterDashboardView`: 6 KPIs + tabla solicitudes recientes + sidebar perfil/acciones
- `ShelterDogsView`: tabla de perros con búsqueda, filtros de estado y acciones
- `ShelterDogFormView`: formulario multi-step para alta y edición de perros
  - 6 pasos: BasicData / Medical / Care / Personality / Media / Review
- `ShelterRequestsView`: solicitudes con tabs y cambio de estado inline
- `ShelterRequestDetailView`: detalle completo + timeline + aprobar/rechazar con nota
- `ShelterProfileView`: editar datos del refugio, redes sociales, configuración de donaciones
- `ShelterMessagesView`: bandeja de entrada con `useShelterConversations`
- `ShelterDonationsView`: historial y métricas de donaciones recibidas
- `MockShelterService`: CURRENT_SHELTER_ID=1 (Huellitas MX), delay 200-400ms

## Diagrama de secuencia — Aprobar solicitud
```
ShelterRequestsView → useShelterRequests()
  → shelterService.getShelterRequests() (400ms)
  → Usuario click fila → /refugio/solicitudes/{id}
  → ShelterRequestDetailView → useShelterRequestDetail(id)
  → Usuario selecciona "Aprobar" → ConfirmDialog
  → shelterService.updateRequestStatus(id, 'approved') (400ms)
  → optimistic update → badge cambia a "Aprobada" → toast éxito
```

## Checklist del reviewer
- [ ] Sidebar colapsa en mobile (drawer tipo portal)
- [ ] Formulario de perro multi-step guarda progreso
- [ ] Solo `CURRENT_SHELTER_ID=1` tiene acceso (mock)
- [ ] 6 KPIs muestran tendencia ↑/↓ vs mes anterior
- [ ] `app/(shelter)/layout.tsx` guard: no-shelter → redirect /login
EOF
)"
```

---

## PR 07 — Panel Administrador

**Incluye:** dashboard global, aprobación de refugios, moderación de perros, gestión de contenido.

```bash
git checkout main
git checkout -b pr/07-admin

git checkout chatbot-design -- modules/admin/
git checkout chatbot-design -- "app/(admin)/"

git add .
git commit -m "feat: admin panel - dashboard, aprobación refugios, moderación perros, gestión contenido (DnD)"
git push -u origin pr/07-admin

gh pr create \
  --title "feat: Panel administrador" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `AdminDashboardView`: 6 KPIs globales + LineChart adopciones 12 meses + BarChart por ciudad + tabla refugios pendientes
- `AdminSheltersView`: 3 tabs (Pendientes / Activos / Suspendidos) + modal de rechazo con nota obligatoria
- `AdminShelterDetailView`: info completa del refugio + panel de decisión + timeline de estado
- `AdminDogsView`: tabla global de todos los perros + 3 FilterChips de calidad + toggle publicar/ocultar
- `AdminContentView`: 3 tabs editables:
  - **Proceso adopción**: pasos reordenables con HTML5 Drag & Drop nativo
  - **FAQs chatbot**: CRUD de preguntas + preview de burbujas bot/usuario
  - **Contenido general**: 6 campos de texto de la plataforma
- Guard server-side: `role !== 'admin'` → redirect `/`

## Diagrama de secuencia — Aprobar refugio
```
AdminSheltersView (tab Pendientes)
  → useAdminShelters() → adminService.getAllShelters() (400ms)
  → Usuario click "Aprobar" en tarjeta pendiente
  → adminService.approveShelter(id) (400ms)
  → Refugio desaparece de tab Pendientes
  → Aparece en tab Activos
  → Badge de sidebar "Refugios" se decrementa
```

## Checklist del reviewer
- [ ] Solo rol 'admin' accede (guard en layout server component)
- [ ] Rechazar refugio requiere nota (textarea no vacía)
- [ ] Drag & Drop de pasos funciona y renumera correctamente
- [ ] Preview de FAQs: burbujas usuario (rojo) / bot (oscuro)
- [ ] Toggle publicar perro: solo disponible/no_disponible, no en_proceso/adoptado
EOF
)"
```

---

## PR 08 — Chatbot

**Incluye:** chatbot flotante con detección de intents por keywords, respuestas con links y sugerencias.

```bash
git checkout main
git checkout -b pr/08-chatbot

git checkout chatbot-design -- modules/chatbot/

# Eliminar chatbot viejo
git rm --ignore-unmatch modules/chatbot/components/bubbleChatbot.tsx
git rm --ignore-unmatch modules/chatbot/infrastructure/MockChatbot.ts
git rm --ignore-unmatch modules/chatbot/styles/chatbot.css

git add .
git commit -m "feat: chatbot - intent detection, respuestas contextualizadas, FAQs editables desde admin"
git push -u origin pr/08-chatbot

gh pr create \
  --title "feat: Módulo chatbot" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `ChatbotWrapper`: botón FAB flotante + panel deslizante con animación
- `ChatbotPanel`: historial de mensajes con scroll, input de texto, typing indicator
- `ChatbotSuggestions`: chips de respuestas sugeridas (desaparecen al enviar)
- `MockChatbotService`: 12 intents (saludo, adoptar, requisitos, costo, quiz, refugios,
  visita, cachorro, tamaño, solicitud, favoritos, gracias) + fallback
  - Tokenización: split por signos de puntuación + coincidencia de frase completa
  - **Delay 400ms** (Regla 4 de servicios mock)
- FAQs del chatbot editables desde el Panel Admin → tab Contenido

## Diagrama de secuencia
```
Usuario escribe "quiero adoptar un perro"
  → useChatbot.sendMessage()
  → chatbotService.getResponse() — await 400ms
  → tokenizar: ['quiero','adoptar','un','perro']
  → intent 'adoptar' matched (keyword: 'adoptar')
  → BotResponse { text, links: ['/perros', '/mi-match/quiz'], suggestions }
  → render: burbuja bot + links clickeables + chips sugerencias
```

## Checklist del reviewer
- [ ] Chatbot visible en todas las rutas públicas (layout `(public)`)
- [ ] Typing indicator de 400ms antes de la respuesta del bot
- [ ] Sugerencias se ocultan después del primer mensaje del usuario
- [ ] Links dentro de respuestas navegan sin recargar (Next.js Link)
- [ ] Panel cierra con click fuera o en la X
EOF
)"
```

---

## PR 09 — Donaciones

**Incluye:** flujo completo de donación: selector de monto, formulario de tarjeta, confirmación animada.

```bash
git checkout main
git checkout -b pr/09-donations

git checkout chatbot-design -- modules/donations/
git checkout chatbot-design -- "app/(public)/refugios/[slug]/donar/"

git add .
git commit -m "feat: donations - amount selector, card form con Luhn + máscaras, confirmación CSS animada"
git push -u origin pr/09-donations

gh pr create \
  --title "feat: Módulo de donaciones" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?
- `AmountSelector`: chips \$50/\$100/\$200/\$500 + campo custom (validación mínimo \$20)
- `PaymentForm`:
  - Card preview animado en tiempo real (número enmascarado, nombre, vencimiento, CVV en bullets)
  - Detección de marca: Visa (4), Mastercard (51-55), Amex (34/37)
  - Máscaras: número en grupos de 4, expiración MM/AA, CVV oculto
  - Validación Luhn + fecha de vencimiento no expirada
- `DonationConfirmation`: animación CSS-only (circle pop + SVG stroke draw + confetti) + receipt + CTAs
- `DonationView`: orquestador con 4 estados: `amount → payment → confirmed → error`
- `MockDonationService`: 1500ms de latencia + **5% de probabilidad de error**
- Página `app/(public)/refugios/[slug]/donar/`: guard `aceptaDonaciones === false` → 404

## Diagrama de secuencia
```
/refugios/huellitas-mx/donar (server)
  → getShelterBySlug() → guard aceptaDonaciones
  → DonationView (client): step='amount'
  → Usuario elige \$200 → click "Continuar"
  → step='payment' → PaymentForm.onSubmit()
  → donationService.initiateDonation() — await 1500ms
  → 95%: donation → step='confirmed' → animación check
  →  5%: Error → step='error' → retry vuelve a 'payment'
```

## Checklist del reviewer
- [ ] Luhn rechaza números de tarjeta inválidos (error en blur)
- [ ] Animación de check y confetti visible al confirmar
- [ ] Progress indicator: Monto (rojo) → Pago → Listo (verde)
- [ ] "Pagar con enlace externo" solo si el refugio tiene `paypalEmail`
- [ ] Causa de la donación (caja naranja) visible en paso de monto
EOF
)"
```

---

## PR 10 — Loading States & Polish *(mergear al final)*

**Incluye:** 8 archivos `loading.tsx` de Next.js con skeletons precisos por ruta.

> ⚠️ Este PR debe mergearse **después de todos los demás** ya que los skeletons
> importan las CSS de cada módulo (que deben existir en main).

```bash
git checkout main
git checkout -b pr/10-polish

git checkout chatbot-design -- "app/(public)/loading.tsx"
git checkout chatbot-design -- "app/(public)/perros/loading.tsx"
git checkout chatbot-design -- "app/(public)/perros/[slug]/loading.tsx"
git checkout chatbot-design -- "app/(public)/refugios/loading.tsx"
git checkout chatbot-design -- "app/(shelter)/refugio/dashboard/loading.tsx"
git checkout chatbot-design -- "app/(shelter)/refugio/perros/loading.tsx"
git checkout chatbot-design -- "app/(admin)/admin/loading.tsx"
git checkout chatbot-design -- "app/(applicant)/mis-solicitudes/loading.tsx"

git add .
git commit -m "feat: loading states - 8 loading.tsx con skeletons que replican el layout real de cada ruta"
git push -u origin pr/10-polish

gh pr create \
  --title "feat: Loading states y polish final (FASE 13)" \
  --base main \
  --body "$(cat <<'EOF'
## ¿Qué incluye?

8 archivos `loading.tsx` con skeletons que usan las mismas clases CSS que el layout real:

| Ruta | Skeleton |
|------|---------|
| `(public)/` | Dots animados + "Cargando…" |
| `(public)/perros/` | Sidebar filtros + 8 DogCard grises |
| `(public)/perros/[slug]/` | Aside foto + content bloque |
| `(public)/refugios/` | Hero + 6 `sl-card` |
| `(shelter)/refugio/dashboard/` | 6 `sd-card` KPIs + tabla 5 filas |
| `(shelter)/refugio/perros/` | Toolbar + `sv-table` 8 filas |
| `(admin)/admin/` | 6 `ad-card` + charts row + tabla refugios |
| `(applicant)/mis-solicitudes/` | Header + tabs + 6 `as-card` |

Todos usan `animate-pulse` de Tailwind.

## Checklist del reviewer
- [ ] Skeleton visible durante el delay de 400ms del mock service
- [ ] Layout del skeleton coincide visualmente con la página real
- [ ] Sin flash de contenido vacío antes de que aparezca el skeleton
- [ ] Skeleton se ve bien en 375/768/1280px
EOF
)"
```

---

## Cheatsheet de comandos útiles

```bash
# Ver todos los PRs abiertos con su estado
gh pr list

# Ver checks y estado de CI de un PR
gh pr checks <número-pr>

# Ver el diff completo de un PR
gh pr diff <número-pr>

# Ver exactamente qué archivos incluye un PR
git diff --name-only main...<tu-rama>

# Mergear un PR aprobado (squash para historial limpio)
gh pr merge <número-pr> --squash --delete-branch

# Si el PR tiene conflictos con main después de que otro PR mergeó:
git fetch origin main
git rebase origin/main
# resolver conflictos → git add . → git rebase --continue
git push --force-with-lease origin <tu-rama>

# Ver log visual de todas las ramas
git log --oneline --graph --all
```

---

## Reglas de oro — Verificación antes de cada PR

1. **Páginas en /app < 10 líneas** → la lógica va en el View de /modules
2. **Sin imports cruzados entre módulos** → solo se importa de `modules/shared`
3. **`'use client'` solo donde hay hooks/state/eventos** → server components por defecto
4. **Mock services con delay ≥ 400ms** → sin latencia no se prueban loading states
5. **ServiceFactory decide en build** → `process.env.NEXT_PUBLIC_USE_MOCK` a nivel de módulo
6. **Cada View tiene su propio loading state** → skeleton propio para filtros y paginación
7. **Verificar en 375 / 768 / 1280px** → antes de marcar cualquier componente como terminado
