# Multiplatformní vývoj v JS

Již dávno neplatí, že JavaScript je technologií, která je spojená výhradně s prohlížečem a webovými stránkami. JavaScript nachází uplatnění nejen na serveru, ale
také na mobilních zařízeních a desktopech. V současné době se velké množství
softwarových firem potýká s problémem jak stavět udržitelné multiplatformní
aplikace, které by běžely současně na mobilních zařízeních i desktopech. Alternativním řešením jsou samozřejmě webové aplikace. Tématem předposledního
semináře bude vývoj nativních aplikací v rámci platformy JavaScript - ať už s
integrací jádra prohlížeče nebo přímo kompilováním do nativního kódu cílového
zařízení.

## Electron

Jedním z dlouhodoběji stabilních trendů je technologie zvaná [Electron](https://www.electronjs.org/). Ta je použita pro řadu moderních desktopových aplikací jako je Visual Studio Code, Microsoft Teams nebo Slack.

Jedná se o open-source framework, který je vyvíjen společností GitHub. Používá renderovací jádro prohlížeče Chromium a JavaScriptové běhové prostředí Node.js. Jedná se o způsob, jakým se webová aplikace zabalí do desktopové podoby, která navíc umožňuje pracovat se systémovými zdroji. Způsob takovéto tvorby aplikací je velmi zajímavý, jelikož jsou vývojáři odstíněni od celé řady problémů, spojených s vývojem pro více platforem. Navíc mohou využít znalosti z tvorby webových aplikací, takže je snadné pro tým vývojářů se zaměřením na webové aplikace přejít na vývoj pro desktop nebo mobil.

## Nextron

Pro účely této lekce použijeme knihovnu [Nextron](https://github.com/saltyshiomix/nextron). Využijeme znalostí z předchozích lekcí o Reactu (respektive Next.js) a doplníme je o další specifika desktopového vývoje.

Pro založení projektu použijeme předpřipravenou šablonu a doinstalujeme závislosti

```
yarn create nextron-app my-app --example with-javascript
cd my-app
yarn
```

Vytvořila se struktura projektu, ze které nás budou zajímat zejména složky `main` a `renderer`. Složka main obsahuje veškerá nastavení, související s Electronem - inicializace okna aplikace, nastavení event-listenerů na různé události spojené s prací v okně. Ve složce renderer pak máme klasickou strukturu Next.js projektu

Pomocí příkazu `yarn dev` spustíme projekt v Development módu. Můžeme si všimnout, že po změně ve zdrojovém kódu se nám provádí, díky hot-reloadingu, překreslování ihned, stejně jako v případě vývoje webových aplikací

Příkazem `yarn build` se spustí Electron-builder, který vytvoří složku `dist` a provede build projektu. K dispozici máme vygenerovaný `My Nextron App Setup 1.0.0.exe` soubor, kterým můžeme provézt instalaci aplikace. Mimo to se vytvořila také složka `win-unpacked`, která obsahuje aplikaci ve spustitelné podobě

Abychom si ukázali, jak snadno se dají vytvářet desktopové aplikace s pomocí Electronu - zkusme si nyní pro ukázku vytvořit jednoduchý textový editor. Přejděme nyní do složky `renderer/pages` a souboru `home.jsx` a vložme následující kód

```js
import React, { useState } from 'react'
import Head from 'next/head'
import fs from 'fs-extra'

function Home() {
  const [text, setText] = useState("")
  const [file, setFile] = useState("")
  const [path, setPath] = useState(null)

  const loadFile = async (e) => {
    if (e.target.files.length < 1) return
    const files = e.target.files
    const file = files[0]
    const text = await fs.readFile(file.path, "utf8")
    setPath(file.path)
    setFile(`- ${file.name}`)
    setText(text)
  }

  return (
    <React.Fragment>
      <Head>
        <title>Electron Demo {file}</title>
      </Head>
      <div>
        <h1>Notepad</h1>
        <input type="file" onChange={loadFile} style={{width: '100%'}}/>
        <textarea type="text" value={text} rows={25} style={{width: '100%'}}/>
      </div>
    </React.Fragment>
  )
}

export default Home
```

Jak si můžeme všimnout hned na začátku souboru - pomocí knihovny `fs-extra`, která je součástí Electronu, můžeme pracovat se souborovým systémem. Funkce `loadFile` umí načíst textový soubor a výsledek uložit do proměnné `text`. Tato funkce je vyvolána přes `onChange` událost elementu `input`, který je typu file. 

Jelikož element `input` nemá nastavený atribut `multiple`, je možné předpokládat, že načtený soubor bude prvním prvkem v poli `files`. Načtený text se pak zobrazí v elementu `textarea` - jelikož však není definován onChange handler, není zatím možné text upravovat. To však nyní napravíme - upravme element `textarea`

```jsx
  <textarea 
    onChange={(e) => setText(e.target.value)} 
    type="text" 
    value={text} 
    rows={25} 
    style={{width: '100%'}}
  />
```

Změny v textu se nám provádí v rámci aplikační paměti. Nyní bychom však chtěli změny uložit zpět do souboru. Přidejme ještě element `button`, který bude tuto funkci vyvolávat. Upravme ještě lehce styly, aby se `input` a `button` dynamicky škálovaly v poměru 1:4

```jsx
  <input type="file" onChange={loadFile} style={{width: '80%'}}/>
```
```jsx
  <button onClick={saveFile} style={{float: 'right', width: '20%'}}>Save</button>
```

Nyní nám zbývá implementovat funkci `saveFile`. Abychom dali uživateli vizuálně najevo, že soubor není uložen, zavedeme novou proměnnou `status`, kterou v nově definované funkci při úspěšném uložení nastavíme na ""

```js
  const saveFile = () => {
    if (!path) return
    fs.writeFile(path, text, (err) => {
      if (!err) setStatus("")
    })
  }
```

Tu rovnou zobrazíme v titulku aplikace za souborem

```jsx
  <title>Electron Demo {file}{status}</title>
```

Nyní vytvořme `onTextChangeHandler`, který bude vyvolávat element `textarea` namísto předem definovaného lambda výrazu. V tomto handleru budeme nastavovat při editaci textu `status` na "*"

```js
const onTextChangeHandler = (e) => {
  setText(e.target.value)
  setStatus("*")
}
```

Výsledný soubor by měl vypadat takto

```js
import React, { useState } from 'react'
import Head from 'next/head'
import fs from 'fs-extra'

function Home() {
  const [text, setText] = useState("")
  const [path, setPath] = useState(null)
  const [file, setFile] = useState("")
  const [status, setStatus] = useState("")

  const loadFile = async (e) => {
    if (e.target.files.length < 1) return
    const files = e.target.files
    const file = files[0]
    const text = await fs.readFile(file.path, "utf8")
    setPath(file.path)
    setFile(`- ${file.name}`)
    setStatus("")
    setText(text)
  }

  const saveFile = () => {
    if (!path) return
    fs.writeFile(path, text, (err) => {
      if (!err) setStatus("")
    })
  }

  const onTextChangeHandler = (e) => {
    if (!path) return
    setText(e.target.value)
    setStatus("*")
  }

  return (
    <React.Fragment>
      <Head>
        <title>Electron Demo {file}{status}</title>
      </Head>
      <div>
        <input type="file" onChange={loadFile} style={{width: '80%'}}/>
        <button onClick={saveFile} style={{float: 'right', width: '20%'}}>Save</button>
        <textarea
          disabled={!path}
          onChange={onTextChangeHandler} 
          type="text" 
          value={text} 
          rows={25} 
          style={{width: '100%'}}
        />
        <span></span>
      </div>
    </React.Fragment>
  )
}

export default Home
```