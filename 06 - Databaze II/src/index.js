require('dotenv').config()
const { MongoClient } = require('mongodb')

const user = process.env.USER
const pass = process.env.PASS
const conStr = `mongodb+srv://${user}:${pass}@test-db.bzwip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(conStr)

const main = async () => {
  try {
    await client.connect()
    console.log("Connected!")
  } catch (err) {
    console.error(err)
  }
}

main()