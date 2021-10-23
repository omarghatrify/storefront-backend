import client from '../database';

export interface Product {
  id?: number;
  name: string;
  price: number;
  category?: string;
}

const TABLE = 'products';
export class ProductStore {
  static async index(category?: string): Promise<Product[]> {
    const conn = await client.connect();
    let result;
    if (category) {
      const sql = `SELECT * FROM ${TABLE} WHERE category=($1);`;
      result = await conn.query<Product>(sql, [category]);
    } else {
      const sql = `SELECT * FROM ${TABLE};`;
      result = await conn.query<Product>(sql);
    }
    conn.release();
    return result.rows.map((r) => {
      r.price = Number(r.price);
      return r;
    });
  }
  static async show(product_id: Product['id']): Promise<Product | null> {
    if (!product_id) throw new Error('Missing product_id.');
    const conn = await client.connect();
    const sql = `SELECT * FROM ${TABLE} WHERE id=($1)`;
    const result = await conn.query<Product>(sql, [product_id]);
    conn.release();
    if (result.rows[0]) result.rows[0].price = Number(result.rows[0].price);
    return result.rows[0] || null;
  }
  static async create(product: Product): Promise<Product> {
    if (!product.name) throw new Error('Missing product name');
    if (!product.price) throw new Error('Missing product price');
    const conn = await client.connect();
    const sql = `INSERT INTO ${TABLE} (name, price, category) VALUES ($1, $2, $3) RETURNING *;`;
    const result = await conn.query<Product>(sql, [
      product.name,
      product.price,
      product.category || null
    ]);
    conn.release();
    result.rows[0].price = Number(result.rows[0].price);
    return result.rows[0];
  }
  static async remove(product_id: Product['id']): Promise<Product | null> {
    if (!product_id) throw new Error('Missing product_id.');
    const sql = `DELETE FROM ${TABLE} WHERE WHERE id=($1) RETURNING *;`;
    const conn = await client.connect();
    const result = await conn.query<Product>(sql, [product_id]);
    conn.release();
    if (result.rows[0]) result.rows[0].price = Number(result.rows[0].price);
    return result.rows[0] || null;
  }
  static async update(product: Product): Promise<Product> {
    if (!product.id) throw new Error('Missing product id.');
    const sql = `UPDATE ${TABLE} SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *`;
    const conn = await client.connect();
    const result = await conn.query<Product>(sql, [
      product.name,
      product.price,
      product.category || null,
      product.id
    ]);
    conn.release();
    if (result.rows[0]) result.rows[0].price = Number(result.rows[0].price);
    return result.rows[0];
  }
}
