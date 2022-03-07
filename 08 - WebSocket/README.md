# WebSocket

Se stále zvyšujícími nároky na webové aplikace a potřebou real-time komunikace mezi prohlížečem a serverem (chat, hry) se do prohlížečů zaintegrovalo WebSockets API implementující komunikační protokol [WebSocket (RFC 6455)](https://www.rfc-editor.org/info/rfc6455)

> The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

Jedná se tedy o plně duplexní způsob komunikace pomocí protokolu TCP, kdy se vytváří komunikační kanál, který je řízen událostmi

## WebSocket API

Vytvořme si dvě složky - client a server. Ve složce server vytvořme server.js, inicializujme složku jako npm projekt a nainstalujme knihovnu `ws`

```
touch server.js
npm init
yarn add ws
```

Poté vložme následující kód a spusťme příkazem `node server.js`

```javascript
const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8080 })

server.on('connection', socket => {
  socket.on('message', msg => {
    console.log(`Server received: ${msg}`)
    socket.send(`Server received ${msg}`)
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
      console.log(`Client received: ${data}`)
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

### Socket.io

Socket.io je nadstavba nad WebSockety pro prohlížeč i server. Jedná se o externí knihovnu, která poskytuje řadu funkcí navíc spolu s jednodušším rozhranním pro práci s WebSockety. Nevýhodou pro použití v prohlížeči je však nutnost stažení externí knihovny 

## Messagingové knihovny

Messagingové knihovny jsou též nazývány jako Message Queue knihovny a nacházejí široké uplatnění v distribuovaných systémech. Zajišťují komunikaci (obecně) mezi producenty a konzumenty pomocí různých komunikačních patternů.

* Použití pro integraci systémů - možnost rozdělit systém do menších celků (services) a zajistit mezi nimi komunikaci
* Systémy mohou být implementovány nad libovolnou platformou (Java, .NET, Python)
* Asynchronní komunikace, streamování zpráv
* IoT, monitoring, event-based systémy, algoritmické obchodování

Typicky využívají komunikaci na úrovni socketů. Na rozdíl od WebSocketů, u messagingových knihoven počítáme s použitím výhradně mimo prohlížeč.

### Základní komunikační patterny

1. Request/Reply 
2. Push/Pull (Pipeline pattern)
3. Publish/Subscribe 

## ZeroMQ


