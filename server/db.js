require('dotenv').config()
const Pool = require("pg").Pool;

const db = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.PORT,
  port: 5432,
  database: "catroulette"
})

module.exports = db;