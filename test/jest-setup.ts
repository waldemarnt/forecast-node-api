import { SetupServer } from '@src/server';
import request from 'supertest';

beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = request(server.getApp());
});
