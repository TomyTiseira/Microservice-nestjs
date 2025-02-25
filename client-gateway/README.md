# Gateway de Microservicios

Este proyecto es un gateway que actúa como intermediario para varios microservicios, facilitando la comunicación entre el cliente y los microservicios.

## Microservicios Incluidos

- [Microservicio de Órdenes](../orders/README.md)
- [Microservicio de Autenticación](../auth/README.md)
- [Microservicio de Pagos](../payments/README.md)
- [Microservicio de Productos](../products/README.md)

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.

## Configuración

Asegúrate de configurar las variables de entorno necesarias en el archivo `.env` para que el gateway funcione correctamente.

- `JWT_SECRET`: Clave secreta utilizada para firmar los tokens JWT.
