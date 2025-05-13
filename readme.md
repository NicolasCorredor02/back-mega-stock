# Mega Stock - Backend Documentation

## Introducción
Backend para plataforma de e-commerce "Mega Stock" desarrollado con Node.js y Express. Proporciona APIs RESTful para gestión de productos, usuarios, carritos de compra, y sistema de autenticación con soporte para administradores.

## Características Principales
- ✅ Gestión de productos con imágenes en Cloudinary
- 🛒 Sistema de carritos con múltiples métodos de pago
- 🔐 Autenticación JWT y OAuth con Google
- 📧 Envío de emails transaccionales
- 📊 Panel de administración con vistas Handlebars
- 🚀 WebSockets para actualizaciones en tiempo real
- 🗃️ Soporte para MySQL y MongoDB con Prisma ORM
## Requisitos
- Node.js v18+
- npm v9+
- MySQL 8+
- MongoDB 6+
- Cuenta Cloudinary
- Cuenta SendGrid (opcional para emails)
## Clonación e instalación

```bash
  git clone https://github.com/NicolasCorredor02/back-mega-stock.git
  cd back-mega-stock
  npm install
  npm run setup-alias
  npm run dev
```
    
## Variables de entorno

Para correr este proyecto, necesitaras agregar las siguientes varaibles de entorno en tu archivo .env, sigue las variables en el archivo .env-example

#### Database
`DATABASE_URL_MYSQL`
`DATABASE_URL_MONGODB`
`DB_PROVIDER`

#### Auth
`JWT_SECRET`
`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`

#### Cloudinary
`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`

#### Email (Nodemailer)
`EMAIL_HOST`
`EMAIL_PORT`
`EMAIL_USER`
`EMAIL_PASS`
## 📌 Endpoints de la API

### 🛒 Productos

| Método | Endpoint                     | Descripción               |
|--------|------------------------------|---------------------------|
| GET    | `/api/products`              | Listar productos paginados |
| POST   | `/api/admin/products`        | Crear nuevo producto      |
| PUT    | `/api/admin/products/:id`    | Actualizar producto       |

### 👤 Usuarios

| Método | Endpoint                        | Descripción              |
|--------|----------------------------------|--------------------------|
| POST   | `/api/user/register`            | Registrar usuario        |
| POST   | `/api/user/login`               | Login tradicional        |
| GET    | `/api/user/login/google`        | Iniciar con Google OAuth |

### 🛒 Carritos

| Método | Endpoint                  | Descripción             |
|--------|----------------------------|-------------------------|
| POST   | `/api/cart`                | Crear carrito           |
| GET    | `/api/cart/:cid`           | Ver detalle de carrito  |
| PUT    | `/api/cart/:cid`           | Actualizar carrito      |

## 📁 Estructura del Proyecto

src/
├── config/ # Configuraciones generales del proyecto
├── controller/ # Controladores con la lógica de los endpoints
├── daos/ # Objetos de acceso a datos (Data Access Objects)
├── middlewares/ # Middlewares para procesamiento de solicitudes
├── public/ # Archivos estáticos públicos (imágenes, JS, CSS)
├── repositories/ # Implementación del patrón repositorio
├── routes/ # Definición de rutas del servidor
├── services/ # Lógica de negocio principal
├── sockets/ # Configuración y lógica de WebSockets
├── utils/ # Funciones y utilidades auxiliares
├── views/ # Vistas y templates de Handlebars
└── index.js # Punto de entrada de la aplicación
## Autenticacion

Se aplica JWT para la autenticacion de lado del usuario y tambien para acceder a las funcionalidades y panel de admin.

#### Flujo JWT
    1. Login con credenciales

    2. Recibir token en cookie

    3. Incluir token en headers para requests protegidos