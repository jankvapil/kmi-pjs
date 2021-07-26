
///
/// Handles GET Users from database request
///
export default async (req, res) => {
  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./db.db"
    }
  })

  try {
    const users = await knex('users')
      .select("*")
    res.status(200).json(users)
  } catch(e) {
    res.status(400).json(e)
  } finally {
    knex.destroy()
  }
}