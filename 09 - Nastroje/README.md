# Užitečné nástroje pro vývoj v JS

Jak již bylo zmíněno v úvodním info o kurzu, JavaScript má mnoho nástrah, do kterých se (nejen) nezkušený programátor může dostat. Některé typické nástrahy jsme si již popsali v úvodních lekcích. V této lekci se budeme zabývat knihovnami, které nám (alespoň částečně) usnadní vývoj JS aplikací.

V dnešní lekci se podíváme na to, jakým způsobem je možné pracovat s aplikačním stavem a které knihovny nám tuto práci usnadní

## Aplikační stav

Vraťme se nyní do adresáře lekce č. 4 (React II), zkopírujme zdrojové soubory celého Next.js projektu a nainstalujme závislosti. V souboru `pages/index.js` upravme kód do následující podoby

```js
import { useState } from 'react'
import Content from '../components/common/Content'
import Counter from '../components/Counter'

export default function Home() {
  const [cnt, setCnt] = useState(0)
  return (
    <Content>
      <Counter value={cnt} setValue={setCnt}/>
      <Counter value={cnt} setValue={setCnt}/>
      <Counter value={cnt} setValue={setCnt}/>
    </Content>
  )
}
```

Komponentu `Counter` pak upravme následujícím způsobem

```js
///
/// My counter component
///
export default function Counter ({ value, setValue }) {
  return (
    <div>
      <p>{value}</p>
      <button onClick={() => setValue(value + 1)}>Add1</button>
    </div>
  )
}
```

Tímto způsobem jsme vytvořili sdílený aplikační stav pro 3 komponenty typu `Counter`. V Reactu se Gettery i Settery předávají přes props. Vychází to z funkcionálního přístupu, že veškeré závislosti, se kterýma komponenta pracuje, se předávají jako parametr. To se však může stát poměrně brzy nepřehledné, při větším počtu závislostí. Jestliže bychom potřebovali změnit jeden vstupní parametr, budeme muset změnu provézt na všech místech aplikace

### Globální aplikační stav

Jistým řešením by bylo zavést globální aplikační stav. To je ale obecný anti-pattern, který narušuje principy funkcionálního přístupu. Mělo by být zřejmé, co je vstupem a výstupem funkcionální React komponenty. Navíc změnou globálního stavu nutně dochází k vedlejším efektům, což určitě nechceme. Nebylo by transparentní, co se v aplikaci děje

## Imutabilní datové struktury

Vhodnějším řešením by bylo pro globální stav zavést určité omezení a to použít immutabilní datové struktury. Na začátku kurzu jsme si přiblížili, jak se pracuje se zanořenými datovými strukturami a na co si dát pozor. Jednou z takových zanořených datových struktur může být právě globální aplikační stav. 

Jako nedestruktivní operace nad polem jsme si představili funkce jako `map`, `filter` nebo `reduce`. Ty nám vracejí vždy pole nová, nemodifikují původní. V případě imutabilních datových struktur jsou všechny operace nedestruktivní. Při modifikaci objektu dochází k vytvoření objektu nového. To by se mohlo zdát jako náročná operace. Nicméně imutabilní datové struktury mají vlastnost tzv. Structural sharing. Jedná se o struktury typu Persistent Search Tree, ve kterých se změna propaguje ke kořenu stromu. Na nezměněné podstromy se odkaz zachová

<br/>
<img src="https://4.bp.blogspot.com/-U4CRzUa93ds/TZCB__l6a6I/AAAAAAAAAA8/9k2hFM81aS4/s1600/binary_tree_after_insert.png" alt="https://massivealgorithms.blogspot.com/2015/10/immutable-binary-tree.html" width="400"/>



## State management

