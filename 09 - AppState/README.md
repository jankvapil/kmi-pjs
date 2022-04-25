# Aplikační stav

V dnešní lekci se podíváme na to, jakým způsobem je možné pracovat s aplikačním stavem a které knihovny nám tuto práci usnadní

Vraťme se nyní do adresáře lekce č. 4 (React II), zkopírujme zdrojové soubory celého Next.js projektu a nainstalujme závislosti. V souboru `pages/index.js` upravme kód do následující podoby

```js
import { useState } from 'react'
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [state, setState] = useState({
    cnt1: 0,
    cnt2: 0,
    cnt3: 0
  })
  return (
    <Content>
      <Counter value={state.cnt1} inc={() => setState({
        ...state,
        cnt1: state.cnt1 + 1
      })}/>
      <Counter value={state.cnt2} inc={() => setState({
        ...state,
        cnt2: state.cnt2 + 1
      })}/>
      <Counter value={state.cnt3} inc={() => setState({
        ...state,
        cnt3: state.cnt3 + 1
      })}/>
      <Counter value={state.cnt1} inc={() => setState({
        ...state,
        cnt1: state.cnt1 + 1
      })}/>
    </Content>
  )
}
```

Komponentu `Counter` pak upravme následujícím způsobem

```js
///
/// My counter component
///
export default function Counter ({ value, inc }) {
  return (
    <div>
      <p>{value}</p>
      <button onClick={inc}>Add1</button>
    </div>
  )
}
```

Tímto jsme vytvořili sdílený aplikační stav pro 4 komponenty typu `Counter`. Některé čítače pracují pouze s vlastní hodnotou, některé hodnotu sdílejí - musí být tedy sdílená hodnota čítače "vytažena" do nadřazené komponenty. To reflektuje velmi častý případ, se kterým se vývojář bude muset potýkat

V případě takto lineární struktury ještě není problém úplně zřejmý. Zkusme si ale představit, že máme aplikační stav složený z daleko více zanořených objektů - pak by nestačilo použít pouze `...state`, ale musely by se všechny zanořené objekty (kterých by se změna stavu netýkala) pomocí destrukturalizace takto zkopírovat

V Reactu se navíc tyto Gettery i Settery předávají přes props. Vychází to z funkcionálního přístupu, že veškeré závislosti, se kterými komponenta pracuje, se předávají jako parametr. To se však může stát poměrně brzy při větším počtu závislostí nepřehledné. Jestliže bychom potřebovali změnit jeden vstupní parametr, budeme muset změnu provést na všech místech aplikace

### Globální aplikační stav

Jistým řešením by bylo zavést globální aplikační stav. To je ale obecný anti-pattern, který narušuje principy funkcionálního přístupu a v Reactu tudíž ani není možný použít. Vždy musí být zřejmé, co je vstupem a výstupem funkcionální React komponenty a pro změnu stavu používat UseState hook, který zajišťuje překreslování. Navíc změnou globálního stavu nutně dochází k vedlejším efektům, což určitě nechceme. Nebylo by transparentní, co se v aplikaci děje

## Imutabilní datové struktury

Vhodnějším řešením by bylo pro globální stav zavést určité omezení a to použitím immutabilních datových struktur. Na začátku kurzu jsme si přiblížili, jak se pracuje se zanořenými datovými strukturami a na co si dát pozor. Jednou z takových zanořených datových struktur může být právě globální aplikační stav

Jako nedestruktivní operace nad polem jsme si představili funkce jako `map`, `filter` nebo `reduce`. Ty nám vracejí vždy pole nová, nemodifikují původní. V případě imutabilních datových struktur jsou všechny operace nedestruktivní. Při modifikaci objektu dochází k vytvoření objektu nového. To by se mohlo zdát jako náročná operace. Nicméně imutabilní datové struktury mají vlastnost *Structural sharing*. Jedná se o struktury typu *Persistent Search Tree*, ve kterých se změna propaguje ke kořenu stromu. Na nezměněné podstromy se odkaz zachová

<br/>
<img 
  style="margin:auto; display:block; width:400px;" 
  src="https://4.bp.blogspot.com/-U4CRzUa93ds/TZCB__l6a6I/AAAAAAAAAA8/9k2hFM81aS4/s1600/binary_tree_after_insert.png" 
  alt="https://massivealgorithms.blogspot.com/2015/10/immutable-binary-tree.html"
/>
<br/>

Obrovským přínosem za cenu přijatelné režie je robustnost, kterou tento přístup poskytuje. Dále se pro React proces počítání změn v DOMu ([Reconciliation](https://reactjs.org/docs/reconciliation.html)) výrazně urychlí, jelikož se nemusí provádět porovnávání zanořených objektů, ale pouze kontrolu reference a snadnější lokalizace elementu v rámci DOM, který se má překreslit

Některé datové struktury mají v sobě implementovanou možnost uchovat historii všech změn. To by představovalo opravdu silný nástroj pro případné debugování, kdy lze poslat report o sledu aplikačních změn, které vedly k chybě za běhu. Cílem dnešní lekce bude k takovémuto řešení dojít pomocí JS knihoven 

## Immer

[Immer](https://immerjs.github.io/immer/) je knihovna pro práci s imutabilními datovými strukturami v rámci JavaScriptu. Na rozdíl od knihoviny [Immutable.js](https://immutable-js.com/) Immer používá nativní JS struktury. Nemusí se tedy při komunikaci např. s externí API provádět žádná deserializace načtených objektů do nových imutabilních struktur

Pro přechod mezi stavy se používá tzv. *Draft*, který mapuje pouze ty vazby, které mají měnit své hodnoty

<br/>
<img 
  style="margin:auto; display:block; width:400px;" 
  src="https://immerjs.github.io/immer/assets/images/immer-4002b3fd2cfd3aa66c62ecc525663c0d.png" 
  alt="https://immerjs.github.io/immer/"
/>
<br/>

## Use-Immer

Immer se v rámci React dá nově používat pomocí hooku [Use-immer](https://github.com/immerjs/use-immer)

```
yarn add immer use-immer
```

Nahraďme nyní v soubor `pages/index.js` veškerý kód související s aplikačním stavem

```js
import { useImmer } from "use-immer"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [state, setState] = useImmer({
    cnt1: 0,
    cnt2: 0,
    cnt3: 0
  })
  return (
    <Content>
      <Counter value={state.cnt1} inc={() => setState(draft => {
        draft.cnt1 = state.cnt1 + 1
      })}/>
      <Counter value={state.cnt2} inc={() => setState(draft => {
        draft.cnt2 = state.cnt2 + 1
      })}/>
      <Counter value={state.cnt3} inc={() => setState(draft => {
        draft.cnt3 = state.cnt3 + 1
      })}/>
      <Counter value={state.cnt1} inc={() => setState(draft => {
        draft.cnt1 = state.cnt1 + 1
      })}/>
    </Content>
  )
}
```

V porovnání s předchozím kódem vidíme značný rozdíl zejména v tom, že se mění pouze ta část aplikačního stavu, který souvisí s danou komponentou

### Reducer

Pojďme se nyní podívat na principielně trochu odlišný přístup. Nahraďme opět kód v souboru `pages/index.js` 

```js
import { useImmerReducer } from "use-immer"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

const initialState = {
  cnt1: 0,
  cnt2: 0,
  cnt3: 0
}

function reducer(draft, action) {
  switch (action.type) {
    case "inc1":
      return void draft.cnt1++
    case "inc2":
      return void draft.cnt2++
    case "inc3":
      return void draft.cnt3++
  }
}

export default function Home() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  return (
    <Content>
      <Counter value={state.cnt1} inc={() => dispatch({ type: "inc1" })}/>
      <Counter value={state.cnt2} inc={() => dispatch({ type: "inc2" })}/>
      <Counter value={state.cnt3} inc={() => dispatch({ type: "inc3" })}/>
      <Counter value={state.cnt1} inc={() => dispatch({ type: "inc1" })}/>
    </Content>
  )
}
```

Zásadní změnou zde vidíme, že se zavedl `initialState`, ve kterém jsou definové defaultní hodnoty jednotlivých čítačů. Dále máme funkci `reducer`, která na základě přijatých akcí provádí změny aplikačního stavu. Poslední rozdíl je ve vyvolávání samotné akce pomocí funkce `dispatch`. Na první pohled se tento přístup zdá poněkud zvláštní, má však ale celou řadu výhod

## Flux

Architektura popsaná v předešlém příkladě nese název [Flux](https://facebook.github.io/flux/). Základními stavebními prvky jsou `actions`, `store` a `dispatcher`. Akce představují typy událostí, které pomocí dispatcheru mění aplikační stav, který je udržován ve store

Všechny změny aplikačního stavu jsou transparentní, jelikož Flux používá jednosměrný "data flow", neboli tok dat. Je jasně daná posloupnost akcí, které vedly k aktuálnímu stavu aplikace. Všechny akce proudí skrz dispatcher, který může akce ukládat a mít tak záznam o tom, co se v aplikaci stalo. Jak jsme naznačili v úvodu, tato možnost je skvělým nástrojem pro debugování. Mimo to je možné jednoduše implementovat například operace jako Undo nebo Redo

## Use-global

V předchozím příkladě jsme si však zavedli Flux architekturu pouze v rámci dané komponenty. Nyní si ukážeme, jak můžeme zavést určitým funkcionálním způsobem globální stav v rámci celé aplikace

Vytvořme novou složku `core` a dále složky `core/store` a `core/actions`. Navíc budeme potřeboval knihovnu *use-global-hook* ve verzi 0.2.3 (kvůli kompatibilitě s Immer)

```
yarn add use-global-hook@0.2.3
```

Ve složce `core/store` vytvořme soubory `index.js` a `initialState.js`. Do souboru `initialState.js` vložme 

```js
export const initialState = {
  cnt1: 0,
  cnt2: 0,
  cnt3: 0
}
```

V souboru `index.js` pak inicializujeme knihovnu `use-global-hook` pro použití s immutabilními strukturami z knihovny `Immer.js` následujícím způsobem

```js
import React from "react"
import Immer from "immer"
import globalHook from "use-global-hook"
import * as actions from "../actions"
import { initialState } from "./initialState"

const options = { Immer }
const useGlobal = globalHook(React, initialState, actions, options)

export default useGlobal
```

Nyní máme vytvořen globální stav aplikace. Potřebujeme nadefinovat ještě akce, které budou s tímto globálním stavem pracovat. V `core/actions` vytvořme opět soubor `index.js` a dále soubor `counterActions.js`. Soubor `counterActions.js` bude vypadat následovně

```js
export const incCounter1 = (store) => {
  store.setState(state => { state.cnt1 = state.cnt1 + 1 })
}

export const incCounter2 = (store) => {
  store.setState(state => { state.cnt2 = state.cnt2 + 1 })
}

export const incCounter3 = (store) => {
  store.setState(state => { state.cnt3 = state.cnt3 + 1 })
}
```

V soboru `counterActions.js` pak budeme exportovat objekt `counter`, který představuje rozhranní pro práci s těmito akcemi

```js
import * as counter from './counterActions'

export { counter }
```

Nyní můžeme v souboru `pages/index.js` použít imutabilní globální stav spolu s globálními akcemi

```js
import useGlobal from "../core/store"
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [globalState, globalActions] = useGlobal()

  return (
    <Content>
      <Counter value={globalState.cnt1} inc={() => globalActions.counter.incCounter1()}/>
      <Counter value={globalState.cnt2} inc={() => globalActions.counter.incCounter2()}/>
      <Counter value={globalState.cnt3} inc={() => globalActions.counter.incCounter3()}/>
      <Counter value={globalState.cnt1} inc={() => globalActions.counter.incCounter1()}/>
    </Content>
  )
}
```

Tímto způsobem jsme přesunuli práci s aplikačním stavem mimo React komponenty. Hodnoty `globalState.cnt1` jsou imutabilní, pokud bychom je chtěli přímo změnit, vyskočila by nám chybová hláška

```js
return (
  <Content>
    <button onClick={() => globalState.cnt1 = globalState.cnt1 + 1}>Error</button>
  </Content>
)
// -> "TypeError: Cannot assign to read only property 'cnt1' of object '#<Object>'"
```

Hodnoty globálního stavu můžeme měnit tedy pouze pomocí explicitně definovaných akcí

## Redux

V příkladech pro tento kurz jsou záměrně použity co nejjednodušší implementace architektury Flux. Pro produkční prostředí je určitě vhodné zvážit použití masivněji používaných knihoven pro správu aplikačního stavu - jako je například knihovna [Redux](https://redux.js.org/). To je však nad rámec tohoto kurzu


<!-- 
## Úkoly

* Vytvořte komponentu Lights (např. 2 div elementy vedle sebe). Ve výchozím stavu jsou obě světla zhaslá (může být jednotná defaultní barva). Vytvořte 2 přepínače (tlačítka) pro každé světlo jedno, která je rozsvěcují a zhasínají. Rozsvícení/zhasnutí implementujte akcemi. Vytvořte tlačítko UNDO, které se po stitknutí vrátí o jednu akci zpět. Pokud není dostupná žádná předchozí akce, tlačítko neprovede nic

```
L1 OFF, L2 OFF
L1 ON
L1 OFF
UNDO -> L1 ON
L1 OFF
UNDO -> L1 ON
UNDO -> L1 OFF
UNDO -> 
``` -->

