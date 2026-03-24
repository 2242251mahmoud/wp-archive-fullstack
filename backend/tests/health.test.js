const request = require('supertest');
const { createApp } = require('../app');

describe('API health and index endpoints', () => {
  const app = createApp();

  test('GET /api/health returns ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /api returns endpoint listing', async () => {
    const response = await request(app).get('/api');

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      message: 'WordPress Archive API',
      endpoints: {
        health: '/api/health',
        items: '/api/items',
        categories: '/api/categories',
        trending: '/api/items/trending/items'
      }
    });
  });
});
