import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/jwt_midware';
import { Product, ProductStore } from '../models/product_model';
import { DashboardQueries } from '../services/dashboardQueries';

const store = ProductStore;
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    let result: Product[];
    // TODO: add category filter method
    if (typeof req.query.category == 'string')
      result = await store.index(req.query.category);
    else result = await store.index();
    res.json(result);
  } catch (error) {
    res.status(500);
    res.json(`Failed to index products, Internal ${error}`);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  try {
    if (isNaN(id)) throw new Error('Invalid ID');
  } catch (error) {
    res.status(400);
    res.send(`Failed to get product, ${error}`);
  }

  try {
    const result = await store.show(id);
    if (result) {
      res.json(result);
      return;
    }
  } catch (error) {
    res.status(500);
    res.send(`Failed to get product, Internal ${error}`);
    return;
  }
  res.status(404);
  res.send(`Failed to get product, ${new Error('Not found.')}`);
};

const create = async (req: Request, res: Response): Promise<void> => {
  const product = req.body as Product;
  try {
    if (!product.price) throw new Error('Missing product price.');
    if (!product.name) throw new Error('Missing product name.');
    if (isNaN(product.price)) throw new Error('Invalid price');
  } catch (error) {
    res.status(400);
    res.send(`Failed to add product, ${error}`);
    return;
  }

  try {
    const result = await store.create(product);
    res.status(201).json(result);
  } catch (error) {
    res.status(500);
    res.send(`Failed to add product, Internal ${error}`);
  }
};

const popular = async (req: Request, res: Response): Promise<void> => {
  const top = Number(req.query.top);
  if (isNaN(top)) {
    const error = new Error('top query must be a number.');
    res.status(400);
    res.send(`Failed to get popular products, ${error}`);
    return;
  }
  try {
    const result = (await DashboardQueries.popularProducts(top)).map((r) => {
      r.price = Number(r.price);
      return r;
    });
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(`Failed to get popular products, Internal ${error}`);
  }
};

const routes = express.Router();
routes.get('/', index); // INDEX
routes.get('/popular', popular); // POPULAR
routes.get('/:id', show); // SHOW
routes.post('/', verifyToken, create); // CREATE

export default routes;
