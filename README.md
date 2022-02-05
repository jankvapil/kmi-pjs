# JavaScript Platform Course

Cílem této diplomové práce je vytvoření kurzu zaměřeného na platformu JavaScript, který by bylo možné zařadit do studijního plánu navazujícího magisterského programu Aplikovaná informatika. Kurz by měl být zaměřen na moderní použití JavaScript technologií. Součástí práce je i příprava veškerých studijních materiálů slidů, skript a řešených příkladů.

## Obsah kurzu

1. Úvod do JS, (opakování) syntaxe ES6+, vlastnosti jazyka, funkcionální přístup, práce s datavými strukturami
2. Node.js (balíčky, package.json, npm), praktikcé použití asynchronních funkcí - načítání dat z API (Axios), Vytvoření webového serveru (Express.js)
3. React - funkcionální komponenty a jejich kompozice, Next.js
4. React - aplikační stav a side efekty (useState, useEffect), Styly
5. Připojení k databázi, načítání dat (SQL query builder - Knex)
6. React - UI komponenty (React-Bootsrap, DevExtreme)
7. Automatické generování API, ORM (Prisma), GraphQL (Hasura)
8. GraphQL subscriptions (real-time události z GraphQL serveru)
9. Možnosti (a limity) prohlížečů, DOM, Server-side vs Client-side rendering, Užitečné nástroje pro vývoj v JS (statické typy, immutabilní datové struktury, state management..) 
10. ClojureScript
11. Electron (úprava + zabalení aplikace pro desktop)
12. React Native (Android / iOS) - minimalizace klientské aplikace pro mobilní zařízení, React Native Windows + macOS (alternativa k .Net WPF, JavaFX..)

## FAQ ohledně kurzu

### Co je cílem kurzu?

* Seznámit se s použitím JS technologií na klientu i na serveru, 
* Vytvořit v průběhu kurzu netriviální projekt, pokrývající alespoň 3 z probraných témat. Bude tedy možnost technologického zaměření dle preferencí studenta. 

### Jaké jsou předpoklady k absolvování kurzu?

* Je nutné ovládat alespoň základy JS + základní zkušenosti s tvorbou webových aplikací.
* Preferovaný editor [VSCode](https://code.visualstudio.com/), linuxová konzole (MINGW pro Windows - součást instalace Gitu).
* Znalost [Gitu](https://git-scm.com/) výhodou.

### Co znamená platforma JavaScript?

* [Historie JS](https://youtu.be/Sh6lK57Cuk4) sahá do poloviny 90. let, kdy postupně vzniklo několik prototypů univerzálního jazyka pro webové prohlížeče. Z těch pak vychází standardizovaná specifikace jazyka JS známá jako ECMAScript. 

* V roce 2009 bylo uvedeno běhové prostředí Node.js, které se stalo určitou platformou pro tvorbu aplikací a na které mohou být zároveň hostované jiné jazyky a technologie. Na prohlížeč lze navíc nahlížet též jako na určitou platformu, která nám poskytuje API k systémovým zdrojům.

### JavaScript je obecně vnímán jako špatný jazyk, proč se jím tedy hlouběji zabývat?

* JS je skutečně špatný jazyk ve smyslu, že existuje spousta [pastí](https://youtu.be/et8xNAc2ic8), do kterých se nezkušený JS programátor může dostat (zejména díky slabým dynamickým typům nebo užívání dvojího rozsahu platnosti). 

* Má však ale mnoho zajímavých vlastností a při dodržování určitých dobrých programátorských praktik v něm lze programovat efektivně. Dle statistik GitHubu je nejrozšířenějším programovacím jazykem vůbec a také má bezpochyby největší open-source zázemí.

### Kde se JS nevyhneme?

* Při tvorbě interaktivních webových aplikací, které budou pracovat s DOM prohlížeče na klientské straně.

### Kde je vhodné zvážit použití právě JS technologií?

* Pro rychlé prototypování aplikací, levné a dostupné řešení (nejen) pro malé projekty / startupy, kde chceme použít jeden jazyk na klientu i na serveru.

### Proč k tvorbě UI právě knihovna React?

* Otázka by se dala zobecnit - proč vlastně používat jakoukoliv knihovnu pro tvorbu frontendu? Důvodů je hned několik. V dřívějších dobách, kdy se API prohlížečů velmi lišilo, bylo nutné sjednotit a zjednodušit práci s DOMem. S řešením přišla knihovna [jQuery](https://jquery.com/), která kromě sjednocení rozdílných funkcionalit prohlížečů usnadnila také práci s asynchronními požadavky (AJAX) nebo CSS selektory. Stala se tak jakousi náhradou Vanilla JavaScriptu.
* Zlomovým bodem bylo vydání JS standardu ES6, kde přišla řada nových vlastností jazyka (včetně podpory práce s asynchronními requesty). Spolu s příchodem frontendových frameworků typu Angular nebo React pak vývoj frontendu dostal úplně nový rozměr. Zásadní změnou je komponentový přístup, kdy máme daleko rozsáhlejší možnosti, co se týče rozdělování kódu do jednotlivých komponent (modulů).
* Pro zachování kompatibility se staršími prohlížeči, podporující starší verze ECMAScriptu vznikly transpilery (typu [Babel](https://babeljs.io/)), které tyto frontendové frameworky používají. Mimo jiné také obsahují řadu optimalizací, které výsledný kód rozdělují ([Webpack](webpack)) a umožňují ho tak načítat po částech. Mezi další optimalizace patří například minifikace CSS stylů a JS skriptů.
* Knihovna React je sama o sobě zaměřena čistě na tvorbu UI, veškeré [React komponenty = JS funkce](https://reactjs.org/docs/introducing-jsx.html), s čímž je spojena celá řada výhod (na rozdíl od šablonovacích frameworků, kombinujících HTML s kódem). React je také dle týdenních statistik stažení (jakožto npm balíčku) nejrozšířenější knihovnou pro tvorbu UI (v porovnání např. s Vue nebo Angularem). Proto je pro tento kurz zvolena jako demonstrativní knihovna pro tvorbu frontendu.

### Příklady projektů

#### backend projekt
- distribuovaný systém psaný v Node.js 
- uzly komunikují pomocí messagingové knihovny ZMQ
- uchovávají konzistentní data

#### fronedend projekt
- webová aplikace v Reactu
- používající GraphQL pro komunikaci s API
- s využitím state management knihoven (Redux)

#### desktop projekt
- desktopová aplikace v Electronu
- načítá soubory v .csv formátu
- ukládá načtené data do vzdálené databáze

#### mobilní projekt
- mobilní klient v React Native
- načítá z RESTové API data o počasí
- zobrazuje předpověď v grafu
