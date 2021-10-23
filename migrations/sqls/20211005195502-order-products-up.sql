/* Replace with your SQL commands */
CREATE TABLE order_products (
  quantity INTEGER NOT NULL,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id)
);