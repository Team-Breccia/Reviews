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
    sort = 'ORDER BY date'
  }
  if (sort === 'helpful') {
    sort = 'ORDER BY HELPFULNESS'
  }
  if (sort === 'relevant') {
    sort = 'ORDER BY HELPFULNESS, date'
  }

  const id = parseInt(req.query.product_id)
  let queryString = `select id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, helpfulness,
    (select array_to_json(array_agg(reviews_photos))) from (select reivews.photos.id, url from reviews_photos left join reviews on reviews.id = review_id)

  from reviews where product_id=${id} ${sort} limit ${count} offset ${count * page - count}`;
  pool.query(queryString, (err, data) => {
    console.log(data.rows)
    res.send(data.rows)
  })
})






app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



