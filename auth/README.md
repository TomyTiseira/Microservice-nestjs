# Microservicio de Autenticación

Este microservicio se encarga de gestionar la autenticación de usuarios en la aplicación. Proporciona funcionalidades para registrar usuarios, iniciar sesión y manejar tokens de acceso.

## Funcionalidades

- **Registro de usuarios**: Permite a los nuevos usuarios registrarse en la aplicación.
- **Inicio de sesión**: Permite a los usuarios existentes iniciar sesión y obtener un token de acceso.
- **Manejo de tokens**: Proporciona funcionalidades para validar y renovar tokens de acceso.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **JWT**: JSON Web Tokens para la autenticación y autorización de usuarios.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.

## Configuración

Asegúrate de configurar las variables de entorno necesarias en el archivo `.env` para que el microservicio funcione correctamente.

- `JWT_SECRET`: Clave secreta utilizada para firmar los tokens JWT.
- `JWT_EXPIRATION`: Tiempo de expiración de los tokens JWT.
