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


## Monocle

Několik lekcí zpět jsme si představili knihovny pro práci s aplikačním stavem. Mezi nimi byla také knihovna Immer, která představuje určitou nadstavbu nad nativníma JS strukturama a zajišťuje tak jejich imutabilitu. Jednou z alternativ Immeru pro TypeScript je knihovna [Monocle](https://github.com/gcanti/monocle-ts) 


# ClojureScript

> ClojureScript is a compiler for Clojure that targets JavaScript. It emits JavaScript code which is compatible with the advanced compilation mode of the Google Closure optimizing compiler.


## 1. Clojure

* dynamické vývojové prostředí (REPL Driven Development)

* datově orientovaný jazyk vycházející z LISPu (kód = data)

* navržen jako hostovaný jazyk (Java, JavaScript)

* dynamický, silně typový


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

[The Functional Programmer's Toolkit - Scott Wlaschin](https://youtu.be/Nrp_LZ-XGsY?t=503)

[Functional Programming](https://github.com/enricopolanski/functional-programming)
[Functional TypeScript](https://www.youtube.com/playlist?list=PLlYJBXwGoczGcVOB96OpQZWOhLqiZ-6N8)

[Why I chose ClojureScript over JavaScript](https://m.oursky.com/why-i-chose-clojure-over-javascript-24f045daab7e)
