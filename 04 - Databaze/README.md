# Práce s databází

## SQLite

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


