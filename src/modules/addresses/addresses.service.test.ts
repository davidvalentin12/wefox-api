process.env['NODE_CONFIG_DIR'] = __dirname.split('src/')[0] + 'src/configs';

jest.mock('@googlemaps/google-maps-services-js', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        geocode: () => {
          return {
            data: {
              results: [
                {
                  'formatted_address': 'full formatted address',
                  types: ['street_address'],
                },
              ],
            },
          };
        },
      };
    }),
    AddressType: {
      'street_address': 'street_address',
    },
  };
});

import AddressesService from '@/modules/addresses/addresses.service';
import { AddressDto } from './addresses.dto';

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe('Addresses service', () => {
  describe('validateAddress', () => {
    it('should a AddressValidationResult with a valid formatted address', async () => {
      const addressesService = new AddressesService();

      const address: AddressDto = {
        'street': 'Calle Bailen',
        'streetNumber': 244,
        'town': 'Barcelona',
        'postalCode': '08037',
        'country': 'Spain',
      };

      const geoCode = await addressesService.validateAddress(address);

      expect(geoCode).toEqual({
        formattedAddress: 'full formatted address',
        isStreetAddress: true,
        isValidAddress: true,
      });
    });
  });

  describe('getAddressWeather', () => {
    it('should return the weather at a certain address', async () => {
      const addressesService = new AddressesService();

      const address: AddressDto = {
        'street': 'Calle Bailen',
        'streetNumber': 244,
        'town': 'Barcelona',
        'postalCode': '08037',
        'country': 'Spain',
      };

      const geoCode = await addressesService.validateAddress(address);

      expect(geoCode).toEqual({
        formattedAddress: 'full formatted address',
        isStreetAddress: true,
        isValidAddress: true,
      });
    });
  });
});
