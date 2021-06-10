import { LocationCoordinates } from '@/modules/addresses/addresses.interface';
import config from 'config';
import fetch, { RequestInit, RequestInfo } from 'node-fetch';
import CacheService from './cache.service';

class OpenWeatherService {
  private API_BASE_URL = 'https://api.openweathermap.org';
  private ttl = 60 * 60 * 12; // cache for 12 Hours
  public cacheService = new CacheService(this.ttl);

  public async getLocationWeather(
    coordinates: LocationCoordinates
  ): Promise<LocationWeather[]> {
    const urlParts = [];

    urlParts.push(`${this.API_BASE_URL}/data/2.5/weather?`);
    urlParts.push(`lat=${coordinates.lat}`);
    urlParts.push(`&lon=${coordinates.lng}`);
    urlParts.push(`&appid=${this.getApiKey()}`);

    const url = urlParts.join('');
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await this.cacheService.get(
      this.cacheService.getKeyFromString(url, 'LocationWeather_'),
      async () => {
        return await this.executeJsonRequest(url, options);
      }
    );

    return response.weather;
  }

  private async executeJsonRequest(url: RequestInfo, options: RequestInit) {
    return await fetch(url, options).then((response) => response.json());
  }

  private getApiKey(): string {
    return config.get('openWeatherApiKey');
  }
}

export interface LocationWeather {
  id: number;
  main: string;
  description: string;
}

export default OpenWeatherService;
