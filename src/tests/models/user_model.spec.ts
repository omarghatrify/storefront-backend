import { UserStore, User } from '../../models/user_model';
import { randomString } from '../misc';

const testPassword = randomString(2);
const user: User = {
  firstname: randomString(2),
  lastname: randomString(2),
  password: testPassword
};
export const create = UserStore.create(user);

describe('Users Model', () => {
  beforeAll(async () => await create);
  describe('Create User', () => {
    it('should create and return new user', async () => {
      await expectAsync(create).toBeResolved();
      const result = await create;
      expect(result.firstname).toEqual(user.firstname);
      expect(result.lastname).toEqual(user.lastname);
    });
  });
  describe('Show User', () => {
    it('should return existing user', async () => {
      const getUser = UserStore.show((await create).id as number);
      await expectAsync(getUser).toBeResolvedTo(await create);
    });
    it('should return null on wrong user id ', async () => {
      const getUser = UserStore.show(1234);
      await expectAsync(getUser).toBeResolved();
      expect(await getUser).toBeFalsy();
      expect(await getUser).toBeNull();
    });
  });
  describe('Check Password', () => {
    it('should be true on right password', async () => {
      const check = UserStore.check_pass(await create, testPassword);
      await expectAsync(check).toBeResolvedTo(true);
    });
    it('should be false on wrong password', async () => {
      const check = UserStore.check_pass(await create, 'wrong' + testPassword);
      await expectAsync(check).toBeResolvedTo(false);
    });
  });
});
