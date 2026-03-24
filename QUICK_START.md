# WordPress Archive - Quick Start Guide

## Project Created! 🎉

Your WordPress theme/plugin archive web application is now ready to use!

## Current Status

- ✅ Backend: Running on `http://localhost:5001`
- ✅ Frontend: Running on `http://localhost:5173`
- ✅ Database: PostgreSQL (wp_archive) with sample data
- ✅ Sample Data: 9 WordPress themes and plugins loaded

## Access the Application

**Open your browser and go to:** `http://localhost:5173`

## What You'll See

- **Search Bar**: Search for WordPress themes and plugins
- **Categories**: Filter by "WordPress Themes" or "WordPress Plugins" in the sidebar
- **Item Cards**: Beautiful cards displaying theme/plugin details with ratings and links
- **Pagination**: Navigate through pages of items (50 items per page)
- **Trending Section**: See trending themes and plugins (sorted by rating)

## Features Ready to Use

1. **Search & Browse** - Search for any theme or plugin by name or description
2. **Filter by Category** - Click category names in the sidebar to filter
3. **Responsive Design** - Works on desktop, tablet, and mobile
4. **Direct Links** - Each item links directly to WordPress.org

## API Endpoints Available

### Get Items
```bash
curl 'http://localhost:5001/api/items?page=1&limit=50'
curl 'http://localhost:5001/api/items?search=elementor'
curl 'http://localhost:5001/api/items?category=2'
```

### Get Categories
```bash
curl 'http://localhost:5001/api/categories'
```

### Get Trending
```bash
curl 'http://localhost:5001/api/items/trending/items?limit=5'
```

## Sample Data Included

**Themes (4):**
- Astra (4.8★)
- Hello Elementor (4.7★)
- OceanWP (4.6★)
- Neve (4.8★)

**Plugins (5):**
- Elementor (4.7★)
- Yoast SEO (4.5★)
- WooCommerce (4.6★)
- Akismet (4.3★)
- Jetpack (4.2★)

## Next Steps

### Add More Data
1. **Run Real Scraper**: The app is set up to scrape WordPress.org weekly
   - The scraper tries to pull data automatically but may need URL adjustments
   - To trigger manual scraping, restart the backend

2. **Add Custom Data**: You can manually add themes/plugins to the database

### Customize
- Modify theme colors in `frontend/src/App.css`
- Add more filters in `frontend/src/components/Sidebar.jsx`
- Extend scraper in `backend/scraper.js`
- Add features like user accounts (see README.md for ideas)

### Deployment
- Build frontend: `npm run build` (creates dist/ folder)
- Deploy to: Netlify, Vercel, or any Node.js host
- Update API URL in `frontend/src/App.jsx` to match production backend

## Common Commands

### Run Everything
Terminal 1 (Backend):
```bash
cd /Users/coder/SRC/wp-archive/backend
npm start
```

Terminal 2 (Frontend):
```bash
cd /Users/coder/SRC/wp-archive/frontend
npm run dev
```

### Seed Data
```bash
# Add default categories
cd backend && node seed.js

# Add sample themes/plugins
cd backend && node seed-items.js
```

### Database
```bash
# Connect to database
psql wp_archive

# View tables
\dt

# Check data
SELECT * FROM items LIMIT 5;
```

## Project Structure

```
wp-archive/
├── backend/          (Express API server)
│   ├── server.js     (Main server)
│   ├── db.js         (Database connection & schema)
│   ├── routes/       (API routes)
│   ├── scraper.js    (WordPress.org scraper)
│   ├── seed.js       (Category seeding)
│   └── .env          (Configuration)
├── frontend/         (React + Vite)
│   ├── src/
│   │   ├── App.jsx   (Main component)
│   │   ├── components/ (UI components)
│   │   └── App.css   (Styling)
│   └── package.json
├── README.md         (Full documentation)
└── QUICK_START.md    (This file)
```

## Troubleshooting

### Backend Won't Start
- Ensure PostgreSQL is running: `brew services start postgresql@16`
- Check database exists: `psql -l | grep wp_archive`
- Verify port 5001 is free: `lsof -i :5001`

### Frontend Won't Start
- Install dependencies: `cd frontend && npm install`
- Clear cache: `rm -rf frontend/node_modules && npm install`
- Check port 5173 is free: `lsof -i :5173`

### No Data Showing
- Seed database: `node backend/seed-items.js`
- Check API: `curl http://localhost:5001/api/categories`
- Check browser console for errors (F12)

### CORS Issues
- Verify backend is running on 5001
- Ensure `cors()` is enabled in server.js
- Check API_URL in frontend App.jsx

## Need Help?

- Backend logs: Check terminal running `npm start` in backend/
- Frontend logs: Check browser DevTools (F12)
- Database: Connect with `psql wp_archive` and inspect data

---

**You're ready to go! Open http://localhost:5173 in your browser to see your WordPress Archive in action.** 🚀
