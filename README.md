# WordPress Archive

A full-stack archive app that collects WordPress themes/plugins and presents them in a searchable interface with category filters, trending highlights, pagination, sorting, and backend health visibility.

## Highlights

- Search and category filtering
- Trending panel based on rating and download count
- Pagination for large datasets
- API health badge and retry flow in UI
- Scheduled scraper with PostgreSQL persistence
- Frontend CI workflow (lint + build) on GitHub Actions

## Stack

### Backend
- Node.js
- Express
- PostgreSQL (`pg`)
- Cheerio + Axios
- node-cron

### Frontend
- React + Vite
- Plain CSS with responsive layout

## Project Structure

```text
wp-archive/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── scraper.js
│   ├── seed.js
│   ├── seed-items.js
│   ├── routes/
│   │   ├── items.js
│   │   └── categories.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   └── .env.example
└── .github/workflows/frontend-ci.yml
```

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`.

```env
PORT=5001
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wp_archive
NODE_ENV=development
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`.

```env
VITE_API_URL=http://localhost:5001/api
```

## Local Development

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Create database

```bash
createdb wp_archive
```

### 3. Configure env files

Create:
- `backend/.env`
- `frontend/.env`

### 4. Seed sample data (optional)

```bash
cd backend
node seed.js
node seed-items.js
```

### 5. Start apps

Terminal 1:

```bash
cd backend
npm start
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5001`

## API Endpoints

- `GET /api`
- `GET /api/health`
- `GET /api/items?page=1&limit=50&search=&category=`
- `GET /api/items/:id`
- `GET /api/items/trending/items?limit=5`
- `GET /api/categories`

## CI

GitHub Actions workflow at `.github/workflows/frontend-ci.yml` runs on push/PR for frontend changes:

- `npm ci`
- `npm run lint`
- `npm run build`

## Deployment

### Backend Deployment (Render/Railway/Fly.io/VM)

1. Provision PostgreSQL.
2. Set backend env variables from `backend/.env.example`.
3. Run backend service with:

```bash
npm start
```

4. Confirm health endpoint:

```text
GET /api/health
```

### Frontend Deployment (Vercel/Netlify)

1. Set root to `frontend`.
2. Build command:

```bash
npm run build
```

3. Output directory:

```text
dist
```

4. Set env variable:

```text
VITE_API_URL=https://your-backend-domain/api
```

## Troubleshooting

### "Cannot GET /api"

- Ensure backend process is restarted after code changes.
- Confirm backend runs on expected port (`5001` by default).
- Check `frontend/.env` points to correct API base URL.

### Frontend can not load items

- Confirm backend health: `GET /api/health`
- Verify CORS middleware is enabled in backend
- Ensure database credentials are valid

## License

MIT
