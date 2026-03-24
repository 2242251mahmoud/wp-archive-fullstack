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

  test('GET /api/items/collections returns curated groups', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Gem One' }] })
      .mockResolvedValueOnce({ rows: [{ id: 2, name: 'Hit One' }] })
      .mockResolvedValueOnce({ rows: [{ id: 3, name: 'Fresh One' }] });

    const response = await request(app).get('/api/items/collections?limit=1');

    expect(response.statusCode).toBe(200);
    expect(response.body.hidden_gems).toHaveLength(1);
    expect(response.body.heavy_hitters).toHaveLength(1);
    expect(response.body.fresh_finds).toHaveLength(1);
    expect(query).toHaveBeenCalledTimes(3);
  });

  test('GET /api/items/insights returns summary payload', async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ total_items: 9, avg_rating: '4.57', max_download_count: 10000 }]
      })
      .mockResolvedValueOnce({
        rows: [{ name: 'WordPress Plugins', item_count: 5 }]
      })
      .mockResolvedValueOnce({
        rows: [{ name: 'Astra', rating: 4.8, download_count: 10000 }]
      });

    const response = await request(app).get('/api/items/insights');

    expect(response.statusCode).toBe(200);
    expect(response.body.stats.total_items).toBe(9);
    expect(response.body.top_category.name).toBe('WordPress Plugins');
    expect(response.body.top_rated.name).toBe('Astra');
  });

  test('GET /api/items/compare rejects insufficient ids', async () => {
    const response = await request(app).get('/api/items/compare?ids=2');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/at least 2/i);
  });

  test('GET /api/items/recommendations returns scored results', async () => {
    query.mockResolvedValueOnce({
      rows: [{ id: 32, name: 'Recommendation Item', recommendation_score: 4.321 }]
    });

    const response = await request(app).get('/api/items/recommendations?limit=3');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].recommendation_score).toBe(4.321);
  });

  test('GET /api/items/stack returns goal-based items', async () => {
    query.mockResolvedValueOnce({
      rows: [{ id: 44, name: 'Stack Candidate', stack_score: 4.112 }]
    });

    const response = await request(app).get('/api/items/stack?goal=seo');

    expect(response.statusCode).toBe(200);
    expect(response.body.goal).toBe('seo');
    expect(response.body.items).toHaveLength(1);
  });
});
