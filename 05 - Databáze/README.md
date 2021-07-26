# Práce s databází

V této lekci se seznámíme se základními metodami práce s databází v rámci serverové části naší aplikace. Vytvoříme si blog s články, které budeme dynamicky načítat z databáze pomoci API requestu.

## SQLite

Pro demonstraci použijeme předpřipravenou SQLite databázi s následující strukturou. 

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

Předpřiravenou databázi `db.db` vložme do kořenového adresáře našeho projektu.

## Knex

Abychom mohli s databází pracovat, budeme potřebovat tyto 2 knihovny - `sqlite3` a `knex`.

```
yarn add sqlite3 knex
```

Vytvořme nyní soubor `api/users.js`, do kterého vložíme následující kód:

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

Knihovna knex nám vytváří spojení s SQLite databází. Předáváme jí objekt, kde definujeme typ databáze a umístění. Jelikož se jedná o lokální databázi, nic jiného není potřeba definovat. 

K databázi přistupujeme přes funkci knex, které předáváme jako parametr název tabulky, se kterou chceme pracovat. Dále pak nad ní voláme další funkce - například select s parametrem `*`

Jak bychom si dokázali tipnout, po zavolání této funkce se vytvoří a vykoná tento SQL dotaz:

```sql
SELECT * FROM users
```

Tomuto přístupu, kdy pomocí objektů a funkcí formujeme databázové dotazy se říká "Query building". Dále máme možnost využít například ORM knihoven, ke kterým se dostaneme později.

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

Na to pak můžeme na frontendu reagovat například uživatelskou notifikací.

## Frontend

Pojďme nyní vytvořit další stránku, kde budeme načtené uživatele zobrazovat...

## Úkol

napsat skripty pro

* výpis všech zaměstnanců, vložení nového změnestnance a smazání konkrétního zaměstnance
