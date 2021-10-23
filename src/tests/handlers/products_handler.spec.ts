import supertest from 'supertest';
import { Product } from '../../models/product_model';
import { app } from '../../server';
import { create as testProduct } from '../models/product_model.spec';
const api = supertest(app);

describe('Products Endpoints', () => {
  let validToken: string;
  let invalidToken: string;
  beforeAll(async () => {
    await testProduct;
    validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiT21hciIsImxhc3RuYW1lIjoiR2hhdHJpZnkiLCJpYXQiOjE2MzM3MjExODB9.uM1MNlPByAQweG7NMbpebMnuH8ZJ5s7DQtyJn5vqXeM';
    invalidToken = validToken + 'bad';
  });
  describe('[GET] /products', () => {
    it('should respond with list containing test product', async () => {
      const res = await api.get('/products/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toContain(await testProduct);
    });
  });
  describe('[GET] /products/:id', () => {
    it('should respond with test product', async () => {
      const res = await api.get(`/products/${(await testProduct).id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(await testProduct);
    });
  });
  describe('[POST] /products', () => {
    it('should create and respond a new product', async () => {
      const newProduct: Product = {
        name: 'NEW PRODUCT',
        price: 1123.45,
        category: 'SOME CATEGORY'
      };
      const res = await api
        .post(`/products/`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(newProduct);
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeInstanceOf(Number);
      expect(res.body.id).toBeGreaterThan(0);
      expect(res.body.name).toEqual(newProduct.name);
      expect(res.body.price).toEqual(newProduct.price);
      expect(res.body.category).toEqual(newProduct.category);
    });
    it('should respond with error 401 on invalid token', async () => {
      const newProduct: Product = {
        name: 'NEW PRODUCT',
        price: 1123.45,
        category: 'SOME CATEGORY'
      };
      await api
        .post(`/products/`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(newProduct)
        .expect(401);
    });
    it('should respond with error 400 on missing name', async () => {
      const newProduct: Partial<Product> = {
        name: undefined,
        price: 1123.45
      };
      await api
        .post(`/products/`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(newProduct)
        .expect(400);
    });
    it('should respond with error 400 on missing price', async () => {
      const newProduct: Partial<Product> = {
        name: 'NEW PRODUCT',
        price: undefined
      };
      await api
        .post(`/products/`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(newProduct)
        .expect(400);
    });
  });
});
