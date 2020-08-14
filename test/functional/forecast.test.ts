import nock from 'nock';

import apiForecastResponseOneBeach from '@test/fixtures/apiForecastResponseOneBeach.json';
import stormGlassFixture from '@test/fixtures/stormGlassFixture.json';
import Beach from '@src/models/beach';

describe('Beach forecast functional tests', () => {
  beforeAll(async () => {
    await Beach.deleteMany({});
    const defaultBeach = {
      lat: -33.79,
      lng: 151.289824,
      name: 'Manly',
      position: 'E',
    };
    const beach = new Beach(defaultBeach);
    await beach.save();
  });
  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', { encodedQueryParams: true })
      .get('/v2/weather/point')
      .query({
        lat: '-33.79',
        lng: '151.289824',
        params:
          'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed',
        source: 'noaa',
      })
      .reply(200, stormGlassFixture);
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponseOneBeach);
  });
  it('should return status code 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', { encodedQueryParams: true })
      .get('/v2/weather/point')
      .query({
        lat: '-33.79',
        lng: '151.289824',
        params:
          'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed',
        source: 'noaa',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');

    expect(status).toBe(500);
  });
});
