
# REST

V minulých lekcích jsme si zkoušeli vytvořit jednoduché RESTové API. Dnes si představíme nástroje, které nám tvorbu RESTových API výrazně zjednodušší.

V úvodu si shrneme několik přístupů, které se pro práci s databází používají

### ORM
* objekově relační mapování databázových entit
* poskytuje největší úroveň abstrakce při práci s databází
* lze mapovat celé tabulky, nebo pouze výsledky dotazů
* přináší rizika ve formě neefektivity dotazů (n+1 problem)

### Query/Schema buildery
* sjednocuje zápis dotazů a příkazů pomocí JS syntaxe (Knex)

### Raw SQL
* pomocí databázových driverů můžeme psát přímo SQL dotazy
* pro určité situace nevyhnutelné (optimalizace dotazů) 


## Prisma

* umožňuje generovat databázi pomocí SDL
* umožňuje interspekcí načíst databázové schéma, na základě kterého vygeneruje API
* TODO

# GraphQL

[GraphQL](https://graphql.org/) je dotazovací jazyk nad určitým datovým zdrojem. Používá dvě základní operace - query (vrací data), mutace (změna v datech)

* GraphQL API obsluhuje jediný endpoint `/graphql`
* pro všechna data, která chceme vystavit v rámci GraphQL API, budujeme resolvery (funkce vracející data z DB)
* schéma API tvoří typy (např. typ User)
* resolveru pak můžeme předat parametry daného typu, které chce vrátit

```gql
query {
  users {
    id
    name
  }
}
```

* zřejmě největší výhodou oproti RESTu je možnost načítat všechna potřebná data v jednom requestu. Také je možnost jednoduše parametrizovat dotaz pomocí nejrůznějších restrikcí (where, order by, limit)

* další zajímavou vlastností GraphQL je evolving. Ten umožňuje snadno rozšiřovat stávající schéma API o nové atributy bez toho, aniž bychom museli vytvářet novou verzi endpointu (jak tomu je u RESTu)

## Prisma pro GraphQL

* podobně jako v případě REST API lze pomocí nástroje Prisma generovat i GraphQL API.

## Hasura





