drop table if exists reviews;

drop table if exists reviews_photos;

drop table if exists characteristics;

drop table if exists characteristics_reviews;

CREATE DATABASE reviewsdata;

\c reviewsdata;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id int,
  rating int,
  date bigint,
  summary VARCHAR,
  body VARCHAR,
  recommend boolean,
  reported boolean,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness int
);

CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id int,
  url VARCHAR
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id int,
  name VARCHAR
);

CREATE TABLE characteristics_reviews (
  id SERIAL PRIMARY KEY,
  review_id int,
  characteristics_id int,
  value int
);



psql junelee -h 52.15.61.59 -d reviewsdata -f /Users/junelee/Reviews/database/schema.sql
copy reviews from '/Users/junelee/reviews.csv' with delimiter ',' csv header;
copy characteristics from '/Users/junelee/characteristics.csv' with delimiter ',' csv header;
copy characteristics_reviews from '/Users/junelee/characteristic_reviews.csv' with delimiter ',' csv header;
copy reviews_photos from '/Users/junelee/reviews_photos.csv' with delimiter ',' csv header;

ALTER TABLE reviews
  ALTER COLUMN date TYPE timestamp without time zone
  USING to_timestamp(date/1000),
  ALTER COLUMN date SET DEFAULT current_timestamp;

  SELECT setval('reviews_id_seq', (select max(id) from reviews));
  SELECT setval('reviews_photos_id_seq', (select max(id) from reviews_photos));
  SELECT setval('characteristics_id_seq', (select max(id) from characteristics));
  SELECT setval('characteristics_reviews_id_seq', (select max(id) from characteristics_reviews));

