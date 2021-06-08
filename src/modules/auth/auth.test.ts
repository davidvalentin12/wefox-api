jest.mock('@/modules/auth/auth.middleware');

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@/modules/auth/users/users.dto';
import AuthRoute from '@/modules/auth/auth.route';
import { mocked } from 'ts-jest/utils';
import authMiddleware from '@/modules/auth/auth.middleware';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from './auth.interface';

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}signup`)
        .send(userData);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findOne = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;
      mocked(authMiddleware).mockImplementation(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (req: RequestWithUser, res: Response, next: NextFunction) => {
          req.user = { ...userData, _id: 'id' };
          next();
        }
      );

      users.findOne = jest.fn().mockReturnValue(userData);

      (mongoose as any).connect = jest.fn();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}logout`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=\; Max-age=0/);
    });
  });
});
