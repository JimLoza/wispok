# Docker

## Levantar contenedores de mongo y app

Es necesario tener instalado docker y asegurarnos de que no este ocupado nuestro puerto 27017, este es el puerto en el que por default se expone mongo y nuestro contenedor lo necesitara libre para poder levantar ambos contenedores.

```bash
docker-compose up --build
```

_el flag `--build` le indica a nuestro docker-compose que construya o reconstruya las imagenes de los servicios antes de iniciarlos, si queremos que nuestro contenedor deje corriendo los servicios en segundo plano y no esten todo el tiempo en nuestra consola podemos agregar el flag `-d` al final_

con este comando basta para que nuestro docker-compose construya nuestra imagen de la aplicacion y justo despues de que la imagen se construye se levanta nuestros contenedores mongo y app

# Levantar el proyecto en local sin docker

> [!IMPORTANT]
> Es necesario tener instalado en nuestra computadora mongo y utilizar las credenciales para nuestro mongo instalado localmente, cambiar la variable de entorno `DB_URI=`

_Instala dependencias_

```bash
npm install
```

_Corre el proyecto en dev_

```bash
npm run dev
```

El proyecto cuenta con un archivo llamado `.env.template` que contiene las variables de entorno que se necesitan para el proyecto, el valor recomendado de las varibales es el siguiente

> [!IMPORTANT]
> El docker-compose tiene configurado los puertos en los que se expone la app que es el `3000` y el `27017` para mongo, en caso de querer cambiar el valor es necesario modificar esos valores en el `docker-compose.yml`

```yml
image: wispok-test
    ports:
      - "3000:3000" --> puerto de la app
  mongo:
    image: mongodb/mongodb-community-server:7.0-ubi8
    ports:
      - "27017:27017" --> puerto de mongo
```

## Variables de entorno

```env
PORT=3000
DB_URI=mongodb://mongo:27017/payment-wispok
SECRET_HASH="@WispokSecretHash"
```

# Ejemplos curl

`Health check de la app`

```bash
curl -X GET http://localhost:3000/health
```

_Respuesta de app funcionando status code `200-OK`_

```json
{
  "ok": true,
  "service": "payments-api",
  "timestamp": "2025-09-24T09:16:03.951Z"
}
```

_Ejemplo mandando un `idempotency-key`_

```bash
curl -X POST http://localhost:3000/api/payment \
-H 'Content-Type: application/json' \
-H 'idempotency-key: 9dcb5d86-6d6e-4cb5-b403-5b422d17c298' \
-d '{
    "amount": 230,
    "reference": "REF-500-10",
    "method": "cash"
  }'
```

_Respuesta status code `201-created`_

```json
{
  "amount": 230,
  "reference": "REF-500-10",
  "method": "cash",
  "status": "confirmed",
  "idempotencyKey": "9dcb5d86-6d6e-4cb5-b403-5b422d17c298",
  "requestHash": "110ac69e68a3ee7e7f8db24a62e6d53229618c5313f96a85aedf66071fefb432",
  "_id": "68d3b4f9653a1dd7bc519900",
  "createdAt": "2025-09-24T09:08:09.895Z",
  "__v": 0
}
```

Misma peticion con los datos mismos datos no creare ningun registro y regresara un status code `200-OK`

_Repite con misma Idempotency-Key + distinto cuerpo status code `409-Conflict`._

```bash
curl -X POST http://localhost:3000/api/payment \
-H 'Content-Type: application/json' \
-H 'idempotency-key: 9dcb5d86-6d6e-4cb5-b403-5b422d17c298' \
-d '{
    "amount": 500,
    "reference": "REF-500-999",
    "method": "cash"
  }'
```
