import config from 'config';
import { AddressDto } from '@/modules/addresses/addresses.dto';
import {
  Client,
  GeocodeResponse,
  GeocodeResult,
} from '@googlemaps/google-maps-services-js';
import HttpException from '../exceptions/HttpException';
import CacheService from './cache.service';

class GoogleMapsService {
  public googleMapsService = new Client();
  private ttl = 60 * 60 * 12; // cache for 12 Hours
  public cacheService = new CacheService(this.ttl);

  public async getAddressGeocode(address: AddressDto): Promise<GeocodeResult> {
    const stringAddress = this.buildAddress(address);
    
    const geoCodeResult: GeocodeResponse = await this.cacheService.get(
      this.cacheService.getKeyFromString(stringAddress, 'AddressGeocode_'),
      async () => {
        return await this.googleMapsService.geocode({
          params: {
            key: this.getApiKey(),
            address: stringAddress,
          },
        });
      }
    );

    if (geoCodeResult.data.results.length == 0) {
      throw new HttpException(
        500,
        `We couldn't find any matching address for: ${stringAddress}`
      );
    }

    return geoCodeResult.data.results[0];
  }

  private buildAddress(address: AddressDto): string {
    const addressParts = [];

    !!address.street && addressParts.push(`${address.street}, `);
    !!address.streetNumber && addressParts.push(`${address.streetNumber}, `);
    !!address.town && addressParts.push(`${address.town}, `);
    !!address.postalCode && addressParts.push(`${address.postalCode}, `);
    !!address.country && addressParts.push(`${address.country}, `);

    return addressParts.join('');
  }

  private getApiKey(): string {
    return config.get('googleMapsApiKey');
  }
}

export default GoogleMapsService;
