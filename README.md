# Actividad XP + TDD Backend

Actividad práctica de **Programación Extrema y Desarrollo Guiado por Pruebas**.

## Objetivo

Partir del primer servidor HTTP propuesto en la Unidad 1 de Backend y desarrollar un nuevo endpoint aplicando el ciclo TDD:

**Rojo → Verde → Refactor**

El servidor base incluye:

- `GET /salud`
- respuesta `404` para rutas inexistentes

El nuevo comportamiento desarrollado es:

- `GET /hora`

## Stack

- TypeScript
- Node.js
- Vitest
- HTTP nativo de Node.js

---

## Desarrollo mediante TDD

### 1. Fase roja 🔴

Primero se escribió la prueba para el nuevo endpoint `GET /hora`, antes de implementar el comportamiento.

La prueba esperaba que el endpoint:

- respondiera con código HTTP `200`;
- devolviera un cuerpo JSON;
- incluyera una propiedad `hora`;
- entregara un valor interpretable como fecha/hora en formato ISO.

Al ejecutar la suite por primera vez, la prueba falló porque `/hora` todavía no existía y el servidor respondió `404`.

Resultado observado:

```text
Expected: 200
Received: 404

Test Files  1 failed (1)
Tests       1 failed (1)
```

Este fallo era el resultado esperado de la fase roja: la prueba demostraba la ausencia del comportamiento que se quería construir.

---

### 2. Fase verde 🟢

Después del fallo inicial, se implementó únicamente el código necesario para responder a:

```http
GET /hora
```

La respuesta contiene la hora actual serializada en JSON:

```json
{
  "hora": "2026-08-24T23:13:13.300Z"
}
```

Al ejecutar nuevamente la misma prueba:

```text
✓ src/servidor.test.ts (1 test)
✓ GET /hora > responde 200 y devuelve la hora actual en formato ISO

Test Files  1 passed (1)
Tests       1 passed (1)
```

De esta manera, el cambio mínimo convirtió la prueba roja en verde.

---

### 3. Refactor 🔵

Luego de obtener la suite en verde se revisó la implementación.

No fue necesario realizar una refactorización adicional para cumplir el objetivo de la actividad, porque el código quedó simple y legible. El criterio de TDD se mantiene: cualquier mejora estructural futura debe realizarse conservando la suite en verde.

---

## Verificación manual con curl

Además de la prueba automatizada, se verificó el endpoint realizando una solicitud HTTP real con `curl`.

Con el servidor iniciado:

```powershell
npm run dev
```

se ejecutó desde otra terminal:

```powershell
curl.exe -i http://localhost:3000/hora
```

Respuesta obtenida:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"hora":"2026-08-24T23:13:13.300Z"}
```

Esto permite comprobar tanto el comportamiento funcional del endpoint como elementos del intercambio HTTP, entre ellos el código de estado, los encabezados y el cuerpo JSON.

---

## Endpoints disponibles

| Método | Ruta | Resultado |
|---|---|---|
| `GET` | `/salud` | Devuelve el estado del servidor y una fecha ISO |
| `GET` | `/hora` | Devuelve la hora actual en formato ISO |
| cualquier otro | ruta inexistente | Devuelve `404` con un mensaje JSON |

Ejemplo de `GET /salud`:

```json
{
  "estado": "ok",
  "fecha": "2026-08-24T23:09:03.743Z"
}
```

Ejemplo de ruta inexistente:

```json
{
  "error": "Recurso no encontrado"
}
```

---

## Cómo ejecutar el proyecto

Instalar dependencias:

```powershell
npm install
```

Ejecutar las pruebas:

```powershell
npm test
```

Levantar el servidor:

```powershell
npm run dev
```

El servidor queda disponible en:

```text
http://localhost:3000
```

---

## Evidencia del ciclo

El historial del repositorio conserva los pasos principales del desarrollo:

```text
Prueba escrita primero
        ↓
404 / test fallando 🔴
        ↓
Implementación mínima de GET /hora
        ↓
Test pasando 🟢
        ↓
Verificación mediante curl ✅
```

La intención es que el historial permita reconstruir el proceso y no mostrar solamente el resultado final.

## Conclusión

La actividad permitió aplicar TDD sobre un servidor HTTP básico. El comportamiento de `GET /hora` fue definido primero mediante una prueba automatizada, luego se implementó el mínimo código necesario para satisfacerla y finalmente se verificó el endpoint mediante una solicitud HTTP real.

De esta forma, la prueba no se utilizó únicamente para comprobar código terminado, sino como guía para desarrollar el nuevo comportamiento.
