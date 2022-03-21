import fpTs from 'https://cdn.skypack.dev/fp-ts/lib/function'

const { flow } = fpTs

const add1 = (x: number) => x + 1
const pow2 = (x: number) => x * x

flow(add1, pow2, console.log)(41)
