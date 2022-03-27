require('dotenv').config()
const { MongoClient } = require('mongodb')

const user = process.env.USER
const pass = process.env.PASS
const conStr = `mongodb+srv://${user}:${pass}@test-db.bzwip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(conStr)

const main = async () => {
  try {
    await client.connect()
    const res = await client.db("test").collection("test").insertMany([
      {id: 2, value: "second"},
      {id: 3, value: "third", note: "additional note"},
    ])
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

main()