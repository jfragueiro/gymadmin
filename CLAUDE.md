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

## Reglas Globales
- Knex NUNCA se importa fuera de apps/api/src/infrastructure/
- Los Use Cases reciben dependencias SOLO por constructor
- Controllers nunca contienen lógica de negocio
- Soft deletes: nunca eliminar físicamente clientes ni planes
- Tests unitarios en domain/ y application/ con mocks de Jest (sin BD)
- Idioma del código: inglés. UI y mensajes de error al usuario: español

## Referencia completa
Ver `/Users/joe/Documents/joe/prd/GymAdmin_PRD_v4.0.pdf` para el modelo de datos completo,
lista de endpoints y especificación de módulos.
