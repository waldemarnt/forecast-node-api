import { SetupServer } from '@src/server';
import request from 'supertest';

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = request(server.getApp());
});

afterAll(async () => {
  await server.close();
});
