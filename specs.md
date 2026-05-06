# GymAdmin – Especificaciones de Negocio
*(Spec – versión 2.0 – 06‑May‑2026)*

---

## 1. Visión General

GymAdmin es una aplicación web **Node.js + React** que permite a los administradores de un gimnasio gestionar clientes, membresías, asistencias, planes de entrenamiento, costos operativos y métricas de actividad. Incluye integración con Telegram para notificaciones automáticas a clientes.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Backend | Node.js + Express.js | 20 LTS |
| Base de datos | PostgreSQL (Neon/Supabase) + Knex.js | 16 |
| Autenticación | JWT (jsonwebtoken) + bcrypt | — |
| Frontend | React + Vite | 18 / 5 |
| Estado servidor | TanStack Query | v5 |
| Estado global | Zustand | — |
| Estilos | Tailwind CSS + shadcn/ui | v3 |
| Formularios | React Hook Form + Zod | — |
| Bot Telegram | node-telegram-bot-api (webhook) | — |
| Infraestructura | Docker + Docker Compose + Nginx | — |
| Testing | Jest (backend) | 29 |

---

## 3. Actores y Roles

| Rol | Código | Descripción |
|-----|--------|-------------|
| **Administrador** | `admin` | Acceso total al sistema. Gestiona usuarios, costos, configuración. |
| **Supervisor** | `supervisor` | Acceso operativo completo excepto gestión de usuarios y config. |
| **Profesor** | `profesor` | Gestiona clientes, asistencias y planes de entrenamiento. |
| **Recepcionista** | `recepcionista` | Registra asistencias, consulta clientes y membresías. |
| **Cajero** | `cajero` | Gestiona membresías y pagos. Sin acceso a clientes ni métricas. |

---

## 4. Matriz de Permisos

Cada módulo puede tener nivel `full` (lectura + escritura), `read` (solo lectura) o `-` (sin acceso).

| Módulo | admin | supervisor | profesor | recepcionista | cajero |
|--------|-------|------------|----------|---------------|--------|
| `clients` | full | full | full | read | - |
| `memberships` | full | full | - | read | full |
| `payments` | full | full | - | - | full |
| `attendance` | full | full | full | full | - |
| `plans` | full | full | full | - | - |
| `exercises` | full | full | full | - | - |
| `metrics` | full | full | full | - | - |
| `reports` | full | full | read | read | - |
| `users` | full | - | - | - | - |
| `config` | full | - | - | - | - |
| `finances` | **full** | **read** | - | - | - |

> El módulo `finances` (Costos) es visible únicamente para `admin` y `supervisor`.
> Solo el `admin` puede agregar categorías nuevas y editar entradas.

---

## 5. Módulos del Sistema

### 5.1 Clientes
CRUD completo de clientes del gimnasio. Incluye soft delete (nunca se eliminan físicamente).

**Campos:** nombre, email, teléfono, fecha de nacimiento, DNI, estado activo, QR token, Telegram chat ID.

**Rutas:**
- `GET /api/v1/clients` — listado paginado con búsqueda
- `POST /api/v1/clients` — registro
- `GET /api/v1/clients/:id` — perfil
- `PUT /api/v1/clients/:id` — actualización
- `DELETE /api/v1/clients/:id` — soft delete

---

### 5.2 Membresías y Planes
Asignación de planes de membresía a clientes.

**Rutas:**
- `GET /api/v1/memberships/overview` — resumen de membresías activas
- `POST /api/v1/memberships` — asignar plan a cliente
- `GET /api/v1/clients/:id/memberships` — historial de membresías de un cliente

---

### 5.3 Asistencia
Registro de ingresos al gimnasio por QR o manual.

**Métodos de check-in:** `manual` | `qr`

**Rutas:**
- `GET /api/v1/attendance/daily` — asistencia del día
- `POST /api/v1/attendance` — registrar ingreso manual
- `POST /api/v1/qr/check-in` — check-in por QR token
- `GET /api/v1/clients/:id/attendance` — historial de un cliente

---

### 5.4 Pagos
Registro de pagos de membresías.

**Rutas:**
- `POST /api/v1/payments` — registrar pago
- `GET /api/v1/clients/:id/payments` — historial de pagos de un cliente

---

### 5.5 Planes de Entrenamiento
Planes personalizados por cliente con ejercicios por día de la semana.

**Rutas:**
- `GET /api/v1/clients/:id/training-plans` — planes del cliente
- `POST /api/v1/training-plans` — crear plan
- `PUT /api/v1/training-plans/:id` — actualizar plan
- `DELETE /api/v1/training-plans/:id` — eliminar plan
- `POST /api/v1/training-plans/:id/exercises` — agregar ejercicio
- `DELETE /api/v1/training-plans/:id/exercises/:exerciseId` — quitar ejercicio

---

### 5.6 Usuarios del sistema
Gestión del personal con acceso a GymAdmin.

**Rutas:**
- `GET /api/v1/users` — listado (solo admin)
- `POST /api/v1/users` — crear usuario
- `PUT /api/v1/users/:id` — actualizar
- `PATCH /api/v1/users/:id/toggle-status` — activar/desactivar

---

### 5.7 Métricas del Gimnasio
Dashboard global de actividad filtrable por rango de fechas.

**Ruta:** `GET /api/v1/gym-metrics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Permiso requerido:** `reports: read`

| ID | Métrica | Descripción |
|----|---------|-------------|
| MG001 | Clientes registrados | Altas en el período seleccionado |
| MG002 | Visitantes únicos | Clientes distintos que ingresaron |
| MG003 | Ingresos por cliente | Ranking con gráfico de barras (top 15) |
| MG004 | Horarios pico | ⏳ Pendiente de implementación |

**Respuesta:**
```json
{
  "period": { "startDate": "2026-05-01", "endDate": "2026-05-31" },
  "clientsRegistered": 15,
  "uniqueVisitors": 42,
  "totalCheckIns": 180,
  "checkInsPerClient": [
    { "clientId": "uuid", "clientName": "Juan López", "total": 12 }
  ]
}
```

---

### 5.8 Módulo de Costos (Finances)

Dashboard financiero mensual. Permite al administrador visualizar y registrar todos los gastos operativos del gimnasio organizados por categoría.

**Permiso requerido:** `finances: read` (ver) | `finances: full` (editar)

#### Vista resumen — `/finances`

Tabla mes × categoría. Cada celda muestra el total del mes o un botón **"añadir"** si no hay entradas.

| Mes | Total | Empleados | Servicios | *(+ col)* |
|-----|-------|-----------|-----------|-----------|
| Mayo | $401.000 | $350.000 | $51.000 | — |
| Abril | $55.000 | *(añadir)* | $55.000 | — |

- El **"+"** en el header del tabla agrega una nueva categoría de gasto (columna nueva).
- Celdas con dato son clickeables → navegan al detalle del mes + categoría.
- Celdas vacías muestran botón **"añadir"** → mismo destino.
- Selector de año para ver histórico.

#### Vista detalle — `/finances/:categoryId?month=YYYY-MM`

Tabla de entradas individuales del mes para esa categoría.

| Concepto | Monto |
|----------|-------|
| Juan Pérez – Recepcionista | $350.000 |
| Ana Gómez – Profesor | $280.000 |
| *(+ Agregar)* | |

- Formulario inline para agregar entradas (concepto + monto).
- Botón eliminar por fila (visible en hover).
- Total calculado automáticamente al pie.

#### Categorías por defecto (seed)

Al iniciar por primera vez se crean dos categorías predeterminadas:
- **Empleados** — sueldos del personal
- **Servicios** — luz, gas, internet, alquiler, etc.

El administrador puede agregar categorías adicionales ilimitadas desde la vista resumen.

#### Modelo de datos

```
expense_categories
------------------
id          integer PK
name        string NOT NULL
created_at  timestamp
updated_at  timestamp

expense_entries
---------------
id          integer PK
category_id integer FK → expense_categories(id) CASCADE
month       string(7) NOT NULL  -- formato YYYY-MM
label       string NOT NULL     -- ej: "Juan Pérez - Recepcionista"
amount      decimal(12,2) NOT NULL
created_at  timestamp
updated_at  timestamp
```

#### Endpoints

| Método | Endpoint | Descripción | Permiso |
|--------|----------|-------------|---------|
| GET | `/api/v1/finances/summary?year=YYYY` | Matriz resumen anual | `finances: read` |
| GET | `/api/v1/finances/categories/:id/entries?month=YYYY-MM` | Detalle de un mes | `finances: read` |
| POST | `/api/v1/finances/categories` | Nueva categoría | `finances: full` |
| POST | `/api/v1/finances/categories/:id/entries` | Nueva entrada | `finances: full` |
| DELETE | `/api/v1/finances/entries/:id` | Eliminar entrada | `finances: full` |

**Respuesta `GET /summary`:**
```json
{
  "year": 2026,
  "categories": [
    { "id": 1, "name": "Empleados" },
    { "id": 2, "name": "Servicios" }
  ],
  "months": [
    {
      "month": "2026-05",
      "totals": { "1": 350000, "2": 51000 },
      "grandTotal": 401000
    },
    {
      "month": "2026-04",
      "totals": { "1": null, "2": 55000 },
      "grandTotal": 55000
    }
  ]
}
```
> `null` en `totals` indica que no hay entradas para ese mes/categoría → se muestra botón "añadir".

---

### 5.9 Telegram Bot

Notificaciones y consulta de planes de entrenamiento vía Telegram.

**Flujo de vinculación:** el cliente escribe su DNI al bot → el sistema lo vincula guardando `telegram_chat_id` en su perfil.

**Comandos:**
| Comando | Descripción |
|---------|-------------|
| DNI (6-10 dígitos) | Vincula la cuenta del cliente al chat |
| `/plan` | Muestra el plan de entrenamiento del día |
| `/semana` | Muestra el plan completo de los 7 días |
| Cualquier otro texto | Mensaje de ayuda |

**Cron job:** todos los días a las 7am (zona horaria `GYM_TIMEZONE`) envía el plan del día a todos los clientes vinculados.

**Ruta:** `POST /api/v1/telegram/webhook` (sin autenticación JWT — validada por `X-Telegram-Bot-Api-Secret-Token`)

---

## 6. Reglas de Negocio

| ID | Regla |
|----|-------|
| RN001 | Los clientes nunca se eliminan físicamente — soft delete con `deleted_at`. |
| RN002 | Los planes de entrenamiento nunca se eliminan físicamente. |
| RN003 | El check-in por QR valida que el cliente tenga membresía activa. |
| RN004 | Un cliente solo puede tener un check-in por día. |
| RN005 | Las categorías de gastos son globales — no están asociadas a un mes específico. |
| RN006 | El total mensual de Costos se calcula en tiempo real como `SUM(amount)` de las entradas del mes. |
| RN007 | Los seeds de datos de prueba solo corren si `ENVIRONMENT ≠ production`. |

---

## 7. Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | URL de conexión PostgreSQL |
| `JWT_SECRET` | Sí | Clave para firmar tokens JWT (≥ 32 chars) |
| `PORT` | No | Puerto del servidor API (default: 3000) |
| `NODE_ENV` | No | Entorno de Node (development / production) |
| `ENVIRONMENT` | No | Si es `production` no carga seeds de datos de prueba |
| `TELEGRAM_BOT_TOKEN` | No | Token del bot de Telegram (@BotFather) |
| `TELEGRAM_WEBHOOK_SECRET` | No | String aleatorio ≥ 32 chars para validar webhook |
| `GYM_TIMEZONE` | No | Zona horaria del cron (ej: `America/Buenos_Aires`) |

---

## 8. Infraestructura Docker

| Servicio | Imagen | Puerto |
|----------|--------|--------|
| `db` | postgres:16-alpine | 5432 |
| `api` | node:20-alpine (build local) | 3000 |
| `web` | nginx:alpine (build Vite) | 80 |

**Inicio automático al levantar:**
1. Migraciones Knex (`migrate:latest`)
2. Seeds: usuario admin + datos de prueba (si `ENVIRONMENT ≠ production`)
3. Servidor Express

**Credenciales por defecto:**
- Email: `admin@gymadmin.com`
- Password: `postgres`

---

## 9. Aprobaciones

| Rol | Firma | Fecha |
|-----|-------|-------|
| Product Owner | **[Nombre]** | 06‑May‑2026 |
| Arquitecto de Software | **[Nombre]** | 06‑May‑2026 |
| Líder de QA | **[Nombre]** | 06‑May‑2026 |
