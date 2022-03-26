# Užitečné nástroje pro vývoj v JS II

Jak již bylo zmíněno v úvodu, JavaScript má mnoho nástrah, do kterých se (nejen) nezkušený programátor může dostat. Některé typické nástrahy jsme si již popsali v úvodních lekcích. V této lekci se budeme zabývat knihovnami, které nám (alespoň částečně) usnadní vývoj JS aplikací

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

## JSDoc

V JavaScript ekosystému se používá standardně pro psaní dokumentace knihovna [JSDoc](https://jsdoc.app/). Typy se dají považovat samozřejmě za součást dokumentace

Pomocí `npm init` vytvořme poslední ukázkový projekt se souborem `third.js` a nainstalujme knihovnu `jsdoc`. Z předešlé ukázky zkopírujme do tohoto projektu složku `zeus` a soubor `types.ts`. Do souboru `third.js` vložme:

```js
/**
 * @typedef {import("./types").User} User
 */

/**
 * @param {User} input  
 */
function printUser(input) {
  console.log(`${input.username}`)
}

/**
 * @type {User}
 */
const user = {
  id: 1,
  username: 'John'
}

printUser(user)
```

Jak si můžeme všimnout, importováním typů v rámci komentářů získáme rovněž nápovědu/autocomplete. Nicméně na rozdíl od použití TypeScriptu ušetříme překlad a můžeme psát rovnou nejnovější staticky typový EcmaScript kód

## Zpět k TypeScriptu

Poté, co jsme si ujasnili, v čem nám TypeScript může pomoci a na co je třeba myslet při jeho použití, podívejme se na jeho další možnosti

### Nepovinné vlastnosti

Jestliže chceme říct, že některá z vlastností objektu je nepovinná, označíme ji otazníkem 

```ts
type Person = {
  name: string
  age?: number
}
```

### Typ pole

Pole musí být označeno typem jeho prvků

```ts
type Persons = Array<Person>

const persons: Array<Person> = [
  { name: "John", age: 42 },
  { name: "Alice", age: 55 },
  { name: "Dave", age: 23 },
]
```

### Typ návratové funkce

V definici funkce není nutné uvádět její návratovou hodnotu - TypeScript si ji sám odvodí. Lze ji však zapsat tímto způsobem

```ts
function oldestPerson(persons: Person[]): Person {
  return persons.reduce((x, y) =>  x.age > y.age ? x : y )
}

const oldest = oldestPerson(persons)
```
### Algebraické datové typy

K definici typů lze využít mimo kompozici také další z matematických operací jako sjednocení (Union type) nebo průnik (Intersection type)

```ts
type Gender = "male" | "female"

type Person = {
  name: string
  age?: number
  gender: Gender
}

const john: Person = {
  name: "John",
  gender: "male"
}
```

V tomto případě funguje `Gender` podobně jako výčtový typ. Pokud bychom předali jiný řetězec než "male" nebo "female", překladač by nám zahlásil chybu

Intersection type je možný použít například pro popis rozhraní React komponenty, která má zároveň převzít vlastnosti nějakého obecného elementu jako v následujícím příkladě

```js
type Props = {
  visible: boolean
}

const Popup = (props: Props & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} style={ props.visible ? {display: 'block'} : {display: 'none'}}>
    { props.children } 
  </div>
)

export default Popup
```

Komponenta `Popup` obsahuje nyní veškeré vlastnosti elementu div spolu s vlastností `visible`

### Rozhraní 

Rozhraní se obvykle používá pro definici typu vstupu funkcí. Jediný rozdíl oproti typu je ten, že umožňuje použít dědičnost

```ts
interface Person {
  name: string
}

interface PersonWithAge extends Person {
  age: number
}

function hello(person: PersonWithAge) {
  console.log(`Hello, I am ${person.name}`)
} 

hello({
  name: "John",
  age: 42
})
```

Na typy by se však mělo nahlížet spíše jako na množiny nežli třídy

### Generika

V TypeScriptu je možné používat generické typy. Jedním takovým může být typ Option

```ts
type Option<T> = { t: 'Some', value: T } | { t: 'None' }
```

V poslední lekci o funkcionálním programování v TypeScriptu se k tomuto typu ještě vrátíme

## JavaScript jako hostovací platforma

Dnes jsme si ukázali, že JavaScript může fungovat jako hostovací platforma pro jiný programovací jazyk. V tomto případě se jednalo pouze o jeho nadmnožinu. Na konci kurzu si ukážeme úplně odlišný funkcionální jazyk, který je možno použít nad platformou JS - Clojure. V poslední části této lekce uděláme menší odbočku od typů. Podíváme se na to, jakým způsobem je možné použít JavaScript pro tvorbu parserů a v konečném důsledku si tak vytvořit vlastní jazyk, překládaný do JS

### Nearley

Velmi povedenou knihovnou pro tvorbu parserů je knihovna [Nearley](https://nearley.js.org/). Základem je vlastní DSL pro popis gramatiky a parser generující AST ve formátu JSON. Pro tvorbu lexeru se dá použít například knihovna [Moo](https://github.com/no-context/moo)

Jako příklad mějme následující gramatiku pro rozpoznání správně uzávorkovaných výrazů

```ne
# Test for balancing parentheses, brackets, square brackets and pairs of "<" ">"

@{% function TRUE (d) { return true; } %}

P ->
      "(" E ")" {% TRUE %}
    | "{" E "}" {% TRUE %}
    | "[" E "]" {% TRUE %}
    | "<" E ">" {% TRUE %}

E ->
      null
    | "(" E ")" E
    | "{" E "}" E
    | "[" E "]" E
    | "<" E ">" E
```


