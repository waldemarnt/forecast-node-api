import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassFixture from './fixtures/stormGlassFixture.json';
import stormGlassFixtureNormalized from './fixtures/stormGlassFixtureNormalized.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return a normalize forecast from the storm glass service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    mockedAxios.get.mockResolvedValue({ data: stormGlassFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassFixtureNormalized);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -11.1111;
    const lng = 100.101;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it('should get a generic error from Storm Glass service when the request fail before reaching the service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Network Error'
    );
  });

  it('should get a generic error from Storm Glass service when the request fail before reaching the service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
