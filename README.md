# Título del Proyecto

Este proyecto consiste en dos microservicios: un gateway y un microservicio de productos, diseñados para manejar operaciones relacionadas con productos.

## Descripción de los Microservicios

### Gateway
Este microservicio actúa como un gateway para enrutar solicitudes a los servicios apropiados.

### Microservicio de Productos
Este microservicio está diseñado para manejar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para productos. Utiliza NestJS y Prisma para la gestión de la base de datos.

## Tecnologías Utilizadas
- Node.js
- NestJS
- Prisma

## Instrucciones de Configuración

1. **Clona el repositorio**:
   ```bash
   git clone <URL del repositorio>
   cd <directorio-del-proyecto>
   ```

2. **Instala las dependencias en cada microservicio**:
   Para el microservicio de productos:
   ```bash
   cd products
   npm install
   ```

   Para el gateway:
   ```bash
   cd client-gateway
   npm install
   ```

3. **Configura las variables de entorno en cada microservicio**:
   Crea un archivo `.env` basado en el archivo `.env.template` y configura las variables necesarias.

4. **Ejecuta los microservicios**:
   Para el microservicio de productos:
   ```bash
   npm run start:dev
   ```

   Para el gateway:
   ```bash
   npm run start:dev
   ```

## Uso
- El microservicio de productos maneja operaciones relacionadas con productos.
- El gateway enruta solicitudes al microservicio apropiado.
