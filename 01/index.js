

/////////////////////////////////////////

/// 1. deklarace a definice vanilla JS (var, function) vs ES6+ (let, const)

/////////////////////////////////////////


// klasická deklarace proměnné
var x = 42

console.log(fn(x)) 

///
/// klasická deklarace + definice funkce
///
function fn(x) {
  return x + 1
}

// redefinice a redeklarace

var x = 666 

///
/// co se stane? Ve scope se přepíše vazba fn 
///
function fn(x) {
  return x - 1
}

///////////////////////////////////////////

let x = 42
let x = 666   // error -> let nelze redeklarovat 
x = 666       // ok

console.log(fn(x))  // error -> funkce není deklarovaná

///
/// deklarace funkce jako navázání lambdy na symbol fn
///
const fn = (x) => {
  return x + 1
}

console.log(fn(x))  // ok -> 667

///
/// error: nelze redeklarovat
///
const fn = (x) => {
  return x + 1
}

fn = x  // error -> const nelze redefinovat


///////////////////////////////////////////

/// 2. funkce 

/////////////////////////////////////////


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


/////////////////////////////////////////

/// 3. objekty

/////////////////////////////////////////


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

// proč mají oba věk 666? Zkopírovala se pouze reference

const shallowCopy = {...person}
shallowCopy.age = 12

console.log(person)
console.log(shallowCopy)

// co když změníme jméno dítěte původního objeku? Změna se provede i ve zkopírovaném objektu

shallowCopy.children[0].name = "David"
console.log(person)
console.log(shallowCopy)

// pomůže Object.assign? 

const shallowCopy2 = Object.assign({}, person);
shallowCopy2.children[0].name = "Adam"

console.log(person)
console.log(shallowCopy2)

// jak tedy provést plnohodnotnou duplikaci objektu?

const deeCopy = JSON.parse(JSON.stringify(person)) 
deeCopy.children[0].name = "Eve"
console.log(person)
console.log(deeCopy)
