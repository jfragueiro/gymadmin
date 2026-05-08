# GymAdmin — Contexto para Claude Code

## Estructura del Monorepo
```
gymadmin/                    ← Monorepo root (npm workspaces)
├── apps/api/                ← Backend Node.js hexagonal
├── apps/web/                ← Frontend React SPA
└── packages/shared/         ← Tipos y constantes compartidas
```

## Backend — Arquitectura Hexagonal (apps/api)
Respetar estrictamente la regla de dependencia:
Domain ← Application ← Infrastructure ← Adapters

### Capas (apps/api/src/)
- `domain/`        → Entidades, Value Objects, Domain Errors. CERO imports externos.
- `application/`   → Use Cases, Ports (interfaces), DTOs. Solo importa de domain/.
- `infrastructure/`→ Repositorios Postgres (Knex), JwtTokenService, BcryptPasswordHasher.
- `adapters/`      → Controllers Express, Routes, Zod schemas. Solo orquesta, sin lógica de negocio.

### Stack Backend
- Node.js 20 + Express.js + PostgreSQL (Neon/Supabase) + Knex.js + Zod + Jest

### Naming Backend
- Use Cases: `RegisterClientUseCase.js`
- Puertos: `IClientRepository.js`
- Repositorios: `PostgresClientRepository.js`
- Errores de dominio: `ClientNotFoundError.js`

## Frontend — React SPA (apps/web)

### Stack Frontend
- React 18 + Vite + React Router v6 + TanStack Query v5
- Tailwind CSS v3 + shadcn/ui + Recharts
- Axios + Zustand + React Hook Form + Zod

### Capas (apps/web/src/)
- `api/`        → Axios client + funciones por módulo (una función por endpoint)
- `hooks/`      → Custom hooks con TanStack Query (useClients, useMetrics, etc.)
- `store/`      → Zustand: solo sesión JWT + rol (authStore.js)
- `pages/`      → Una carpeta por pantalla, orquestan hooks y componen UI
- `components/` → Reutilizables por módulo (ui/, layout/, clients/, metrics/, etc.)
- `router/`     → React Router: rutas + ProtectedRoute
- `utils/`      → formatters.js, constants.js

### Naming Frontend
- Componentes: `PascalCase.jsx` (ej. `ClientTable.jsx`)
- Hooks: `camelCase` con prefijo `use` (ej. `useClients`, `useCheckIn`)
- Funciones API: `camelCase` por acción (ej. `clientsApi.getAll`, `clientsApi.create`)
- Query keys: array con recurso + filtros `['clients', filters]`

### Reglas Frontend
- Tailwind únicamente — sin CSS custom
- shadcn/ui como base de componentes — no reinventar primitivos
- TanStack Query para estado del servidor, Zustand solo para sesión global
- No Redux
- Validación con React Hook Form + Zod
- Interceptor Axios adjunta JWT en todas las requests; redirige a /login en 401

## Módulo Telegram (apps/api/src/)
Bot de notificaciones. Flujo: cliente escribe su DNI → bot lo vincula (guarda telegram_chat_id en clients). Cron job diario a las 7am envía el plan del día.

### Estructura
- `application/telegram/ports/ITelegramService.js` → puerto abstracto
- `application/telegram/use-cases/` → SendDailyPlansUseCase, GetDailyPlanUseCase, GetWeeklyPlanUseCase, HandleUnknownCommandUseCase
- `application/client/LinkTelegramUseCase.js` → vincula DNI ↔ chat_id
- `infrastructure/services/TelegramBotService.js` → implementa ITelegramService con node-telegram-bot-api (modo webhook)
- `infrastructure/scheduler.js` → cron job (node-cron) a las 7am en GYM_TIMEZONE
- `adapters/controllers/TelegramWebhookController.js` → valida X-Telegram-Bot-Api-Secret-Token, rutea por comando
- `adapters/routes/telegramRoutes.js` → POST /api/v1/telegram/webhook (sin auth JWT)

### Variables de entorno requeridas
- `TELEGRAM_BOT_TOKEN` → token del bot (@BotFather)
- `TELEGRAM_WEBHOOK_SECRET` → string aleatorio ≥32 chars para validar el webhook
- `GYM_TIMEZONE` → zona horaria del cron (ej. America/Buenos_Aires)

### Comandos del bot
- DNI (6-10 dígitos) → vinculación automática
- `/plan` → entrenamiento del día actual
- `/semana` → plan completo de los 7 días
- Cualquier otro texto → mensaje de ayuda

## Reglas Globales
- Knex NUNCA se importa fuera de apps/api/src/infrastructure/
- Los Use Cases reciben dependencias SOLO por constructor
- Controllers nunca contienen lógica de negocio
- Soft deletes: nunca eliminar físicamente clientes ni planes
- Tests unitarios en domain/ y application/ con mocks de Jest (sin BD)
- Idioma del código: inglés. UI y mensajes de error al usuario: español

## Seguridad — Obligatorio en toda integración

### Validación de inputs en endpoints POST/PUT/PATCH
- Todo endpoint que reciba body DEBE tener su schema Zod en `adapters/schemas/`
- El schema se aplica ANTES de llamar al Use Case — nunca pasar `req.body` directo
- Campos de tipo string: definir longitud máxima (`.max()`) para evitar payloads gigantes
- Campos numéricos: validar rango con `.min()` / `.max()`
- Fechas: validar formato con `.regex(/^\d{4}-\d{2}-\d{2}$/)` antes de parsear
- Enums: usar `z.enum([...])` — nunca aceptar valores arbitrarios
- Si la validación Zod falla, Express devuelve 400 con el mensaje del error — no llega al Use Case

### Protección contra SQL Injection
- Usar SIEMPRE los métodos de Knex (`.where({ id })`, `.insert({})`) — NUNCA concatenar strings en queries
- Prohibido: `` knex.raw(`WHERE id = ${id}`) `` con variables directas
- Permitido: `knex.raw('WHERE id = ?', [id])` con parámetros posicionales cuando sea necesario
- Los repositorios son la única capa que toca Knex — ningún controller ni use case construye queries

### Protección contra SSRF (Server-Side Request Forgery)
- El backend NO debe hacer requests HTTP a URLs que vengan del usuario (body, query params, headers)
- Si un endpoint necesita hacer fetch externo, la URL debe estar hardcodeada o venir de variables de entorno
- Nunca pasar `req.body.url`, `req.query.webhook`, ni similares a `fetch()`, `axios.get()` u otras funciones HTTP
- El webhook de Telegram usa URL configurada en `TELEGRAM_WEBHOOK_SECRET` — no viene del cliente

### Frontend — Validación antes de enviar
- Todo formulario con POST usa React Hook Form + Zod (`zodResolver`) antes de llamar a la API
- Campos obligatorios marcados con `required` en el componente `Field` (asterisco rojo visible)
- El botón submit permanece deshabilitado (`disabled`) hasta que los campos obligatorios estén completos
- Los errores de la API se muestran usando `error?.response?.data?.error` (clave `error`, no `message`)

## Referencia completa
Ver `/Users/joe/Documents/joe/prd/GymAdmin_PRD_v6.0.pdf` para el modelo de datos completo,
lista de endpoints y especificación de módulos.
