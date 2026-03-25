const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/items', itemRoutes);
  app.use('/api/categories', categoryRoutes);

  app.get('/api', (req, res) => {
    res.json({
      message: 'WordPress Archive API',
      endpoints: {
        health: '/api/health',
        items: '/api/items',
        categories: '/api/categories',
        trending: '/api/items/trending/items',
        collections: '/api/items/collections',
        insights: '/api/items/insights',
        recommendations: '/api/items/recommendations',
        stack: '/api/items/stack?goal=seo',
        implementation_plan: '/api/items/implementation-plan?ids=1,2&profile=personal-brand',
        compare: '/api/items/compare?ids=1,2'
      }
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

module.exports = { createApp };
