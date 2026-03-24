# WordPress Archive

A full-stack archive app that collects WordPress themes/plugins and presents them in a searchable interface with category filters, trending highlights, pagination, sorting, and backend health visibility.

## Highlights

- Search and category filtering
- Trending panel based on rating and download count
- Pagination for large datasets
- API health badge and retry flow in UI
- Scheduled scraper with PostgreSQL persistence
- Frontend and backend CI workflows on GitHub Actions
- Backend Dockerfile and local `docker-compose` stack
- PR/Issue templates and CODEOWNERS for better collaboration
- Security policy and Dependabot update automation

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
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── scraper.js
│   ├── Dockerfile
│   ├── seed.js
│   ├── seed-items.js
│   ├── tests/
│   │   └── health.test.js
│   ├── routes/
│   │   ├── items.js
│   │   └── categories.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   ├── .env.example
│   └── vercel.json
├── .github/workflows/frontend-ci.yml
├── .github/workflows/backend-ci.yml
├── .github/pull_request_template.md
├── .github/ISSUE_TEMPLATE/
├── .github/CODEOWNERS
├── .github/SECURITY.md
├── .github/dependabot.yml
├── render.yaml
└── docker-compose.yml
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

### 6. Run backend tests

```bash
cd backend
npm test
```

### 7. Run backend lint and syntax checks

```bash
cd backend
npm run lint
npm run check
```

### 8. Run backend with Docker (optional)

```bash
docker compose up --build
```

API will be available at `http://localhost:5001`.

## API Endpoints

- `GET /api`
- `GET /api/health`
- `GET /api/items?page=1&limit=50&search=&category=`
- `GET /api/items/:id`
- `GET /api/items/trending/items?limit=5`
- `GET /api/categories`

## CI

Frontend workflow `.github/workflows/frontend-ci.yml` runs on push/PR for frontend changes:

- `npm ci`
- `npm run lint`
- `npm run build`

Backend workflow `.github/workflows/backend-ci.yml` runs on push/PR for backend changes:

- `npm ci`
- `npm run lint`
- `npm run check`
- `npm test`

## Deployment

### Backend Deployment (Render/Railway/Fly.io/VM)

The repository includes `render.yaml` for Render Blueprint deployment.

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

If deploying with Docker, use `backend/Dockerfile`.

### Frontend Deployment (Vercel/Netlify)

The repository includes `frontend/vercel.json` for Vercel defaults.

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

## Collaboration Defaults

- Pull requests use `.github/pull_request_template.md`
- Issues use `.github/ISSUE_TEMPLATE/*`
- Owners are defined in `.github/CODEOWNERS`

## Security and Maintenance

- Vulnerability reporting policy: `.github/SECURITY.md`
- Automated dependency updates: `.github/dependabot.yml`
