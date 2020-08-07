import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassAPIParamters =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaaa';

  constructor(protected request: AxiosStatic) {}
  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParamters}&source=${this.stormGlassAPISource}`,
      {
        headers: {
          Authorization: process.env.STORM_GLASS_API_KEY,
        },
      }
    );
  }
}
