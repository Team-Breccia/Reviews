const express = require('express');
const app = express();
const path = require('path');

app.use(express.json())
app.use(express.static(path.join(__dirname, '.')))

const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello Hello')
})

app.get('/reviews/:product_id', (req, res) => {
  console.log(req.params.product_id)
  console.log('reviews/1 get request')
  res.send(req.params.product_id)
})

app.get('/reviews/:product_id/:page?/:count?/:sort', (req, res) => {
  console.log(req.params)
})





app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});



