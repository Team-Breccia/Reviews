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

app.get('/reviews', (req, res) => {
  console.log(req.query)
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = req.query.sort || 'newest';
  if (sort === 'newest') {
    sort = 'order by date'
  }
  if (sort === 'helpful') {
    sort = 'order by helpfulness'
  }
  if (sort === 'relevant') {
    sort = 'order by ???'
  }
  console.log(sort)

  const id = parseInt(req.query.product_id)
  let queryString = `SELECT * FROM reviews where product_id=${id}`;
  pool.query(queryString, (err, data) => {
    console.log(data.rows)
    res.send(data.rows)
  })
})






app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



