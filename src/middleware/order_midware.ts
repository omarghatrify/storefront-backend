import express from 'express';
import { Order, OrderStore } from '../models/order_model';
import { User } from '../models/user_model';

const orderParam = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const order_id = Number(req.params.order_id);
    if (isNaN(order_id)) {
      res
        .status(400)
        .json(
          `Failed to get order products, ${new Error('Invalid order id.')}`
        );
      return;
    }
    const order = await OrderStore.show(order_id);
    if (!order) {
      res
        .status(403)
        .json(`Failed to get order products, ${new Error('Order not found.')}`);
      return;
    }
    res.locals.order = order;
    next();
  } catch (error) {
    res.status(500);
    res.json(`Failed to get order, ${error}`);
  }
};
const orderOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user as User;
    const order = res.locals.order as Order;
    if (!user) {
      res.status(500).json(`Internal ${new Error('Unautherized.')}`);
      return;
    }
    if (!order) {
      res.status(500).json(`Internal ${new Error('Order not found.')}`);
      return;
    }
    if (order.user_id != user.id) {
      res
        .status(403)
        .json(`Failed to get order, ${new Error('Access denied.')}`);
      return;
    }
    next();
  } catch (error) {
    res.status(500);
    res.json(`Failed, ${error}`);
  }
};

export { orderParam, orderOwner };
