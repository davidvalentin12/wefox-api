import { Router } from 'express';
import AddressesController from '@/modules/addresses/addresses.controller';
import { AddressDto } from '@/modules/addresses/addresses.dto';
import Route from '@/shared/interfaces/routes.interface';
import validationMiddleware from '@/shared/middlewares/validation.middleware';
import authMiddleware from '@/modules/auth/auth.middleware';

class AddressesRoute implements Route {
  public path = '/addresses';
  public router = Router();
  public addressesController = new AddressesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/validate`,
      validationMiddleware(AddressDto, 'body'),
      this.addressesController.validate
    );
    this.router.post(
      `${this.path}/weather`,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      authMiddleware,
      validationMiddleware(AddressDto, 'body'),
      this.addressesController.getAddressWeather
    );
  }
}

export default AddressesRoute;
