import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassFixture from './fixtures/stormGlassFixture.json';
import stormGlassFixtureNormalized from './fixtures/stormGlassFixtureNormalized.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return a normalize forecast from the storm glass service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    axios.get = jest.fn().mockResolvedValue({ data: stormGlassFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassFixtureNormalized);
  });
});
