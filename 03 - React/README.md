
# React

[React](https://reactjs.org/) je knihovna pro tvorbu uživatelského rozhranní. Hlavní myšlenkou je rozdělení uživatelského rozhranní na komponenty, které se skládají z menších částí do větších celků. Syntaxí React velmi připomíná HTML, takže je velmi snadné, pro kohokoliv se základy tvorby webových aplikací, se v něm velmi rychle začít orientovat.


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


React je čistě client-side technologie. Dá se jednoduše vložit do webové stránky pomocí skriptu a napojit na určitý element, který má být kořenem stromu React komponent. Tímto způsobem však React používat nebudeme. Je však dobré vědět, že je možné jej použít ihned bez problému například v již existující aplikaci.

## Next.js

Jelikož React je knihovna, která řeší pouze efektivní dynamické překreslování View, budeme používat nadstavbu v podobě frameworku `Next.js`. Ten nám poskytne řadu rozšiřujících nástrojů (pro routování, serverside rendering...), spolu s předpřipravenou šablonu projektu (včetně serveru, který nám jednotlivé stránky bude servírovat, takže si nebudeme muset vytvářet celý devstack od základu sami).

## Vytvoření projektu

Projekt vytvoříme s pomocí devstacku `create-next-app` následujícím příkazem.

```
npx create-next-app
```

Po spuštění web serveru příkazem `yarn dev` (dev = development mode) přejdeme v prohlížeči na adresu http://localhost:3000, na které uvidíme úvodní stránku naší aplikace s několika odkazy. 

```
yarn dev
```

Zároveň máme připravený základní layout stránky. Ten však používat nebudeme a vše si vytvoříme od základu sami. 

Přejděme tedy do souboru `pages/index.js` a všechno mezi elementy `<main> ... </main>` smažme.

## Komponenty

Projekt budeme strukturovat následovně - veškeré komponenty budeme ukládat do složky `components`. Tu je také vhodné rozdělit na příslušné sekce.

```
mkdir components
```

Složka common bude obsahovat společné komponenty v rámci celého projektu.

```
mkdir components/common
```

Nyní vytvořme ve složce `common` 3 soubory - `Header.js`, `Footer.js` a `Content.js`. Dodržujme následující konvenci, že názvy komponent budou začínat velkým písmenem.

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

Jako jednu z prvních změn si můžeme nastavit vlastní faviconu. Doporučuji použít například [favicon.io](https://favicon.io/favicon-generator/), kde se dají vygenerovat velmi hezké ikonky z ASCII znaků.

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

Jak si můžeme všimnout, komponenta `Content` má ve své definici argument `props` - neboli Properties (vlastnosti) dané komponenty. V nich lze předávat buďto další komponenty a tvořit tak hierarchii komponent, nebo (jak uvidíme později) předávat jakékoliv další objekty, se kterými má komponenta dále pracovat.

Do souboru `pages/index.js` pak vložme samotnou komponentu Content, která bude obalovat veškerý další obsah stránky.

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

Jak jsme si mohli všimnout, po změně ve zdrojovém kódu se nám změny automaticky promítnou přímo v aplikaci. Této funkci se říká Hot Reaload.

Nyní vytvořme další komponentu Button pomocí 

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

Jednotlivé property `name` a `msg` můžeme destrukturalizovat viz předchozí příklad. To také usnadní statickou analýzu kódu, takže vývojové prostředí ví, co za argumenty se komponentě předává a může to poté nabídnout v nápovědě.

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

Po kliknutí na tlačítko s názvem "Click" se nám zobrazí ve vyskakovacím okně zpráva, kterou jsme předali komponentě `Button`.

## Routování

Pro načtení jiné stránky musíme nastavit tzv. routování.

## CSS

