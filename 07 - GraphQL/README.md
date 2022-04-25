
# GraphQL

V minulých lekcích jsme si zkusili vytvořit jednoduché RESTové API. Dnes si představíme technologii GraphQL, která je určitým rozšířením klasického RESTu

[GraphQL](https://graphql.org/) je dotazovací jazyk nad libovolným datovým zdrojem. Používá dvě základní operace - Query (vrací data) a Mutace (změna v datech)

* GraphQL API obsluhuje jediný endpoint `/graphql`
* Pro všechna data, která chceme vystavit v rámci GraphQL API, budujeme resolvery (funkce vracející data z DB)
* Schéma API tvoří typy (např. typ User)
* Resolveru pak můžeme předat parametry daného typu, které chce vrátit

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

Do souboru `server.js` vložme následující kód, čímž vytvoříme základní strukturu GraphQL API serveru

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

Po kliknutí na odkaz Schema a záložku SDL vidíme námi definované GraphQL schéma, které si můžeme stáhnout a pracovat s ním v klientské aplikaci. To je velmi užitečné, jelikož tímto způsobem máme ihned k dispozici dokumentaci daného API. Dokonce existují nástroje jako [Zeus](https://www.npmjs.com/package/graphql-zeus), které jsou schopny ze schématu vygenerovat typy pro TypeScript. To si přiblížíme v lekci o statickém typování

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

## Relace 

Připomeňme si SQLite schéma z lekce č.5

```sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Users" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Posts" (
	"id"	INTEGER NOT NULL,
	"heading"	TEXT NOT NULL,
	"text"	TEXT,
	"authorId"	INTEGER NOT NULL,
	FOREIGN KEY("authorId") REFERENCES "Users",
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
```

Nyní převeďme toto databázové schéma na GraphQL schéma.

```gql
type Query {
  users: [User]
}

type User {
  id: Int!
  username: String!
  posts: [Post]
}

type Post {
  id: Int!
  heading: String!
  text: String
  authorId: Int!
}
```

Jak si můžeme všimnout, relace se zde explicitně nedefinují pomocí cizích klíčů. Pouze řekneme, že typ User má vlastnost posts, která je typu pole, jehož prvky jsou objekty typu Post. Jakým způsobem se data pro konkrétního uživatele získají už řeší samotný resolver
