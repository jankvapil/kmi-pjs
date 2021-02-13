# JavaScript Platform Course

Cílem této diplomové práce je vytvoření kurzu zaměřeného na platformu JavaScript, který by bylo možné zařadit do studijního plánu navazujícího magisterského programu Aplikovaná informatika. Kurz by měl být zaměřen na moderní použití JavaScript technologií. Součástí práce je i příprava veškerých studijních materiálů slidů, skript a řešených příkladů.

## Obsah kurzu

1. Úvod do JS, (opakování) syntaxe ES6+, vlastnosti jazyka, funkcionální přístup, práce s datavými strukturami
2. Node.js (balíčky, package.json, npm), praktikcé použití asynchronních funkcí - načítání dat z API (Fetch API, Axios)
3. Serverside JavaScript - Express.js, Socket.io
4. Připojení k databázi, načítání dat (SQL query builder - Knex)
5. ORM (Prisma), automatické generování API
6. Tvorba vlastní API (REST, GraphQL)
7. Možnosti (a limity) prohlížečů, DOM, Server-side vs Client-side rendering 
8. React (funkcionální komponenty a jejich kompozice, hooky, routování), Next.js
9. Nástroje pro vývoj frontendu - typy (Typescript, Flow, JSDoc), imutabilní datové struktury (Immutable.js), state management (Redux), 
10. ClojureScript
11. Electron (úprava + zabalení aplikace pro desktop)
12. React Native (Android / iOS) - minimalizace klientské aplikace pro mobilní zařízení, React Native Windows + macOS (alternativa k .Net WPF, JavaFX..)

## FAQ ohledně kurzu


### Co znamená platforma JavaScript?

* [Historie JS](https://youtu.be/Sh6lK57Cuk4) sahá do poloviny 90. let, kdy postupně vzniklo několik prototypů univerzálního jazyka pro webové prohlížeče. Z těch pak vychází standardizovaná specifikace jazyka JS známá jako ECMAScript. V roce 2009 bylo uvedeno běhové prostředí Node.js, které se stalo určitou platformou pro tvorbu aplikací a na které mohou být zároveň hostované jiné jazyky a technologie.

### JavaScript je obecně vnímán jako špatný jazyk, proč se jím tedy hlouběji zabývat?

* JS je skutečně špatný jazyk ve smyslu, že existuje spousta [pastí](https://youtu.be/et8xNAc2ic8), do kterých se nezkušený JS programátor může dostat (zejména díky slabým dynamickým typům promenných nebo užívání dvojího rozsahu platnosti). 
* Má však ale mnoho zajímavých vlastností a při dodržování určitých dobrých programátorských praktik v něm lze programovat efektivně. Dle statistik GitHubu je nejrozšířenějším programovacím jazykem vůbec a také má bezpochyby největší open-source zázemí. Na prohlížeč lze navíc nahlížet též jako na určitou platformu, která nám poskytuje API k systémovým zdrojům.

### Kde se JS nevyhneme?

* Při tvorbě interaktivních webových aplikací, které budou pracovat s DOM prohlížeče na klientské straně.

### Kde je vhodné zvážit použití právě JS technologií?

* Pro rychlé prototypování aplikací, levné a dostupné řešení pro malé projekty / startupy, kde chceme použít jeden jazyk na klientu i na serveru.

### Co je cílem kurzu?

* Seznámit se s použitím JS technologií na klientu i na serveru, vytvořit v průběhu kurzu vlastní informační systém (klientskou aplikaci + serverové API).


