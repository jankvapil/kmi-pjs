# WebSocket

Se stále zvyšujícími nároky na webové aplikace a potřebou real-time komunikace mezi prohlížečem a serverem (chat, hry) se do prohlížečů zaintegrovalo WebSockets API implementující komunikační protokol [WebSocket (RFC 6455)](https://www.rfc-editor.org/info/rfc6455)

> The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

Jedná se tedy o plně duplexní způsob komunikace pomocí protokolu TCP, kdy se vytváří komunikační kanál, který je řízen událostmi

## WebSocket API

Vytvořme si dvě složky - client a server. Ve složce server vytvořme `server.js`, inicializujme složku jako npm projekt a nainstalujme knihovnu `ws`

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

Server v tuto chvíli naslouchá na adrese `ws://localhost:8080`. Dále ve složce client vytvořme `index.html` a doplňme následující kód:

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

Socket.io je nadstavba nad websockety pro prohlížeč i server. Jedná se o externí knihovnu, která poskytuje řadu funkcí navíc spolu s jednodušším rozhranním pro práci s websockety. Nevýhodou pro použití v prohlížeči je však nutnost stažení externí knihovny 

# Messagingové knihovny

Messagingové knihovny jsou též nazývány jako Message Queue (MQ [^1]) knihovny a nacházejí široké uplatnění v distribuovaných systémech. Zajišťují komunikaci (obecně) mezi producenty a konzumenty pomocí různých komunikačních patternů

* Použití pro integraci systémů - možnost rozdělit systém do menších celků (services) a zajistit mezi nimi komunikaci
* Systémy mohou být implementovány nad libovolnou platformou (Java, .NET, Python)
* Asynchronní komunikace, streamování zpráv
* IoT, monitoring, event-based systémy, algoritmické obchodování

[^1]: Zde je možná název MQ obsahující "Queue" trochu zavádějící, jelikož pouze v patternu Push/Pull, jak zjistíme později, figuruje fronta jako stěžejní prvek

Typicky se využívá komunikace na úrovni socketů. Na rozdíl od websocketů, u MQ knihoven počítáme s použitím výhradně mimo prohlížeč

## Základní komunikační patterny

1. Request/Reply - blokující komunikace, konzument čeká na odpověď od producenta
2. Push/Pull (Pipeline pattern) - neblokující komunikace, zprávy jsou ukládány na zásobník. Ve chvíli, kdy je konzument dosupný si uložené zprávy postupně vyzvedne
3. Publish/Subscribe - neblokující komunikace, "radio" - producent vysílá zprávy, konzument se připojí na "kanál" a začne zprávy odchytávat až ve chvíli připojení

## ZeroMQ

[ZeroMQ](https://zeromq.org/) je velmi jednoduchá a rychlá MQ knihovna. Má velkou podporu napříč programovacími jazyky a platformami. Nicméně je omezena spíše na nižší úroveň komunikace mezi jednotlivými uzly. Výhodou je, že nepotřebuje žádný middleware (brokera, jako např. [RabitMQ](https://www.rabbitmq.com/) - proto předpona Zero). Může tak fungovat i na té nejjednodušší úrovni peer-to-peer komunikace implementovatelnou pomocí několika řádků kódu

Pojďme tedy založit nový projekt a nainstalujme knihovnu ZeroMQ ve verzi 5

```
yarn add zeromq@5
```

Vytvořme soubory `producer.js` a `consumer.js`. Do souboru `producer.js` vložme

```js
const zmq = require("zeromq")
const sock = zmq.socket("push")

sock.bindSync("tcp://127.0.0.1:3000")
console.log("Producer bound to port 3000")

let i = 1
setInterval(() => {
  const msg = `msg ${i++}`
  console.log(`sending ${msg}..`)
  sock.send(msg)
}, 1000)
```

Tímto jsme vytvořili producenta, který je nabindovaný na lokální adresu s portem 3000. Každou sekundu vytváří zprávu, kterou pomocí patternu Push/Pull (Push = producent) odesílá. Typ komunikace se definuje už při inicializaci socketu. Jak je vidět, zpráva se odesílá pomocí funkce `sock.send`

Spusťme producenta pomocí `node producent.js` a vytvořme konzumenta `consumer.js`

```js
const zmq = require("zeromq")
const sock = zmq.socket("pull")

sock.connect("tcp://127.0.0.1:3000")
console.log("Consumer connected to port 3000")

sock.on("message", (msg) => {
  console.log("data: %s", msg.toString())
})
```

Zde si můžeme všimnout, že podobně jako u producenta definujeme typ socketu (Pull = konzument). Rozdílem je, že zde definujeme odchytávání události typu "message". V nové konzoli spusťme zároveň i konzumenta pomocí `node consumer.js`. V konzoli se nám objeví všechny odeslané zprávy producentem a zároveň přibývají stále nové (dokud producent poběží)

### Workers

Někoho by určitě napadlo - co se stane, když se spustí konzument vícekrát? V takovém případě se budou konzumenti střídat v přebírání a zpracování zpráv. Tím můžeme například jednoduše zajistit škálování systému a distribuci požadavků mezi nezávislé uzly, které mohou zpracovávat požadavky nezávisle na sobě. Proto se někdy konzumenti v rámci Push/Pull patternu nazývají *Workers* 

## PUB/SUB

Pojďme se nyní podívat na komunikační pattern typu Publish/Subscribe. Ve složce, kde máme soubory `consumer` a `producer`, vytvořme ještě `publisher.js` a `subscriber.js`. Do souboru `publisher.js` doplňme 

```js
const zmq = require("zeromq")
const sock = new zmq.socket("pub")

sock.bindSync("tcp://127.0.0.1:3000")
console.log("Publisher bound to port 3000")

let i = 1
setInterval(() => {
  const msg = `msg ${i++}`
  console.log(`sending ${msg}..`)
  sock.send(`topic ${msg}`)
}, 1000)
```

Zde si můžeme všimnou jediného rozdílu (kromě jiného typu socketu) oproti producentovi - před samotnou zprávu posíláme tzv. *Topic*. Jedná se o typ kanálu, na který se daná zpráva posílá

Do souboru `publisher.js` vložme 

```js
const zmq = require("zeromq")
const sock = zmq.socket("sub")

sock.connect("tcp://127.0.0.1:3000")
sock.subscribe("topic")

sock.on("message", (msg) => {
  console.log("data: %s", msg.toString())
})
```

Kód se opět velmi podobá konzumentovi s tím rozdílem, že pomocí `sock.subscribe` předem definujeme, který z topiců chceme zaregistrovat pro odchytávání zpráv. Opět můžeme zkusit spustit nezávisle na sobě několik subscriberů a publishera. Můžeme si všimnout, že nyní se nám u subscribera začnou objevovat zprávy až ve chvíli, kdy se na daný topic připojí

Výhodou použití knihovny ZMQ je právě odstínění od nízko-úrovňových problémů, jako je například výpadek spojení. Ve chvíli, kdy publisher vypadne, subscribeři čekají, dokud se publisher znova nespustí. Nedochází k chybám, že by spojení bylo neočekávaně ukončeno a podobně 
