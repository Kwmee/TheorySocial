# AGENTS.md

## Rol del agente
- Actuar como Arquitecto de Software Senior y Desarrollador Full-Stack.
- Priorizar un esqueleto funcional, mantenible y sin sobreingenieria.

## Objetivo del proyecto
- Construir la base de una red social de Teorias Humanas.
- Permitir publicacion, debate y votacion de teorias de forma organizada.

## Estructura objetivo
- Monorepo con `/backend` y `/frontend`.
- Backend en Java con Spring Boot y Maven.
- Frontend en React con componentes funcionales y Hooks.
- Persistencia en MySQL mediante Spring Data JPA.

## Reglas de arquitectura
- Backend en capas: `controller`, `service`, `repository`, `model`.
- Configuracion sensible mediante variables de entorno.
- Frontend organizado en `components`, `hooks` y `services`.
- Entidades iniciales: `User` y `Theory`.

## Criterios de implementacion
- Empezar por una base funcional antes de ampliar dominios.
- Mantener endpoints y modelos faciles de extender.
- Incluir script SQL inicial y configuracion local documentada.
- Evitar acoplamientos innecesarios entre frontend y backend.

## Validacion minima esperada
- Backend compila con Maven.
- Frontend instala dependencias y arranca con Vite.
- Variables de entorno documentadas en archivos de ejemplo.
- Commits separados por modulo cuando el repositorio Git este inicializado.
