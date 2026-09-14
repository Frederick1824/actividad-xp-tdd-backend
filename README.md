# 🚀 Actividad Backend — XP + TDD + Prisma + Swagger

Backend académico desarrollado de forma incremental, partiendo de un servidor HTTP simple y evolucionando hacia una API REST con arquitectura por capas, persistencia relacional, transacciones y documentación interactiva.

> Rama de entrega: `unidad-2-prisma-swagger`

---

## 🧭 Evolución del proyecto

Este repositorio conserva el recorrido completo de las actividades anteriores y suma, en esta etapa, persistencia real con PostgreSQL y Prisma ORM.

```text
Cliente HTTP
    ↓
Router
    ↓
Controller
    ↓
Service
    ↓
Repository / Prisma
    ↓
PostgreSQL
```

La idea principal fue **evolucionar el mismo backend**, sin crear un proyecto aislado para cada consigna.

---

## 🛠️ Tecnologías

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- OpenAPI 3.1
- Swagger UI
- Vitest
- Supertest

---

## 🗃️ Modelo de datos

El esquema Prisma define cuatro entidades principales:

- `Usuario`
- `Producto`
- `Pedido`
- `DetallePedido`

Se incluyen claves primarias autoincrementales, tipos de datos, precios, stock y relaciones 1:N.

```text
Usuario 1 ─── N Pedido
Pedido  1 ─── N DetallePedido
Producto 1 ── N DetallePedido
```

---

## 🔐 Configuración local

La conexión a PostgreSQL se realiza mediante `DATABASE_URL` en un archivo `.env` local.

El archivo `.env` está excluido del repositorio mediante `.gitignore`.

Ejemplo disponible en `.env.example`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/actividad_backend?schema=public"
PORT=3000
```

---

## 🧱 Prisma y migraciones

Generar Prisma Client:

```bash
npx prisma generate
```

Crear o aplicar la migración inicial:

```bash
npx prisma migrate dev --name init
```

La migración inicial se encuentra versionada en:

```text
prisma/migrations/
```

---

## 🌱 Datos de prueba

El proyecto incluye un seed para cargar un usuario y productos de ejemplo.

```bash
npx prisma db seed
```

Datos utilizados para validar el checkout:

```text
Usuario: Federico
Producto 1: Teclado mecánico — $45.000 — stock 10
Producto 2: Mouse inalámbrico — $25.000 — stock 15
```

---

# 🛒 Endpoint principal

## `POST /api/pedidos`

Procesa un pedido completo y descuenta el stock dentro de una transacción de Prisma.

### Request

```json
{
  "usuarioId": 1,
  "productosComprados": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 2,
      "cantidad": 1
    }
  ]
}
```

### Flujo del checkout

1. valida `usuarioId` y `productosComprados`;
2. verifica que exista el usuario;
3. crea el pedido;
4. busca los productos solicitados;
5. valida el stock disponible;
6. descuenta inventario;
7. crea cada `DetallePedido`;
8. calcula el total;
9. actualiza el pedido;
10. devuelve `201 Created`.

---

## 🔄 Transacción y rollback

El checkout utiliza:

```ts
prisma.$transaction(...)
```

Todas las operaciones se ejecutan como una unidad.

Si ocurre un error, por ejemplo stock insuficiente, la transacción se revierte automáticamente y evita estados inconsistentes como:

- pedidos creados sin detalles;
- stock descontado parcialmente;
- totales incompletos.

---

## ✅ Prueba funcional realizada

El endpoint fue ejecutado desde Swagger UI con los datos del seed y respondió correctamente:

```text
HTTP 201 Created
```

Para la compra de:

```text
2 × $45.000 = $90.000
1 × $25.000 = $25.000
────────────────────
TOTAL         $115.000
```

La respuesta incluye el pedido creado, usuario, detalles y productos asociados.

---

## 📡 Respuestas HTTP

| Código | Situación |
|---|---|
| `201` | Pedido creado correctamente |
| `400` | Datos incompletos, productos inválidos o stock insuficiente |
| `404` | Usuario o producto no encontrado |
| `500` | Error interno inesperado |

---

# 📚 OpenAPI + Swagger UI

La especificación se encuentra en:

```text
src/docs/openapi.yaml
```

Swagger UI está integrado como middleware de Express.

Con el servidor activo:

```text
http://localhost:3000/docs/
```

Desde allí se puede:

- revisar el contrato de `POST /api/pedidos`;
- consultar schemas;
- observar ejemplos de request y response;
- ejecutar el endpoint directamente con **Try it out**.

---

## 🧪 Tests

La suite automatizada heredada de la actividad anterior sigue disponible:

```bash
npm test
```

Resultado verificado:

```text
Test Files  1 passed
Tests       8 passed
```

Validación de TypeScript:

```bash
npm run typecheck
```

Resultado: sin errores de tipos.

---

## 🧩 Endpoints heredados

También se conservan los endpoints anteriores:

| Método | Ruta |
|---|---|
| `GET` | `/salud` |
| `GET` | `/hora` |
| `GET` | `/estudiantes` |
| `GET` | `/estudiantes/:id` |
| `POST` | `/estudiantes` |
| `PATCH` | `/estudiantes/:id` |
| `DELETE` | `/estudiantes/:id` |

---

## 📁 Estructura principal

```text
prisma/
├── migrations/
├── schema.prisma
└── seed.ts

src/
├── app.ts
├── server.ts
├── docs/
│   ├── openapi.yaml
│   └── swagger.ts
├── lib/
│   └── prisma.ts
├── estudiantes/
├── usuarios/
├── productos/
└── pedidos/
    ├── pedidos.controller.ts
    ├── pedidos.routes.ts
    └── pedidos.service.ts
```

---

## ▶️ Instalación y ejecución

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run typecheck
npm test
npm run dev
```

Servidor:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/docs/
```

---

## 🎯 Resultado final

La actividad muestra la evolución de un backend inicialmente simple hacia una API con:

- arquitectura por capas;
- PostgreSQL como base de datos relacional;
- Prisma ORM;
- migraciones versionadas;
- repositorios con persistencia real;
- checkout transaccional;
- control de stock y rollback;
- contrato OpenAPI;
- Swagger UI;
- pruebas automatizadas y validación de tipos.

El objetivo no fue reemplazar el trabajo anterior, sino **hacer visible la evolución incremental del mismo proyecto**.
