# WordPress Archive - Web Scraping & Data Display

A full-stack web application that scrapes WordPress themes and plugins from WordPress.org and displays them in a modern, searchable interface - similar to wplocker.com.

## Features

- 🔍 **Search & Filter**: Search themes and plugins with real-time filtering
- 📂 **Category Browse**: Browse content by category
- 📊 **Trending Section**: Discover trending themes and plugins
- ⚡ **Fast & Responsive**: Built with React and Express for optimal performance
- 🗄️ **Database Storage**: PostgreSQL for reliable data persistence
- 🤖 **Automatic Scraping**: Scheduled scraper collects data from WordPress.org weekly

## Tech Stack

### Backend
- **Node.js + Express** - API server
- **PostgreSQL** - Database
- **Cheerio** - Web scraping
- **Node-cron** - Scheduled tasks
- **Axios** - HTTP requests

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS** - Styling

## Project Structure

```
wp-archive/
├── backend/
│   ├── server.js          # Main server file
│   ├── db.js              # Database setup and queries
│   ├── scraper.js         # WordPress.org scraper
│   ├── routes/
│   │   ├── items.js       # Items API endpoints
│   │   └── categories.js  # Categories API endpoints
│   ├── package.json
│   └── .env               # Environment variables
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main app component
    │   ├── App.css        # Styles
    │   ├── components/
    │   │   ├── ItemCard.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── Pagination.jsx
    │   │   └── Sidebar.jsx
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Homebrew (for macOS) or your OS package manager

### 1. Install PostgreSQL

**macOS (Homebrew)**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
createdb wp_archive

# Or using psql:
psql -U postgres
CREATE DATABASE wp_archive;
\q
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Update `.env` if needed:
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wp_archive
```

Start the backend:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Home Page**: Browse all themes and plugins
2. **Search**: Use the search bar to find specific items
3. **Filter by Category**: Click categories in the sidebar
4. **Pagination**: Navigate through pages of results
5. **Trending**: View trending items in the sidebar

## API Endpoints

### Items
- `GET /api/items` - List items with pagination
  - Query params: `page`, `limit`, `search`, `category`
- `GET /api/items/:id` - Get single item
- `GET /api/items/trending/items` - Get trending items
  - Query params: `limit`

### Categories
- `GET /api/categories` - List all categories with item counts

## Database Schema

### Tables

**categories**
- `id` (PRIMARY KEY)
- `name` (VARCHAR, UNIQUE)
- `type` (VARCHAR)
- `created_at` (TIMESTAMP)

**items**
- `id` (PRIMARY KEY)
- `name` (VARCHAR)
- `slug` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `author` (VARCHAR)
- `category_id` (FOREIGN KEY)
- `version` (VARCHAR)
- `rating` (DECIMAL)
- `download_count` (INTEGER)
- `download_link` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Scraper

The scraper automatically:
- Fetches themes from `https://wordpress.org/themes/`
- Fetches plugins from `https://wordpress.org/plugins/`
- Runs on startup and then weekly (Sunday at 2 AM)
- Stores data in the database
- Updates existing items if already in database

## Development

### Running Locally

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
# No build needed, run with: npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## Future Enhancements

- User accounts and authentication
- Comment system
- Download tracking
- Admin panel for scraper management
- Support for more sources (ThemeForest, CodeCanyon, etc.)
- Favorites/bookmarks
- Advanced filtering options

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check `.env` credentials match your PostgreSQL setup
- Verify database exists: `psql -l`

### Scraper Not Working
- Check internet connection
- Verify WordPress.org is accessible
- Check backend logs for errors

### Frontend Can't Connect to Backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled in `server.js`
- Verify no port conflicts

## License

MIT

## Notes

This is a learning project that demonstrates web scraping, full-stack development, and data aggregation. It respects WordPress.org's public content and robots.txt policies.
