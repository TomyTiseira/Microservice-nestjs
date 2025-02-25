# Proyecto de Microservicios

Este proyecto es una arquitectura de microservicios que permite gestionar diferentes funcionalidades de una aplicación de manera modular y escalable. Cada microservicio se encarga de una parte específica del sistema, facilitando el desarrollo y mantenimiento.

## Microservicios Incluidos

- [Microservicio de Órdenes](orders/README.md): Gestiona la creación, actualización y recuperación de órdenes, y utiliza el microservicio de pagos para gestionar los pagos.
- [Microservicio de Autenticación](auth/README.md): Maneja el registro de usuarios, inicio de sesión y validación de tokens.
- [Microservicio de Pagos](payments/README.md): Se encarga del procesamiento de pagos y manejo de webhooks. Sin embargo, no tiene endpoints expuestos directamente, ya que se utiliza internamente por el microservicio de órdenes para gestionar los pagos.
- [Microservicio de Productos](products/README.md): Gestiona la creación, actualización y recuperación de productos.

## Configuración del Proyecto

Para configurar el proyecto, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd <nombre_del_directorio>
   ```

3. Asegúrate de configurar las variables de entorno necesarias en los archivos `.env` de cada microservicio.

## Uso

Para iniciar el proyecto, utiliza el siguiente comando:
```bash
docker-compose up --build
```

Esto construirá y levantará todos los microservicios definidos en el archivo `docker-compose.yml`.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.
- **PostgreSQL**: Sistema de gestión de bases de datos utilizado por el microservicio de órdenes.
- **Stripe**: API para gestionar pagos en línea en el microservicio de pagos.

## Rutas del Proyecto

### Microservicio de Órdenes

- **Crear orden**: `POST /api/orders`
- **Obtener todas las órdenes**: `GET /api/orders`
- **Obtener una orden por ID**: `GET /api/orders/id/:id`
- **Obtener todas las órdenes según un estado**: `GET /api/orders/:status`
- **Actualizar el estado de una orden**: `PATCH /api/orders/:id`
- **Obtener todos los estados de la orden**: `GET /api/orders/info/states`

### Microservicio de Autenticación

- **Registro de usuarios**: `POST /api/auth/register`
- **Inicio de sesión**: `POST /api/auth/login`
- **Cerrar sesión**: `POST /api/auth/logout`
- **Validación de token**: `GET /api/auth/verify`
- **Refrescar el token**: `POST /api/auth/refresh`

### Microservicio de Pagos

- **Nota**: Este microservicio no tiene endpoints expuestos directamente, ya que se utiliza internamente por el microservicio de órdenes para validar los pagos.

### Microservicio de Productos

- **Crear un producto**: `POST /api/products`
- **Obtener todos los productos**: `GET /api/products`
- **Obtener un producto por ID**: `GET /api/products/:id`
- **Actualizar un producto**: `PATCH /api/products/:id`
- **Eliminar un producto**: `DELETE /api/products/:id`
