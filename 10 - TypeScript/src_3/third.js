
/**
 * @typedef {import("./types").User} User
 */

/**
 * @param {User} input  
 */
function printUser(input) {
  console.log(`${input.username}`)
}

/**
 * @type {User}
 */
const user = {
  id: 1,
  username: 'John'
}

printUser(user)