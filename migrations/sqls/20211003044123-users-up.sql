/* Replace with your SQL commands */
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(35) NOT NULL,
  lastName VARCHAR(35) NOT NULL,
  password VARCHAR(100) NOT NULL
);