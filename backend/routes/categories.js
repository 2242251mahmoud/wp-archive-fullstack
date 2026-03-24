const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT c.*, COUNT(i.id) as item_count FROM categories c LEFT JOIN items i ON c.id = i.category_id GROUP BY c.id ORDER BY c.name'
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
