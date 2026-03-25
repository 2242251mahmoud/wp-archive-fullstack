# WordPress Archive

[![Frontend CI](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/backend-ci.yml)
[![Post Deploy Smoke Test](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/post-deploy-smoke.yml/badge.svg)](https://github.com/2242251mahmoud/wp-archive-fullstack/actions/workflows/post-deploy-smoke.yml)

A full-stack archive app that collects WordPress themes/plugins and presents them in a searchable interface with category filters, trending highlights, pagination, sorting, and backend health visibility.

## Live Demo

- Frontend: `https://your-frontend-domain`
- API health: `https://your-api-domain/api/health`

Replace these with your production URLs after deployment.

## Highlights

- Search and category filtering
- Trending panel based on rating and download count
- Pagination for large datasets
- API health badge and retry flow in UI
- Discovery Lab collections (Hidden Gems, Heavy Hitters, Fresh Finds)
- Favorites Vault persisted in local storage
- Compare Bench for side-by-side item comparison
- One-click WP-CLI install command copy per item card
- Insights panel with live archive statistics
- Recommendation Radar endpoint and UI section
- Goal-driven Stack Builder for common site outcomes
- Shareable snapshot links for favorites and compare selections
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

## Architecture

```mermaid
flowchart LR
	U[User Browser] --> F[Frontend: React + Vite]
	F -->|HTTP /api| A[Backend API: Node.js + Express]
	A --> Q[(PostgreSQL)]
	A --> S[Scraper + Scheduler]
	S --> W[WordPress.org Data Sources]
	A --> H[/api/health]
```

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
├── .github/branch-protection.md
├── .github/workflows/release-on-version-bump.yml
├── .github/workflows/pr-title.yml
├── .github/workflows/dependency-review.yml
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
- `GET /api/items/collections?limit=6`
- `GET /api/items/insights`
- `GET /api/items/recommendations?limit=8`
- `GET /api/items/stack?goal=seo`
- `GET /api/items/compare?ids=1,2`
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

Release workflow `.github/workflows/release-on-version-bump.yml` runs on push to `main` when root `package.json` changes:

- Reads `version`
- Creates tag `v<version>` if it does not already exist
- Publishes a GitHub release with auto-generated release notes

PR title workflow `.github/workflows/pr-title.yml` enforces conventional commit style pull request titles.

Dependency review workflow `.github/workflows/dependency-review.yml` scans dependency diffs on pull requests.

Post-deploy smoke workflow `.github/workflows/post-deploy-smoke.yml` can run on schedule or manually and validates deployed frontend/API URLs.

Configure smoke targets in `.github/smoke-targets.env`:

- `SMOKE_FRONTEND_URL=https://your-frontend-domain`
- `SMOKE_API_HEALTH_URL=https://your-api-domain/api/health`

## Deployment

### Deploy Now

API deployment shortcuts:

- [![Deploy API on Render](https://img.shields.io/badge/Deploy%20API-Render-46E3B7?logo=render&logoColor=black)](https://render.com/deploy?repo=https://github.com/2242251mahmoud/wp-archive-fullstack)
- [![Deploy API on Heroku](https://img.shields.io/badge/Deploy%20API-Heroku-430098?logo=heroku&logoColor=white)](https://www.heroku.com/deploy?template=https://github.com/2242251mahmoud/wp-archive-fullstack)
- [![Deploy API on Railway](https://img.shields.io/badge/Deploy%20API-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app/new)
- [![Deploy API on DigitalOcean](https://img.shields.io/badge/Deploy%20API-DigitalOcean-0080FF?logo=digitalocean&logoColor=white)](https://cloud.digitalocean.com/apps/new)
- [![Deploy API on Linode](https://img.shields.io/badge/Deploy%20API-Linode-00A95C?logo=linode&logoColor=white)](https://cloud.linode.com/)

Frontend deployment shortcuts:

- [![Deploy Frontend on Vercel](https://img.shields.io/badge/Deploy%20Frontend-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/2242251mahmoud/wp-archive-fullstack&root-directory=frontend)
- [![Deploy Frontend on Netlify](https://img.shields.io/badge/Deploy%20Frontend-Netlify-00C7B7?logo=netlify&logoColor=white)](https://app.netlify.com/start)

Recommended production setup:

- Deploy API to Render/Heroku/Railway/DigitalOcean/Linode.
- Deploy frontend to Vercel/Netlify.
- Set `VITE_API_URL` in frontend to your deployed API URL plus `/api`.

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

### Heroku Quick Deploy Notes

The repository includes a root `app.json` and `Procfile` for Heroku deploy-button compatibility.

1. Click the Heroku deploy badge.
2. Provision `heroku-postgresql` addon during setup.
3. Set required DB env vars if your plan does not auto-wire all values.
4. Confirm health endpoint:

```text
GET /api/health
```

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

### Deploy button created app but API fails at runtime

- Confirm `NODE_ENV=production` and `PORT` are set by platform runtime.
- Verify database host/user/password/database values are present.
- For Heroku, verify Postgres addon is attached and credentials are mapped.

### Frontend deploy works but backend calls fail in production

- Ensure `VITE_API_URL` is set in frontend platform settings.
- Confirm value includes `/api` suffix.
- Rebuild frontend after updating environment variables.

### Smoke test workflow is skipped

- Set real deployment URLs in `.github/smoke-targets.env`.
- Re-run workflow from Actions tab or wait for next schedule.

## Monitoring

For ongoing uptime visibility, create monitors in UptimeRobot (or Better Stack) for:

- Frontend URL (200 expected)
- API health URL `/api/health` (200 expected)

After creating monitors, add your public status page link in this README and optionally replace badges with provider-specific status badges.

## License

MIT

## Collaboration Defaults

- Pull requests use `.github/pull_request_template.md`
- Issues use `.github/ISSUE_TEMPLATE/*`
- Owners are defined in `.github/CODEOWNERS`
- Main branch protection policy is documented in `.github/branch-protection.md`

## Security and Maintenance

- Vulnerability reporting policy: `.github/SECURITY.md`
- Automated dependency updates: `.github/dependabot.yml`

## Portfolio Kit

Use these ready-made assets to showcase this project on your personal website:

- `portfolio-kit/case-study.md` - long-form narrative case study
- `portfolio-kit/case-study-short.md` - concise portfolio-ready case study version
- `portfolio-kit/project-data.json` - structured project metadata for dynamic site rendering
- `portfolio-kit/case-study.html` - standalone polished case study web page
- `PORTFOLIO_CASE_STUDY.md` - expanded engineering + product storytelling
- `PORTFOLIO_SNIPPETS.md` - resume and project card snippets

Recent app additions include a Launch Blueprint module that generates implementation checklists and WP-CLI command packs from selected items.

Personal owner-only prep materials are maintained in a separate private companion repository.
