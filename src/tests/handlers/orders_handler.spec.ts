import supertest from 'supertest';
import { Order, OrderProduct, OrderStore } from '../../models/order_model';
import { ProductStore } from '../../models/product_model';
import { UserStore } from '../../models/user_model';
import { app } from '../../server';
import { randomInteger, randomNumber, randomString } from '../misc';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET) throw new Error('TOKEN_SECRET missing!');

const api = supertest(app);

const testUser = UserStore.create({
  firstname: randomString(2),
  lastname: randomString(2),
  password: randomString(2)
}).then((u) => {
  delete u.password;
  return u;
});

const token = testUser.then((u) => jwt.sign(u, TOKEN_SECRET));

const testProduct = ProductStore.create({
  name: randomString(2),
  price: randomNumber(0, 100, 2)
});

describe('Orders Endpoints', () => {
  const createOrder = Promise.all([testUser, testProduct, token]).then((v) => {
    const user = v[0];
    const product = v[1];
    const token = v[2];
    return api
      .post('/orders')
      .auth(token, { type: 'bearer' })
      .send(<Order>{
        user_id: user.id,
        products: [{ product_id: product.id, quantity: 1 }]
      })
      .expect(201);
  });
  describe('[POST] /orders', () => {
    it('should create and respond new order', async () => {
      const result = (await createOrder).body as Order;
      expect(result).toEqual({
        id: jasmine.any(Number),
        status: 'ACTIVE',
        user_id: (await testUser).id as number,
        products: [
          { product_id: (await testProduct).id as number, quantity: 1 }
        ]
      });
    });
    it('should respond with 405 when an active order already exists', async () => {
      await createOrder;
      await api
        .post('/orders')
        .auth(await token, { type: 'bearer' })
        .send(<Order>{
          user_id: (await testUser).id,
          products: [{ product_id: (await testProduct).id, quantity: 1 }]
        });
    });
    it('should respond with 401 on missing token', async () => {
      await api.post('/orders').send(<Order>{
        user_id: (await testUser).id,
        products: [{ product_id: (await testProduct).id, quantity: 1 }]
      });
    });
    it('should respond with 401 on invalid token', async () => {
      await api
        .post('/orders')
        .auth((await token) + 'bad', { type: 'bearer' })
        .send(<Order>{
          user_id: (await testUser).id,
          products: [{ product_id: (await testProduct).id, quantity: 1 }]
        });
    });
  });
  describe('[GET] /orders', () => {
    it('should respond with array of orders', async () => {
      const order = (await createOrder).body;
      const response = await api
        .get('/orders')
        .auth(await token, { type: 'bearer' })
        .expect(200);
      expect(response.body).toContain(
        jasmine.objectContaining({
          ...order,
          products: jasmine.arrayContaining(order.products)
        })
      );
    });
    it('should respond with 401 on invalid token', async () => {
      const order = (await createOrder).body;
      const response = await api
        .get('/orders')
        .auth((await token) + 'sd', { type: 'bearer' })
        .expect(401);
    });
    it('should respond with 401 on missing token', async () => {
      await createOrder;
      const response = await api.get('/orders').expect(401);
    });
  });
  describe('[GET] /orders/:id', () => {
    it('should respond with order', async () => {
      const order = (await createOrder).body;
      const response = await api
        .get(`/orders/${order.id}`)
        .auth(await token, { type: 'bearer' })
        .expect(200);
      expect(response.body).toEqual({
        ...order,
        products: jasmine.arrayContaining(order.products)
      });
    });
    it('should respond with 401 on invalid token', async () => {
      const order = (await createOrder).body;
      await api
        .get(`/orders/${order.id}`)
        .auth((await token) + 'bad', { type: 'bearer' })
        .expect(401);
    });
    it('should respond with 401 on missing token', async () => {
      const order = (await createOrder).body;
      await api.get(`/orders/${order.id}`).expect(401);
    });
    it('should respond with 403 when attemping to get other user order', async () => {
      const order = (await createOrder).body;
      const newUser = await UserStore.create({
        firstname: 'new',
        lastname: 'user',
        password: 'pass'
      });
      await api
        .get(`/orders/${order.id}`)
        .auth(jwt.sign(newUser, TOKEN_SECRET), { type: 'bearer' })
        .expect(403);
    });
  });
  describe('[GET] /orders/:id/products', () => {
    it('should respond with list of products containing the test product', async () => {
      const order = (await createOrder).body;
      const product = await testProduct;
      const response = await api
        .get(`/orders/${order.id}/products`)
        .auth(await token, { type: 'bearer' })
        .expect(200);
      expect(response.body).toContain({
        product_id: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        category: product.category
      });
    });
    it('should respond with error 401 on missing token', async () => {
      const order = (await createOrder).body;
      await api.get(`/orders/${order.id}/products`).expect(401);
    });
    it('should respond with error 401 on invalid token', async () => {
      const order = (await createOrder).body;
      await api
        .get(`/orders/${order.id}/products`)
        .auth((await token) + 'bad', { type: 'bearer' })
        .expect(401);
    });
  });
  describe('[POST] /orders/:id/products', () => {
    it('should respond with newly added product', async () => {
      const order = (await createOrder).body;
      const newProduct = await ProductStore.create({
        name: randomString(2),
        price: randomNumber(0, 100, 2)
      });
      const response = await api
        .post(`/orders/${order.id}/products`)
        .auth(await token, { type: 'bearer' })
        .send(<OrderProduct>{ product_id: newProduct.id, quantity: 10 })
        .expect(201);
      expect(response.body).toEqual(<OrderProduct>{
        product_id: newProduct.id,
        quantity: 10
      });
    });
    it('should respond with error 401 on missing token', async () => {
      const order = (await createOrder).body;
      await api.post(`/orders/${order.id}/products`).expect(401);
    });
    it('should respond with error 401 on invalid token', async () => {
      const order = (await createOrder).body;
      await api
        .post(`/orders/${order.id}/products`)
        .auth((await token) + 'bad', { type: 'bearer' })
        .expect(401);
    });
  });
});
