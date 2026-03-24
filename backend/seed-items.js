const { query, pool } = require('./db');

const seedItems = async () => {
  try {
    console.log('Seeding database with sample items...');

    const sampleItems = [
      // Themes
      {
        name: 'Astra',
        slug: 'astra',
        description: 'Astra is a fast, lightweight & customizable WordPress theme built with a focus on speed and modern design.',
        author: 'Brainstorm Force',
        category_id: 1,
        rating: 4.8,
        download_link: 'https://wordpress.org/themes/astra/'
      },
      {
        name: 'Hello Elementor',
        slug: 'hello-elementor',
        description: 'A lightweight WordPress theme designed to work seamlessly with Elementor page builder.',
        author: 'Elementor',
        category_id: 1,
        rating: 4.7,
        download_link: 'https://wordpress.org/themes/hello-elementor/'
      },
      {
        name: 'OceanWP',
        slug: 'oceanwp',
        description: 'OceanWP is a beautiful, multi-purpose WordPress theme that is fast, customizable & SEO friendly.',
        author: 'OceanWP',
        category_id: 1,
        rating: 4.6,
        download_link: 'https://wordpress.org/themes/oceanwp/'
      },
      {
        name: 'Neve',
        slug: 'neve',
        description: 'Neve is a super fast, deeply customizable, and SEO friendly WordPress theme.',
        author: 'Themeisle',
        category_id: 1,
        rating: 4.8,
        download_link: 'https://wordpress.org/themes/neve/'
      },
      // Plugins
      {
        name: 'Elementor',
        slug: 'elementor-website-builder',
        description: 'Build beautiful, professional websites with Elementor visual page builder.',
        author: 'Elementor.com',
        category_id: 2,
        rating: 4.7,
        download_link: 'https://wordpress.org/plugins/elementor/'
      },
      {
        name: 'Yoast SEO',
        slug: 'wordpress-seo',
        description: 'Improve your WordPress SEO: write better content and have a fully optimized WordPress site.',
        author: 'Team Yoast',
        category_id: 2,
        rating: 4.5,
        download_link: 'https://wordpress.org/plugins/wordpress-seo/'
      },
      {
        name: 'WooCommerce',
        slug: 'woocommerce',
        description: 'An open-source eCommerce plugin that helps you sell anything, beautifully.',
        author: 'Automattic',
        category_id: 2,
        rating: 4.6,
        download_link: 'https://wordpress.org/plugins/woocommerce/'
      },
      {
        name: 'Akismet',
        slug: 'akismet',
        description: 'Akismet checks your comments and trackbacks against their global database.',
        author: 'Automattic',
        category_id: 2,
        rating: 4.3,
        download_link: 'https://wordpress.org/plugins/akismet/'
      },
      {
        name: 'Jetpack',
        slug: 'jetpack',
        description: 'Jetpack brings the power of WordPress.com to every WordPress site.',
        author: 'Automattic',
        category_id: 2,
        rating: 4.2,
        download_link: 'https://wordpress.org/plugins/jetpack/'
      },
    ];

    for (const item of sampleItems) {
      try {
        await query(
          `INSERT INTO items (name, slug, description, author, category_id, rating, download_link, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
           ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $3, author = $4, rating = $6, download_link = $7, updated_at = NOW()`,
          [item.name, item.slug, item.description, item.author, item.category_id, item.rating, item.download_link]
        );
      } catch (err) {
        console.error(`Error inserting ${item.name}:`, err.message);
      }
    }

    console.log('Sample items seeded successfully');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedItems();
