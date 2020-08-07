import request from 'supertest'

describe('Beach forecast functional tests', () => {
  it('should return a forecast with just a few times', async () => {
    const {body,status} = await request(app).get('/forecast')

    expect(status).toBe(200);
    expect(body).toBe([])
  })
})
