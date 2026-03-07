# Theory Social

Monorepo base para una red social de teorias humanas.

## Estructura
- `backend`: API REST con Spring Boot, Spring Data JPA y MySQL.
- `frontend`: cliente React con Vite.
- `database`: script SQL inicial para MySQL.

## Checklist inicial recomendada
- Crear `backend/.env` a partir de `backend/.env.example`.
- Crear `frontend/.env` a partir de `frontend/.env.example`.
- Ejecutar `database/init.sql` en MySQL local o dejar que Hibernate cree el esquema.
- Arrancar backend con `mvn spring-boot:run` o con `tools/apache-maven-3.9.12/bin/mvn.cmd spring-boot:run`.
- Arrancar frontend con `npm install` y `npm run dev`.

## Siguientes pasos recomendados
- Añadir autenticacion y gestion de sesiones.
- Incorporar comentarios y votos como modelos propios.
- Sustituir entidades expuestas por DTOs dedicados.
- Añadir Docker Compose para desarrollo local.
