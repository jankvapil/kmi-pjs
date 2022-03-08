
import { User } from './types'

function printUser(input: User) {
  console.log(`${input.username}`)
}

const user: User = {
  id: 1,
  username: "John"
}

printUser(user)
