# Actividad XP + TDD Backend

Actividad práctica de **Programación Extrema y Desarrollo Guiado por Pruebas**.

## Objetivo

Partir del primer servidor HTTP propuesto en la Unidad 1 de Backend y desarrollar un nuevo endpoint aplicando el ciclo TDD:

**Rojo → Verde → Refactor**

El servidor base incluye:

- `GET /salud`
- respuesta `404` para rutas inexistentes

El nuevo comportamiento a desarrollar será:

- `GET /hora`

La implementación se realizará **después de escribir y ejecutar la prueba que expresa el comportamiento esperado**.

## Stack

- TypeScript
- Node.js
- Vitest
- HTTP nativo de Node.js

## Evidencia esperada

1. Servidor base funcionando.
2. Prueba para `GET /hora` escrita antes de la implementación.
3. Ejecución en rojo.
4. Implementación mínima.
5. Ejecución en verde.
6. Refactor, si corresponde, manteniendo la suite verde.
7. Verificación manual mediante `curl`.

> Este repositorio conserva el historial de commits como evidencia del proceso TDD.
