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
