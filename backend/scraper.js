const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const { query } = require('./db');

const WORDPRESS_THEMES_URL = 'https://wordpress.org/themes/';
const WORDPRESS_PLUGINS_URL = 'https://wordpress.org/plugins/';

const scrapeThemes = async () => {
  try {
    console.log('Starting theme scrape...');

    // For now, scrape a few pages of themes
    for (let page = 1; page <= 2; page++) {
      const url = `${WORDPRESS_THEMES_URL}?page=${page}`;

      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(response.data);

        // Scrape theme cards
        const themes = [];
        $('article.plugin-card').each((i, elem) => {
          const $elem = $(elem);

          const name = $elem.find('h3 a').text().trim();
          const description = $elem.find('.description').text().trim();
          const author = $elem.find('.author').text().replace('By ', '').trim();
          const rating = parseFloat($elem.find('.star-rating').attr('aria-label')?.split(' ')[0]) || 0;
          const link = $elem.find('h3 a').attr('href');

          if (name) {
            themes.push({
              name,
              description,
              author,
              rating,
              link,
              type: 'theme'
            });
          }
        });

        // Save to database
        for (const theme of themes) {
          try {
            // Get or create category
            let categoryId = 1; // Default category

            const result = await query(
              `INSERT INTO items (name, slug, description, author, category_id, rating, download_link, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
               ON CONFLICT (slug) DO UPDATE SET
               name = $1, description = $3, author = $4, rating = $6, download_link = $7, updated_at = NOW()`,
              [
                theme.name,
                theme.name.toLowerCase().replace(/\s+/g, '-'),
                theme.description,
                theme.author,
                categoryId,
                theme.rating,
                theme.link
              ]
            );
          } catch (err) {
            // Ignore duplicate or error
          }
        }

        console.log(`Scraped ${themes.length} themes from page ${page}`);
      } catch (err) {
        console.error(`Error scraping theme page ${page}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Theme scrape error:', err);
  }
};

const scrapePlugins = async () => {
  try {
    console.log('Starting plugin scrape...');

    // For now, scrape a few pages of plugins
    for (let page = 1; page <= 2; page++) {
      const url = `${WORDPRESS_PLUGINS_URL}?page=${page}`;

      try {
        const response = await axios.get(url, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(response.data);

        // Scrape plugin cards
        const plugins = [];
        $('article.plugin-card').each((i, elem) => {
          const $elem = $(elem);

          const name = $elem.find('h3 a').text().trim();
          const description = $elem.find('.description').text().trim();
          const author = $elem.find('.author').text().replace('By ', '').trim();
          const rating = parseFloat($elem.find('.star-rating').attr('aria-label')?.split(' ')[0]) || 0;
          const link = $elem.find('h3 a').attr('href');

          if (name) {
            plugins.push({
              name,
              description,
              author,
              rating,
              link,
              type: 'plugin'
            });
          }
        });

        // Save to database
        for (const plugin of plugins) {
          try {
            let categoryId = 2; // Default category for plugins

            const result = await query(
              `INSERT INTO items (name, slug, description, author, category_id, rating, download_link, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
               ON CONFLICT (slug) DO UPDATE SET
               name = $1, description = $3, author = $4, rating = $6, download_link = $7, updated_at = NOW()`,
              [
                plugin.name,
                plugin.name.toLowerCase().replace(/\s+/g, '-'),
                plugin.description,
                plugin.author,
                categoryId,
                plugin.rating,
                plugin.link
              ]
            );
          } catch (err) {
            // Ignore duplicate or error
          }
        }

        console.log(`Scraped ${plugins.length} plugins from page ${page}`);
      } catch (err) {
        console.error(`Error scraping plugin page ${page}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Plugin scrape error:', err);
  }
};

const startScraperSchedule = () => {
  // Run scraper on startup
  scrapeThemes();
  scrapePlugins();

  // Schedule to run weekly (every Sunday at 2 AM)
  cron.schedule('0 2 * * 0', () => {
    console.log('Running scheduled scraper...');
    scrapeThemes();
    scrapePlugins();
  });
};

module.exports = { startScraperSchedule, scrapeThemes, scrapePlugins };
