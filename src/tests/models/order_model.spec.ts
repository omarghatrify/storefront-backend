import { Order, OrderStore } from '../../models/order_model';
import { randomInteger } from '../misc';
import { create as product } from './product_model.spec';
import { create as user } from './user_model.spec';

describe('Orders Model', () => {
  let newOrder: Order;
  let create: Promise<Order>;
  beforeAll(async () => {
    newOrder = {
      user_id: <number>(await user).id,
      status: 'ACTIVE',
      products: [
        {
          product_id: <number>(await product).id,
          quantity: randomInteger(0, 999999)
        }
      ]
    };
    create = OrderStore.create(newOrder);
  });
  describe('Create Method', () => {
    it('should create a new order', async () => {
      await expectAsync(create).toBeResolved();
      const result = await create;
      expect(result.id).toBeInstanceOf(Number);
      expect(result).toEqual({
        id: result.id,
        ...newOrder
      });
    });

    it('should throw error on invalid user_id', async () => {
      await expectAsync(
        OrderStore.create({
          user_id: 12323,
          status: 'ACTIVE',
          products: []
        })
      ).toBeRejectedWithError();
    });
  });
  describe('Index Method', () => {
    it('should list created orders.', async () => {
      await create;
      const index = OrderStore.index();
      await expectAsync(index).toBeResolved();
      expect(await index).toContain(await create);
    });
  });
  describe('Show Method', () => {
    beforeAll(async () => await create);
    it('should return order', async () => {
      const showMethod = OrderStore.show((await create).id as number);
      await expectAsync(showMethod).toBeResolvedTo(await create);
    });
    it('should return null on wrong id', async () => {
      const showMethod = OrderStore.show(99999);
      await expectAsync(showMethod).toBeResolvedTo(null);
    });
  });
  describe('Get Products Method', () => {
    it(`should return list of order's products`, async () => {
      const method = OrderStore.getProducts((await create).id as number);
      await expectAsync(method).toBeResolved();
      const result = await method;
      const s = {
        ...(await product),
        ...newOrder.products[0]
      };
      delete s.id;
      expect(result).toContain(s);
    });
  });
});
