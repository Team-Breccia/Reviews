const { Pool, Client } = require('pg');

const pool = new Pool({
  host: 'ec2-3-14-130-126.us-east-2.compute.amazonaws.com',
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