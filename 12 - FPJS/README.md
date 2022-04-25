# Funkcionální programování na platformě JavaScript

V průběhu kurzu jsme si přiblížili některé výhody spojené s použitím funkcionálního přístupu v rámci JavaScriptu. Počínaje předvídatelnou prací s daty pomocí nedestruktivních operací jako `map` nebo `reduce`, přes fukncionální kompozici React komponent, až po relativně sofistikovaný funkcionální state management

Nicméně stále platí, že samotný JavaScript funkcionálních prvků zase tolik neobsahuje. Vyskytují se především v podobě jednotlivých externích knihoven (Immer), případně v ucelenější podobě - jako např. knihovna [Ramda](https://ramdajs.com/). Bohužel se však musíme spokojit s někdy poněkud zvláštní syntaxí v důsledku integrace funkcionálních principů do nefunkcionálního programovacího jazyka

V dnešní lekci se podíváme na jednu z takovýchto integrací, a to konkrétně knihovnu [fp-ts](https://gcanti.github.io/fp-ts/), která integruje funkcionální principy do TypeScriptu. V druhé polovině se budeme věnovat úplně odlišnému přístupu - a to zcela samostatnému jazyku [Clojure](https://clojure.org/), který je hostován nad platformou JavaScript

## Fp-ts

Pro otestování knihovny fp-ts můžeme použít například Deno. Knihovnu je možné naimportovat přímo z CDN bez nutnosti stahování závislostí předem

```ts
import fpts from 'https://cdn.skypack.dev/fp-ts/lib/function'

const { pipe } = fpts

const add1 = (x: number) => x + 1
const pow2 = (x: number) => x * x

pipe(41, add1, pow2, console.log)
```

V první ukázce vidíme pomocnou funkci `pipe`,  která nám umožňuje zřetězit jednotlivé funkce a jejich výsledky mezi sebou předávat

```ts
const { flow } = fpts

const add1 = (x: number) => x + 1
const pow2 = (x: number) => x * x

flow(add1, pow2, console.log)(41)
```

Podobně lze použít také funkci `flow` s rozdílem, že argument se předává až na konci

## Task/Either

Funkcionální handlování asynchronních událostí lze s fp-ts řešit pomocí TaskEither

Mějme následující scénář. Chceme načíst pole uživatelů, poté ke každému uživateli podle jeho ID načíst dodatečné informace a příspěvky, které vytvořil (příklad převzat od [Victor Boutté](https://codesandbox.io/s/white-waterfall-d9ypw?file=/src/index.ts))

```ts
const sequentialRequestChain = () =>
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response1) => response1.json())
    .then((users) => {
      console.log(`fetched all users`, users)
      fetch(`https://jsonplaceholder.typicode.com/users/${users[0].id}`)
        .then((response2) => response2.json())
        .then((singleUser) => {
          console.log("fetched single user", singleUser)
          fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${users[0].id}`
          )
            .then((response3) => response3.json())
            .then((postsByUserId) =>
              console.log("fetched post related to user", postsByUserId)
            )
        })
    })
    .catch((err) => console.error(err))
```

Jelikož odchytáváme chybu pouze na nejvyšší úrovni, nemůžeme jasně určit, ve které části nastal případný problém

```ts

const sequentialRequestAsync = async () => {
  let allUsersInfo

  try {
    const users = await fetch(
      `https://jsonplaceholder.typicode.com/users`
    ).then((response1) => response1.json())

    allUsersInfo = users
    console.log(`fetched all users`, users)
  } catch (error) {
    console.log("failed to fetch users")
  }

  if (allUsersInfo && allUsersInfo[0].id < 2) {
    try {
      const singleUser = await fetch(
        `https://jsonplaceholder.typicode.com/users/${allUsersInfo[0].id}`
      ).then((response2) => response2.json())
      console.log("fetched single user", singleUser)
    } catch (error) {
      console.log("failed to fetch single user")
    }

    try {
      const postByUserId = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${allUsersInfo[0].id}`
      ).then((response3) => response3.json())
      console.log("fetched post related to user", postByUserId)
    } catch (error) {
      console.log("failed to fetch users post")
    }
  }
}

```

V tomto případě je ošetřen každý požadavek, nicméně kód ošetřováním chybových stavů velmi rychle lidově řečeno nabobtnal. Pojďme se podívat, jak by se tato situace dala řešit s pomocí `TaskEither` z knihovny `fpts`

Zásadní změnou je oproti klasickému přístupu v tom, že se nevyvolávají výjimky. Nemůže tedy dojít k tomu, že bychom ji na nějakém místě zapomněli ošetřit a program by spadl. Tímto způsobem lze na sebe navázat více asynchronních funkcí. V případě, že některý z požadavků selže, jako výsledek se předá `Error`

```ts
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"
import { Do } from "fp-ts-contrib/lib/Do"

import { User } from "../types"

const safeFetch = (
  url: string,
  errMessage: string
): TE.TaskEither<Error, Array<User>> =>
  TE.tryCatch(
    () => fetch(url).then((res) => res.json()),
    () => new Error(errMessage)
  )

const doSequentialRequest = Do(TE.taskEither)
  .bind(
    "allUsersInfo",
    safeFetch(
      "https://jsonplaceholder.typicode.com/users",
      "failed to fetch users"
    )
  )
  .bindL("singleUserInfo", ({ allUsersInfo }) =>
    allUsersInfo && allUsersInfo[0].id < 2
      ? safeFetch(
          `https://jsonplaceholder.typicode.com/users/${allUsersInfo[0].id}`,
          "failed to fetch single user"
        )
      : TE.taskEither.of({})
  )
  .bindL("postByUserId", ({ allUsersInfo }) =>
    allUsersInfo && allUsersInfo[0].id < 2
      ? safeFetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${allUsersInfo[0].id}`,
          "failed to fetch all post for a single user"
        )
      : TE.taskEither.of({})
  )
  .return(({ allUsersInfo, singleUserInfo, postByUserId }) => ({
    allUsersInfo,
    singleUserInfo,
    postByUserId
  }))
```

Samotnou funkci pak voláme způsobem, že předem definujeme, co se má stát. V případě, že některý z požadavků skončí chybou, zavolá se `console.error`, kterému se předá chybová hláška (Left). Jestliže vše proběhne v pořádku (Right), zavolá se `console.log`

```ts
export const invokeDoSequentialRequest = () =>
  doSequentialRequest().then(E.fold(console.error, console.log))
```

Není tedy nutné ošetřovat kód výjimkami a přidávat další kontroly jako v případě `sequentialRequestChain` nebo `sequentialRequestAsync`

## Monocle

Několik lekcí zpět jsme si představili knihovny pro práci s aplikačním stavem. Mezi nimi byla také knihovna Immer, která představuje určitou nadstavbu nad nativníma JS strukturama a zajišťuje tak jejich imutabilitu. Jednou z alternativ Immeru pro TypeScript je knihovna [Monocle](https://github.com/gcanti/monocle-ts) 


# ClojureScript

> ClojureScript is a compiler for Clojure that targets JavaScript. It emits JavaScript code which is compatible with the advanced compilation mode of the Google Closure optimizing compiler.

## 1. Clojure

* Dynamické vývojové prostředí (REPL Driven Development)
* Datově orientovaný jazyk vycházející z LISPu (kód = data)
* Navržen jako hostovaný jazyk (Java, JavaScript)
* Dynamický, silně typový

## EDN Typy

* EDN = Extensible Data Notation ([specifikace](https://github.com/edn-format/edn))

```clj
"foo"   ;; řetězec
\f      ;; znak
42      ;; celé číslo
42N     ;; velké celé číslo
3.14    ;; číslo s plovoucí řádovou čárkou
3.14M   ;; velké číslo s plovoucí řádovou čárkou
true    ;; pravdivostní hodnota
nil     ;; null
+       ;; symbol
:foo    ;; klíčové slovo
```


## EDN Datové struktury
```clj
;; seznam - sekvenční přístup
(+ 2 3)

;; vektor - sekvenční / náhodný přístup
[2 3]

;; mapa - asociativní pole
{:a 1 :b 2}

;; množina
#{:a :b :c}
```


## Definice funkce

* pomocí názvu funkce, dokumentačního komentáře, parametrů a těla funkce

```clj
(defn add 
  "funkce sečte 2 čísla"
  [x y] 
  (+ x y))

(println (add 1 2))
```

## 2. ClojureScript

Spoustu užitečných příkazů včetně popisů můžeme najít na [Cheatsheetu](https://cljs.info/cheatsheet/)

### Lumo

ClojureScript REPL nad Node.js po nainstalování spustíme příkazem `lumo` 

```
npm install -g lumo-cljs
```

Můžeme také spouštět přímo CLJS programy pomocí `lumo <nazev_souboru.cljs>`

Integrace s Node.js probíhá následujícím způsobem. Vytvořme soubor `main.cljs` a `file.txt`

```
touch main.cljs
echo "hello world" > file.txt
```

Zkusíme načíst textový soubor a vypsat jeho obsah. K tomu budeme potřebovat knihovnu `fs`. Jelikož je součástí node.js, můžeme ji naimportovat přimo.

```clj
(require 'fs)

(fs/readFile 
  "file.txt" 
  (fn [err data] (println data)))
```

V případě, že chceme použít externí knihovnu, musíme ji nainstalovat pomocí npm/yarn. To si ukážeme na příkladu implementace jednoduchého webserveru pomocí `express.js`.

```
npm init -y && npm install express request request-promise
```

Po inicializaci projektu a nainstalování knihoven doplňme následující kód do souboru `main.cljs`

```clj
(require 'express)
(require '[request-promise :as rp])
(def port 3000)

(-> (express)
      (.get "/" (fn [req res] (.send res "<h1>Hello World<h1/>")))
      (.get "/data" 
        (fn [req res] 
          (.send res (clj->js {:key "value"}))))
      (.listen port))

(-> (str "http://localhost:" port)
      rp
      (.then (fn [body] (println "\nReceived:" body)))
      (.catch (fn [err] (println "\nOops:" (.-stack err)))))
```

Server naslouchá na portu 3000. Na routě `/data` server vrací JSON `{"key": "value"}`

## 3. Reagent

> [Reagent](https://reagent-project.github.io/) provides a minimalistic interface between ClojureScript and React. It allows you to define efficient React components using nothing but plain ClojureScript functions and data, that describe your UI using a Hiccup-like syntax.


## Reference

[Functional Programming](https://github.com/enricopolanski/functional-programming)
[Functional TypeScript](https://www.youtube.com/playlist?list=PLlYJBXwGoczGcVOB96OpQZWOhLqiZ-6N8)

[Why I chose ClojureScript over JavaScript](https://m.oursky.com/why-i-chose-clojure-over-javascript-24f045daab7e)
[Základy Clojure a funkcionálneho programovania](https://youtu.be/YxuT3KHSZnQ)

[F# for Fun and Profit](https://fsharpforfunandprofit.com/)
[The Functional Programmer's Toolkit - Scott Wlaschin](https://youtu.be/Nrp_LZ-XGsY?t=503)
