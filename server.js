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
  let queryString = `select reviews.id, product_id, rating, date, summary, body, recommend, reviewer_name, helpfulness,
    array_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) as photos FROM reviews
    inner join reviews_photos on reviews.id = review_id
  where product_id=${id}
  group by reviews.id
  ${sort}
  limit ${count}
  offset ${count * page - count}`;
  pool.query(queryString, (err, data) => {
    if (err) {
      console.log(err)
    }
    let resultObj = {
      "product": JSON.stringify(id),
      "page": page,
      "count": count,
      "results": data.rows
    }
    console.log(resultObj)
    res.send(resultObj)
  })
})

/*
array_agg(jsonb_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) as photos FROM reviews left join reviews_photos on reviews.id = review_id
*/





app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



