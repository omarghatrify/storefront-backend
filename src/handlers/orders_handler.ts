import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/jwt_midware';
import { OrderStore, Order } from '../models/order_model';
import { User } from '../models/user_model';
import order_products_routes from './order_products_handler';

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user as User;
    let user_id = undefined;
    //const status = req.query.status as Order['status'] | undefined;
    if (req.query.user_id) {
      user_id = Number(req.query.user_id);
      if (isNaN(user_id)) {
        res.status(400);
        res.json(
          `Failed to index orders, ${new Error(
            'Invalid query parameter: user_id'
          )}`
        );
        return;
      }
      if (user_id != user.id) {
        res.status(403);
        res.json(`Failed to index orders, ${new Error('Acces denied.')}`);
        return;
      }
    }
    /*if (status) {
      if (status != 'ACTIVE' && status != 'COMPLETE') {
        res.status(400);
        res.json(
          `Failed to index orders, ${new Error(
            'Invalid query parameter: status'
          )}`
        );
        return;
      }
    }*/
    const result = await OrderStore.index(user_id /*, status*/);
    res.json(result);
  } catch (error) {
    res.status(500).json(`Failed to get order, ${error}`);
  }
};

const active = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user as User;
    let user_id = undefined;
    if (req.query.user) {
      user_id = Number(req.query.user);
      if (isNaN(user_id)) {
        res.status(400);
        res.json(
          `Failed to index active orders, ${new Error(
            'Invalid query parameter: user_id'
          )}`
        );
        return;
      }
      if (user_id != user.id) {
        res.status(403);
        res.json(`Failed to index orders, ${new Error('Acces denied.')}`);
        return;
      }
    }
    const result = await OrderStore.index(user_id, 'ACTIVE');
    res.json(result);
  } catch (error) {
    res.status(500).json(`Failed to index active orders, ${error}`);
  }
};

const complete = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user as User;
    let user_id = undefined;
    if (req.query.user) {
      user_id = Number(req.query.user);
      if (isNaN(user_id)) {
        res.status(400);
        res.json(
          `Failed to index completed orders, ${new Error(
            'Invalid query parameter: user_id'
          )}`
        );
        return;
      }
      if (user_id != user.id) {
        res.status(403);
        res.json(`Failed to index orders, ${new Error('Acces denied.')}`);
        return;
      }
    }
    const result = await OrderStore.index(user_id, 'COMPLETE');
    res.json(result);
  } catch (error) {
    res.status(500).json(`Failed to index completed orders, ${error}`);
  }
};
const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user as User;
    const order_id = Number(req.params.order_id);
    if (isNaN(order_id)) {
      res.status(400);
      res.json(`Failed to get order, ${new Error('Invalid order id.')}`);
      return;
    }
    const result = await OrderStore.show(order_id);
    if (result) {
      if (result.user_id != user.id) {
        res.status(403);
        res.json(`Failed to get order, ${new Error('Access denied.')}`);
        return;
      }
      res.json(result);
      return;
    }
    res.status(404);
    res.json(`Failed to get order, ${new Error('Not found.')}`);
  } catch (error) {
    res.status(500);
    res.json(`Failed to get order, Internal ${error}`);
  }
};
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = req.body.products as Order['products'];
    const user = res.locals.user as User;
    const activeOrders = await OrderStore.index(user.id as number, 'ACTIVE');
    if (activeOrders.length > 0) {
      res.status(405);
      res.json(
        `Failed to create order, ${new Error(
          'You already have an active order.'
        )}`
      );
      return;
    }
    const result = await OrderStore.create({
      user_id: user.id as number,
      products: products,
      status: 'ACTIVE'
    });
    res.status(201).send(result);
    return;
  } catch (error) {
    res.status(500);
    res.json(`Failed to create order, Internal ${error}`);
  }
};
const patch = async (req: Request, res: Response): Promise<void> => {
  try {
    const value = req.body as Partial<Order>;
    const order_id = Number(req.params.order_id);
    const user = res.locals.user as User;
    if (isNaN(order_id)) {
      res.status(400);
      res.json(`Failed to patch order, ${new Error('Invalid order id.')}`);
      return;
    }
    const order = await OrderStore.show(order_id);
    if (!order) {
      res.status(404);
      res.json(`Failed to patch order, ${new Error('Not found.')}`);
      return;
    }
    if (user.id != order.user_id) {
      res.status(403);
      res.json(`Failed to patch order, ${new Error('Access denied.')}`);
      return;
    }
    try {
      if (value.id) throw new Error('Cant patch order ID.');
      if (value.user_id) throw new Error('Cant patch user ID.');
      if (value.products) throw new Error('Use order products endpoint.');
      if (!value.status) throw new Error('Nothing to patch.');
      if (value.status != 'ACTIVE' && value.status != 'COMPLETE')
        throw new Error('Invalid status, allowed: (ACTIVE | COMPLETE).');
      if (value.status == 'ACTIVE' && order.status == 'COMPLETE')
        throw new Error(`Can't reopen a completed order`);
    } catch (error) {
      res.status(406);
      res.json(`Failed to patch order, ${error}`);
      return;
    }
    const result = await OrderStore.patch(order_id, value);
    res.json(result);
  } catch (error) {
    res.status(500);
    res.json(`Failed to patch order, Internal ${error}`);
  }
};

const routes = express.Router();
routes.get('/', verifyToken, index);
routes.get('/complete', verifyToken, complete);
routes.get('/active', verifyToken, active);
routes.post('/', verifyToken, create);
routes.get('/:order_id', verifyToken, show);
routes.patch('/:order_id', verifyToken, patch);
routes.use('/:order_id/products', order_products_routes);
export default routes;
