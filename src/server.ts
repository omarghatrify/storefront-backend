import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import products_routes from './handlers/products_handler';
import users_routes from './handlers/users_handler';
import orders_routes from './handlers/orders_handler';

const port = process.env.API_PORT || 3000;
export const app: express.Application = express();

console.log(`Started for ${process.env.ENV} enviroment.`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});
app.use('/products', products_routes);
app.use('/users', users_routes);
app.use('/orders', orders_routes);

app.listen(port, function () {
  console.log(`listening on port: ${port}`);
});
