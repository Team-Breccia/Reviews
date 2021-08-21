const app = require('../server.js');
const axios = require('axios');

test('server is running', () => {
  axios.get('localhost:3000')
    .then((res) => {
      expect(res).toBeDefined()
    })
    .catch((err) => {
      console.log(err);
    })
});

test('should receive a certain amount of data depending on page and count in GET /reviews/', () => {
  axios.get('localhost:3000/reviews/?product_id=5&page=1&count=5')
       .then((res) => {
         expect(res).toHaveLength(5);
       })
       .catch((err) => {
         console.log(err);
       })
});

test('should receive a certain amount of data depending on page and count in GET /reviews/', () => {
  axios.get('localhost:3000/reviews/?product_id=5&page=1&count=5')
       .then((res) => {
         expect(res).toHaveLength(5);
       })
       .catch((err) => {
         console.log(err);
       })
});

