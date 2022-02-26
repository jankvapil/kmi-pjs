# Nerelační databázové systémy

Protikladem ke klasické koncepci relačních databázových modelů máme v současné době stále rozrůstající se počet alternativních databázových paradigmat. Mezi ty patří například key/value, dokumentové nebo grafové modely databázových systémů

## MongoDB

Jedním z nejpopulárnějších alternativ klasického relačního databázového modelu je právě dokumentový, jehož zástupcem pro tento kurz bude právě [MongoDB](https://youtu.be/-bt_y4Loofg)

Výhodou tohoto modelu je jeho jednoduchost, snadná škálovatelnost a robustnost. Na druhou stranu nepodporuje některé z typických vlastností pro relační databázový model (např. použití jazyka SQL, triggerů nebo procedur)

![převzato z https://www.michalbialecki.com/en/2018/03/16/relational-vs-non-relational-databases/](https://www.michalbialecki.com/wp-content/uploads/2018/03/MongoDB-nosql-vs-msql-relational-codewave-insight_lzzufm-900x480.jpg)



## SQLite

- TODO: přesunout do lekce 5, přidat migrace

Pro demonstraci použijeme předpřipravenou SQLite databázi s následující strukturou

```sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Department" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"city"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Job" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Employee" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"jobId"	INTEGER NOT NULL,
	"salary"	NUMERIC NOT NULL,
	"depId"	INTEGER NOT NULL,
	FOREIGN KEY("depId") REFERENCES "Department"("id"),
	FOREIGN KEY("jobId") REFERENCES "Job"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
```

## Knex

```
yarn add sqlite3 knex
```

Vytvořme nyní soubor `index.js`, do kterého vložíme následující kód:

```javascript
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.db"
  }
})

const getEmployees = async () => {
  const res = await knex('employee')
    .select("*")
  console.log(res)
  knex.destroy()
}

getEmployees()

```

Po spuštění `yarn start` se nám vypíše obsah tabulky `employee`.

. . .

## Migrace

Pomocí příkazu `npx knex init` vytvoříme `knexfile.js` a následně jej upravíme tak, aby odkazoval na naši testovací databázi:

```javascript
development: {
  client: 'sqlite3',
  connection: {
    filename: './db.db'
  }
}
```

. . .


Pro práci s databází je nezbytné si udržovat informace o provedených strukturálních změnách, k čemuž slouží migrace. Nyní si můžeme vytvořit první migraci následujícím příkazem, který nám vytvoří složku `migrations` spolu s první migrací.

```
npx knex migrate:make first
```



## Úkol

napsat skripty pro

* výpis všech zaměstnanců, vložení nového změnestnance a smazání konkrétního zaměstnance
