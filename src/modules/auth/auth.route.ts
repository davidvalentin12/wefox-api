import { Router } from 'express';
import AuthController from '@/modules/auth/auth.controller';
import { UserDto } from '@/modules/auth/users/users.dto';
import Route from '@/shared/interfaces/routes.interface';
import authMiddleware from '@/modules/auth/auth.middleware';
import validationMiddleware from '@/shared/middlewares/validation.middleware';

class AuthRoute implements Route {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      validationMiddleware(UserDto, 'body'),
      this.authController.signUp
    );
    this.router.post(
      `${this.path}login`,
      validationMiddleware(UserDto, 'body'),
      this.authController.logIn
    );
    this.router.post(
      `${this.path}logout`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      authMiddleware,
      this.authController.logOut
    );
  }
}

export default AuthRoute;
