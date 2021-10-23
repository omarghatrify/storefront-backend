import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/jwt_midware';
import { orderOwner, orderParam } from '../middleware/order_midware';
import { OrderProduct, OrderStore } from '../models/order_model';
import { Product } from '../models/product_model';

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await OrderStore.getProducts(res.locals.order.id);
    res.json(result);
  } catch (error) {
    res.status(500).json(`Failed to add product to order, ${error}`);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product_order = req.body as OrderProduct;
    const result = await OrderStore.addProducts(res.locals.order.id, [
      product_order
    ]);
    res.status(201);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json(`Failed to add product to order, ${error}`);
  }
};

const routes = express.Router({ mergeParams: true });
routes.get('/', verifyToken, orderParam, orderOwner, index);
routes.post('/', verifyToken, orderParam, orderOwner, create);

export default routes;
