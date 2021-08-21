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
  let queryString = `select reviews.id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
    array_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) as photos FROM reviews
    left join reviews_photos on reviews.id = review_id
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
    res.send(resultObj)
  })
})

app.get('/reviews/meta', (req, res) => {

  const product_id = parseInt(req.query.product_id)

  const ratingQuery = `select count(rating) as "5",
  (select count(rating) as "4" from reviews where product_id=${product_id} and rating = 4),
  (select count(rating) as "3" from reviews where product_id=${product_id} and rating = 3),
  (select count(rating) as "2" from reviews where product_id=${product_id} and rating = 2),
  (select count(rating) as "1" from reviews where product_id=${product_id} and rating = 1)
  from reviews where product_id = ${product_id} and rating = 5`;


  const characteristicsQuery = `select name, id,
  (select avg(value) from characteristics_reviews where characteristics_id = characteristics.id) as average from characteristics where product_id = ${product_id}`;

  const recommendQuery = `select count(recommend) as true, (select count(recommend) as false from reviews where product_id = ${product_id} and recommend = false) from reviews where product_id = ${product_id} and recommend = true`;


  pool.query(ratingQuery, (err, data) => {
    let ratings = data.rows[0]
    pool.query(characteristicsQuery, (err, data) => {
      let characteristics = data.rows
      characteristicsTransform = {};
      characteristics.forEach((item) => {
        characteristicsTransform[item.name] = {id: item.id, value: item.average};
      })
      pool.query(recommendQuery, (err, data) => {
        let recommend = data.rows[0]
        let result = {
          "product_id": JSON.stringify(product_id),
          "ratings": ratings,
          "recommended": recommend,
          "characteristics": characteristicsTransform
        }
        res.send(result)
      })
    })
  })
})

app.post('/reviews', (req, res) => {
  const product_id = parseInt(req.body.product_id)
  const rating = req.body.rating
  const summary = req.body.summary
  const body = req.body.body
  const recommend = req.body.recommend
  const reviewer_name = req.body.reviewer_name
  const reviewer_email = req.body.reviewer_email
  const photos = req.body.photos
  const characteristics = req.body.characteristics
  const reported = req.body.report || false
  const date = 'NOW()'
  const response = req.body.response || null
  const helpfulness = req.body.response || 0
  const keys = Object.keys(characteristics)
  const value = Object.values(characteristics)



  let values = [product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos, keys, value]



  let bodyString = `with review as (
    insert into reviews (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    returning id
    ),
  photo as (
    insert into reviews_photos (review_id, url)
    select id,
    unnest(($11)::text[])
    from review
  )
  insert into characteristics_reviews (review_id, characteristics_id, value)
  select id,
  unnest(($12)::int[]),
  unnest(($13)::int[])
  from review`





  pool.query(bodyString, values)
      .then((data) => {
        res.status(201).send('post worked booooo')
      })
      .catch((error) => {
        console.log(error)
      })
})


app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;

  let paramString = `update reviews set helpfulness = helpfulness + 1 where id =${review_id}`;

  pool.query(paramString, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data)
    res.send(data)
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;

  let paramString = `update reviews set reported = true where id=${review_id}`;

  pool.query(paramString, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(err);
    res.send(data)
  })
})




app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



