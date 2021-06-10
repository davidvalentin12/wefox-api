import { AddressDto } from '@/modules/addresses/addresses.dto';
import {
  AddressType,
  GeocodeResult,
} from '@googlemaps/google-maps-services-js';
import { AddressValidationResult, AddressWeather, LocationCoordinates } from './addresses.interface';
import GoogleMapsService from '@/shared/services/googleMaps.service';
import OpenWeatherService, { LocationWeather } from '@/shared/services/openWeather.service';

class AddressesService {
  public googleMapsService = new GoogleMapsService();
  public openWeatherService = new OpenWeatherService();

  public async validateAddress(
    address: AddressDto
  ): Promise<AddressValidationResult> {
    const geocodeResult: GeocodeResult = await this.googleMapsService.getAddressGeocode(address);

    const isStreetAddress = geocodeResult.types.some(
      (type: AddressType) => type == AddressType.street_address
    );

    return {
      isValidAddress: !geocodeResult.partial_match,
      isStreetAddress: isStreetAddress,
      formattedAddress: geocodeResult.formatted_address,
    };
  }

  public async getAddressWeather(address: AddressDto): Promise<AddressWeather> {
    const geocodeResult: GeocodeResult = await this.googleMapsService.getAddressGeocode(address);
    const location: LocationCoordinates = {
      lat:geocodeResult.geometry.location.lat,
      lng:geocodeResult.geometry.location.lng
    }

    const locationWeather: LocationWeather[] = await this.openWeatherService.getLocationWeather(location);

    return {
      weather: locationWeather,
      address: geocodeResult.formatted_address
    }
  }
}

export default AddressesService;
