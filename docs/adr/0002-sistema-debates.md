# ADR 0002: Sistema de debates plano para teorias

## Estado

Aprobado

## Contexto

La aplicacion ya dispone de teorias y votos sobre teorias. El siguiente paso funcional es abrir debates sin introducir complejidad innecesaria en backend, frontend y base de datos.

## Decision

Se adopta un modelo de respuestas de un solo nivel:

- `theory_responses` almacena respuestas directas a una teoria.
- `theory_response_votes` almacena un unico voto activo por usuario y respuesta.
- El score de cada respuesta se persiste en la propia fila de `theory_responses`.
- La API expone lectura del hilo de debate por teoria, creacion de respuesta y voto de respuesta.
- La vista de perfil muestra las teorias creadas por el usuario autenticado mediante `/api/theories/me`.

## Motivos

- El MVP debe ser facil de mantener y probar.
- Un hilo plano cubre el caso principal de debate sin abrir recursion en DTOs ni UI.
- El score persistido reduce coste de lectura en el feed y en los debates.
- El voto unico por usuario evita duplicidades y simplifica la consistencia transaccional.

## Consecuencias

- No hay respuestas anidadas en esta iteracion.
- Si el producto exige arboles de discusion mas adelante, el cambio debera evaluarse con otra ADR.
- La base de datos requiere dos tablas nuevas y sus indices asociados.
