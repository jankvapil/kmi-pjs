
///
/// Creates connection to DB
///
const createConn = () => {
  return require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./db.db"
    }
  })
}

///
/// Handles Users REST requests
///
export default async (req, res) => {
  if (req.method === "GET") {
    const knex = createConn()
    try {
      const users = await knex('users')
        .select("*")
      res.status(200).json(users)
    } catch(e) {
      res.status(400).json(e)
    } finally {
      knex.destroy()
    }
    return
  } 
  else if (req.method === "POST") {
    if (req.body.username) {
      const knex = createConn()
      try {
        const username = req.body.username
        const newUsersIds = await knex('users')
          .insert({ username })
        res.status(200).json(newUsersIds)
      } catch(e) {
        res.status(400).json(e)
      } finally {
        knex.destroy()
      }
      return
    }
  } 
  res.status(400).json({error: "BAD REQUEST"})
}