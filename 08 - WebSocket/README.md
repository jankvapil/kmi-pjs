# WebSocket

Se stále zvyšujícími nároky na webové aplikace a potřebou real-time komunikace mezi prohlížečem a serverem se do prohlížečů zaintegrovalo WebSockets API implementující komunikační protokol [WebSocket (RFC 6455)](https://www.rfc-editor.org/info/rfc6455)

> The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

Jedná se tedy o plně duplexní způsob komunikace pomocí protokolu TCP, kdy se vytváří komunikační kanál, který je řízen událostmi

## WebSocket API

Vytvořme si dvě složky - client a server. Ve složce server vytvořme server.js, inicializujme složku jako npm projekt a nainstalujme knihovnu `ws`

```
touch server.js
npm init
yarn add ws
```

poté vložme následující kód a spusťme příkazem `node server.js`

```javascript
const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8080 })

server.on('connection', socket => {
  socket.on('message', msg => {
    console.log(`Received: ${msg}`)
    socket.send(`Received ${msg}`)
  })
})
```

Server v tuto chvíli naslouchá na adrese `ws://localhost:8080`. Dále ve složce client vytvořme index.html a doplňme následující kód

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WebSocket API Demo</title>
</head>
<body>
  <script>
    const socket = new WebSocket('ws://localhost:8080')
    socket.onmessage = ({ data }) => {
      console.log(`Msg: ${data}`)
    }

    function send() {
      socket.send("msg")
    }
  </script>
  <button onclick="send()">Send</button>
</body>
</html>
```

Po kliknutí na tlačítko Send se přes vytvořené WebSocket spojení odešle zpráva "msg", která se následně zobrazí v konzoli serveru. V prohlížeči se zobrazí potvrzení o přijetí

## Socket.io

