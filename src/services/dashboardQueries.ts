import client from '../database';
import { Product } from '../models/product_model';

export class DashboardQueries {
  static async popularProducts(top: number): Promise<Product[]> {
    const sql = `
    SELECT p.*
    FROM products p
    JOIN order_products op ON op.product_id = p.id GROUP BY id
    ORDER BY sum(op.quantity) DESC
    LIMIT $1
    `;
    const conn = await client.connect();
    const result = await conn.query<Product>(sql, [top]);
    conn.release();
    return result.rows;
  }
}
