const mysql = require('mysql')
require('dotenv').config()
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  timezone: process.env.timezone
})

connection.connect((error) => {
  if (error) {
    throw error
  }
  console.log('You are now connection')
})

module.exports = connection
