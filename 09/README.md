# Užitečné nástroje pro vývoj v JS

Jak již bylo zmíněno v úvodním info o kurzu, JavaScript má mnoho nástrah, do kterých se (nejen) nezkušený programátor může dostat. Některé zakladní nástrahy jsme si již popsali v úvodních lekcích. V této lekci se budeme zabývat knihovnami, které nám (alespoň částečně) usnadní vývoj JS aplikací.

K eliminaci některých rizik máme zavedeny určité programátorské praktiky a návrhové vzory (viz. např. kompozice funkcionálních komponent), které nám pomohou se i ve složitějších projektech lépe orientovat a které si zde také popíšeme.

## Statické typování 

Při programování JS aplikací se nám mnohokrát stane, že budeme volat neexistující funkci, což skončí klasickou chybou "*undefined is not a function*" nebo omylem předáme jako parametry funkce místo objektu pole a podobně.

Přidáním statické kontroly typů získáme nejen oznámení případných chyb při kompilaci (nikoliv při běhu), ale zároveň také *auto-complete*.

Nicméně je třeba stále brát v potaz, že data, která dostaneme od serveru, nemusejí vždy odpovídat struktuře, kterou si jednou nadefinujeme (neplatí v případě, že implmentujeme zároveň backend, se kterým sdílíme typy v rámci *monorepa*).

Předávání informací o datových typech mezi klientem/serverem lze řešit pomocí schémat ([JSON Schema](https://json-schema.org/)/[OpenAPI](https://github.com/OAI/OpenAPI-Specification)), které umožňují ověřovat konzistenci dat za běhu. Protokol [Transit](https://github.com/cognitect/transit-format) umožňuje posílat data (JSON) zároveń s informacích o typech.


### TypeScript 

* [TypeScript](https://www.typescriptlang.org/) (Microsoft)

* nadmnožina JS

* zapisujeme typové anotace do kódu


```
npm install -g typescript
```

### Flow

* [Flow](https://flow.org/) (Facebook)

### JSDoc

* [JSDoc](https://jsdoc.app/)

* typy jako součást dokumentace

* pro popis typů lze použít DSL v *.d.ts

* kompatibilní i s ClojureScript

## Imutabilní datové struktury

### Immutable.js

## State management 

### Redux

## Ostatní

### ESLint