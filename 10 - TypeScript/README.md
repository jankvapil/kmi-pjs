# Užitečné nástroje pro vývoj v JS

Jak již bylo zmíněno v úvodním info o kurzu, JavaScript má mnoho nástrah, do kterých se (nejen) nezkušený programátor může dostat. Některé typické nástrahy jsme si již popsali v úvodních lekcích. V této lekci se budeme zabývat knihovnami, které nám (alespoň částečně) usnadní vývoj JS aplikací

K eliminaci některých rizik máme zavedeny určité programátorské praktiky a návrhové vzory (viz. např. kompozice funkcionálních komponent), které nám pomohou se i ve složitějších projektech lépe orientovat a které si zde také popíšeme

## Statická kontrola typů 

Při programování JS aplikací se nám mnohokrát stane, že budeme volat neexistující funkci, což skončí klasickou chybou "*undefined is not a function*" nebo omylem předáme jako parametry funkce místo objektu pole a podobně

Přidáním statické kontroly typů získáme nejen oznámení případných chyb při kompilaci, ale zároveň také *auto-complete*

Nicméně je třeba stále brát v potaz, že data, která dostaneme od serveru, nemusejí vždy odpovídat struktuře, kterou si jednou nadefinujeme (neplatí v případě, že implmentujeme zároveň backend, se kterým sdílíme typy v rámci *monorepa*)

Předávání informací o datových typech mezi klientem a serverem lze řešit pomocí schémat. Zatím jsme si ukázali, jakým způsobem schéma vytvořit. Dnes se podíváme na to, jak z takového schématu typy vygenerovat. 

Mimo GraphQL existují také [JSON Schema](https://json-schema.org/)/[OpenAPI](https://github.com/OAI/OpenAPI-Specification), které umožňují ověřovat konzistenci dat za běhu. Protokol [Transit](https://github.com/cognitect/transit-format) umožňuje posílat data (JSON) zároveň s informacích o typech

## TypeScript 

[TypeScript](https://www.typescriptlang.org/) je nadmnožina JavaScriptu, vytvořena Microsoftem. Typy zapisujeme pomocí anotací do kódu

Než se však pustíme do integrace TypeScriptu do Node.js projektu, zkusme se první podívat na jeden zajímavý projekt, který nám usnadní start s TypeScriptem

## Deno

[Deno](https://deno.land/) je JS/TS runtime, vytvořen autorem Node.js. Stejně jako Node.js má Deno svůj REPL a interpret. Zatím se jedná o čerstvý projekt, ale má potenciál značným způsobem nahradit Node.js na serveru

Začněme tedy tím, že si Deno nainstalujeme a vytvoříme soubor `first.ts`. Poté do souboru vložme následující kód

```ts
function print(input: String) {
  console.log(input)
}

print("hello")  // -> Hello
print(0)        // -> Error
```

Soubor interpretujeme pomocí příkazu `deno run first.ts`

Vlastní typy definujeme v TypeScriptu následujícím způsobem

```ts
type Person = {
  name: String
  age: Number
}

function howOld(input: Person) {
  console.log(`${input.name} is ${input.age} years old`)
}

howOld({
  name: "John Doe",
  age: 42
}) 

// -> John Doe is 42 years old
```

## TypeScript v Node.js

Nevýhodou použití TypeScriptu v Node.js je nutnost kompilace

Založme nový projekt se zdrojovým souborem `second.ts` a inicializujme jej pomocí `npm init`. Dále musíme přidat TypeScript jako "vývojovou závislost" (Dev Dependency) a inicializovat samotný TypeScript v projektu

```
yarn add -D typescript
npx tsc --init
```

Tímto se nám vytvořil soubor `tsconfig.json`, kde máme k dispozici nejrůznější nastavení kompilátoru. Nyní musíme nastavit ještě samotné volání kompilátoru při buildu. Přidejme tedy do `package.json` tento skript

```json
"scripts": {
  "build": "tsc"
},
```

Zkopírujme si kód, který jsme použili v příkladu `first.ts` pro Deno a vložme jej do souboru `second.ts`. Nyní pomocí příkazu `yarn build` se vygeneruje nový soubor `second.js`

```js
"use strict";
function howOld(input) {
    console.log(`${input.name} is ${input.age} years old`);
}
howOld({
    name: "John Doe",
    age: 42
});
```

## Generování typů

Zásadní výhodou při používání schémat je možnost vygenerovat si z nich typy. To si nyní ukážeme s pomocí knihovny [Zeus](https://zeus.graphqleditor.com/). Nainstalujme jej tedy globálně následujícím příkazem

```
npm i -g graphql-zeus
```

Zkopírujme do složky, kde máme inicializovaný TypeScript GraphQL schéma z lekce č. 7

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

Pomocí následujícího příkazu se nám do složky `zeus` vygenerují typy z GraphQL schématu

```
npx zeus schema.graphql ./
```

Vytvořme ještě jeden soubor `types.ts`, kde s typy budeme pracovat. Vygenerované typy můžeme načíst a exportovat tímto způsobem

```ts
import { ModelTypes } from './zeus/index'

export type User = ModelTypes['User']
export type Post = ModelTypes['Post']
```

Poté do souboru `second.ts` vložme 

```ts
import { User } from './types'

function printUser(input: User) {
  console.log(`${input.username}`)
}

const user: User = {
  id: 1,
  username: "John"
}

printUser(user)
```

Zavoláním `yarn build` se nám všechny .ts soubory přeloží do JavaScriptu

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printUser(input) {
    console.log(`${input.username}`);
}
const user = {
    id: 1,
    username: "John"
};
printUser(user);
```

Jak si můžeme všimnou, žádná kontrola typů se ve vygenerovaném kódu neprovádí. TypeScript provede kontrolu v době překladu. Nicméně i přesto se statickou kontrolu hodí používat pro zamezení překlepů a možnosti nápovědy/autocomplete

## Další alternativy

### Flow

* [Flow](https://flow.org/) (Facebook)

### JSDoc

* [JSDoc](https://jsdoc.app/)

* typy jako součást dokumentace

* pro popis typů lze použít DSL v *.d.ts

* kompatibilní i s ClojureScript