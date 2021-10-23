import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const env = process.env.ENV ? process.env.ENV + '_' : '';
if (!process.env[`POSTGRES_${env}DB`])
  throw new Error(`POSTGRES_${env}DB missing!`);
if (!process.env[`POSTGRES_${env}HOST`])
  throw new Error(`POSTGRES_${env}HOST missing!`);
if (!process.env[`POSTGRES_${env}USER`])
  throw new Error(`POSTGRES_${env}USER missing!`);
if (!process.env[`POSTGRES_${env}PASSWORD`])
  throw new Error(`POSTGRES_${env}PASSWORD missing!`);

const port = Number(process.env[`POSTGRES_${env}PORT`]);
const client = new Pool({
  host: process.env[`POSTGRES_${env}HOST`],
  database: process.env[`POSTGRES_${env}DB`],
  user: process.env[`POSTGRES_${env}USER`],
  password: process.env[`POSTGRES_${env}PASSWORD`],
  port: !isNaN(port) ? port : undefined
});
export default client;
