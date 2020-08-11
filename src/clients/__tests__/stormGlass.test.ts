import { StormGlass } from '@src/clients/stormGlass';
import * as HTTPUtil from '@src/util/request';
import stormGlassFixture from '@test/fixtures/stormGlassFixture.json';
import stormGlassFixtureNormalized from '@test/fixtures/stormGlassFixtureNormalized.json';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return a normalize forecast from the storm glass service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
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

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it('should get a generic error from Storm Glass service when the request fail before reaching the service', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Network Error'
    );
  });

  it('should get a generic error from Storm Glass service when the rate limit reached', async () => {
    const lat = -11.1111;
    const lng = 100.101;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
