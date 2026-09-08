# Guía de Ejercicios Prácticos

## Análisis de código, diagnóstico y diseño de APIs REST con Express & TypeScript

**Materia:** Programación Backend  
**Unidad:** 2 — Diseño e Implementación de APIs  
**Objetivo:** Resolver los ejercicios aplicando principios REST, DTO, validación en runtime, manejo centralizado de errores, inyección de dependencias, arquitectura por capas, HTTP y OpenAPI.

---

## EJERCICIO 1 — Diseño de rutas y métodos HTTP

### 1. Principios REST violados
Las rutas usan verbos y describen acciones en vez de recursos. Además, se utilizan métodos HTTP incorrectos: `POST` para modificar y `GET` para eliminar. En REST, la acción debe expresarse principalmente mediante el método HTTP y la ruta debe representar el recurso.

### 2. Rutas corregidas

| Acción | Método | Ruta REST |
|---|---|---|
| Listar tareas | `GET` | `/api/v1/tareas` |
| Crear tarea | `POST` | `/api/v1/tareas` |
| Reemplazar una tarea | `PUT` | `/api/v1/tareas/:id` |
| Modificar parcialmente | `PATCH` | `/api/v1/tareas/:id` |
| Eliminar tarea | `DELETE` | `/api/v1/tareas/:id` |

---

## EJERCICIO 2 — TypeScript no valida en runtime

### 1. ¿Por qué `as CrearTareaDto` no valida?
Porque la aserción de tipo solo le indica al compilador cómo tratar el valor. Al ejecutarse, las interfaces y tipos de TypeScript no existen como validadores automáticos, por lo que no se comprueba realmente el contenido de `req.body`.

### 2. Riesgos
Un cliente podría enviar campos ausentes, tipos incorrectos o estructuras inesperadas. Eso puede generar errores de ejecución, datos inconsistentes, incumplimiento de reglas de negocio o respuestas `500` que deberían haberse detectado como errores de entrada.

---

## EJERCICIO 3 — Validación manual DTO

### 1. ¿Por qué `422` y no `400`?
`400 Bad Request` corresponde a una solicitud mal formada o a un cuerpo que no puede interpretarse correctamente. `422 Unprocessable Content` se usa cuando la solicitud es comprensible, pero los valores no cumplen reglas semánticas o de negocio.

### 2. `{"titulo":" AB ","prioridad":"alta"}`
Falla. `" AB ".trim()` produce `"AB"`, cuya longitud es `2`. Como se exige un mínimo de `3`, se lanza un `AppError 422` con `INVALID_TITLE`.

---

## EJERCICIO 4 — PUT vs PATCH

### 1. PUT con solo `{"completada": true}`
`PUT` representa el reemplazo completo del recurso. Si se envía solo `completada`, faltan `titulo` y `prioridad`. Un diseño correcto debería rechazar la solicitud por incompleta o reemplazar la representación completa según contrato. Para un cambio parcial corresponde `PATCH`.

### 2. Idempotencia
Una operación es idempotente cuando repetir la misma solicitud produce el mismo estado final. `PUT` es idempotente. `POST` normalmente no lo es, porque repetir una creación puede generar varios recursos distintos.

---

## EJERCICIO 5 — Parámetros de ruta

### 1. `GET /api/v1/tareas/abc`
`Number("abc")` produce `NaN`. `Number.isInteger(NaN)` es `false`, por lo que se lanza `AppError 400 INVALID_ID`.

### 2. ¿Por qué validar antes del Service?
Porque se evita enviar a la lógica de negocio un identificador inválido, se corta temprano el flujo y se garantiza que el Service trabaje con un contrato consistente: IDs enteros positivos.

---

## EJERCICIO 6 — Middleware centralizado de errores

### 1. `instanceof AppError`
Permite distinguir errores esperados y controlados de fallos inesperados. Así se respetan `status`, `code`, `message` y `details` definidos por la aplicación.

### 2. No exponer stack traces
Porque pueden revelar rutas internas, archivos, consultas, estructura de la base de datos o detalles de infraestructura. Esa información debe quedar en logs internos, no en la respuesta al cliente.

---

## EJERCICIO 7 — Inyección de dependencias

### 1. Problema de acoplamiento
Si el Controller crea directamente Repository y Service, queda ligado a implementaciones concretas y resulta más difícil reemplazar dependencias o probarlo de forma aislada.

### 2. Refactor por constructor

```ts
export class TareasController {
  constructor(private readonly service: TareasService) {}

  public obtenerTodas = (_req: Request, res: Response) => {
    const data = this.service.obtenerTodas();
    return res.status(200).json({ data });
  };
}

const repository = new TareasRepository();
const service = new TareasService(repository);
const controller = new TareasController(service);
```

El Controller recibe la dependencia desde afuera. En tests se puede inyectar un mock o fake de `TareasService`, evitando acceder a la implementación real del Repository.

---

## EJERCICIO 8 — Paginación

### 1. `?page=3&limit=5`

```text
page = 3
limit = 5
start = (3 - 1) * 5 = 10
end = 10 + 5 = 15
```

Por lo tanto se ejecuta `slice(10, 15)`, que toma los índices `10` a `14`.

### 2. Valores extremos
`Math.max` evita valores menores a `1`. `Math.min` limita el máximo de `limit` a `100`.

Con `?page=-2&limit=5000`:

```text
page = 1
limit = 100
```

---

## EJERCICIO 9 — Violación de arquitectura por capas

### 1. Responsabilidades mezcladas
La ruta parsea el ID, accede directamente a datos, decide el `404`, ejecuta una regla de negocio y construye la respuesta. Se están salteando Controller, Service y Repository.

### 2. Responsabilidades correctas

**Router:** declarar método y URL, aplicar middleware y asociar la ruta con el Controller.

**Controller:** interpretar HTTP, extraer y validar parámetros básicos, invocar al Service y construir la respuesta.

La regla de negocio debe estar en Service y el acceso a datos en Repository.

---

## EJERCICIO 10 — OpenAPI y contratos

### 1. `{"titulo":"A","prioridad":"urgente"}`
Debe responder `422 Unprocessable Content`. El título incumple `minLength: 3` y `prioridad` no pertenece al enum `[baja, media, alta]`.

### 2. OpenAPI vs Swagger
**OpenAPI** es la especificación estándar que describe el contrato de una API. **Swagger** es un conjunto de herramientas que utiliza esa especificación, por ejemplo Swagger UI para visualizar y probar endpoints.

---

## EJERCICIO 11 — Breaking changes y versionado

### 1. ¿Por qué es breaking?
Los clientes existentes esperan `data.id` y `data.prioridad`. Si se mueve `id` y se renombra `prioridad`, ese contrato deja de cumplirse y los clientes pueden fallar aunque el servidor siga respondiendo `200`.

### 2. Nueva URL
Debe publicarse una nueva versión, por ejemplo:

```http
GET /api/v2/tareas/15
```

manteniendo `/api/v1` mientras existan clientes que dependan de la versión anterior.

---

## EJERCICIO 12 — Location y envoltorio `data`

### 1. Encabezado `Location`
Indica la URL del recurso recién creado. Por ejemplo: `/api/v1/tareas/{id}`.

### 2. ¿Por qué `{ data: tarea }`?
Aporta una estructura de respuesta estable y extensible. Permite agregar metadatos, paginación u otra información sin cambiar la ubicación lógica de la entidad.

---

## EJERCICIO 13 — Repositorio e inmutabilidad

### 1. Riesgo de la Opción A
Devuelve la referencia interna del arreglo. Un consumidor podría hacer `pop()`, `push()` o modificar elementos y alterar directamente el estado privado del Repository.

### 2. Opción B
El spread crea un nuevo arreglo:

```ts
return [...this.tareas];
```

Modificar el arreglo devuelto no agrega ni elimina elementos del arreglo interno. Para máxima inmutabilidad de objetos anidados harían falta copias adicionales.

---

## EJERCICIO 14 — cURL

### 1. Opción `-i`
Incluye en la salida los encabezados HTTP de la respuesta además del cuerpo, permitiendo observar status, `Content-Type` y otros headers.

### 2. Sin `Content-Type: application/json`
`express.json()` procesa normalmente cuerpos cuyo `Content-Type` coincide con JSON. Si se omite ese encabezado, el cuerpo puede no ser parseado y `req.body` puede quedar `undefined` o sin el objeto esperado, según configuración y versión de Express.

---

## EJERCICIO 15 — DTO de creación e identificadores

### 1. Campos ausentes en `CrearTareaDto`
El cliente solo aporta los datos necesarios para solicitar la creación: `titulo` y `prioridad`. `id`, `completada` y `fechaCreacion` forman parte de la entidad final y son valores controlados por el sistema.

### 2. ¿Dónde generar `id` y `fechaCreacion`?
El `id` pertenece a la capa de persistencia/Repository, porque depende del mecanismo de almacenamiento y suele generarlo la base de datos. `fechaCreacion` puede establecerse en Service como parte de la lógica de creación o en persistencia si el esquema la define por defecto.

No deben provenir del cliente HTTP porque el servidor debe preservar integridad y evitar IDs o fechas manipuladas.

---

## Síntesis final

Criterios clave trabajados:

- rutas orientadas a recursos;
- métodos HTTP con semántica correcta;
- validación en runtime;
- errores centralizados;
- responsabilidades separadas por capas;
- dependencias inyectables;
- contratos OpenAPI explícitos;
- respuestas HTTP coherentes;
- datos sensibles fuera de las respuestas de error.
