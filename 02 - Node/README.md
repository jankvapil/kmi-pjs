# Node.js

Jednou z hlavních výhod platformy JS je možnost sdílení kódu na klientovi i serveru. Tématem této lekce bude právě JavaScript na straně serveru

> Node.js je open-source, multiplatformní, backendové běhové prostředí JavaScriptu, které běží na enginu Chrome V8 a spouští JavaScript kód mimo webový prohlížeč

Obrovskou předností [Node.js](https://nodejs.org/en/) je jeho balíčkovací systém, který v době psaní této lekce čítá okolo 1.5 milionu knihoven. V porovnání s ostatními platformami je sice největším, s tím je však spojeno také určité riziko a ne každou knihovnu je vhodné používat

Obecně je lepší spoléhat na dlouhodobě vyvíjené a masivně používané knihovny, s velkým zázemím a podporou ze strany komunity. Případně knihovny, za kterými stojí velké společnosti a tudíž by měly zaručovat určitou kvalitu a podporu do budoucna (ne vždy tomu tak skutečně je)

## Npm

Neboli [*Node Package Manager*](https://www.npmjs.com/) je balíčkovací systém pro *Node.js* (je instalován společně s *Node.js*), který umožňuje spravovat závislosti na JavaScriptových knihovnách. Alternativou je pak balíčkovací systém **Yarn**, který budeme používat v dalších lekcích

Jako první se musíme ujistit, že máme správně nainstalovaný *Node.js* i *npm*. Do konzole zadejme postupně příkazy `node -v` a `npm -v`, které by měly vypsat nainstalované verze

Zkusme si také zapnout samotný **REPL** spuštěním příkazu `node` bez argumentu

> REPL (Read Eval Print Loop) je programovací prostředí, které umožňuje programátorovi komunikovat s běžícím programem a upravovat jej vyhodnocováním výrazů

Ve složce `src` spusťmě příkaz `npm init`. Tímto příkazem spustíme utilitu, která nás provede samotnou inicializací Node.js projektu

## Package.json

Po inicializaci nám vznikne soubor `package.json`, který může vypadat nějak takto:

```javascript
{
  "name": "lecture2",
  "version": "1.0.0",
  "description": "second kmi/pjs lecture",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jan Kvapil",
}
```

Nás momentálně zajímá řádek `"main": "index.js"`, který definuje hlavní soubor programu. Vytvořme jej tedy pomocí `touch index.js` a vložme:

```javascript
console.log("hello world!")
```

Nyní můžeme zkusit `index.js` spustit pomocí příkazu `node index.js`

Do skriptů doplňme následující řádek `"start": "node index.js"` a zkusme skript spustit pomocí `npm start`

```javascript
"scripts": {
  "start": "node index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
## Instalace balíčků

Pro demonstraci nám poslouží balíček [Axios](https://www.npmjs.com/package/axios), který slouží ke snadnému posílání HTTP requestů

```
npm install axios
```

### Node modules

Do složky `node_modules` se po provedení příkazu `npm install` stáhnou zdrojové soubory závislých knihoven. Složku `node_modules` je možné kdykoliv smazat a znova nainstalovat předešlým příkazem - proto v `.gitignore` vždy nastavujeme pravidlo `/node_modules`

Upravme nyní soubor `index.js` a vložme následující kód. Po spuštění skriptu `npm start` nám program vypíše aktuální hodnotu BTC v amerických dolarech

```javascript
const axios = require('axios')

///
/// Fetches current BTC/USD price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  console.log(`Current BTC price at ${res.data.time.updated} is $${res.data.bpi.USD.rate}.`)
}

fetchBTC()
```
Z předešlé ukázky si můžeme všimnou několika věcí: 

* pomocí funkce `require` si na konstantu `axios` navážeme referenci na tuto knihovnu 
* přes konstantu `axios` můžeme volat funkci get (= HTTP GET), která vykonná asynchronní dotaz na server
* jakmile server vrátí odpověď, pokračuje se ve vykonávání kódu - výpis aktuální hodnoty BTC

## Express server

Knihovna [Express](https://github.com/expressjs/expres) nám umožňuje snadno vytvořit vlastní webový server. V následujícím příkladě si vytvoříme jednoduchý webový server, který bude pro každý request generovat statické HTML stránky, kde bude zobrazena aktuální hodnota BTC

Jako první si musíme nainstalovat knihovnu Express

```
npm i express
```

Zakomentujeme obsah souboru `index.js` (později budeme potřebovat) a vložíme:

```javascript
const express = require('express')

const server = express()
const port = 3000

server.get("/", (req, res) => {
  res.send("Hello!")
})

server.listen(port, () => console.log(`Ready on http://localhost:${port}/...`)) 
```

V tomto příkladě si můžeme všimnout definici obsluhy GET requestu pro kořenovou routu `"/"`, která vrací "Hello!"

Dále pak zavoláním funkce `listen` říkáme, že má server po spuštění začít poslouchat na námi definovaném portu 3000

Po spuštění příkazu `npm start` se nám spustí server. Můžeme přejít do prohlížeče a zadat http://localhost:3000/. Běžící server lze vypnout stisknutím `ctrl+c` v konzoli


```html
<html>
  <head></head>
  <body>Hello!</body>
</html>
```

Po zobrazení HTML inspektoru prohlížeče vidíme, že se nám zobrazila stránka s "Hello" v tělě stránky

Vraťme se k předešlému příkladu, který nyní použijeme. Upravme soubor `index.js` do této podoby:

```javascript
const axios = require('axios')
const express = require('express')

///
/// Fetches current BTC/USD price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  return {
    date: res.data.time.updated, 
    value: res.data.bpi.USD.rate
  }
}

const server = express()
const port = 3000

server.get("/", async (req, res) => {
  const btcRes = await fetchBTC()
  res.send(`
      <h1>Bitcoin</h1>
      <table>
        <tr>
          <th>Date</th>
        </tr>
        <tr>
          <td>${btcRes.date}</td>
        </tr>
        <tr>
          <th>Price</th>
        </tr>
        <tr>
          <td>${btcRes.value}</td>
        </tr>
      </table>
    `
  )
})

server.listen(port, () => console.log(`Ready on http://localhost:${port}/...`)) 
```

Výsledek requestu ve funkci `fetchBTC` jsme lehce upravili, aby se nám s ním lepe pracovalo. Další změnou je nutnost přidat klíčové slovo `async` do callbacku pro obsluhu GET requestu, jelikož v něm (asynchronně) čekáme na odpověď od API. Po přijetí odpovědi pak vygenerujeme HTML, které naplníme požadovanými daty a odešleme zpět klientovi

Tento přístup se nazývá Server Side Rendering (SSR). Server na základě požadavku vrací vygenerovanou HTML stránku. Jednou z technologií, která vychází primárně z tohoto přístupu, je například technologie PHP


