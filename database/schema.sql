CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id int,
  rating int,
  date timestamp,
  summary VARCHAR,
  body VARCHAR,
  recommend boolean,
  reported boolean,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness int,
)

CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR,
  review_id int,
)

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id int,
  name VARCHAR,
)

CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id SERIAL PRIMARY KEY,
  review_id int,
  characteristics_id int,
  value int,
)