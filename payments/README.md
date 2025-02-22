# Microservicio de Pagos

Este microservicio se encarga de gestionar el procesamiento de pagos utilizando la API de Stripe. Proporciona funcionalidades para crear sesiones de pago, manejar webhooks y responder a eventos de éxito o cancelación de pagos.

## Funcionalidades

- **Crear sesión de pago**: Permite a los usuarios iniciar una sesión de pago a través de la API de Stripe.
- **Webhook de Stripe**: Maneja las notificaciones de eventos de Stripe, como el éxito de un pago.
- **Respuestas de éxito y cancelación**: Proporciona endpoints para manejar las respuestas de éxito y cancelación de pagos.

## Tecnologías Utilizadas

- **NestJS**: Framework para construir aplicaciones del lado del servidor en Node.js.
- **Stripe**: API para gestionar pagos en línea.
- **NATS**: Sistema de mensajería para la comunicación entre microservicios.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.

## Configuración

Asegúrate de configurar las variables de entorno necesarias en el archivo `.env` para que el microservicio funcione correctamente.

- `STRIPE_SECRET_KEY`: Clave secreta de la API de Stripe.
- `STRIPE_SUCCESS_URL`: URL a la que se redirige después de un pago exitoso.
- `STRIPE_CANCEL_URL`: URL a la que se redirige después de un pago cancelado.
- `STRIPE_WEBHOOK_SECRET`: Secreto del webhook de Stripe.
