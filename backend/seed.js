const { query } = require('./db');

const seedDatabase = async () => {
  try {
    console.log('Seeding database with categories...');

    await query(`
      INSERT INTO categories (name, type) VALUES
      ('WordPress Themes', 'theme'),
      ('WordPress Plugins', 'plugin')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
