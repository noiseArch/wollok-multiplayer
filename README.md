# Experimento Wollok Multiplayer con WebSockets

La idea era usando un servidor mediante WebSockets sincronizar el estado del juego en multiples clientes. 

## Requisitos 

Yo use estas versiones de node, npm y wollok para armarlo.
```sh
$ node -v
v20.19.5
$ npm -v
11.6.0
$ wollok --version
0.3.1
```

## Uso

1. Clonar el repositorio
2. Instalar dependencias con `npm install` en los directorios `client` y `server`
3. En `server` levantarlo usando `npm run start`. Deberian ver algo asi
```sh
$ npm run start

> server@1.0.0 start
> tsx server.ts

WebSocket server is running on ws://localhost:8080
```
4. En `client` pueden levantar los clientes que deseen con el siguiente comando y deberian ver el siguiente output
```sh
$ wollok run 'mainExample.Game' --skipValidations --port 4200

🚀 Running program mainExample.Game on C:\Users\MatiasValtolina\Desktop\wollok-multiplayer\client
🌏 Building environment for mainExample.Game...

👾 Game available at: http://localhost:4200
🗂️  Assets folder C:\Users\MatiasValtolina\Desktop\wollok-multiplayer\client\assets
Connected to server.
```
Y en el `server` deberia aparecerles esto
```sh
WebSocket server is running on ws://localhost:8080
Connection created.
Player connected. ID: 41619116
```
Tengan en cuenta que cada cliente debe tener un puerto distinto.
