# WordPress Archive - Product Case Study

## Project Summary

WordPress Archive is a full-stack discovery platform that aggregates WordPress themes and plugins into a modern search-and-decision experience. Instead of a basic catalog, the product focuses on helping users choose the right tools quickly through recommendations, curated collections, stack generation, and side-by-side comparison.

## Why I Built It

Most plugin/theme directories force users to manually browse long lists and compare options mentally. I wanted to design a discovery workflow that feels more like a product recommender than a static listing.

## Goals

- Reduce time to a confident theme/plugin decision
- Make discovery useful for both beginners and advanced builders
- Add practical utility features users can act on immediately
- Build a production-ready codebase with CI, tests, governance, and deployment config

## My Role

- Product design and UX strategy
- Frontend architecture and interaction design
- Backend API design and scoring logic
- Testing and CI/CD workflow implementation
- Documentation and portfolio storytelling

## Tech Stack

### Frontend
- React + Vite
- Component-based architecture
- Responsive CSS system with custom visual language

### Backend
- Node.js + Express
- PostgreSQL
- Structured API routes for search, collections, insights, recommendations, and stack generation

### Quality and DevOps
- GitHub Actions CI (frontend and backend)
- Jest + Supertest integration tests
- Branch protection rules and CODEOWNERS
- Dependabot and security policy
- Render + Vercel deployment config
- Docker and docker-compose for local/prod parity

## Product Features

### 1. Discovery Lab (Curated Collections)
- Hidden Gems
- Heavy Hitters
- Fresh Finds

This introduces editorial-style navigation instead of only keyword search.

### 2. Recommendation Radar
A blended recommendation score combines quality, popularity, and freshness into ranked picks.

### 3. Build My Stack
Users select a goal (SEO, ecommerce, performance, security, blog, launch-fast), and the app returns a practical plugin/theme stack.

### 4. Compare Bench
Users can add up to 3 items for side-by-side evaluation.

### 5. Favorites Vault
Personal saved items are persisted in local storage for return visits.

### 6. Share Snapshot
Users can generate shareable links that encode favorites and compare selections.

### 7. WP-CLI Quick Actions
Each card provides a one-click copy action for install commands, turning discovery into immediate execution.

## API Design Highlights

Key endpoints:

- `GET /api/items`
- `GET /api/items/trending/items`
- `GET /api/items/collections`
- `GET /api/items/insights`
- `GET /api/items/recommendations`
- `GET /api/items/stack?goal=seo`
- `GET /api/items/compare?ids=1,2,3`
- `GET /api/categories`

The API surface was designed to support decision workflows, not just listing data.

## Engineering Decisions

### Recommendation Scoring
I used a weighted blend instead of a single metric:

- Rating signal (quality)
- Download signal (adoption)
- Updated_at signal (freshness)

This avoids overfitting to one dimension and improves practical ranking quality.

### Testability First
The server uses an app factory pattern to isolate startup concerns from route logic, enabling efficient integration testing with mocked DB queries.

### Governance for Real Teams
I added branch protection, required checks, PR templates, issue templates, and CODEOWNERS so the project reads like production engineering work, not just a code demo.

## Challenges and Solutions

### Challenge: Endpoint ambiguity in Express routes
Dynamic route ordering caused path collisions.

Solution: Explicit route ordering for static paths before param routes, and tests to protect behavior.

### Challenge: Decision overload for end users
Raw lists made the product feel generic.

Solution: Add collections, recommendation radar, and stack builder to create guided discovery paths.

### Challenge: Portfolio credibility
A polished UI alone is not enough for strong portfolio signal.

Solution: Added CI pipelines, deployment config, test coverage, security automation, and product-level documentation.

## Results You Can Showcase

- Full-stack architecture with production-minded workflows
- Product-thinking features beyond CRUD
- Data-backed recommendation model
- Test-backed API endpoints
- CI + branch-protected collaboration model
- Strong UX with practical utility actions

## What I Would Build Next

- User accounts and cloud-synced favorites/stacks
- Trend delta analytics over time (rising/falling items)
- Saved/public stack pages with friendly URLs
- Optional AI-generated stack explanation summaries

## Portfolio Presentation Tips

When presenting this project on your website, emphasize:

1. Product thinking: discovery and decision support, not just listing
2. Full-stack depth: frontend UX + backend scoring + CI quality gates
3. Practicality: compare, share, WP-CLI actions, stack builder
4. Engineering maturity: tests, branch protection, security and release workflows

## Live Links

- Repository: https://github.com/2242251mahmoud/wp-archive-fullstack
- Pull Request (ongoing enhancements): https://github.com/2242251mahmoud/wp-archive-fullstack/pull/8
