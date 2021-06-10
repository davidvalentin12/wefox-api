process.env['NODE_CONFIG_DIR'] = __dirname.split('src/')[0] + 'src/configs';

jest.mock('@/shared/services/googleMaps.service');
jest.mock('@/shared/services/openWeather.service');

import GoogleMapsService from '@/shared/services/googleMaps.service';
import AddressesService from '@/modules/addresses/addresses.service';
import { AddressDto } from './addresses.dto';
import { mocked } from 'ts-jest/utils';
import {
  AddressGeometry,
  AddressType,
  GeocodeResult,
} from '@googlemaps/google-maps-services-js';
import OpenWeatherService, {
  LocationWeather,
} from '@/shared/services/openWeather.service';

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe('Addresses service', () => {
  describe('validateAddress', () => {
    it('should a AddressValidationResult with a valid formatted address', async () => {
      const googleMapsService = new GoogleMapsService();
      const geocodeResult: Partial<GeocodeResult> = {
        types: [AddressType.street_address],
        formatted_address: 'fully formatted address',
        address_components: [],
        postcode_localities: [],
        geometry: {
          location: {
            lat: 10,
            lng: 10,
          },
        } as AddressGeometry,
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(googleMapsService.getAddressGeocode).mockResolvedValue(
        geocodeResult as GeocodeResult
      );
      const addressesService = new AddressesService(googleMapsService);

      const address: AddressDto = {
        street: 'Calle Bailen',
        streetNumber: 244,
        town: 'Barcelona',
        postalCode: '08037',
        country: 'Spain',
      };

      const geoCode = await addressesService.validateAddress(address);

      expect(geoCode).toEqual({
        formattedAddress: 'fully formatted address',
        isStreetAddress: true,
        isValidAddress: true,
      });
    });
  });

  describe('getAddressWeather', () => {
    it('should return the weather at a certain address', async () => {
      const googleMapsService = new GoogleMapsService();
      const openWeatherService = new OpenWeatherService();
      const geocodeResult: Partial<GeocodeResult> = {
        types: [AddressType.street_address],
        formatted_address: 'fully formatted address',
        address_components: [],
        postcode_localities: [],
        geometry: {
          location: {
            lat: 10,
            lng: 10,
          },
        } as AddressGeometry,
      };
      const locationWeather: LocationWeather = {
        id: 123,
        main: 'Awesome weather',
        description:
          'Awesome weather because any weather is good to do a code challenge ;)',
      };

      mocked(googleMapsService.getAddressGeocode).mockResolvedValue(
        geocodeResult as GeocodeResult
      );
      mocked(openWeatherService.getLocationWeather).mockResolvedValue([
        locationWeather,
      ]);

      const addressesService = new AddressesService(
        googleMapsService,
        openWeatherService
      );

      const address: AddressDto = {
        street: 'Calle Bailen',
        streetNumber: 244,
        town: 'Barcelona',
        postalCode: '08037',
        country: 'Spain',
      };

      const addressWeather = await addressesService.getAddressWeather(address);

      expect(addressWeather).toEqual({
        address: 'fully formatted address',
        weather: [
          {
            description:
              'Awesome weather because any weather is good to do a code challenge ;)',
            id: 123,
            main: 'Awesome weather',
          },
        ],
      });
    });
  });
});
