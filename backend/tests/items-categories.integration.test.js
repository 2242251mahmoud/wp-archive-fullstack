const request = require('supertest');

jest.mock('../db', () => ({
  query: jest.fn()
}));

const { query } = require('../db');
const { createApp } = require('../app');

describe('Items and categories API integration', () => {
  const app = createApp();

  beforeEach(() => {
    query.mockReset();
  });

  test('GET /api/categories returns categories with item counts', async () => {
    query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'WordPress Themes', item_count: '4' },
        { id: 2, name: 'WordPress Plugins', item_count: '5' }
      ]
    });

    const response = await request(app).get('/api/categories');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toMatchObject({ id: 1, name: 'WordPress Themes' });
    expect(query).toHaveBeenCalledTimes(1);
  });

  test('GET /api/items returns paginated filtered items', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ total: '2' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 11,
            name: 'Yoast SEO',
            category_id: 2,
            rating: 4.5,
            download_count: 1000
          },
          {
            id: 12,
            name: 'Rank Math',
            category_id: 2,
            rating: 4.7,
            download_count: 800
          }
        ]
      });

    const response = await request(app)
      .get('/api/items?page=1&limit=10&search=seo&category=2');

    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2,
      pages: 1
    });
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('GET /api/items/trending/items respects limit', async () => {
    query.mockResolvedValueOnce({
      rows: [{ id: 21, name: 'Astra', rating: 4.8, download_count: 2000 }]
    });

    const response = await request(app).get('/api/items/trending/items?limit=5');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(query).toHaveBeenCalledWith(
      'SELECT * FROM items ORDER BY rating DESC, download_count DESC LIMIT $1',
      [5]
    );
  });
});
