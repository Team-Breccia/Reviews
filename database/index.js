const { pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 3000,
  user: 'junelee',
  password: 'mango',
  database: 'reviews'
})

pool.on('error', (err, client) => {
  console.log(err)
});

pool.connect();