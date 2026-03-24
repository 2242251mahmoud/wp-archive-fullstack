# WordPress Archive - Portfolio Case Study

## Headline
A full-stack recommendation-driven discovery app for WordPress themes and plugins.

## 1) Project Overview
WordPress Archive is a product-focused web application that helps users discover, evaluate, and act on WordPress themes/plugins faster. Instead of a basic searchable list, the app includes recommendation scoring, curated collections, stack generation by goal, side-by-side comparison, persistent favorites, and shareable snapshots.

## 2) Problem
Most theme/plugin directories create decision fatigue:
- Long lists with weak prioritization
- Manual comparison burden
- No guided workflow from discovery to action

## 3) Solution
I built a decision-support experience with both product UX and engineering rigor:
- Discovery Lab: Hidden Gems, Heavy Hitters, Fresh Finds
- Recommendation Radar: score blend of quality + popularity + freshness
- Build My Stack: goal-based bundle generator (`seo`, `ecommerce`, etc.)
- Compare Bench: compare up to 3 items side by side
- Favorites Vault: local persistence for saved picks
- Share Snapshot: URL-based sharing of favorites + compare state
- WP-CLI copy actions from every card

## 4) Architecture
### Frontend
- React + Vite
- Component-driven UI with responsive CSS design language
- Local persistence (`localStorage`) for favorites

### Backend
- Node.js + Express
- PostgreSQL
- Endpoint layer designed for product workflows, not only CRUD

### Quality/Operations
- Frontend and backend CI workflows
- Integration tests via Jest + Supertest
- Branch protection, PR templates, issue templates, CODEOWNERS
- Release workflow on version bump
- Security policy + Dependabot automation
- Docker + docker-compose + Render/Vercel deploy config

## 5) Key Technical Work
### Recommendation scoring formula
The recommendation endpoint computes blended score from:
- Rating signal
- Download signal
- Recency signal (`updated_at` windowing)

This improves practical ranking quality compared to sorting by one metric.

### Goal-based stack generation
The stack endpoint maps product goals to semantic keyword families and returns ranked candidates.

### Testability-first server structure
Express app factory pattern enables route-level integration testing without full runtime side effects.

## 6) Outcomes
- Faster decision workflow for end users
- Strong portfolio signal across product, UX, backend, testing, and DevOps
- Reusable platform for future features (accounts, public stack pages, trend analytics)

## 7) Challenges and Tradeoffs
- Data quality depends on scraping consistency and source markup
- Score weights are heuristic and may need calibration with user behavior data
- Local-only persistence is simple but not cross-device

## 8) What I’d Build Next
- Public stack pages with shareable slugs
- User accounts + cloud sync
- Trend delta analytics with time series snapshots
- Explainable recommendation breakdown per item

## 9) Links
- Repo: https://github.com/2242251mahmoud/wp-archive-fullstack
- Active enhancement PR: https://github.com/2242251mahmoud/wp-archive-fullstack/pull/8
