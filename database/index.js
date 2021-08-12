const { Pool, Client } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'junelee',
  password: 'mango',
  database: 'reviewsdata'
})


pool.on('error', (err, client) => {
  console.log(err)
});

pool.connect();

module.exports = pool;