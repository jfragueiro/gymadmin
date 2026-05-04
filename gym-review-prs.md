# GymAdmin — Guía de Code Review y Testing

## 1. Checklist de Code Review

### 1.1 Backend — Node.js / Arquitectura Hexagonal

#### Regla de dependencia (no negociable)
- [ ] `domain/` no importa nada externo ni de otras capas
- [ ] `application/` solo importa de `domain/` (use cases, ports)
- [ ] `infrastructure/` solo implementa ports de `application/`; usa Knex solo aquí
- [ ] `adapters/` no contiene lógica de negocio; solo orquesta y valida con Zod
- [ ] Knex **no aparece** fuera de `apps/api/src/infrastructure/`

#### Domain Layer
- [ ] Entidades: estado privado, mutaciones vía métodos con nombres de dominio
- [ ] Value Objects: inmutables, validación en constructor, sin efectos secundarios
- [ ] Errores de dominio: clases propias (`ClientNotFoundError`), nunca strings sueltos
- [ ] Cero dependencias de librerías externas en esta capa

#### Application Layer (Use Cases)
- [ ] Un Use Case = una acción de negocio
- [ ] Dependencias recibidas **únicamente por constructor** (no instanciadas dentro)
- [ ] Retorna DTOs o primitivos, nunca entidades de infraestructura (filas de BD)
- [ ] No accede directamente a la BD ni a librerías de infraestructura

#### Infrastructure Layer
- [ ] Repositorios implementan el puerto (`IClientRepository`) sin agregar métodos extra
- [ ] Queries Knex: usar `trx` para operaciones que requieran atomicidad
- [ ] Soft deletes: `deleted_at` timestamp, nunca `DELETE` en clientes ni planes
- [ ] Secrets y config vienen de variables de entorno, nunca hardcodeados

#### Adapters Layer (Controllers / Routes)
- [ ] Validación de request con Zod antes de llamar al Use Case
- [ ] Controller no maneja errores de negocio directamente: los relanza y deja al middleware global
- [ ] Respuestas HTTP: 201 para recursos creados, 200 para consultas, 204 sin body
- [ ] Rutas del bot Telegram sin autenticación JWT (excepción controlada y documentada)

#### Seguridad
- [ ] Contraseñas siempre hasheadas con bcrypt (nunca en texto plano en logs ni respuestas)
- [ ] JWT validado en middleware, no en cada controller
- [ ] Header `X-Telegram-Bot-Api-Secret-Token` validado antes de procesar webhook
- [ ] Inputs de usuario sanitizados via Zod antes de llegar al dominio
- [ ] Sin `console.log` con datos sensibles (tokens, passwords, datos personales)

#### Calidad general Node.js
- [ ] `async/await` consistente, sin mezclar con `.then()`
- [ ] Errores no silenciados: ningún `catch` vacío
- [ ] Sin variables sin usar o imports muertos
- [ ] Nombres en inglés (código), mensajes de error al usuario en español
- [ ] Variables de entorno accedidas al inicio del proceso, no en cada llamada

---

### 1.2 Frontend — React SPA

#### Estado
- [ ] Estado del servidor **exclusivamente** en TanStack Query (no en `useState`)
- [ ] `authStore` (Zustand) solo guarda JWT y rol — nada más
- [ ] Sin `useEffect` para fetching de datos; usar `useQuery`
- [ ] `useMutation` para todas las operaciones de escritura con `onSuccess`/`onError`

#### Componentes
- [ ] Componentes en `PascalCase.jsx`
- [ ] Componentes de página en `pages/` solo orquestan hooks y componen UI
- [ ] Sin lógica de negocio en componentes: extraer a hooks custom
- [ ] Primitivos UI de shadcn/ui — no reinventar botones, inputs, modales
- [ ] Solo Tailwind para estilos — sin `style={{}}` inline ni CSS custom

#### API y comunicación
- [ ] Funciones API agrupadas por módulo (`clientsApi.getAll`, `clientsApi.create`)
- [ ] El interceptor Axios es el único lugar que adjunta el JWT y redirige en 401
- [ ] Query keys: array `['recurso', filtros]` — consistente en todo el módulo
- [ ] Sin `fetch` directo en componentes o hooks

#### Formularios
- [ ] Todos los formularios usan React Hook Form + Zod (`zodResolver`)
- [ ] Errores de validación mostrados en español
- [ ] `isLoading`/`isPending` de la mutation usado para deshabilitar el botón submit

#### Calidad general React
- [ ] Sin prop drilling de más de 2 niveles (usar composición o contexto/query)
- [ ] Keys únicas y estables en listas (no usar índice si el array puede reordenarse)
- [ ] Sin `any` implícito en props que debería estar tipado
- [ ] Imports ordenados: externos → internos → relativos

---

## 2. Testing — TDD obligatorio en GymAdmin

### 2.1 Regla principal: el test se escribe ANTES del código

En GymAdmin se aplica TDD (Test-Driven Development) en las capas `domain/` y `application/`.
Esto no es opcional: **no se acepta en merge código de dominio o use case sin su test previo.**

El ciclo TDD a seguir en cada feature:

```
1. RED   → Escribir el test que describe el comportamiento esperado. Debe fallar.
2. GREEN → Escribir el mínimo código que hace pasar el test.
3. REFACTOR → Limpiar sin romper el test.
```

Beneficios concretos para este proyecto:
- La arquitectura hexagonal hace que los use cases sean 100% testeables sin BD (se mockean los puertos).
- Los tests actúan como documentación viva de las reglas de negocio del gimnasio.
- Detecta regresiones antes de llegar a la capa HTTP.

### 2.2 Mapa de cobertura por capa

| Capa | Cuándo escribir el test | Qué testear | Herramienta |
|---|---|---|---|
| `domain/` | **Antes** del código — TDD obligatorio | Reglas de negocio, validaciones de entidades y VOs | Jest |
| `application/` (use cases) | **Antes** del código — TDD obligatorio | Orquestación, interacción con puertos mockeados | Jest |
| `infrastructure/` | Después — integración opcional | Queries reales contra BD de test | Jest + BD real |
| `adapters/` (controllers) | Después | Validación Zod, status HTTP, mapeo de errores | Jest + Supertest |
| `components/` React | Al crear el componente | Render, interacciones, estado | Vitest + Testing Library |
| `hooks/` React | Al crear el hook | Fetching, mutaciones, estado derivado | Vitest + MSW |

**¿Por qué no SDD / BDD con Gherkin?**
SDD (Cucumber/Gherkin) agrega valor cuando hay stakeholders no técnicos que validan specs en lenguaje natural. En GymAdmin toda la especificación vive en el PRD y en CLAUDE.md — TDD en las capas internas da el mismo beneficio (diseño emergente + regresión) sin el overhead de mantener archivos `.feature`.

---

### 2.3 Backend — Jest

#### Estructura de carpetas
```
apps/api/src/
├── domain/
│   └── client/
│       └── __tests__/
│           └── Client.test.js                   ← Escrito ANTES de Client.js
├── application/
│   └── client/
│       └── __tests__/
│           └── RegisterClientUseCase.test.js    ← Escrito ANTES del use case
└── adapters/
    └── controllers/
        └── __tests__/
            └── ClientController.test.js         ← Supertest, después del controller
```

#### Ciclo TDD en la práctica — ejemplo use case

**Paso 1 — RED: escribir el test primero**
```js
// RegisterClientUseCase.test.js — se escribe ANTES de RegisterClientUseCase.js
describe('RegisterClientUseCase', () => {
  let mockClientRepo;
  let mockHasher;
  let useCase;

  beforeEach(() => {
    mockClientRepo = { findByDni: jest.fn(), save: jest.fn() };
    mockHasher = { hash: jest.fn().mockResolvedValue('hashed_pass') };
    useCase = new RegisterClientUseCase(mockClientRepo, mockHasher);
    jest.clearAllMocks();
  });

  it('guarda el cliente y retorna su id cuando el DNI no existe', async () => {
    mockClientRepo.findByDni.mockResolvedValue(null);
    mockClientRepo.save.mockResolvedValue({ id: 1 });

    const result = await useCase.execute({ dni: '12345678', name: 'Juan', password: '1234' });

    expect(mockClientRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('id', 1);
  });

  it('lanza ClientAlreadyExistsError cuando el DNI ya está registrado', async () => {
    mockClientRepo.findByDni.mockResolvedValue({ id: 99 });

    await expect(
      useCase.execute({ dni: '12345678', name: 'Juan', password: '1234' })
    ).rejects.toThrow(ClientAlreadyExistsError);
  });
});
```

**Paso 2 — GREEN: implementar lo mínimo para pasar**
```js
// RegisterClientUseCase.js — se escribe DESPUÉS del test
class RegisterClientUseCase {
  constructor(clientRepository, passwordHasher) {
    this.clientRepository = clientRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ dni, name, password }) {
    const existing = await this.clientRepository.findByDni(dni);
    if (existing) throw new ClientAlreadyExistsError(dni);

    const hashedPassword = await this.passwordHasher.hash(password);
    return this.clientRepository.save({ dni, name, password: hashedPassword });
  }
}
```

**Paso 3 — REFACTOR**: limpiar nombres, extraer constantes, sin tocar los tests.

#### Convenciones de naming en tests
```js
// Describe: nombre de la clase o función bajo test
// it: comportamiento observable en lenguaje de negocio (no "debería hacer X")
describe('Client entity', () => {
  it('activa la membresía cuando el pago es registrado', () => { ... });
  it('no permite activar una membresía ya activa', () => { ... });
});
```

#### Reglas de mocking
- Mocks de repositorios: objetos planos con `jest.fn()` — nunca `jest.mock()` de módulos enteros
- **Nunca** mockear la BD real en tests de dominio/application
- **Nunca** importar Knex en tests de dominio o application
- `jest.clearAllMocks()` en cada `beforeEach`

#### Qué testear (y qué no)
Testear:
- Path feliz y paths de error de cada use case
- Reglas de validación de entidades y VOs
- Que los errores de dominio correctos se lanzan en cada condición de negocio

No testear:
- La implementación interna de Knex (test de integración separado)
- Librerías de terceros (bcrypt, jwt)
- Getters triviales sin lógica

#### Scripts
```json
// apps/api/package.json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

### 2.4 Frontend — Vitest + Testing Library

El frontend actualmente no tiene configuración de tests. Pasos para añadirla:

#### Instalación
```bash
cd apps/web
npm install -D vitest @vitest/ui jsdom \
  @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom msw
```

#### `apps/web/vite.config.js` — agregar bloque test
```js
/// <reference types="vitest" />
export default defineConfig({
  // ...config existente...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
});
```

#### `apps/web/src/test/setup.js`
```js
import '@testing-library/jest-dom';
```

#### Estructura
```
apps/web/src/
├── components/
│   └── clients/
│       └── __tests__/
│           └── ClientTable.test.jsx
└── hooks/
    └── __tests__/
        └── useClients.test.js
```

#### Patrón para componentes
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientTable } from '../ClientTable';

describe('ClientTable', () => {
  it('muestra mensaje cuando no hay clientes', () => {
    render(<ClientTable clients={[]} />);
    expect(screen.getByText(/no hay clientes/i)).toBeInTheDocument();
  });

  it('llama a onSelect cuando se hace click en una fila', async () => {
    const onSelect = vi.fn();
    render(<ClientTable clients={[mockClient]} onSelect={onSelect} />);
    await userEvent.click(screen.getByText(mockClient.name));
    expect(onSelect).toHaveBeenCalledWith(mockClient.id);
  });
});
```

#### Patrón para hooks con MSW
```js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useClients } from '../useClients';

const server = setupServer(
  http.get('/api/v1/clients', () => HttpResponse.json([mockClient]))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('retorna la lista de clientes', async () => {
  const { result } = renderHook(() => useClients(), { wrapper: QueryWrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(1);
});
```

---

## 3. Definición de "listo para merge"

Un PR está listo para merge cuando cumple **todos** los siguientes puntos:

- [ ] Todos los checks de la sección 1 (code review) se cumplen
- [ ] Cada use case o entidad de dominio nuevo tiene su test escrito **antes** del código (TDD)
- [ ] Cada componente o hook React nuevo tiene su test de comportamiento
- [ ] `npm test` pasa en verde en `apps/api` sin warnings
- [ ] Cobertura de use cases y entidades: mínimo paths feliz + paths de error principales
- [ ] Sin `console.log` de debug
- [ ] Variables de entorno nuevas documentadas en `.env.example`
- [ ] Migraciones Knex incluidas si cambió el esquema de BD
- [ ] Sin secrets ni datos reales en el código ni en los tests
