import client from '../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = Number(process.env.SALT_ROUNDS);

if (!pepper) throw new Error('ENV variable "BCRYPT_PASSWORD" not specified.');
if (isNaN(saltRounds))
  throw new Error('ENV variable "SALT_ROUNDS" is not valid.');

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
}

export class UserStore {
  static async create(user: User): Promise<User> {
    if (!user.password) throw new Error('Missing password.');
    const conn = await client.connect();
    const hash = await bcrypt.hash(user.password + pepper, saltRounds);
    const sql =
      'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *';
    const result = await conn.query<User>(sql, [
      user.firstname,
      user.lastname,
      hash
    ]);
    conn.release();
    return result.rows[0];
  }
  static async index(): Promise<User[]> {
    const conn = await client.connect();
    const sql = 'SELECT id, firstname, lastname FROM users;';
    const result = await conn.query<User>(sql);
    conn.release();
    return result.rows;
  }
  static async show(id: User['id']): Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1);';
    const result = await conn.query<User>(sql, [id]);
    conn.release();
    return result.rows[0] || null;
  }

  static async check_pass(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password + pepper, user.password as string);
  }
}
