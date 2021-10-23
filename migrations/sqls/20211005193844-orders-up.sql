/* Replace with your SQL commands */
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(9) check(status in ('ACTIVE', 'COMPLETE')),
  user_id INTEGER NOT NULL REFERENCES users(id)
);