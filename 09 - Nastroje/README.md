# Užitečné nástroje pro vývoj v JS

V dnešní lekci se podíváme na to, jakým způsobem je možné pracovat s aplikačním stavem a které knihovny nám tuto práci usnadní

## Aplikační stav

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
      <button onClick={() => inc()}>Add1</button>
    </div>
  )
}
```

Tímto jsme vytvořili sdílený aplikační stav pro 4 komponenty typu `Counter`. Některé čítače pracují pouze s vlastní hodnotou, některé hodnotu sdílejí - musí být tedy sdílená hodnota čítače "vytažena" do nadřazené komponenty. To reflektuje velmi častý případ, se kterým se vývojář bude muset potýkat

V případě takto lineární struktury ještě není problém úplně zřejmý. Zkusme si ale představit, že máme aplikační stav složený z daleko více zanořených objektů

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

## State management

