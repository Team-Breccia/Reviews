const express = require('express');
const app = express();
const path = require('path');
const pool = require('./database/index.js')



app.use(express.json())
app.use(express.static(path.join(__dirname, '.')))

const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello Hello')
})

app.get('/reviews/:product_id', (req, res) => {
  const id = parseInt(req.params.product_id)
  let queryString = `SELECT * FROM reviews where id=${id}`;
  pool.query(queryString, (err, data) => {
    console.log(data.rows[0])
    res.send(data.rows[0])
  })
})






app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



