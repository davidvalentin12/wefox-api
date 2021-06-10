import { NextFunction, Request, Response } from 'express';
import AddressesService from '@/modules/addresses/addresses.service';
import { AddressDto } from './addresses.dto';
import { AddressValidationResult, AddressWeather } from './addresses.interface';

class AddressesController {
  public addressesService = new AddressesService();

  public validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressDto: AddressDto = req.body;
      const validation: AddressValidationResult = await this.addressesService.validateAddress(addressDto);

      res.status(200).json({ 
        data:  validation, 
        message: `${validation.isValidAddress ? 'Valid' : 'Invalid or Misspelled' } Address`
      });

    } catch (error) {
      next(error);
    }
  };

  public getAddressWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressDto: AddressDto = req.body;
      const locationWeather: AddressWeather = await this.addressesService.getAddressWeather(addressDto);

      res.status(200).json({ 
        data: locationWeather
      });

    } catch (error) {
      next(error);
    }
  };
}

export default AddressesController;
