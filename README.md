# Actividad Backend — Evolución XP + TDD + Prisma + Swagger

Este repositorio continúa el backend trabajado en actividades anteriores y muestra su evolución incremental. La rama `unidad-2-prisma-swagger` incorpora persistencia relacional con PostgreSQL y Prisma ORM, checkout transaccional y documentación interactiva con OpenAPI y Swagger UI.

## Evolución del proyecto

La actividad comenzó con un servidor HTTP simple y luego pasó a una arquitectura por capas con Express y TypeScript. En esta nueva etapa se agrega persistencia real y documentación del contrato de la API.

Flujo actual:

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

## Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- OpenAPI
- Swagger UI
- Vitest
- Supertest

## Persistencia con Prisma

La conexión se configura mediante la variable `DATABASE_URL` en un archivo `.env` local. El archivo `.env` no se versiona.

Ejemplo disponible en `.env.example`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/actividad_backend?schema=public"
PORT=3000
```

El esquema Prisma define las entidades:

- `Usuario`
- `Producto`
- `Pedido`
- `DetallePedido`

con sus claves primarias, tipos de datos y relaciones 1:N.

## Migraciones

Generar Prisma Client:

```bash
npx prisma generate
```

Crear/aplicar una migración de desarrollo:

```bash
npx prisma migrate dev --name init
```

## Datos de prueba

El proyecto incluye `prisma/seed.ts` para cargar un usuario y productos de prueba.

```bash
npx prisma db seed
```

## Endpoint principal de la actividad

### POST `/api/pedidos`

Procesa un checkout completo.

Ejemplo de entrada:

```json
{
  "usuarioId": 1,
  "productosComprados": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 2, "cantidad": 1 }
  ]
}
```

Comportamiento:

- valida `usuarioId` y `productosComprados`;
- crea el pedido;
- consulta los productos solicitados;
- valida stock disponible;
- descuenta inventario;
- crea los registros de `DetallePedido`;
- calcula y actualiza el total;
- devuelve `201 Created` si todo finaliza correctamente.

## Transacción y rollback

El checkout utiliza `prisma.$transaction` para agrupar las operaciones. Si algún producto no dispone de stock suficiente se lanza un error y Prisma revierte la transacción, evitando pedidos incompletos o descuentos parciales de inventario.

## Respuestas HTTP

| Código | Situación |
|---|---|
| `201` | Pedido creado correctamente |
| `400` | Datos incompletos, inválidos o stock insuficiente |
| `404` | Usuario o producto inexistente |
| `500` | Error interno inesperado |

## OpenAPI y Swagger

La especificación se encuentra en:

```text
src/docs/openapi.yaml
```

Swagger UI está integrado como middleware de Express.

Con el servidor levantado, la documentación interactiva está disponible en:

```text
http://localhost:3000/docs
```

Desde esa pantalla se puede revisar el contrato y ejecutar manualmente `POST /api/pedidos`.

## Endpoints heredados

Se mantienen los endpoints de la iteración anterior:

| Método | Ruta |
|---|---|
| `GET` | `/salud` |
| `GET` | `/hora` |
| `GET` | `/estudiantes` |
| `GET` | `/estudiantes/:id` |
| `POST` | `/estudiantes` |
| `PATCH` | `/estudiantes/:id` |
| `DELETE` | `/estudiantes/:id` |

## Instalación y ejecución

```bash
npm install
npm run typecheck
npm run dev
```

Servidor local:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/docs
```

## Pruebas existentes

La suite previa de estudiantes se conserva y puede ejecutarse con:

```bash
npm test
```

## Estructura principal

```text
prisma/
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

## Conclusión

La actividad evoluciona el backend anterior sin crear un proyecto aislado. La nueva implementación reemplaza la persistencia simulada para las entidades comerciales por PostgreSQL mediante Prisma, protege el checkout con una transacción y documenta el contrato HTTP mediante OpenAPI y Swagger UI.
