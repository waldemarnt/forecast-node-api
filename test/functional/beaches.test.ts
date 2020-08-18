import Beach from '@src/models/beach';
import AuthService from '@src/services/auth';
import User from '@src/models/user';

let token: string;
describe('Beaches functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const defaultUser = {
      name: 'John Doe',
      email: 'john@mail.com.br',
      password: '1234',
    };
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({
          'x-access-token': token,
        })
        .send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });
    it('should return status code 422 when there a validation error', async () => {
      const newBeach = {
        lat: 'invalid-string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({
          'x-access-token': token,
        })
        .send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid-string" at path "lat"',
      });
    });
  });
});
