# Nerelační databázové systémy

Protikladem ke klasické koncepci relačních databázových modelů máme v současné době stále rozrůstající se počet alternativních databázových paradigmat. Mezi ty patří například key/value, dokumentové nebo grafové modely databázových systémů

## MongoDB

Jedním z nejpopulárnějších alternativ klasického relačního databázového modelu je právě dokumentový. Jeho zástupcem pro tento kurz bude právě [MongoDB](https://youtu.be/-bt_y4Loofg), které používá dokumenty ve formátu BSON (Binary-encoded Javascript Object Notation) a kvůli skvělé integraci s Node.js je proto vhodným kandidátem

Výhodou tohoto modelu je jeho jednoduchost, rychlost, robustnost a snadná škálovatelnost - vertikální (rychlejší hardware, více paměti), tak i horizontální (více distribuovaných databází běžících zároveň). Na druhou stranu nepodporuje některé z typických vlastností pro relační databázové systémy (např. použití jazyka SQL, triggerů nebo procedur)

![převzato z https://www.michalbialecki.com/en/2018/03/16/relational-vs-non-relational-databases/](https://www.michalbialecki.com/wp-content/uploads/2018/03/MongoDB-nosql-vs-msql-relational-codewave-insight_lzzufm-900x480.jpg)

### MongoDB Community Server

Podobně jako u relačních databází jako MySQL nebo PostgreSQL je možné i MongoDB rozběhnout lokálně na svém PC. Nicméně na rozdíl od SQLite už je třeba nějaký čas věnovat samotnému zprovoznění tohoto databázového [serveru](https://www.mongodb.com/try/download/community) včetně MongoDB Shellu ([mongosh](https://docs.mongodb.com/mongodb-shell/)). Mongosh poskytuje základní CRUD operace pro práci s DB. Lze jej samozřejmě používat i pro práci se vzdálenou databází

### MongoDB v Dockeru

Další možností je stáhnout a spustit si předpřipravený kontejner, na kterém běží MongoDB přímo v [Dockeru](https://www.docker.com/)

### MongoDB Atlas

V případě, že chceme použít plně spravované cloudové řešení, nejjednodušší možností je zaregistrovat se na portálu [Atlas](https://www.mongodb.com/cloud/atlas/register), kde poskytují možnost zdarma si vytvořit účet spolu s databází

Pro účely tohoto semináře je nutné zprovoznit jednu z těchto variant

Vytvořme nový projekt pomocí `yarn init` a nainstalujme knihovnu MongoDB `yarn add mongodb`

## Dotenv

Předtím než začneme pracovat se samotnou databází, nainstalujme ještě knihovnu [Dotenv](https://github.com/motdotla/dotenv) `yarn add dotenv` a v kořenovém adresáři vytvořme soubor `.env`. Do něj vložme přihlašovací údaje k MongoDB, které později použijeme v Connection stringu. 

```env
USER=<user>
PASS=<pass>
```

Tyto "environment" soubory slouží k uchovávání citivých konfiguračních údajů. Knihovna Dotenv nám zajistí, aby tyto environment proměnné byly dostupné v rámci globálního aplikačního prostředí

Vyzkoušejme nyní připojení k MongoDB databázi. Do souboru `index.js` vložme

```js
require('dotenv').config()
const { MongoClient } = require('mongodb')

const user = process.env.USER
const pass = process.env.PASS
const conStr = `mongodb+srv://${user}:${pass}@test-db.bzwip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(conStr)

const main = async () => {
  try {
    await client.connect() 
  }
}

main()
```

Pokud je vše nastavené správně (Connection string je nutno upravit), měla by se nám v konzoli zobrazit hláška "Connected!"

Vytvořme v rámci MongoDB testovací databázi a nahraďme ve funkci `main` try blok následujícím kódem

```js
const main = async () => {
  try {
    await client.connect()
    const dbs = await client.db().admin().listDatabases()
    console.log(dbs.databases)
  } catch (err) {
    console.error(err)
  }
}
```

Po spuštění skriptu se nám do konzole vypíše seznam všech databází, mezi kterými by měla být i nově vytvořená databáze `test`

```js
{ name: 'test', sizeOnDisk: 8192, empty: false }
```

### Kolekce

V rámci MongoDB se data uchovávají v kolekcích (analogicky případ relační tabulky). K těm můžeme přistupovat následujícím způsobem

```js
await client.db("test").collection("test").insertOne({ id: 1, value: "first" })
```

V případě, že kolekce neexituje, autoamticky se vytvoří nová a vloží se do ní předaný objekt. Na rozdíl od relačních databází, zde není potřeba definovat žádné schéma, které by hlídalo strukturu vstupních dat. Do existující kolekce lze přidat libovolný "sloupec" navíc

```js
await client.db("test").collection("test").insertMany([
  { id: 2, value: "second" },
  { id: 3, value: "third", note: "additional note" }
])
```

### Mongoose

V minulé lekci jsme si vyzkoušeli práci s databází pomocí query builderu Knex. Nyní se podíváme na trochu odlišný přístup k práci s databází - a to pomocí mapování databázových entit. Jedním z takových nástrojů je například [Mongoose](https://mongoosejs.com/) - ODM (Object Document Mapping) knihovna

## Prisma

Moongose je však zaměřený pouze na MongoDB. Použijeme obecnější nástroj [Prisma](https://www.prisma.io/), který podporuje především ORM přístup, ale dá se s ním pracovat také nad nerelační MongoDB databází

Nainstalujme Prisma CLI jako dev-dependency `yarn add -D prisma` a dále `yarn add @prisma/client`. Inicializujme Prismu pomocí `npx prisma init`. Tento příkaz vytvoří složku `prisma`

### Prisma schéma

Ve složce `prisma` se nám vytvořil soubor `schema.prisma`. Jde o univerzální schéma popisující datový model

Upravme tedy schéma následujícím způsobem 

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["mongodb"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Jelikož MongoDB ještě není oficiálně podporované, musíme nastavit tzv. previewFeatures. Stejně tak musíme nastavit datový zdroj na databázi typu MongoDB a URL. V souboru `.env` nastavme proměnnou DATABASE_URL tak, aby odpovídala Connection stringu

Rozšiřme schéma o model `Log`

```prisma
model Log {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  text String
}
```

Poté příkazem `npx prisma generate` vygenerujeme klienta, kterého použijeme v následujícím příkladě. Soubor `index.js` nahraďme tímto kódem

```js
const { PrismaClient } = require("@prisma/client")

const main = async () => {
  try {
    const prisma = new PrismaClient()
    const newLog = await prisma.log.create({
      data: {
        text: "first log"
      }
    })
    console.log(newLog)
  } catch (err) {
    console.error(err)
  }
}

main()
```

Můžeme si všimnout, že díky vygenerovanému Prisma klientovi máme zajištěnou typovou bezpečnost (a také auto-complete). Nemůžeme přistupovat pomocí klienta k entitám, které ve schématu neexistují

### Introspection

Jednou z velmi užitečných funkcí Prismy je introspekce databáze. Ta umožňuje vygenerovat schéma z libovolné databáze (Postgres, MSSQL, Mongo..)

To si můžeme ukázat následujícím způsobem. Vymažme model `Log` ze schématu, aby zůstal opět v této podobě

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["mongodb"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Nyní pomocí příkazu `npx prisma db pull` se nám `Log` automaticky přidá do schématu

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["mongoDb"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Log {
  id   String @id @default(auto()) @map("_id") @db.ObjectId
  text String
}
```

### CRUD

Mimo vytváření (Create) můžeme používat další Read, Update a Delete operace.

```js
await prisma.log.findMany({
  where: {
    text: "first log"
  }
})
// -> [ { id: '6240ab1d753fa5383750718a', text: 'first log' } ]

await prisma.log.update({
  where: {
    id: "6240ab1d753fa5383750718a"
  },
  data: {
    text: "updated log"
  }
}) 
// -> { id: '6240ab1d753fa5383750718a', text: 'updated log' }

await prisma.log.delete({
  where: { id: "6240ab1d753fa5383750718a"}
}) 
// -> { id: '6240ab1d753fa5383750718a', text: 'updated log' }
```

Výhodou je možnost použití takto jednotného zápisu pro libovolný databázový systém

## TSDB a časové řady

V době masivně rozšiřujícího se IoT bylo třeba přizpůsobit i možnosti ukládání obrovských objemů dat z nejrůznějších senzorů. To samé například platí i pro nástroje monitorující pohyb cen akcií, kryptoměn a dalších finančních instrumentů

K tomu slouží TSDB neboli time series databases. Ty jsou optimalizované pro ukládání velkých objemů dat, kde hodnoty jsou asosiovány s časovým razítkem, kdy byly tyto data pořízeny. Typickým zástupcem je například [InfluxDB](https://docs.influxdata.com/influxdb/v2.1/get-started/). Pro účely dnešního kurzu si však vystačíme s MongoDB

