const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'coder',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'wp_archive',
});

const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        author VARCHAR(255),
        category_id INTEGER REFERENCES categories(id),
        version VARCHAR(50),
        rating DECIMAL(3,2),
        download_count INTEGER DEFAULT 0,
        download_link VARCHAR(255),
        preview_url VARCHAR(255),
        active_installations VARCHAR(50),
        requires_version VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
      CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
      CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);
    `);

    console.log('Database tables created');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = { initDB, query, pool };
