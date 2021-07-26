
# React II

V této lekci se budeme zabývat aplikačním stavem v React aplikaci. Na konci pak nakousneme téma stylování aplikace (imporováním CSS souborů/inline CSS v JavaScriptu).

Minule jsme si zkusili vytvořit první API endpoint. K tomu nyní budeme přistupovat a zobrazovat načtená data v naší aplikaci pomocí React komponent.

Budeme potřebovat projekt z minulého cvičení (můžete si jej stáhnout v `"03 - React/src"`, pomocí příkazu `yarn` nainstalovat potřebné závislosti a spustit webserver pomocí `yarn dev` v developmnet módu).

## UseState

Prvním krokem bude představení Hooku UseState. Vytvořme proto novou komponentu `Counter`.

```
touch components/Counter.js
```

Do naší nové komponenty vložme následující kód, naimportujme komponentu v `pages/index.js` a vložme ji do nadřazené komponenty `Content`.

```javascript
///
/// My counter component
///
export default function Counter ({ initValue }) {
  let cnt = initValue ? initValue : 0
  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => cnt++}>Add1</button>
    </div>
  )
}
```

Jak si můžeme všimnou - po kliknutí na tlačítko Add1 se nic nestane. Hodnota navázaná na symbol `cnt` se sice inkrementuje, ale změna se nepromítne do View.

Aby se změna promítla do View, musíme o tom nějakým způsobem říct Reactu. K tomu slouží hook UseState. První je třeba jej naimportovat (je součástí knihovny React). Nyní zavoláme funkci `useState` a jako parametr předáme inicializační hodnotu.

Funkce `useState` vrací Getter a Setter pro danou hodnotu. Ty navážeme na symboly `cnt` a `setCnt` následujícím způsobem. Pak akorát zaměníme obsluhu kliknutí na tlačítko a máme hotové funkční počítadlo.
 
```javascript
import { useState } from "react"

///
/// My counter component
///
export default function Counter ({ initValue }) {
  const [cnt, setCnt] = useState(0)
  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => setCnt(cnt + 1)}>Add1</button>
    </div>
  )
}
```

## UseEffect

Dalším velmi používaným hookem je UseEffect. Ten nám umožňuje dynamicky reagovat na změny stavu aplikace. 

Prvním typem změny stavu je načtení samotné komponenty. Mezi importované funkce z knihoviny React přidejme funkci `useEffect`. Prvním parametrem je callback - funkce, která se vykoná po vyvolání efektu. Druhým parametrem je pak pole závislých symbolů. Jestliže je pole závislých symbolů prázdné, zavolá se funkce pouze při načtení komponenty.

```javascript
import { useEffect, useState } from "react"

///
/// My counter component
///
export default function Counter ({ initValue }) {
  useEffect(() => {
    alert("Loaded!")
  }, [])
  ...
}
```

Po znovunačtení úvodní stránky se nám pokaždé zobrazí vyskakovací okno s hláškou "Loaded!".

Nyní změňme definici efektu tak, že do pole závislých symbolů přidáme symbol `cnt`. Ten musí být definován ještě před definicí samotného efektu.

```javascript
const [cnt, setCnt] = useState(initValue ? initValue : 0)
useEffect(() => {
  alert("Cnt was increased!")
}, [cnt])
```

Jak si můžeme všimnout, po každé změně hodnoty symbolu `cnt` se nám zobrazí vyskakovací okno s hláškou "Cnt was increased!" (Včetně samotné inicializace).

## UseSWR

Vraťme se teď na stránku `pages/btc.js` a nainstalujme knihovnu SWR. Jedná se o hook, který realizuje asynchronní načítaní dat a následnou změnu aplikačního stavu.

```
yarn add swr  
```

Hook UseSWR potřebuje 2 argumenty - adresu API a callback, který zpracuje přijatá data. V následujícím příkladě použijeme [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - rozhraní je součástí většiny moderních prohlížečů a umožňuje práci s asynchronními HTTP dotazy (není součastí Node.js).

```javascript
import useSWR from "swr"
import Content from '../components/common/Content'

export default function Btc() {
  const { data, error } = useSWR(
    "api/btc",
    url => fetch(url).then(res => res.json())
  )

  if (error) return "An error has occurred."
  if (!data) return "Loading..."
  return (
    <Content>
      <h1>BTC Price</h1>
      <p>{data?.value}</p>
    </Content>
  )
}
```

## Styly

Po vytvoření projektu jsme si mohli všimnout, že máme předdefinované styly ve složce `styles`. Zde máme 2 soubory - `globals.css`, definující globální styly a poté `Home.module.css`, definující styly pro konkrétní komponentu. Jestliže chceme definovat styly pro konkrétní komponentu, musíme dodržovat konvenci `[název_komponenty].module.css`.

Zkusme nyní přejmenovat soubor `Home.module.css` na `Content.module.css`. Dále soubor upravme, aby v něm zůstaly pouze styly pro třídy `.container` a `.main`.

```css
.container {
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main {
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
```

Nyní musíme také upravit import v `components/common/Content.js`

```javascript
import styles from '../../styles/Content.module.css'
```

## Styly v JavaScriptu

Často budeme chtít použít styly přímo v rámci dané komponenty, aniž bychom vytvářeli zvlášť .css soubor. K tomu můžeme použít inline styly. 

V souboru `components/common/Footer.js` upravme element footer.

```javascript
<footer style={{outline: '1px solid green'}}>
  This is footer
</footer>
```

Po znovunačtení stránky vidíme ohraničení této komponenty znázorněné zeleným rámečkem.

## Úkol

Pro endpointy z minulého úkolu vytvořte samostatné stránky (např. `pages/eth.js`), na kterých budou zobrazeny tabulky s daty pro konkrétní kryptoměnu.

Dále vytvořte komponentu navigace, která bude obsahovat seznam odkazů na jednotlivé stránky (homepage, BTC a další). Měla by být zobrazena na každé stránce.

Nastylujte odkazy, tlačítka i tabulky s kryptoměnami.