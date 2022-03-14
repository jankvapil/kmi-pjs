# Multiplatformní vývoj v JS

Doba, kdy platilo, že JavaScript je technologií výhradně spojena s prohlížečem a webovými stránkami je dávno pryč. JavaScript nachází uplatnění nejen na serveru, ale také na mobilních zařízeních a desktopech

## Electron

V současné době se většina velkých společností potýká s problémem, jak stavět udržitelné multiplatformní aplikace, které by běžely současně na Windows, MacOS i Linuxu. Jedním z aktuálních trendů je technologie zvaná [Electron](https://www.electronjs.org/). Ta je použita pro řadu moderních desktopových aplikací jako je VSCode, MS Teams nebo Slack

> Electron is a free and open-source software framework developed and maintained by GitHub. It allows for the development of desktop GUI applications using web technologies: it combines the Chromium rendering engine and the Node.js runtime

Jak popis naznačuje, jedná se o způsob, jakým se webová aplikace zabalí do desktopové podoby s použitím Node.js běhového prostředí, které umožňuje pracovat se systémovými zdroji. Způsob takovéto tvorby aplikací je velmi zajímavý, jelikož jsou vývojáři odstíněni od celé řadu problémů, spojené s vývojem pro více platforem

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
  
  const loadFile = async (e) => {
    const files = e.target.files
    const file = files[0]
    const text = await fs.readFile(file.path, "utf8")
    setText(text)
  }
  return (
    <React.Fragment>
      <Head>
        <title>Electron Demo</title>
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
  <input multiple type="file" onChange={loadFile} style={{width: '80%'}}/>
  <button onClick={saveFile} style={{float: 'right', width: '20%'}}>Save</button>
```

Nyní nám zbývá implementovat funkci `saveFile`

