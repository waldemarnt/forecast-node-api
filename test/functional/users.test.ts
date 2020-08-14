import user from '@src/models/user';

describe('User functional tests', () => {
  beforeEach(async () => await user.deleteMany({}));
  describe('When creating an new user', () => {
    it('should succesfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com.br',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('should return status code 400 when there is validation error', async () => {
      const newUser = {
        email: 'john@mail.com.br',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return status code 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com.br',
        password: '1234',
      };

      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database',
      });
    });
  });
});
