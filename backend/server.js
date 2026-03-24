require('dotenv').config();
const { initDB } = require('./db');
const { startScraperSchedule } = require('./scraper');
const { createApp } = require('./app');

const app = createApp();

// Initialize database
initDB();

// Start scheduled scraper
startScraperSchedule();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
