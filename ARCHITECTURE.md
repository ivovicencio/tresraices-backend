# Arquitectura del Sistema: Plataforma Inmobiliaria API REST

## 1. Visión General del Negocio
La plataforma es un sistema de gestión inmobiliaria diseñado para funcionar como un catálogo digital 24/7 y un embudo de captación de *leads* (clientes potenciales). 
**Importante:** El sistema NO es un e-commerce. NO existen carritos de compras, pasarelas de pago (Stripe/MercadoPago), ni transacciones monetarias dentro de la app. El flujo final de un cliente interesado es generar una `SolicitudVisita` que conectará al usuario con el agente inmobiliario vía WhatsApp o Email.

El sistema servirá los datos a un frontend desarrollado en Angular (SPA).

## 2. Actores del Sistema
1. **Visitante Público:** Puede explorar el catálogo de propiedades, aplicar filtros (precio, estado, ubicación) y ver el detalle de un inmueble. Si una propiedad le interesa, llena un formulario para solicitar una visita/contacto.
2. **Administrador (Inmobiliario):** Accede mediante autenticación segura (Login). Su función es gestionar el CRUD completo del catálogo de propiedades y visualizar/gestionar el estado de los leads generados (`SolicitudVisita`).

## 3. Stack Tecnológico Estricto
* **Backend:** Node.js, Express.js.
* **Base de Datos:** PostgreSQL v15 (desplegada en Docker contenedor `inmo_postgres` puerto 5432).
* **Driver DB:** `pg` (Pool de conexiones). No se usan ORMs como Prisma/Sequelize por ahora, consultas SQL puras y parametrizadas.
* **Autenticación y Seguridad:** JWT (JSON Web Tokens) y encriptación de contraseñas con `bcryptjs`.

## 4. Estructura de la Base de Datos (Esquema Relacional)
El modelo de datos se basa en alta cohesión y normalización:

* **`Inmobiliaria`**: Representa la entidad del negocio. (id, nombre, direccion).
* **`Propiedad`**: El inventario. (id, titulo, precio [DECIMAL], estado [Disponible, Reservado, Vendido], inmobiliaria_id [FK]).
* **`Cliente`**: Usuarios interesados/leads. (id, nombre, telefono, email, password [para acceso futuro, encriptada]).
* **`SolicitudVisita`**: Tabla pivot y motor del negocio (Lead). (id, fecha, estado [Pendiente, Contactado, Cerrado], cliente_id [FK], propiedad_id [FK]).

## 5. Arquitectura de Software y Patrones
El proyecto sigue el patrón de arquitectura de diseño en capas (N-Tier) para mantener bajo acoplamiento:
* `/routes`: Define los endpoints HTTP y protege rutas con middlewares de autenticación.
* `/controllers`: Maneja la lógica de req/res, extrae parámetros y delega al servicio o DB.
* `/middlewares`: Interceptores (ej. `verifyToken` para JWT, validadores de esquemas).
* `/db`: Configuración global del Pool de PostgreSQL.

## 6. Reglas de Seguridad y Estándares de Código
* **Cero Inyecciones SQL:** Todas las consultas a PostgreSQL deben usar parámetros `$1, $2`, jamás concatenar strings.
* **Protección de Endpoints:** Todas las operaciones de mutación de catálogo (POST, PUT, DELETE de Propiedades) y lectura de Leads están estrictamente protegidas con validación de JWT en el header `Authorization: Bearer <token>`.
* **Respuestas Estandarizadas:** Toda la API debe responder usando un formato JSON uniforme: `{ status: '1'|'0', msg: 'Mensaje', data: [...]|{} }`.