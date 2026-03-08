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
- Seguridad backend con Spring Security y sesion HTTP; solo `/api/auth/**` puede ser publico.
- Configuracion sensible mediante variables de entorno.
- Frontend organizado en `components`, `hooks` y `services`.
- Entidades iniciales: `User` y `Theory`.

## Criterios de implementacion
- Empezar por una base funcional antes de ampliar dominios.
- Mantener endpoints y modelos faciles de extender.
- Incluir script SQL inicial y configuracion local documentada.
- Evitar acoplamientos innecesarios entre frontend y backend.
- Bloquear todo el contenido del frontend para usuarios no autenticados.
- Persistir la aceptacion de terminos y condiciones en base de datos, nunca solo en navegador.
- La portada principal debe priorizar una vista de `Teorias Populares` con interaccion tipo swipe.
- El tutorial de swipe para nuevos usuarios debe persistirse en base de datos en el usuario, nunca solo en frontend.
- El sistema de votos debe garantizar un unico voto activo por usuario y teoria, con actualizacion consistente del score.
- El ranking de popularidad debe basarse en votos netos recientes y apoyarse en indices SQL cuando aplique.
- Mantener tema visual consistente mediante variables CSS y soporte nativo de modo claro/oscuro segun `prefers-color-scheme`.
- La experiencia social autenticada debe seguir un layout tipo Instagram: sidebar fija en escritorio, barra inferior en movil y columna central de contenido.
- El modo swipe debe mantenerse operativo como una seccion `Descubrir` separada del feed principal.
- Las teorias del feed deben renderizarse como cards limpias con cabecera, cuerpo legible y acciones de voto integradas.
- Las micro-interacciones visuales deben priorizar `transform` y `opacity` para rendimiento GPU y evitar lag perceptible.
- La paleta principal de acento debe inspirarse en Instagram: rosa, violeta y amarillo para gradientes y estados destacados.
- Evitar acciones o iconos duplicados: cada accion principal debe aparecer en un unico lugar logico de la interfaz.
- Priorizar `Container Queries`, `Grid` y `Flexbox` para adaptacion dinamica por contenedor, no solo por viewport.
- Cualquier refactor visual debe mantener contraste compatible con WCAG 2.2 tanto en modo claro como en modo oscuro.

## Validacion minima esperada
- Backend compila con Maven.
- Frontend instala dependencias y arranca con Vite.
- Variables de entorno documentadas en archivos de ejemplo.
- Commits separados por modulo cuando el repositorio Git este inicializado.
