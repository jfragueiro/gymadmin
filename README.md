# GymAdmin

Sistema de gestión para gimnasios. Permite administrar clientes, membresías, asistencias y métricas de actividad. Incluye integración con Telegram para notificaciones de planes de entrenamiento.

## Stack

- **Backend:** Node.js 20 + Express + PostgreSQL + Knex.js
- **Frontend:** React 18 + Vite + TanStack Query + Tailwind CSS + shadcn/ui
- **Infraestructura:** Docker + Docker Compose + Nginx

---

## Correr con Docker

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd gymadmin
```

### 2. Crear el archivo `.env`

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
JWT_SECRET=un_secreto_seguro_de_al_menos_32_caracteres

# Poner 'production' para NO generar datos de prueba al iniciar
ENVIRONMENT=development

# Opcional — Bot de Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
GYM_TIMEZONE=America/Buenos_Aires
```

### 3. Levantar los servicios

```bash
docker compose up --build
```

Primera vez que corre, Docker:
1. Construye las imágenes de API y frontend
2. Levanta PostgreSQL
3. Ejecuta las migraciones automáticamente
4. Carga el usuario admin
5. Si `ENVIRONMENT` **no** es `production`: carga 20 clientes de prueba con asistencias históricas desde enero

### 4. Acceder

| Servicio   | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost       |
| API        | http://localhost:3000  |
| PostgreSQL | localhost:5432         |

---

## Credenciales por defecto

| Campo    | Valor                |
|----------|----------------------|
| Email    | `admin@gymadmin.com` |
| Password | `postgres`           |

> Cambiá la contraseña antes de usar en producción.

---

## Datos de prueba

Con `ENVIRONMENT=development` (o sin definir la variable), al iniciar se cargan automáticamente:

- **20 clientes** con datos ficticios (nombre, DNI, email, teléfono)
- **Asistencias aleatorias** desde enero del año en curso, una visita por día por cliente entre las 7:00 y las 21:00

Para desactivar los datos de prueba, setear en `.env`:

```env
ENVIRONMENT=production
```

---

## Comandos útiles

```bash
# Levantar en background
docker compose up --build -d

# Ver logs de la API
docker compose logs -f api

# Detener y eliminar volúmenes (borra la DB)
docker compose down -v

# Reiniciar solo la API
docker compose restart api
```

---

## Estructura del proyecto

```
gymadmin/
├── apps/
│   ├── api/        # Backend Node.js — arquitectura hexagonal
│   └── web/        # Frontend React SPA
└── packages/
    └── shared/     # Tipos y constantes compartidos
```
