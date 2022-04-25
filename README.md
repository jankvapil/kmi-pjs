# JavaScript Platform Course

Cílem předmětu bude seznámit studenty s použitím JavaScript technologií na klientu i serveru. Základem je pochopení a následné použití moderních principů tvorby webových aplikací. V průběhu kurzu budou představeny nástroje a návrhové vzory, které usnadní vývoj aplikací

## Obsah kurzu

1. Úvod do JS, (opakování) syntaxe ES6+, vlastnosti jazyka
2. Node.js (package.json, npm), asynchronní požadavky, tvorba web serveru (Express.js)
3. React - funkcionální UI komponenty a jejich kompozice, Next.js
4. React - aplikační stav a side efekty, styly v JS, komponenty třetích stran
5. Databáze - kategorie přístupů k DB, tvorba RESTového API
6. Nerelační databáze (MongoDB), ORM (Prisma), TSDB, časové řady
7. GraphQL - SDL, tvorba API
8. WebSocket (Socket.io), Message Queue knihovny (ZeroMQ)
9. Aplikační stav, immutabilní datové struktury (Immer), state management
10. Statické typy (TypeScript), TS Runtime (Deno), Dokumentace (JSDoc)
11. Multiplatformní vývoj (Electron)
12. Funkcionální programování na platformě JS (fp-ts, ClojureScript)

## Q&A ohledně kurzu

### Jaké jsou předpoklady k absolvování kurzu?

* Je nutné ovládat alespoň základy JS, mít základní zkušenosti s tvorbou webových aplikací.
* Dále je nutné znát základní principy z oblasti databázových systémů, počítačových sítí (zejména aplikační vrstvě) a mít povědomí o metodách protokolu HTTP.

### Jaké jsou potřeba nástroje (IDE, software)?

* Preferovaný editor [VSCode](https://code.visualstudio.com/), linuxová konzole (MINGW pro Windows - součást instalace Gitu).
* Node.js runtime
* Znalost [Gitu](https://git-scm.com/) výhodou

### Co znamená platforma JavaScript?

* [Historie JS](https://youtu.be/Sh6lK57Cuk4) sahá do poloviny 90. let, kdy postupně vzniklo několik prototypů univerzálního jazyka pro webové prohlížeče. Z těch pak vychází standardizovaná specifikace jazyka JS známá jako ECMAScript

* V roce 2009 bylo uvedeno běhové prostředí Node.js, které se stalo určitou platformou pro tvorbu aplikací a na které mohou být zároveň hostované jiné jazyky a technologie. Na prohlížeč lze navíc nahlížet též jako na určitou platformu, která nám poskytuje API k systémovým zdrojům

### JavaScript je obecně vnímán jako špatný jazyk, proč se jím tedy hlouběji zabývat?

* JS je skutečně špatný jazyk ve smyslu, že existuje spousta [pastí](https://youtu.be/et8xNAc2ic8), do kterých se nezkušený JS programátor může dostat (zejména díky slabým dynamickým typům nebo užívání dvojího rozsahu platnosti)

* Má však ale mnoho zajímavých vlastností a při dodržování správných programátorských přístupů v něm lze programovat efektivně. Dle statistik GitHubu je nejrozšířenějším programovacím jazykem vůbec. Také má bezpochyby největší open-source zázemí

### Kde se JS nevyhneme?

* Při tvorbě interaktivních webových aplikací, které budou pracovat s DOM prohlížeče na klientské straně
### Kde je vhodné zvážit použití právě JS technologií?

* Pro rychlé prototypování aplikací - dostupné řešení (nejen) pro malé projekty/startupy
* Výhodou je použití jednotné technologie na klientu i serveru

### Proč k tvorbě UI právě knihovna React?

* Otázka by se dala zobecnit - proč vlastně používat jakoukoliv knihovnu pro tvorbu frontendu? Důvodů je hned několik. V dřívějších dobách, kdy se API prohlížečů velmi lišilo, bylo nutné sjednotit a zjednodušit práci s DOMem. S řešením přišla knihovna [jQuery](https://jquery.com/), která kromě sjednocení rozdílných funkcionalit prohlížečů usnadnila také práci s asynchronními požadavky (AJAX) nebo CSS selektory. Stala se tak jakousi náhradou tzv. "Vanilla JavaScriptu"
* Zlomovým bodem bylo vydání JS standardu ES6, kde přišla řada nových vlastností jazyka (včetně podpory práce s asynchronními requesty). Spolu s příchodem frontendových frameworků typu [Angular](https://angular.io/) nebo [React](https://reactjs.org/) pak vývoj frontendu dostal úplně nový rozměr. Zásadní změnou je komponentový přístup, kdy máme daleko rozsáhlejší možnosti, co se týče rozdělování kódu do jednotlivých komponent (modulů)
* Pro zachování kompatibility se staršími prohlížeči, podporující starší verze ECMAScriptu vznikly transpilery (typu [Babel](https://babeljs.io/)), které tyto frontendové frameworky používají. Mimo jiné také obsahují řadu optimalizací, které výsledný kód rozdělují ([Webpack](webpack)) a umožňují ho tak načítat po částech. Mezi další optimalizace patří například minifikace CSS stylů a JS skriptů
* Knihovna React je sama o sobě zaměřena čistě na tvorbu UI, veškeré [React komponenty = JS funkce](https://reactjs.org/docs/introducing-jsx.html), s čímž je spojena celá řada výhod (na rozdíl od šablonovacích frameworků, kombinujících HTML s kódem). React je také dle týdenních statistik stažení (jakožto npm balíčku) nejrozšířenější knihovnou pro tvorbu UI (v porovnání např. s [Vue](https://vuejs.org/) nebo Angularem). Proto je pro tento kurz zvolena jako demonstrativní knihovna pro tvorbu frontendu
