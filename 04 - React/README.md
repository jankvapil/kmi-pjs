
# React II

V této lekci se budeme zabývat aplikačním stavem v React aplikaci.

Minule jsme si zkusili vytvořit první API endpoint. K tomu nyní budeme v naší aplikaci přistupovat a zobrazovat načtená data v naší aplikaci pomocí React komponent.

Budeme potřebovat projekt z minulého cvičení (můžete si jej stáhnout v `"03 - React/src"`, pomocí příkazu `yarn` nainstalovat potřebné závislosti a zpustit webserver pomocí `yarn dev` v developmnet módu.)

## UseState

Prvním krokem bude představení Hooku UseState. Vytvořme proto novou komponentu `Counter`.

```
touch components/Counter.js
```

Do naší nové komponenty vložme následující kód, naimportujme komponentu v `pages/index.js` a vložme ji do nadřazené komponenty `Content`.

```javascript
///
/// My counter component
///
export default function Counter ({initValue}) {
  let cnt = initValue ? initValue : 0
  return (
    <div>
      <p>{cnt}</p>
      <button onClick={() => cnt++}>Add1</button>
    </div>
  )
}
```

Jak si můžeme všimnou, tak po kliknutí na tlačítko Add1 se nic nestane. Proměnná se sice inkrementuje, ale změna se nepromítne do View.

Aby se změna promítla do View, musíme o tom nějakým způsobem říct Reactu. K tomu slouží UseState Hook. První je třeba jej naimportovat (je součástí knihovny React). Nyní zavoláme funkci `useState` a jako parametr předáme inicializační hodnotu.

Funkce `useState` vrací Getter a Setter pro danou hodnotu. Ty navážeme na symboly `cnt` a `setCnt` následujícím způsobem. Pak akorát zaměníme obsluhu kliknutí a máme hotové funkční počítadlo.
 
```javascript
import { useState } from "react"

///
/// My counter component
///
export default function Counter ({initValue}) {
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

Dalším velmi používaným Hookem je UseEffect. Ten nám umožňuje dynamicky reagovat na změny stavu aplikace. 

Prvním typem změny stavu je načtení komponenty. Mezi importované funkce z knihoviny React přidejme funkci `useEffect`. Ta se volá s prvním parametrem jako callbackem (funkce, co se má vykonat, až se effekt vyvolá) a druhým parametrem jako polem závislých symbolů. Jestliže je pole závislých symbolů prázdné, zavolá se funkce pouze při načtení komponenty.

```javascript
import { useEffect, useState } from "react"

///
/// My counter component
///
export default function Counter ({ initValue }) {
  useEffect(() => {
    alert("I am loaded!")
  }, [])

  ...

}
```

Po znovunačtení úvodní stránky se nám pokaždé zobrazí vyskakovací okno s hláškou "I am loaded!".

Nyní změňme definici efektu tak, že do pole závislých symbolů přidáme symbol `cnt`. Ten musí být definován ještě před definicí daného efektu.

```javascript
  const [cnt, setCnt] = useState(initValue ? initValue : 0)
  useEffect(() => {
    alert("Cnt was increased!")
  }, [cnt])
}
```

Jak si můžeme všimnout, po každé změně hodnoty symbolu `cnt` se nám zobrazí vyskakovací okno s hláškou "Cnt was increased!" (Včetně samotné inicializace).


## Úkol

TODO