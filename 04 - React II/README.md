
# React II

V této lekci se budeme zabývat aplikačním stavem v React aplikaci. Dále pak nakousneme téma stylování aplikace (imporováním CSS souborů/inline CSS v JavaScriptu). Na konci se podíváme, jak použít hotové komponenty třetích stran

Minule jsme si zkusili vytvořit první API endpoint. K tomu nyní budeme přistupovat a zobrazovat načtená data v naší aplikaci pomocí React komponent

Budeme potřebovat projekt z minulého cvičení (můžete si jej stáhnout v `"03 - React/src"`, pomocí příkazu `yarn` nainstalovat potřebné závislosti a spustit webserver pomocí `yarn dev` v developmnet módu)

## UseState

Prvním krokem bude představení hooku `useState`. Vytvořme proto novou komponentu `Counter`

```
touch components/Counter.js
```

Do naší nové komponenty vložme následující kód, naimportujme komponentu v `pages/index.js` a vložme ji do nadřazené komponenty `Content`

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

Jak si můžeme všimnou, po kliknutí na tlačítko "Add1" se nic nestane. Hodnota navázaná na symbol `cnt` se sice inkrementuje, ale změna se nepromítne do View

Aby se změna promítla do View, musíme o tom nějakým způsobem říct Reactu. K tomu slouží hook `useState`. První je třeba jej naimportovat (je součástí knihovny React). Nyní zavoláme funkci `useState` a jako parametr předáme inicializační hodnotu

Funkce `useState` vrací "Getter" a "Setter" pro danou hodnotu. Ty navážeme na symboly `cnt` a `setCnt` následujícím způsobem. Pak akorát zaměníme obsluhu kliknutí na tlačítko a máme hotové funkční počítadlo
 
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

Dalším velmi používaným hookem je `useEffect`. Ten nám umožňuje dynamicky reagovat na změny stavu aplikace

Prvním typem změny stavu je načtení samotné komponenty. Mezi importované funkce z knihoviny React přidejme funkci `useEffect`. Prvním parametrem je callback - funkce, která se vykoná po vyvolání efektu. Druhým parametrem je pak pole závislých symbolů. Jestliže je pole závislých symbolů prázdné, zavolá se funkce pouze při načtení komponenty

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

Po znovunačtení úvodní stránky se nám pokaždé zobrazí vyskakovací okno s hláškou "Loaded!"

Nyní změňme definici efektu tak, že do pole závislých symbolů přidáme symbol `cnt`. Ten musí být definován ještě před definicí samotného efektu

```javascript
const [cnt, setCnt] = useState(initValue ? initValue : 0)
useEffect(() => {
  alert("Cnt was changed!")
}, [cnt])
```

Jak si můžeme všimnout, po každé změně hodnoty symbolu `cnt` se nám zobrazí vyskakovací okno s hláškou "Cnt was changed!" (včetně samotné inicializace)

## UseSWR

Vraťme se teď na stránku `pages/btc.js` a nainstalujme knihovnu SWR. Jedná se o hook, který realizuje asynchronní načítaní dat a následnou změnu aplikačního stavu

```
yarn add swr  
```

Hook `useSWR` potřebuje 2 argumenty - adresu API a callback, který zpracuje přijatá data. V následujícím příkladě použijeme [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - rozhraní je součástí většiny moderních prohlížečů a umožňuje práci s asynchronními HTTP dotazy (není součastí Node.js)

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

Po vytvoření projektu jsme si mohli všimnout, že máme předdefinované styly ve složce `styles`. Zde máme 2 soubory - `globals.css`, definující globální styly a poté `Home.module.css`, definující styly pro konkrétní komponentu. Jestliže chceme definovat styly pro konkrétní komponentu, musíme dodržovat konvenci `[název_komponenty].module.css`

Zkusme nyní přejmenovat soubor `Home.module.css` na `Content.module.css`. Dále soubor upravme, aby v něm zůstaly pouze styly pro třídy `.container` a `.main`

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

Často budeme chtít použít styly přímo v rámci dané komponenty, aniž bychom vytvářeli zvlášť .css soubor. K tomu můžeme použít inline styly

V souboru `components/common/Footer.js` upravme element footer

```javascript
<footer style={{outline: '1px solid green'}}>
  This is footer
</footer>
```

Po znovunačtení stránky vidíme ohraničení této komponenty znázorněné zeleným rámečkem

### Tailwind

Stylování tímto způsobem však není jediná možnost. Zajímavou alternativou tzv. CSS in JS je knihovna [Tailwind](https://tailwindcss.com/). Ta se dá velmi snadno integrovat do Next.js projektu [tímto](https://tailwindcss.com/docs/guides/nextjs) způsobem. Více o Tailwindu se můžete dozvědět například v kurzu Webové technologie (kmi/wete) spolu s dalšími pokročilými vlastnostmi CSS, od kterých zde odhlédneme

## Komponenty třetích stran

Určitě není vždy žádoucí psát si všechny komponenty od základu. Předpřipravených React komponent je dostupná celá řada. Nicméně stále platí, že ne všechny komponenty je dobrý nápad bez většího rozmyslu do projektu importovat

### React Toastify

Typickým příkladem takovéto externí komponenty jsou třeba vizualizace notifikací. V následujícím příkladě si ukážeme, jak takovou komponentu zaintegrovat do projektu

Nainstalujme knihovnu React-toastify

```
yarn add react-toastify
```

Nyní do komponenty `Counter` doplňme následující importy

```javascript
import { ToastContainer, toast } from 'react-toastify'
```

Nahraďme `alert` za funkci `toast` a přidejme komponentu `ToastContainer` do JSX

```javascript
///
/// My counter component
///
export default function Counter ({ initValue }) {
  const [cnt, setCnt] = useState(initValue ? initValue : 0)
  useEffect(() => {
    // alert("Cnt was changed!")
    toast("Cnt was changed!")
  }, [cnt])

  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => setCnt(cnt + 1)}>Add1</button>
      <ToastContainer />
    </div>
  )
}
```

Když znovu načteme stránku s nově importovanými styly, bude se nám již zobrazovat asynchronně nový typ notifikace, vyvolaný hookem `useEffect`

Jelikož předpokládáme, že notifikaci budeme používat na více místech aplikace, určitě můžeme import CSS souboru přesunot například do `pages/_app.js`, ať nemusíme načítat styly v každé komponentě zvlášť. To samé platí pro samotný `ToastContainer`, který můžeme vložit třeba do komponenty `common/Content.js`


```javascript
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```