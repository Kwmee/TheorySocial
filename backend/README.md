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
