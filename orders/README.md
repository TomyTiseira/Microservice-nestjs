# Microservicio de Órdenes

Este microservicio se encarga de gestionar las órdenes en la aplicación. Proporciona funcionalidades para crear, actualizar y obtener información sobre las órdenes.

## Funcionalidades

- **Crear orden**: Permite a los usuarios crear una nueva orden en la aplicación.
- **Actualizar orden**: Permite a los usuarios actualizar la información de una orden existente.
- **Obtener información de órdenes**: Proporciona endpoints para recuperar información sobre las órdenes.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar información de órdenes.
- **Prisma**: ORM (Object-Relational Mapping) para interactuar con la base de datos.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.

## Configuración

Asegúrate de configurar las variables de entorno necesarias en el archivo `.env` para que el microservicio funcione correctamente.

- `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL.
