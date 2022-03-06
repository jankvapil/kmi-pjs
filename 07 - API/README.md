
# REST

V minulých lekcích jsme si zkoušeli vytvořit jednoduché RESTové API. Dnes si představíme nástroje, které nám tvorbu RESTových API výrazně zjednodušší.

V úvodu si shrneme několik přístupů, které se pro práci s databází používají

### ORM
* objekově relační mapování databázových entit
* poskytuje největší úroveň abstrakce při práci s databází
* lze mapovat celé tabulky, nebo pouze výsledky dotazů
* přináší rizika ve formě neefektivity dotazů (n+1 problem)

### Query/Schema buildery
* sjednocuje zápis dotazů a příkazů pomocí JS syntaxe (Knex)

### Raw SQL
* pomocí databázových driverů můžeme psát přímo SQL dotazy
* pro určité situace nevyhnutelné (optimalizace dotazů) 


## Prisma

* umožňuje generovat databázi pomocí SDL
* umožňuje interspekcí načíst databázové schéma, na základě kterého vygeneruje API
* TODO

# GraphQL

[GraphQL](https://graphql.org/) je dotazovací jazyk nad určitým datovým zdrojem. Používá dvě základní operace - Query (vrací data) a Mutace (změna v datech)

* GraphQL API obsluhuje jediný endpoint `/graphql`
* pro všechna data, která chceme vystavit v rámci GraphQL API, budujeme resolvery (funkce vracející data z DB)
* schéma API tvoří typy (např. typ User)
* resolveru pak můžeme předat parametry daného typu, které chce vrátit

```gql
query {
  users {
    id
    name
  }
}
```

Zřejmě největší výhodou oproti RESTu je možnost načítat všechna potřebná data v jednom requestu. Také je možnost jednoduše parametrizovat dotaz pomocí nejrůznějších restrikcí (where, order by, limit)

Další zajímavou vlastností GraphQL je evolving. Ten umožňuje snadno rozšiřovat stávající schéma API o nové atributy bez toho, aniž bychom museli vytvářet novou verzi endpointu (jak tomu je u RESTu)

Vytvořme nyní jednoduchý GraphQL server. Pomocí `npm init` založíme projekt. Dále budeme potřebovat následující knihoviny a zdrojový soubor `server.js`

```
yarn add graphql express apollo-server-express
touch server.js
```

Do souboru `server.js` vložme následující kód, čímž vytvoříme základní strukturu GraphQL API serveru.

```javascript
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = 4000

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => {
      return "Hello"
    }
  }
}

const run = async () => {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  await server.start()
  server.applyMiddleware({ app: app })
  app.listen(PORT, console.log(`GraphQL API is running at http://localhost:${PORT}/graphql`))
}

run()
```

Můžeme si všimnout, že konstruktor `ApolloServer` přijímá jako argument objekt, jehož součástí je `typeDefs`, který definuje schéma GraphQL API. Jak bylo zmíněno v úvodu, GraphQL používá 2 základní operace - Query a Mutace. Zde máme nadefinovaný query-typ hello, který vrací string. Pomocí `resolverů` definujeme jednotlivé operace, které vracejí data. V tomto případě vracíme konstantu "hello". Je však zřejmé, že zde se bude pracovat typicky s nějakým externím datovým zdrojem (databází)

Po spuštění API pomocí `node server.js` přejděme na adresu `http://localhost:4000/graphql`. GraphQL API přijímá pouze POST requesty, takže v prohlížeči se (pomocí GET requestu) dostaneme na úvodní stránku studio.apollographql, které nás po kliknutí přesměruje na stránku tohoto nástroje. Zde si můžeme vyzkoušet práci s naším GraphQL API - vložme do editoru násedující dotaz

```gql
query {
  hello
}
```

Ten nám po spuštění (Ctrl+Enter) vrátí následující JSON

```JSON
{
  "data": {
    "hello": "Hello"
  }
}
```

Po kliknutí na odkaz Schema a záložku SDL vidíme námi definované GraphQL schéma, které si můžeme stáhnout a pracovat s ním v klientské části aplikace. To je velmi užitečné, jelikož tímto způsobem máme ihned k dispozici dokumentaci daného API. Dokonce existují nástroje jako [Zeus](https://www.npmjs.com/package/graphql-zeus), které jsou schopny ze schématu vygenerovat typy pro TypeScript. To si přiblížíme v lekci o statickém typování

```gql
type Query {
  hello: String
}
```

V další části vytvoříme systém pro zaznamenávání logů pomocí GraphQL mutací. Pojďme nyní rozšířit naše GraphQL schéma o nový typ `Log`. Součástí skalárních typů není od základu datum, takže jej musíme doplnit:

```gql
scalar Date

type Log {
  timestamp: Date
  text: String
}

type Query {
  logs: [Log]
}
```

V resolveru budeme vracet předpřipravené pole logů

```javascript
const logs = [{
  timestamp: +new Date(),
  text: "test log"
}]

const resolvers = {
  Query: {
    logs: () => {
      return logs
    }
  }
}
```

Abychom mohli přidávat další logy, zavedeme nový typ Mutation

```gql
type Mutation {
  addLog(text: String): Date
}
```

Dále do resolverů přidáme `Mutation`, včetně funkce `addLog`, která vloží log s aktuálním časovým razítkem do pole logů

```javascript
const resolvers = {
  Query: {
    logs: () => {
      return logs
    }
  },
  Mutation: {
    addLog: (_ , { text }) => {
      const date = +new Date()
      logs.push({
        timestamp: date,
        text: text
      })
      return date
    }
  }
}

```

Nyní můžeme přidat log následujícím způsobem

```gql
# 1.
mutation {
  addLog(text: "Test log")
}

# 2.
query {
  logs {
    timestamp
    text
  }
}
```

Query nám vrátilo pole `data.logs`, obsahující všechny doposud přidané logy


## Prisma pro GraphQL

* podobně jako v případě REST API lze pomocí nástroje Prisma generovat i GraphQL API.

## Hasura





