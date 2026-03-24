const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./db');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const { startScraperSchedule } = require('./scraper');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Start scheduled scraper
startScraperSchedule();

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

// API index route
app.get('/api', (req, res) => {
  res.json({
    message: 'WordPress Archive API',
    endpoints: {
      health: '/api/health',
      items: '/api/items',
      categories: '/api/categories',
      trending: '/api/items/trending/items'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
