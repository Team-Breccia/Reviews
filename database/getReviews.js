const pool = require('./database/index.js');

const getReviews = ({page, count, sort, product_id }, cb ) => {
  const id = [product_id];
  const queryString = 'SELECT * FROM WHERE review_id = $1'

  pool.query(queryString, id)
      .then((data) => {
        cb(null, data.rows)
      })
      .catch((err) => {
        console.log(err)
      })
      .then(() => {
        pool.end();
      })
}

module.exports = getReviews;