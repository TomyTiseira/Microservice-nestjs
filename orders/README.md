# Microservicio de Órdenes

Este microservicio se encarga de gestionar las órdenes en la aplicación. Proporciona funcionalidades para crear, actualizar y obtener información sobre las órdenes.

## Instalación

Para instalar y ejecutar este microservicio, sigue los siguientes pasos:

1. Clona el repositorio:
   ```bash
   git clone <URL del repositorio>
   ```

2. Navega al directorio del microservicio:
   ```bash
   cd orders
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Configura las variables de entorno necesarias. Puedes crear un archivo `.env` en la raíz del proyecto y definir las variables requeridas.

5. Ejecuta el microservicio:
   ```bash
   npm run start:dev
   ```

## Uso

Una vez que el microservicio esté en funcionamiento, puedes interactuar con él a través de las siguientes rutas:

- `POST /orders`: Crear una nueva orden.
- `GET /orders`: Obtener todas las órdenes.
- `GET /orders/:id`: Obtener una orden específica por ID.
