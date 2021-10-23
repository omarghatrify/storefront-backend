import { Product, ProductStore } from '../../models/product_model';
import { randomNumber, randomString } from '../misc';

const product: Product = {
  name: randomString(2),
  price: randomNumber(0, 9999999999, 2),
  category: randomString(2)
};
export const create = ProductStore.create(product);

describe('Product Model', () => {
  describe('Create Product', () => {
    it('should creats a product', async () => {
      await expectAsync(create).toBeResolved();
    });
    it('should return the created product', async () => {
      const result = await create;
      expect(result.id).toBeDefined();
      expect(result.name).toEqual(product.name);
      expect(result.price).toEqual(product.price);
      expect(result.category).toEqual(product.category);
    });
  });
  describe('Show Product', () => {
    it('should get a product', async () => {
      const method = ProductStore.show((await create).id as number);
      await expectAsync(method).toBeResolved();
    });
    it('should match the requested product', async () => {
      const method = ProductStore.show((await create).id as number);
      await expectAsync(method).toBeResolvedTo(await create);
    });
    it('should return null on wrong id', async () => {
      const method = ProductStore.show(9999);
      await expectAsync(method).toBeResolvedTo(null);
    });
  });
  describe('Index Products', () => {
    beforeAll(async () => await create);
    it('should be resolved', async () => {
      await expectAsync(ProductStore.index()).toBeResolved();
    });
    it('should return list containing the test product', async () => {
      const list = await ProductStore.index();
      expect(list).toContain(await create);
    });
  });
  describe('Update Product', () => {
    it('should return updated value', async () => {
      const newValue: Product = {
        id: (await create).id,
        name: randomString(),
        price: randomNumber(0, 9999999999, 2),
        category: randomString()
      };
      const updateMethod = ProductStore.update(newValue);
      await expectAsync(updateMethod).toBeResolvedTo(newValue);
      await ProductStore.update(await create); //reset
    });
  });
});
