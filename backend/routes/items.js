const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Get items with pagination, search, and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const category = req.query.category;

    const offset = (page - 1) * limit;

    let baseQuery = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (search) {
      baseQuery += ' AND (name ILIKE $1 OR description ILIKE $1)';
      params.push(`%${search}%`);
    }

    if (category && category !== 'all') {
      const paramIndex = params.length + 1;
      baseQuery += ` AND category_id = $${paramIndex}`;
      params.push(parseInt(category));
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM (${baseQuery.replace('SELECT *', 'SELECT 1')}) as t`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const itemsQuery = baseQuery + ' ORDER BY updated_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await query(itemsQuery, params);

    res.json({
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get trending items (most downloaded/viewed)
router.get('/trending/items', async (req, res) => {
  try {
    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

    const result = await query(
      'SELECT * FROM items ORDER BY rating DESC, download_count DESC LIMIT $1',
      [limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trending:', err);
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
});

// Get curated discovery collections
router.get('/collections', async (req, res) => {
  try {
    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 6;

    const [hiddenGems, heavyHitters, freshFinds] = await Promise.all([
      query(
        'SELECT * FROM items WHERE rating >= 4.5 ORDER BY download_count ASC NULLS LAST, rating DESC LIMIT $1',
        [limit]
      ),
      query(
        'SELECT * FROM items ORDER BY download_count DESC NULLS LAST, rating DESC LIMIT $1',
        [limit]
      ),
      query(
        'SELECT * FROM items ORDER BY updated_at DESC NULLS LAST, rating DESC LIMIT $1',
        [limit]
      )
    ]);

    res.json({
      hidden_gems: hiddenGems.rows,
      heavy_hitters: heavyHitters.rows,
      fresh_finds: freshFinds.rows
    });
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get archive insights for dashboard cards
router.get('/insights', async (req, res) => {
  try {
    const [statsResult, topCategoryResult, topRatedResult] = await Promise.all([
      query(
        `SELECT
          COUNT(*)::int AS total_items,
          COALESCE(AVG(rating), 0)::numeric(10,2) AS avg_rating,
          COALESCE(MAX(download_count), 0)::int AS max_download_count
         FROM items`
      ),
      query(
        `SELECT c.name, COUNT(i.id)::int AS item_count
         FROM categories c
         LEFT JOIN items i ON i.category_id = c.id
         GROUP BY c.name
         ORDER BY item_count DESC, c.name ASC
         LIMIT 1`
      ),
      query(
        `SELECT name, rating, download_count
         FROM items
         ORDER BY rating DESC NULLS LAST, download_count DESC NULLS LAST
         LIMIT 1`
      )
    ]);

    res.json({
      stats: statsResult.rows[0] || { total_items: 0, avg_rating: 0, max_download_count: 0 },
      top_category: topCategoryResult.rows[0] || null,
      top_rated: topRatedResult.rows[0] || null
    });
  } catch (err) {
    console.error('Error fetching insights:', err);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// Get recommendation-ranked items using blended quality/popularity/freshness score
router.get('/recommendations', async (req, res) => {
  try {
    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 12;

    const result = await query(
      `SELECT
         i.*,
         ROUND(
           (
             COALESCE(i.rating, 0) * 0.58 +
             LEAST(COALESCE(i.download_count, 0) / 100000.0, 5) * 0.27 +
             CASE
               WHEN i.updated_at >= NOW() - INTERVAL '90 days' THEN 0.9
               WHEN i.updated_at >= NOW() - INTERVAL '180 days' THEN 0.55
               ELSE 0.2
             END * 0.15
           )::numeric,
           3
         ) AS recommendation_score
       FROM items i
       ORDER BY recommendation_score DESC, i.rating DESC NULLS LAST, i.download_count DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Build a practical stack by goal keyword
router.get('/stack', async (req, res) => {
  try {
    const goal = (req.query.goal || 'launch-fast').toString().toLowerCase();
    const goalPatterns = {
      seo: ['seo', 'rank', 'metadata', 'schema'],
      ecommerce: ['commerce', 'checkout', 'cart', 'payment', 'shop'],
      performance: ['cache', 'speed', 'optimi', 'performance'],
      security: ['security', 'firewall', 'protect', 'spam'],
      blog: ['blog', 'editor', 'content', 'post'],
      'launch-fast': ['starter', 'elementor', 'builder', 'easy', 'template']
    };

    const patterns = goalPatterns[goal] || goalPatterns['launch-fast'];
    const likeFilters = [];
    const params = [];

    patterns.forEach((token, index) => {
      const paramPosition = index + 1;
      params.push(`%${token}%`);
      likeFilters.push(`(name ILIKE $${paramPosition} OR description ILIKE $${paramPosition})`);
    });

    const queryText = `
      SELECT
        *,
        ROUND((COALESCE(rating, 0) * 0.7 + LEAST(COALESCE(download_count, 0) / 100000.0, 5) * 0.3)::numeric, 3) AS stack_score
      FROM items
      WHERE ${likeFilters.join(' OR ')}
      ORDER BY stack_score DESC, rating DESC NULLS LAST, download_count DESC NULLS LAST
      LIMIT 8
    `;

    const result = await query(queryText, params);
    res.json({ goal, patterns, items: result.rows });
  } catch (err) {
    console.error('Error building stack:', err);
    res.status(500).json({ error: 'Failed to build stack' });
  }
});

// Compare up to 3 items by ids query parameter
router.get('/compare', async (req, res) => {
  try {
    const idsParam = (req.query.ids || '').toString();
    const ids = idsParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => Number.isFinite(id));

    if (ids.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 valid item ids in ids query parameter' });
    }

    const uniqueIds = [...new Set(ids)].slice(0, 3);
    const placeholders = uniqueIds.map((_, i) => `$${i + 1}`).join(', ');
    const result = await query(
      `SELECT * FROM items WHERE id IN (${placeholders}) ORDER BY rating DESC NULLS LAST, download_count DESC NULLS LAST`,
      uniqueIds
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error('Error comparing items:', err);
    res.status(500).json({ error: 'Failed to compare items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

module.exports = router;
