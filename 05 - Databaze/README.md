# Práce s databází

V této lekci se seznámíme se základními metodami práce s databází v rámci backendové části naší aplikace. Vytvoříme si blog s články, které budeme dynamicky načítat z databáze pomocí RESTového dotazu

V úvodu si shrneme několik přístupů, které se pro práci s databází používají


### ORM
* objekově relační mapování databázových entit
* poskytuje nejvyšší úroveň abstrakce při práci s databází
* lze mapovat celé tabulky, nebo pouze výsledky dotazů
* přináší rizika ve formě neefektivity dotazů (n+1 problem)

### Query/Schema buildery
* sjednocuje zápis dotazů a příkazů pomocí JS syntaxe (Knex)

### Raw SQL
* pomocí databázových driverů můžeme psát přímo SQL dotazy
* pro určité situace nevyhnutelné (optimalizace dotazů) 


### Database-First / Code-First

Přístupu práce s databází, kdy používáme již existující databázi říkáme Database-First přístup. Můžeme jít ale i opačným směrem a celou databázi vygenerovat pomocí kódu (neboli Code-First). Například v rámci platformy .NET se tento přístup často používá způsobem, že se vytvoří model databáze pomocí tříd a z něj se poté generují samotné databázové entity. Z jednotlivých úprav těchto tříd vznikají tzv. `migrace`. To jsou části kódu, které transformují databázové schéma do nové podoby

## SQLite

Pro účely této lekce použijeme předpřipravenou SQLite databázi s následující strukturou

```sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Users" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Posts" (
	"id"	INTEGER NOT NULL,
	"heading"	TEXT NOT NULL,
	"text"	TEXT,
	"authorId"	INTEGER NOT NULL,
	FOREIGN KEY("authorId") REFERENCES "Users",
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
```

Předpřipravenou databázi `db.db` zkopírujme z minulé lekce a vložme ji do kořenového adresáře našeho projektu

## Knex

Abychom mohli s databází pracovat, budeme potřebovat tyto 2 knihovny - `sqlite3` a `knex`

```
yarn add sqlite3 knex
```

Vytvořme nyní soubor `pages/api/users.js`, do kterého vložíme následující kód:

```javascript
///
/// Handles GET Users from database request
///
export default async (req, res) => {
  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./db.db"
    }
  })

  try {
    const users = await knex('users')
      .select("*")
    res.status(200).json(users)
  } catch(e) {
    res.status(400).json(e)
  } finally {
    knex.destroy()
  }
}
```

Knihovna Knex nám vytváří spojení s SQLite databází. Předáváme jí objekt, kde definujeme typ databáze a umístění. Jelikož se jedná o lokální databázi, nic jiného není potřeba definovat

K databázi přistupujeme přes funkci knex, které předáváme jako parametr název tabulky, se kterou chceme pracovat. Dále pak nad ní voláme další funkce - například `select` s parametrem `*`

Jak bychom určitě dokázali uhádnout, po zavolání této funkce se vytvoří a vykoná tento SQL dotaz:

```sql
SELECT * FROM users
```

Tomuto přístupu, kdy pomocí objektů a funkcí formujeme databázové dotazy se říká "Query building". Dále máme možnost využít například ORM knihoven, ke kterým se dostaneme v příštím semináři

Když zkusíme v prohlížeči zadat adresu http://localhost:3000/api/users, měl by nám server vrátit následující JSON:

```json
[
  {"id":1,"username":"admin"},
  {"id":2,"username":"john"},
  {"id":3,"username":"alex"},
  {"id":4,"username":"david"},
  {"id":5,"username":"kate"}
]
```

Jelikož už máme předešlý request ošetřen výjimkou, kdybychom změnili název tabulky `users` na `user`, vrátilo by se nám:

```json
{"errno":1,"code":"SQLITE_ERROR"} 
```

Na to pak můžeme na frontendu reagovat například uživatelskou notifikací

## Frontend

Pojďme nyní vytvořit další stránku `pages/users.js`, kde budeme načtené uživatele zobrazovat

První si však zkusme pomocí hooku useEffect uživatele vůbec načíst

```javascript
import { useEffect } from "react"
import Content from '../components/common/Content'

export default function Users() {
  useEffect(async () => {
    const res = await fetch('api/users')
    const data = await res.json()
    console.log(data)
  }, [])

  return (
    <Content>
      <h1>Users</h1>
    </Content>
  )
}
```

Když si otevřeme vývojářské nástroje ve webovém prohlížeči (typicky pomocí F12), po načtení http://localhost:3000/users se nám v konzoli vypíše pole uživatelů

## Generování komponent

Nahraďme nyní useEffect hookem useSWR, podobně jako na stránce `pages/btc.js`. Dále pak vytvořme seznam, do kterého namapujeme načtené uživatele tímto způsobem:

```javascript
import useSWR from "swr"
import Content from '../components/common/Content'

export default function Users() {
  const { data, error } = useSWR(
    "api/users",
    url => fetch(url).then(res => res.json())
  )

  if (error) return "An error has occurred."
  if (!data) return "Loading..."

  return (
    <Content>
      <h1>Users</h1>
      <ul>
        {data.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </Content>
  )
}
```

Když se zaměříme na samotnou položku seznamu, všimněme si vlastosti `key`. Ta je nezbytná pro jakékoliv seznamy, tabulky a další generované komponenty. Jestliže se změní obsah - například v jedné buňce tabulky, React bude přesně vědět, co se změnilo, a může tak zařídit efektivní překreslení. Klíč tedy z podstaty věci musí být unikátní a pro danou položku neměnný (není tedy vhodné používat například index v poli jako klíč)

## Přidání uživatele

V poslední části této lekce si zkusíme vytvořit komponentu `components/AddUserForm.js` pro přidání nového uživatele

```javascript
import { useState } from "react"

///
/// Add User Form component
///
export default function AddUserForm() {
  const [username, setUsername] = useState("")

  ///
  /// Handles onChange event 
  ///
  const handleOnChange = (e) => {
    const input = e.target.value
    setUsername(input)
  }
  
  return (
    <div>
      <input value={username} onChange={handleOnChange}/>
    </div>
  )
}
```

Takto vyřešíme změnu stavu pro `input` element. Dále budeme potřebovat ještě tlačítko, kterým potvrdíme přidání nového uživatele. Jako první ale potřebujeme upravit endpoint `pages/api/users` naší API tak, aby přijímal POST request, v jehož těle bude uživatelské jméno nového uživatele

```javascript
///
/// Creates connection to DB
///
const createConn = () => {
  return require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./db.db"
    }
  })
}

///
/// Handles Users REST requests
///
export default async (req, res) => {
  if (req.method === "GET") {
    const knex = createConn()
    try {
      const users = await knex('users')
        .select("*")
      res.status(200).json(users)
    } catch(e) {
      res.status(400).json(e)
    } finally {
      knex.destroy()
    }
  } 
  else if (req.method === "POST") {
    if (req.body.username) {
      const knex = createConn()
      try {
        const username = req.body.username
        const newUsersIds = await knex('users')
          .insert({ username })
        res.status(200).json(newUsersIds)
      } catch(e) {
        res.status(400).json(e)
      } finally {
        knex.destroy()
      }
    }
  }
}
```
Tímto způsobem jsme rozšířili naše RESTové API, kde reagujeme na dva typy requestů v rámci jednoho endpointu

Nyní se vraťme k obsluze kliknutí na tlačítko pro přídání nového uživatele

```javascript

import { useState } from "react"

///
/// Add User Form component
///
export default function AddUserForm() {
  const [username, setUsername] = useState("")

  ///
  /// Handles onClick event 
  ///
  const handleOnClick = async () => {
    const res = await fetch(`api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    if (res.ok) {
      alert("User has been added into DB!")
    } else {
      alert("User can not be inserted into DB!")
    }
  }

  ///
  /// Handles onChange event 
  ///
  const handleOnChange = (e) => {
    const input = e.target.value
    setUsername(input)
  }
  
  return (
    <div>
      <input value={username} onChange={handleOnChange}/>
      <button onClick={handleOnClick}>Add User</button>
    </div>
  )
}
```