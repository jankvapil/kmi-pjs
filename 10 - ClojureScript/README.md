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

### Lumo

ClojureScript REPL nad Node.js po nainstalování spustíme příkazem `lumo` 

```
npm install -g lumo-cljs
```

Můžeme také spouštět přímo CLJS programy pomocí `lumo <nazev_souboru.cljs>`


## 3. Reagent

> [Reagent](https://reagent-project.github.io/) provides a minimalistic interface between ClojureScript and React. It allows you to define efficient React components using nothing but plain ClojureScript functions and data, that describe your UI using a Hiccup-like syntax.


## Reference

[Why I chose ClojureScript over JavaScript](https://m.oursky.com/why-i-chose-clojure-over-javascript-24f045daab7e)
