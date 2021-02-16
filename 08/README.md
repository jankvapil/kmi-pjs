
# React

React je knihovna pro tvorbu uživatelského rozhranní. Vychází z funkcionálního paradigmatu... TODO

## Next.js

Devstack.. TODO

## Vytvoření projektu

Projekt vytvoříme s pomocí devstacku `create-next-app`. Ten obsahuje jakousi kostru projektu.

```
npx create-next-app
```

Po spuštění web serveru následujícím příkazem (dev = development mode) vidíme úvodní stránku s několika odkazy. 

```
yarn dev
```

Zároveň máme připravený základní layout stránky. Ten však nebudeme používat a vše si vytvoříme "od základu". 

Přejděme tedy do souboru `pages/index.js` a všechno mezi elementy `<main> ... </main>` smažme.

## Komponenty

Projekt budeme strukturovat následovně - veškeré komponenty budeme ukládat do složky components. Tu je vhodné rozdělit také na příslušné sekce.

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
      <title>Create Next App</title>
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
      <Header/>
      <main className={styles.main}>
        { props.children }
      </main>
      <Footer />
    </div>
  )
}

export default Content
```

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

Jak jsme si mohli všimnout, po změně "HTML" se nám změny automaticky promítnou přímo v aplikaci. Této funkci se říká Hot Reaload.



