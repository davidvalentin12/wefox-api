import { LocationWeather } from '@/shared/services/openWeather.service';

export interface AddressValidationResult {
  isValidAddress: boolean;
  isStreetAddress?: boolean;
  formattedAddress?: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface AddressWeather {
  weather: LocationWeather[];
  address: string;
}