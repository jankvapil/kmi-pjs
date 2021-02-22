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
