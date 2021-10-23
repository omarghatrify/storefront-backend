import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/jwt_midware';
import { User, UserStore } from '../models/user_model';
import jwt from 'jsonwebtoken';
import { OrderStore } from '../models/order_model';

const TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET) throw new Error('TOKEN_SECRET missing!');

const store = UserStore;

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await store.index();
    res.json(
      result.map((u) => {
        delete u.password;
        return u;
      })
    );
  } catch (error) {
    res.status(500);
    res.json(`Failed to index users, Internal ${error}`);
    return;
  }
};
const show = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const user = res.locals.user as User;
  if (isNaN(id)) {
    res.status(400);
    res.send(`Failed to get user, ${new Error('Invalid user id.')}`);
  }
  if (id != user.id) {
    res.status(403);
    res.send(`Failed to get user, ${new Error('Access denied.')}`);
    return;
  }
  try {
    const result = await store.show(id);
    if (result) {
      delete result.password;
      res.json(result);
      return;
    }
  } catch (error) {
    res.status(500);
    res.send(`Failed to get user, Internal ${error}`);
    return;
  }
  res.status(404);
  res.send(`Failed to get user, ${new Error(`User ${id} not found.`)}`);
  return;
};
const create = async (req: Request, res: Response): Promise<void> => {
  const user = req.body as User;
  try {
    if (!user.firstname) throw new Error('Missing parameter: firstname.');
    if (!user.lastname) throw new Error('Missing parameter: lastname.');
    if (!user.password) throw new Error('Missing parameter: password.');
  } catch (error) {
    res.status(400);
    res.send(`Failed to create user, ${error}`);
    return;
  }
  try {
    const result = await store.create(user);
    delete result.password;
    const token = jwt.sign(result, TOKEN_SECRET);
    res.status(201).send(token);
    return;
  } catch (error) {
    res.status(500);
    res.send(`Failed to create user, Internal ${error}`);
  }
};
const auth = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.body.id);
  const password = req.body.password;
  try {
    if (!req.body.id) throw new Error('Missing parameter: id.');
    if (!password) throw new Error('Missing parameter: password.');
    if (isNaN(id)) throw new Error('Invalid parameter: id.');
  } catch (error) {
    res.status(400);
    res.json(`Failed to authenticate, ${error}`);
    return;
  }

  try {
    const user = await store.show(req.body.id);
    if (user && (await store.check_pass(user, password))) {
      delete user.password;
      const token = jwt.sign(user, TOKEN_SECRET);
      res.send(token);
      return;
    }
  } catch (error) {
    res.status(500);
    res.send(`Failed to authenticate user, Internal ${error}`);
  }
  res.status(403);
  res.json(`Authentication Failed, ${new Error('Wrong id or password.')}`);
  return;
};

const orders = async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.id);
  const user = res.locals.user as User;
  if (user_id != user.id) {
    res.status(403);
    res.send(`Failed to get user, ${new Error('Access denied on user.')}`);
    return;
  }
  try {
    const result = await OrderStore.index(user_id);
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(`Failed to get user orders, Internal ${error}`);
  }
};

const routes = express.Router();
routes.get('/', verifyToken, index); // INDEX
routes.get('/:id', verifyToken, show); // SHOW
routes.post('/', create); // CREATE
routes.post('/authenticate', auth); // CREATE
routes.get('/:id/orders', verifyToken, orders);
export default routes;
