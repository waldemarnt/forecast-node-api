/* eslint-disable @typescript-eslint/ban-types */
import AuthService from '@src/services/auth';
import AuthMiddleware from '../auth';

describe('AuthMiddleware unit tests', () => {
  it('should verify a json web token and call next function', () => {
    const token = AuthService.generateToken({ data: 'fake-data' });
    const reqFake = {
      headers: {
        'x-access-token': token,
      },
    };
    const resFake = {};
    const nextFake = jest.fn();

    AuthMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });
  it('should return UNAUTHORIZED if there is not a token ', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid-token',
      },
    };
    const sendMock = jest.fn();

    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();

    AuthMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });
  it('should return UNAUTHORIZED if there is a problem on a token verification ', () => {
    const reqFake = {
      headers: {},
    };
    const sendMock = jest.fn();

    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();

    AuthMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
