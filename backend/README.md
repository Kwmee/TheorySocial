# Backend

## Requisitos
- Java 17
- Maven 3.9+
- MySQL 8+

## Variables de entorno
- Copia `backend/.env.example` a `backend/.env` y ajusta credenciales.

## Arranque
```bash
mvn spring-boot:run
```

## Seguridad base
- `POST /api/auth/signup` y `POST /api/auth/login` son publicos.
- Todo el resto de endpoints `/api/**` requiere sesion autenticada.
- La sesion se mantiene por cookie HTTP y el frontend debe enviar `credentials: "include"`.

## Cambio manual de esquema
- Para habilitar foto de perfil por URL ejecuta `database/manual-profile-image-migration.sql` sobre MySQL.
- Los nuevos campos persistidos son `users.profile_image_url` y `users.bio`.
