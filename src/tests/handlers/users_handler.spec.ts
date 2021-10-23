import supertest from 'supertest';
import { User, UserStore } from '../../models/user_model';
import { app } from '../../server';

import jwt from 'jsonwebtoken';
import { randomInteger, randomString } from '../misc';
const TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET) throw new Error('TOKEN_SECRET missing!');

const api = supertest(app);
const firstname = randomString(2);
const lastname = randomString(2);
const password = randomString(2);

const testUser = UserStore.create({
  firstname: firstname,
  lastname: lastname,
  password: password
}).then((u) => {
  delete u.password;
  return u;
});

describe('Users Endpoints', () => {
  let validToken: string;
  let invalidToken: string;
  beforeAll(async () => {
    validToken = jwt.sign(await testUser, TOKEN_SECRET);
    invalidToken = jwt.sign(await testUser, TOKEN_SECRET + randomString());
  });
  describe('[GET] /users', () => {
    it('should respond with list containing test user.', async () => {
      const res = await api.get('/users/').auth(validToken, { type: 'bearer' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toContain(await testUser);
    });
    it('should respond with error 401 on missing token.', async () => {
      await api.get('/users/').expect(401);
    });
    it('should respond with error 401 on invalid token.', async () => {
      await api
        .get('/users/')
        .auth(invalidToken, { type: 'bearer' })
        .expect(401);
    });
  });
  describe('[GET] /users/:id', () => {
    it('should respond with test user', async () => {
      const res = await api
        .get(`/users/${(await testUser).id}`)
        .auth(validToken, { type: 'bearer' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(await testUser);
    });
    it('should respond with error 401 on missing token.', async () => {
      await api.get(`/users/${(await testUser).id}`).expect(401);
    });
    it('should respond with error 401 on invalid token.', async () => {
      await api
        .get(`/users/${(await testUser).id}`)
        .auth(invalidToken, { type: 'bearer' })
        .expect(401);
    });
  });
  describe('[POST] /users', () => {
    it('should create a new user and respond with jwt.', async () => {
      const newUser: User = {
        firstname: 'NEW',
        lastname: 'USER',
        password: 'PASSWORD'
      };
      const res = await api.post(`/users`).send(newUser).expect(201);
      expect(() => jwt.verify(res.text, TOKEN_SECRET)).not.toThrow();
      const payload = jwt.verify(res.text, TOKEN_SECRET);
      expect((payload as User).id).toBeInstanceOf(Number);
      expect((payload as User).id).toBeGreaterThan(0);
      expect((payload as User).firstname).toEqual(newUser.firstname);
      expect((payload as User).lastname).toEqual(newUser.lastname);
      expect((payload as User).password).toBeUndefined();
    });
    it('should respond with error 400 on missing firstname', async () => {
      await api
        .post(`/users/`)
        .send({
          lastname: 'USER',
          password: 'PASSWORD'
        })
        .expect(400);
    });

    it('should respond with error 400 on missing lastname', async () => {
      await api
        .post(`/users/`)
        .send({
          firstname: 'TEST',
          password: 'PASSWORD'
        })
        .expect(400);
    });

    it('should respond with error 400 on missing password', async () => {
      await api
        .post(`/users/`)
        .send({
          firstname: 'NEW',
          lastname: 'USER'
        })
        .expect(400);
    });
  });
  describe('[POST] /users/authenticate', () => {
    it('should respond with valid jwt on correct id & password', async () => {
      const res = await api
        .post(`/users/authenticate`)
        .send({
          id: (await testUser).id,
          password: password
        })
        .expect(200);
      expect(() => jwt.verify(res.text, TOKEN_SECRET)).not.toThrow();
      const payload = jwt.verify(res.text, TOKEN_SECRET);
      expect((payload as User).id).toBeInstanceOf(Number);
      expect((payload as User).id).toBeGreaterThan(0);
      expect((payload as User).firstname).toEqual(firstname);
      expect((payload as User).lastname).toEqual(lastname);
      expect((payload as User).password).toBeUndefined();
    });
    it('should respond with error 400 on missing id', async () => {
      await api
        .post(`/users/authenticate`)
        .send({ password: 'sfdfsd' })
        .expect(400);
    });
    it('should respond with error 400 on missing password', async () => {
      await api.post(`/users/authenticate`).send({ id: 1 }).expect(400);
    });
    it('should respond with error 400 on invalid id', async () => {
      await api.post(`/users/authenticate`).send({ id: 'someID' }).expect(400);
    });
    it('should respond with error 403 on wrong password', async () => {
      await api
        .post(`/users/authenticate`)
        .send({ id: (await testUser).id, password: password + randomString() })
        .expect(403);
    });
    it('should respond with error 403 on wrong id', async () => {
      await api
        .post(`/users/authenticate`)
        .send({
          id: ((await testUser).id as number) * 100,
          password: password
        })
        .expect(403);
    });
  });
});
