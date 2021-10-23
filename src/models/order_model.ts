import client from '../database';
import { Product } from './product_model';

export interface Order {
  id?: number;
  status: 'ACTIVE' | 'COMPLETE';
  products: OrderProduct[];
  user_id: number;
}

export interface OrderProduct {
  order_id?: number;
  product_id: number;
  quantity: number;
}

export class OrderStore {
  static TABLE = 'orders';

  static async index(
    user_id?: number,
    status?: Order['status']
  ): Promise<Order[]> {
    let sql = `
    SELECT orders.* , 
      COALESCE(json_agg(json_build_object('product_id', product_id, 'quantity', quantity)) FILTER (WHERE product_id IS NOT NULL AND quantity IS NOT NULL), '[]') as products
    FROM orders
    LEFT JOIN order_products ON id = order_id
    `;
    const filters: string[] = [];
    if (user_id) filters.push(`user_id=(${user_id})`);
    if (status) filters.push(`status=('${status}')`);
    const conn = await client.connect();
    if (filters.length > 0) sql = sql.concat(' WHERE ', filters.join(' AND '));
    sql = sql.concat(' GROUP BY id;');
    const result = await conn.query<Order>(sql);
    conn.release();
    return result.rows;
  }
  static async show(id: number): Promise<Order | null> {
    const conn = await client.connect();
    const sql = `
    SELECT orders.*,
      COALESCE(json_agg(json_build_object('product_id', product_id, 'quantity', quantity)) FILTER (WHERE product_id IS NOT NULL AND quantity IS NOT NULL), '[]') as products
    FROM orders
    LEFT JOIN order_products ON id = order_id
    WHERE id=($1) GROUP BY id;
    `;
    const result = await conn.query<Order>(sql, [id]);
    conn.release();
    return result.rows[0] || null;
  }
  static async create(order: Order): Promise<Order> {
    const conn = await client.connect();
    const sql = `INSERT INTO ${OrderStore.TABLE} (user_id, status) VALUES ($1, $2) RETURNING *;`;
    const result = await conn.query<Order>(sql, [order.user_id, order.status]);
    conn.release();
    if (order.products && order.products.length > 0) {
      result.rows[0].products = await this.addProducts(
        result.rows[0].id as number,
        order.products
      );
    }
    return result.rows[0];
  }
  static async patch(
    id: Required<Order>['id'],
    order: Partial<Order>
  ): Promise<Order> {
    const updates = [];
    const values = [];

    if (order.status) {
      updates.push(`status=($${values.length + 1})`);
      values.push(order.status);
    }
    if (order.user_id) {
      updates.push(`user_id=($${values.length + 1})`);
      values.push(order.user_id);
    }
    const sql = `
      UPDATE orders
      SET ${updates.join(', ')}
      WHERE id=(${id})
      RETURNING *;
    `;
    const conn = await client.connect();
    const result = await conn.query<Order>(sql, values);
    conn.release();
    return result.rows[0];
  }
  static async addProducts(
    order_id: number,
    products: OrderProduct[]
  ): Promise<OrderProduct[]> {
    const values = products
      .map((p) => `(${order_id}, ${p.product_id}, ${p.quantity})`)
      .join(', ');
    const conn = await client.connect();
    const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES ${values} RETURNING product_id, quantity;`;
    const result = await conn.query<OrderProduct>(sql);
    conn.release();
    return result.rows;
  }
  static async getProducts(
    order_id: number
  ): Promise<Array<Product & OrderProduct>> {
    const conn = await client.connect();
    const sql = `
      SELECT op.product_id, op.quantity, p.name, p.price, p.category
      FROM products p
      JOIN order_products op ON p.id = op.product_id
      WHERE op.order_id = ($1);
    `;
    const result = await conn.query<Product & OrderProduct>(sql, [order_id]);
    conn.release();
    return result.rows.map((r) => {
      return { ...r, price: Number(r.price) };
    });
  }
  /*
  static async getProducts(order_id: number): Promise<OrderProduct[]> {
    const conn = await client.connect();
    const sql = `
      SELECT product_id, quantity
      FROM order_products
      WHERE order_id = ($1);
    `;
    const result = await conn.query<OrderProduct>(sql, [order_id]);
    conn.release();
    return result.rows;
  }
  */
}
