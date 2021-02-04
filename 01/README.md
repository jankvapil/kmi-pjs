# Úvod do Platformy JS


## 1. Deklarace a definice Vanilla JS vs ES6+ 

Rozdíly v rozsahu platnosti a deklaracích / definicích proměnných (vazeb) a funkcí.

### Vanilla JS


```javascript
var x = 42

fn(x) // funkci lze volat před samotnou deklarací

function fn(x) {
  return x + 1
}

var x = 666 // var lze redeklarovat
 
///
/// co se stane? Ve scope se přepíše vazba fn 
///
function fn(x) {
  return x - 1
}
```

Ve funkcionálním programování se pro definice proměnných používá slovní spojení "vytvořit vazby mezi symboly (názvy proměnných) a hodnotami", což odpovídá přesněji následujícímu přístupu. Ve většině případů chceme zamezit nechtěnné redefinici a redeklaraci - proto preferujeme pro deklaraci vazeb použití const (neboli navázání hodnoty na konstantu). V případech, kdy záměrně chceme někdy v budoucnu vazby změnit, použijeme let. Var používat nebudeme.
### ECMAScript 6
```javascript
let x = 42
let x = 666   // error -> let nelze redeklarovat 
x = 666       // ok

fn(x)         // error -> funkce není deklarovaná

///
/// deklarace funkce jako navázání lambda výrazu na symbol fn
///
const fn = (x) => {
  return x + 1
}

///
/// error -> nelze redeklarovat
///
const fn = (x) => {
  return x + 1
}

fn = x  // error -> const nelze redefinovat
```


## 2. Funkce 

S funkcemi lze v JS manipulovat stejně jako s hodnotami (High-Order functions).

```javascript
///
/// lambda v jednom řádku vrací poslední vyhodnocený výraz 
///
const fn = (x) => 42 && 666 && x + 1   

console.log(fn(42))   // -> 43

///
/// funkce jako argumenty funkcí
///
const fn2 = (x, fn) => {
  return fn(x)
}

console.log(fn2(42, fn))  // -> 43

///
/// funkce jako návratové hodnoty
///
const fn3 = () => {
  return (x) => x + 1 
}

let res = fn3()
console.log(res)  // -> function

res = fn3()(42)   
console.log(res)  // -> 43
```

## 3. Objekty a pole

Složená data mohou být v JS realizována jako pole nebo objekty (JS objekt != JSON, uvidíme později). V čem je však práce s nimi občas zrádná a neintuitivní je jejich duplikace. Na následujících příkladech si ukážeme, jak k této problematice přistupovat. Uvažujme následující příklad:

```javascript
const person = {
  name: "John Doe",
  age: 42,
  children: [{name: "Amy"}, {name: "Lucas"}],
  greeting: () => "Hello, my name is John"
}

console.log(person)

const copy = person
copy.age = 666

console.log(copy)
console.log(person)
```

Proč mají oba věk 666? Zkopírovala se pouze reference na daný objekt, tudíž přiřazujeme novou hodnotu tomu samému objektu. 

Zkusme nyní využít tzv. **destrukturalizaci** (operátor ... ), která převede objekt na posloupnost párů <key, value> a vytvoří je jako nové hodnoty.

```javascript
const shallowCopy = {...person}
shallowCopy.age = 12

console.log(person)
console.log(shallowCopy)
```

Nyní se nám změna věku už projevila správně. Co když změníme jméno dítěte původního objeku? 

```javascript
shallowCopy.children[0].name = "David"

console.log(person)
console.log(shallowCopy)
```

Změna se provede i ve zkopírovaném objektu. Pomůže Object.assign? 

```javascript
const shallowCopy2 = Object.assign({}, person);
shallowCopy2.children[0].name = "Adam"

console.log(person)
console.log(shallowCopy2)
```

Jak vidíme, ani toto nám pro zanořené data nepomohlo. Jak tedy provést plnohodnotnou duplikaci objektu?

```javascript
const deepCopy = JSON.parse(JSON.stringify(person)) 
deepCopy.children[0].name = "Eve"

console.log(person)
console.log(deepCopy)
```

S využitím základních tříd a funkcí JS můžeme objekt převézt na řetězec znaků a z něj na JSON, čímž docílíme zkopírování všech zanořených datových struktur. Nyní si můžeme všimnout, že díky funkci JSON.parse jsme získali sice nový objekt, ale bez funkce greeting. To samé platí i pro víceřádkové stringy, které se nahradí znaky konce řádků, jelikož formát JSON víceřádkové řetězce nepodporuje.

```javascript
const str = JSON.parse(JSON.stringify({str: `Multi

  line`
}))

console.log(str) // -> { str: 'Multi\n\n  line' }
```

## Reference

Podrobnější výčet vlastností jazyka + příklady [zde](https://github.com/airbnb/javascript/blob/master/README.md).