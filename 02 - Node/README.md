# Node.js

Jednou z hlavních výhod platformy JS je možnost sdílení kódu na klientu i serveru. Tématem této lekce bude právě server-side JS.

> "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the Chrome V8 engine and executes JavaScript code outside a web browser."

Obrovskou předností [Node.js](https://nodejs.org/en/) je jeho balíčkovací systém, který poskytuje zdaleka nejvíce open-source knihoven (v současné době okolo 1.5 milionu) v porovnání s ostatními platformami. S tím je však spojeno určité riziko a ne každý balíček je vhodné používat. 

Obecně je lepší spoléhat na dlouhodobě vyvíjené a masivně používané knihovny, s velkým zázemím a podporou ze strany komunity. Případně knihovny, za kterými stojí velké společností a tudíž by měly zaručovat určitou kvalitu a podporu do budoucna (ne vždy tomu tak skutečně je).

## npm

Neboli [*Node Package Manager*](https://www.npmjs.com/) je balíčkovací systém pro *Node.js* (je instalován společně s *Node.js*), umožňující spravovat závislosti na JavaScriptových knihovnách. Alternativou je pak balíčkovací systém **Yarn**, který budeme používat v dalších lekcích.

### Getting started

Prvně se musíme ujistit, že máme správně nainstalovaný *Node.js* i *npm*. Do konzole zadejme postupně příkazy `node -v` a `npm -v`, které by měly vypsat nainstalované verze.

Zkusme si také zapnout samotný **REPL**, spuštěním příkazu `node` bez argumentu.

Ve složce `src` spusťmě příkaz `npm init`. Tímto příkazem spustíme utilitu, která nás provede samotnou inicializací Node.js projektu.

## Package.json

Po inicializaci nám vznikne soubor `package.json`, který bude vypadat nějak takto:

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
  "license": "ISC"
}
```

Nás momentálně zajímá řádek `"main": "index.js"`, který definuje hlavní soubor programu. Vytvořme jej tedy pomocí `touch index.js` a vložme:.

```javascript
console.log("hello world!")
```

Nyní můžeme zkusit `index.js` spustit pomocí příkazu `node index.js`.

Do skriptů doplňme následující řádek `"start": "node index.js"` a zkusme skript spustit pomocí `npm start`.

```javascript
"scripts": {
  "start": "node index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
## Instalace balíčků

Pro demonstraci nám poslouží balíček [axios](https://www.npmjs.com/package/axios), který slouží ke snadnému posílání HTTP requestů.

```
npm install axios
```

### Node modules

Do složky `node_modules` se po provedení příkazu `npm install` stáhnou zdrojové soubory závislých knihoven. Složku `node_modules` je možné kdykoliv smazat a znova nainstalovat předešlým příkazem - proto v `.gitignore` vždy nastavujeme pravidlo `/node_modules`.

Upravme nyní soubor `index.js` a vložme následující kód. Po spuštění skriptu `npm start` nám program vypíše aktuální cenu Bitcoinu.

```javascript
const axios = require('axios')

///
/// Fetches current BTC price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  console.log(`Current BTC price at ${res.data.time.updated} is $${res.data.bpi.USD.rate}.`)
}

fetchBTC()
```
Z předešlé ukázky si můžeme všimnou několika věcí: 

* funkce `require` nám vloží referenci na knihovnu do proměnné `axios`
* přes proměnnou `axios` můžeme volat funkci get (= HTTP GET), která vykonná asynchronní dotaz na server
* jakmile server vrátí odpověď, pokračuje se ve vykonávání kódu - výpis aktuální ceny BTC


## Práce s databází

Pro demonstraci použijeme předpřipravenou SQLite databázi s následující strukturou

```sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Department" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"city"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Job" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Employee" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"jobId"	INTEGER NOT NULL,
	"salary"	NUMERIC NOT NULL,
	"depId"	INTEGER NOT NULL,
	FOREIGN KEY("depId") REFERENCES "Department"("id"),
	FOREIGN KEY("jobId") REFERENCES "Job"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
```

## Knex

```
yarn add sqlite3 knex
```

Vytvořme nyní soubor `index.js`, do kterého vložíme následující kód:

```javascript
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.db"
  }
})

const getEmployees = async () => {
  const res = await knex('employee')
    .select("*")
  console.log(res)
  knex.destroy()
}

getEmployees()

```

Po spuštění `yarn start` se nám vypíše obsah tabulky `employee`.

## Úkol

napsat skripty pro

* výpis všech zaměstnanců, vložení nového změnestnance a smazání konkrétního zaměstnance


