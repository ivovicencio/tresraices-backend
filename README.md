# Tres Raíces - Backend API Inmobiliaria

API RESTful para la gestión de propiedades inmobiliarias y captación de leads.

## Stack

- Node.js + Express 5
- PostgreSQL 15 (Docker)
- JWT (autenticación)
- Helmet + CORS + Rate Limiting (seguridad)

## Requisitos

- Node.js 18+
- Docker Desktop (para PostgreSQL)
- npm

## Inicio Rápido

```bash
# 1. Iniciar PostgreSQL
docker compose up -d

# 2. Configurar .env (ya existe, verificar variables)
# PORT=3000
# DB_USER=inmo_admin
# DB_PASSWORD=superpassword123
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=inmobiliaria_db
# JWT_SECRET=MiClaveSuperSecretaInmobiliaria2026
# CORS_ORIGIN=http://localhost:4200 (o el origen de tu frontend)

# 3. Inicializar base de datos (si es desde cero)
docker exec -i inmo_postgres psql -U inmo_admin -d inmobiliaria_db < db/init.sql

# 4. Instalar dependencias
npm install

# 5. Iniciar servidor
npm run dev
```

## Endpoints

### Auth (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

**POST /api/auth/login**
```json
// Request
{ "email": "admin@correo.com", "password": "123456" }
// Response
{ "status": "1", "msg": "Login exitoso", "token": "eyJ..." }
```

### Propiedades

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/propiedades` | No | Listar propiedades (con filtros) |
| GET | `/api/propiedades/:id` | No | Detalle de propiedad |
| POST | `/api/propiedades` | JWT | Crear propiedad |
| PUT | `/api/propiedades/:id` | JWT | Actualizar propiedad |
| DELETE | `/api/propiedades/:id` | JWT | Eliminar propiedad |

**Filtros GET /api/propiedades:**
- `?page=1&limit=10` — Paginación
- `?precio_min=1000000&precio_max=5000000` — Rango de precio
- `?estado=Disponible` — Estado (Disponible, Reservado, Vendido)
- `?search=casa` — Búsqueda por título

### Leads (Solicitudes de Visita)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/leads` | No | Crear solicitud de visita |
| GET | `/api/leads` | JWT | Listar solicitudes (con JOIN a Cliente y Propiedad) |
| PUT | `/api/leads/:id` | JWT | Actualizar estado de solicitud |

**POST /api/leads** (público — para el formulario de contacto):
```json
// Request
{ "nombre": "Juan Pérez", "telefono": "5551234567", "email": "juan@correo.com", "propiedad_id": 1 }
// Response
{ "status": "1", "msg": "Solicitud de visita creada exitosamente...", "data": { "id": 1 } }
```

**PUT /api/leads/:id** (admin):
```json
// Request
{ "estado": "Contactado" }  // Pendiente | Contactado | Cerrado
```

## Cómo Obtener el JWT

1. Registra un usuario: `POST /api/auth/register` con `{ nombre, telefono, email, password }`
2. Inicia sesión: `POST /api/auth/login` con `{ email, password }`
3. La respuesta incluye un `token`. Debes enviarlo en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

O también funciona con el header:
```
x-access-token: eyJhbGciOiJIUzI1NiIs...
```

## Seguridad Implementada

- **Helmet**: Headers HTTP de seguridad (XSS, Content-Security-Policy, etc.)
- **CORS**: Restringido por origen (configurar `CORS_ORIGIN` en .env)
- **Rate Limiting**: 100 solicitudes por 15 minutos por IP
- **JWT**: Tokens de 24 horas para endpoints protegidos
- **SQL parametrizado**: Sin riesgo de inyección SQL (query params $1, $2, ...)
- **bcryptjs**: Contraseñas hasheadas con salt
- **Validación**: Schemas de validación en rutas antes de tocar la BD

## Despliegue en Railway (Recomendado)

Railway es la opción más fácil para primerizos porque tiene:

1. **Plan gratuito** con $5/mes de crédito (suficiente para este proyecto)
2. **PostgreSQL incluido** como servicio
3. **Despliegue automático** desde GitHub
4. **Dominio público** automático (`.railway.app`)
5. **Variables de entorno** configurables desde el dashboard

### Pasos para Railway:

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Iniciar sesión
railway login

# 3. Enlazar proyecto (desde la raíz del proyecto)
railway init

# 4. Crear servicio PostgreSQL
railway add postgres

# 5. Desplegar
railway up

# 6. La CLI configura automáticamente DATABASE_URL
#    Solo debes agregar JWT_SECRET manualmente:
railway variables set JWT_SECRET=tu_clave_secreta_aqui
```

**Importante**: Railway inyecta `DATABASE_URL` automáticamente. El código usa `DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME` — en Railway debes cambiar el `db/db.js` para usar `DATABASE_URL` o mapear las variables desde el dashboard.

Para más información: [https://docs.railway.com](https://docs.railway.com)

### Alternativa: Render

Render también tiene plan gratuito y es similar a Railway:
- Crea un "Web Service" desde tu repo de GitHub
- Crea una "PostgreSQL Database" separada
- Configura las variables de entorno en el dashboard
- Render asigna dominio público automáticamente

## Estructura del Proyecto

```
/
├── index.js                    # Entry point
├── db/
│   ├── db.js                   # Pool de PostgreSQL
│   ├── index.js                # Re-export
│   └── init.sql                # Schema completo
├── controllers/
│   ├── auth.controller.js      # Register / Login
│   ├── propiedad.controller.js # CRUD propiedades
│   └── lead.controller.js      # CRUD leads
├── routes/
│   ├── auth.route.js
│   ├── propiedad.route.js
│   └── lead.route.js
├── middlewares/
│   ├── auth.middleware.js      # verifyToken (JWT)
│   ├── validator.js            # Validación de schemas
│   └── errorHandler.js         # Manejo global de errores
├── .env                        # Variables de entorno (no se sube)
├── docker-compose.yml          # PostgreSQL + pgAdmin
└── package.json
```

## Formato de Respuesta Estandarizado

```json
// Éxito
{ "status": "1", "msg": "Mensaje descriptivo", "data": {} }

// Error
{ "status": "0", "msg": "Mensaje de error", "data": [] }

// Validación
{ "status": "0", "msg": "Error de validación", "data": ["campo1: error", "campo2: error"] }
```
