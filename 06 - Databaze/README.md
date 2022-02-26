# Nerelační databázové systémy

Protikladem ke klasické koncepci relačních databázových modelů máme v současné době stále rozrůstající se počet alternativních databázových paradigmat. Mezi ty patří například key/value, dokumentové nebo grafové modely databázových systémů

## MongoDB

Jedním z nejpopulárnějších alternativ klasického relačního databázového modelu je právě dokumentový. Jeho zástupcem pro tento kurz bude právě [MongoDB](https://youtu.be/-bt_y4Loofg), které používá dokumenty podobné formátu JSON a kvůli skvělé integraci s Node.js je proto vhodným kandidátem

Výhodou tohoto modelu je jeho jednoduchost, rychlost, robustnost a snadná škálovatelnost - vertikální (rychlejší hardware, více paměti), tak i horizontální (více distribuovaných databází běžících zároveň). Na druhou stranu nepodporuje některé z typických vlastností pro relační databázové systémy (např. použití jazyka SQL, triggerů nebo procedur)

![převzato z https://www.michalbialecki.com/en/2018/03/16/relational-vs-non-relational-databases/](https://www.michalbialecki.com/wp-content/uploads/2018/03/MongoDB-nosql-vs-msql-relational-codewave-insight_lzzufm-900x480.jpg)

### MongoDB Community Server

Podobně jako u relačních databází jako MySQL nebo PostgreSQL je možné i MongoDB rozběhnout lokálně na svém PC. Nicméně na rozdíl od SQLite už je třeba nějaký čas věnovat samotnému zprovoznění tohoto databázového [serveru](https://www.mongodb.com/try/download/community) a MongoDB Shellu ([mongosh](https://docs.mongodb.com/mongodb-shell/))

### MongoDB v Dockeru

Další možností je stáhnout a spustit si předpřipravený kontejner, na kterém běží MongoDB přímo v [Dockeru](https://www.docker.com/)

### MongoDB Atlas

V případě, že chceme použít plně spravované cloudové řešení, nejjednodušší možností je zaregistrovat se na portálu [Atlas](https://www.mongodb.com/cloud/atlas/register), kde poskytují možnost zdarma si vytvořit účet spolu s databází

Pro účely tohoto semináře bude nutné zprovoznit jednu z těchto variant

## TSDB a časové řady

V době masivně rozšiřujícího se IoT bylo třeba přizpůsobit i možnosti ukládání obrovských objemů dat z nejrůznějších senzorů. To samé například platí i pro nástroje monitorující pohyb cen akcií, kryptoměn a dalších finančních instrumentů

K tomu slouží TSDB neboli time series databases. Ty jsou optimalizované pro ukládání velkých objemů dat, kde hodnoty jsou asosiovány s časovým razítkem, kdy byly tyto data pořízeny. Typickým zástupcem je například [InfluxDB](https://docs.influxdata.com/influxdb/v2.1/get-started/). Pro účely dnešního kurzu si však vystačíme s MongoDB

