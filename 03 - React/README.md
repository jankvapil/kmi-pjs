
# React

[React](https://reactjs.org/) je knihovna pro tvorbu uživatelského rozhranní. Hlavní myšlenkou je rozdělení uživatelského rozhranní na komponenty, které se skládají z menších částí do větších celků. V Reactu je komponenta definovaná čistě jako funkce. Ta představuje transformaci dat na View

Syntaxí JSX, kterou React používá, velmi připomíná HTML. Je tedy snadné pro kohokoliv se základy tvorby webových aplikací se v něm začít velmi rychle orientovat


```javascript
(
  <App>
    <Header />
    <Content>
      ...
    </Content>
    <Footer />
  </App>
)
```


React je čistě client-side technologie. Dá se jednoduše vložit do webové stránky pomocí skriptu a napojit na určitý element, který má být kořenem stromu React komponent. Tímto způsobem však React používat nebudeme. Je však dobré vědět, že je možné jej použít bez problému v již existující aplikaci. Podrobný postup je možné najít například [zde](https://dev.to/underscorecode/creating-your-react-project-from-scratch-without-create-react-app-the-complete-guide-4kbc)

## Next.js

Jelikož React je knihovna, která řeší pouze efektivní překreslování View, budeme používat framework `Next.js`, jehož základem je právě React a dále poskytuje také řadu rozšiřujících nástrojů pro routování, serverside rendering a dalších možností. Next nabízí předpřipravené různé šablony projektů (dle preferencí použití dalších rozšiřujících knihoven) včetně serveru, který nám jednotlivé stránky bude servírovat, takže odpadá potřeba vytvářet celý projekt od základu

## Vytvoření projektu

Projekt vytvoříme s pomocí DevStacku `create-next-app` následujícím příkazem

```
npx create-next-app
```

Po spuštění web serveru příkazem `yarn dev` (dev = development mode) přejdeme v prohlížeči na adresu http://localhost:3000, na které uvidíme úvodní stránku naší aplikace s několika odkazy 

```
yarn dev
```

Zároveň máme připravený základní layout stránky. Ten však používat nebudeme a vše si vytvoříme od základu sami

Přejděme tedy do souboru `pages/index.js` a všechno mezi elementy `<main> ... </main>` smažme

## Komponenty

Projekt budeme strukturovat následovně - veškeré komponenty budeme ukládat do složky `components`. Tu je také vhodné rozdělit na příslušné sekce

```
mkdir components
```

Složka common bude obsahovat společné komponenty v rámci celého projektu

```
mkdir components/common
```

Nyní vytvořme ve složce `common` 3 soubory - `Header.js`, `Footer.js` a `Content.js`. Dodržujme následující konvenci, že názvy komponent budou začínat velkým písmenem

```
touch components/common/Footer.js
touch components/common/Header.js
touch components/common/Content.js
```

### Header

Do souboru `Header.js` vložme následující kód:

```javascript
import Head from 'next/head'

///
/// Header component
///
const Header = () => {
  return (
    <Head>
      <title>KMI/PJS Course</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default Header
```

Jako jednu z prvních změn si můžeme nastavit vlastní favicon. Doporučuji použít například [favicon.io](https://favicon.io/favicon-generator/), kde se dají vygenerovat velmi hezké ikonky z ASCII znaků

### Footer

Do souboru `Footer.js` vložme následující kód:

```javascript
///
/// Footer component
///
const Footer = () => {
  return (
    <footer>
      This is footer
    </footer>
  )
}

export default Footer
```

## Props

Nyní cheme komponenty `Header` a `Footer` naimportovat do hlavní komponenty `Content`. To uděláme následujícím způsobem:

```javascript
import styles from '../../styles/Home.module.css'

import Header from './Header'
import Footer from './Footer'

///
/// Content component
///
const Content = (props) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        { props.children }
      </main>
      <Footer />
    </div>
  )
}

export default Content
```

Jak si můžeme všimnout, komponenta `Content` má ve své definici argument `props` - neboli Properties (vlastnosti) dané komponenty. V nich lze předávat buďto další komponenty a tvořit tak hierarchii komponent, nebo (jak uvidíme později) předávat jakékoliv další objekty, se kterými má komponenta dále pracovat

Do souboru `pages/index.js` pak vložme samotnou komponentu Content, která bude obalovat veškerý další obsah stránky

```javascript
import { Content } from '../components/common/Content'

export default function Home() {
  return (
    <Content>
      <h1>Hello world!</h1>
    </Content>
  )
}

```

## Hot Reload

Jak jsme si mohli všimnout, po změně ve zdrojovém kódu se nám změny automaticky promítnou přímo v aplikaci. Této funkci se říká Hot Reload

Nyní vytvořme další komponentu `Button` pomocí 

```
touch components/Button.js
```

s následujícím kódem...

```javascript
///
/// My button component
///
const Button = ({ name, msg }) => {
  return (
    <button onClick={() => alert(msg) }>
      { name }
    </button>
  )
}

export default Button
```

Jednotlivé property `name` a `msg` můžeme destrukturalizovat viz předchozí příklad. To také usnadní statickou analýzu kódu, takže vývojové prostředí ví, co za argumenty se komponentě předává a může to poté nabídnout v nápovědě

Nyní musíme komponentu opět naimportovat do stránky `pages/index.js`

```javascript
...
export default function Home() {
  return (
    <Content>
      <h1>Hello world!</h1>
      <Button name="Click" msg="Hello!"/>
    </Content>
  )
}

```

Po kliknutí na tlačítko s názvem "Click" se nám zobrazí ve vyskakovacím okně zpráva, kterou jsme předali komponentě `Button`

## Routování

Ve složce `pages` vytvoříme novou stránku s názvem `btc.js`

```
touch pages/btc.js
```

Do ní vložíme podobný kód, jako máme v souboru `index.js`

```javascript
import Content from '../components/common/Content'

export default function Btc() {
  return (
    <Content>
      <h1>BTC Price</h1>
    </Content>
  )
}
```

Když v prohlížeči přejdeme na adresu `http://localhost:3000/btc`, zobrazí se nám nově vytvořená stránka. Next.js automaticky všechny soubory ve složce pages zpřístupňuje jako routy. Pro speciální název index pak zpřístupní defaultní routu

Jak si můžeme všimnout, ve složce pages máme ještě dále složku `api`, obsahující soubor `hello.js`. Veškeré soubory pod touto složkou jsou považovány za API endpointy (typicky REST nebo GraphQL - uvidíme později)

Vraťme se ještě na chvíli ke stránce `index.js` a doplňme následující kód, abychom se na stránku BTC mohli dostat po kliknutí z hlavní stránky

```javascript
<a href="/btc">BTC</a>
```

Tímto způsobem však nikdy routování v Next.js neřešíme. K práci s routerem používáme přímo referenci na router, vytvořenou hookem `useRouter`. Pozměňme kód v komponentě `Button`:

```javascript
import { useRouter } from 'next/router'

///
/// My button component
///
const Button = ({ name, msg }) => {
  const router = useRouter()
  return (
    <button onClick={() => router.push("/btc")}>
      { name }
    </button>
  )
}

export default Button
```

Nyní zkusme porovnat oba přístupy

## Hooky

S pojmem "hook" se budeme ve funkcionálních komponentách Reactu setkávat velmi často. 

Jelikož, jak jsme si říkali v úvodu, funkcionální React komponenta je čistá funkce, která transformuje data na View. Pomocí hooků můžeme do těchto funkcí vnášet určitým "čistým" způsobem side-efekty. V další lekci se budeme zabývat například aplikačním stavem, který je také realizován pomocí hooků

# REST API

V úvodním semináři o Node.js jsme si představili jednoduchou webovou službu, ve které jsme implementovali obsluhu HTTP GET požadavku, kde jsme vraceli HTML stránku. Podobným způsobem můžeme implementovat tzv. RESTové API, prostřednictvím kterého můžeme pracovat s datovou vrstvou webové aplikace (uvidíme později)

REST API používá HTTP metody - GET, POST, PUT a DELETE. Typicky se vracejí odpovědi ve formátu JSON

Zkusme si tedy vytvořit vlastní API endpoint, obsluhující GET request. Přejmenujme existující `hello.js` na `btc.js` ve složce `pages/api`. Když přejdeme na adresu http://localhost:3000/api/btc, uvidíme výsledek tohoto API requestu, definovaného níže:

```javascript
export default (req, res) => {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
```

Pojďme nyní vytvořit endpoint, vracející JSON s aktuální cenou Bitcoinu

První musíme nainstalovat knihovnu Axios. To provedeme pomocí příkazu `yarn add axios`

Poté upravíme soubor `btc.js` tak, že vložíme funkci na načítání dat z Coindesk API, kterou následně zavoláme v handleru API requestu a výsledek vrátíme pomocí funkce `res.json()`

```javascript
const axios = require('axios')

///
/// Fetches current BTC/USD price from Coindesk API
/// 
const fetchBTC = async () => {
  const res = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/btc.json')
  return {
    date: res.data.time.updated, 
    value: res.data.bpi.USD.rate
  }
}

///
/// Handles api/btc request
///
export default async (req, res) => {
  const btcRes = await fetchBTC()
  res.statusCode = 200
  res.json({ ...btcRes })
}
```

Nyní můžeme vyzkoušet náš API dotaz na adrese http://localhost:3000/api/btc. V případě, že se dotaz vykoná správně (nemáme zatím ošetřeno), měli bychom vidět aktuální cenu BTC ve formátu JSON

Tímto jsme vytvořili náš první API endpoint. V následující lekci si zkusíme už práci s aplikačním stavem a vizuální podobu naší aplikace si trochu vylepšíme

## Úkol

Vytvořte podobným způsobem jako v minulé lekci více endpointů pro různé typy altcoinů (např. api/eth)