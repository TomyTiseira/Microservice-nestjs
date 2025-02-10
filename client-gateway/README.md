# Gateway de Microservicios

Este proyecto es un gateway que actúa como intermediario para varios microservicios, incluyendo las funciones de productos. Este gateway permite la comunicación entre el cliente y los microservicios, facilitando la gestión de productos a través de diferentes operaciones.

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd client-gateway
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

El gateway proporciona los siguientes endpoints para gestionar productos:

- **Crear un producto**
  - **Método**: `POST`
  - **Endpoint**: `/api/products`
  - **Cuerpo**: 
    ```json
    {
      "name": "Nombre del producto",
      "price": 100,
    }
    ```

- **Obtener todos los productos**
  - **Método**: `GET`
  - **Endpoint**: `/api/products`
  - **Query**: 
    - `limit`: Número máximo de productos a devolver.
    - `page`: Número de página para la paginación.

- **Obtener un producto por ID**
  - **Método**: `GET`
  - **Endpoint**: `/api/products/:id`

- **Actualizar un producto**
  - **Método**: `PATCH`
  - **Endpoint**: `/api/products/:id`
  - **Cuerpo**: 
    ```json
    {
      "name": "Nuevo nombre del producto",
      "price": 150
    }
    ```

- **Eliminar un producto**
  - **Método**: `DELETE`
  - **Endpoint**: `/api/products/:id`

