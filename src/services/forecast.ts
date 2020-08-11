import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  N = 'N',
  W = 'W',
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectsSources: BeachForecast[] = [];
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData: BeachForecast[] = points.map((point) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...point,
      }));

      pointsWithCorrectsSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectsSources;
  }
}
