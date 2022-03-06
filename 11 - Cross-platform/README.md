# Multiplatformní vývoj v JS

Doba kdy platilo, že JavaScript je technologií výhradně spojena s prohlížečem a webovými stránkami je dávno pryč. JavaScript nachází uplatnění nejen na serveru, ale také na mobilních zařízeních a desktopech

## Electron

V současné době se většina velkých společností potýká s problémem, jak stavět udržitelné multiplatformní aplikace, které by běžely současně na Windows, MacOS i Linuxu. Současným trendem je technologie zvaná [Electron](https://www.electronjs.org/), která je použita pro řadu moderních desktopových aplikací, jako je VSCode, MS Teams nebo Slack

> Electron is a free and open-source software framework developed and maintained by GitHub. It allows for the development of desktop GUI applications using web technologies: it combines the Chromium rendering engine and the Node.js runtime

Jak popis naznačuje, jedná se o způsob, jakým se webová aplikace zabalí do desktopové podoby s použitím Node.js běhového prostředí, které umožňuje pracovat se systémovými zdroji. Způsob takovéto tvorby aplikací je velmi zajímavý, jelikož jsou vývojáři odstíněni o celou řadu problémů, spojenou s vývojem pro více platforem

## Nextron

Pro účely této lekce použijeme knihovnu [Nextron](https://github.com/saltyshiomix/nextron). Využijeme znalostí z předchozích lekcí o Reactu (respektive Next.js) a doplníme je o další specifika desktopového vývoje.

Pro založení projektu použijeme předpřipravenou šablonu a doinstalujeme závislosti

```
yarn create nextron-app my-app --example with-javascript
cd my-app
yarn
```

Vytvořila se struktura projektu, ze které nás budou zajímat zejména složky `main` a `renderer`. Složka main obsahuje veškeré nastavení, související s Electronem - inicializace okna aplikace, nastavení event listenerů na různé události. Ve složce renderer pak máme klasickou strukturu Next.js projektu

Pomocí příkazu `yarn dev` spustíme projekt v Development módu. Můžeme si všimnout, že po změně ve zdrojovém kódu se nám provádí díky hot-reloadingu překreslování ihned, stejně jako v případě vývoje webových aplikací

Příkazem `yarn build` se spustí Electron-builder, který vytvoří složku `dist` a provede build projektu. K dispozici máme vygenerovaný `My Nextron App Setup 1.0.0.exe` soubor, kterým můžeme provézt instalaci aplikace. Mimo to se vytvořila také složka `win-unpacked`, která obsahuje aplikaci ve spustitelné podobě