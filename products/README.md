# Microservicio de Productos

Este microservicio se encarga de gestionar la información de los productos en la aplicación. Proporciona funcionalidades para crear, actualizar, eliminar y consultar productos.

## Funcionalidades

- **Crear producto**: Permite a los usuarios crear nuevos productos en la base de datos.
- **Consultar productos**: Permite obtener una lista de productos, con soporte para paginación.
- **Actualizar producto**: Permite actualizar la información de un producto existente.
- **Eliminar producto**: Permite marcar un producto como no disponible en lugar de eliminarlo físicamente.
- **Validar productos**: Verifica la disponibilidad de múltiples productos.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **Prisma**: ORM (Object-Relational Mapping) para interactuar con la base de datos.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.
- **SQLite**: Base de datos SQL.

## Configuración

Asegúrate de configurar las variables de entorno necesarias en el archivo `.env` para que el microservicio funcione correctamente.

- `DATABASE_URL`: URL de conexión a la base de datos.
