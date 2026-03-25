# WordPress Archive - Portfolio Case Study

## Headline
A full-stack recommendation-driven discovery app for WordPress themes and plugins.

## 1) Project Overview
WordPress Archive is a product-focused web application that helps users discover, evaluate, and act on WordPress themes/plugins faster. Instead of a basic searchable list, the app includes recommendation scoring, curated collections, stack generation by goal, side-by-side comparison, persistent favorites, and shareable snapshots.

This case study is written to show not only what was built, but why each technical decision mattered for user outcomes, delivery speed, and long-term maintainability.

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

## 5) Technology Choices and Why
### React (Frontend UI)
- What it solved: complex, stateful workflows (search, compare, favorites, stack generation, launch plans).
- Why it was chosen: component architecture makes feature growth predictable and easier to maintain.
- Practical benefit: faster iteration on user-facing features without rewriting core UI flows.

### Vite (Frontend Tooling)
- What it solved: development speed and build performance.
- Why it was chosen: very fast startup/HMR improves feedback loops while designing and testing UI decisions.
- Practical benefit: reduced development friction and quicker experimentation.

### Node.js + Express (Backend API)
- What it solved: flexible API development for recommendation, stack, compare, and planning endpoints.
- Why it was chosen: lightweight, fast to iterate, and ideal for JSON-first product APIs.
- Practical benefit: feature endpoints can be added quickly as product needs evolve.

### PostgreSQL (Data Layer)
- What it solved: reliable relational data model and efficient sorting/filtering/aggregation.
- Why it was chosen: strong SQL capabilities for ranking and dashboard-style insights.
- Practical benefit: consistent query behavior and scalable foundation for analytics expansion.

### Jest + Supertest (Integration Testing)
- What it solved: regression risk across API routes and recommendation workflows.
- Why it was chosen: straightforward route-level validation with minimal setup.
- Practical benefit: safer refactors and confidence during rapid feature expansion.

### GitHub Actions + Branch Protection (Delivery Quality)
- What it solved: inconsistent quality and release risk.
- Why it was chosen: automated lint/build/test gates and protected main branch policies.
- Practical benefit: cleaner merges, fewer breakages, and repeatable delivery.

### Docker + Deployment Blueprints
- What it solved: "works on my machine" setup issues.
- Why it was chosen: reproducible environments and easier handoff to other developers.
- Practical benefit: faster onboarding and smoother deployment across platforms.

## 6) Key Technical Work
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

## 7) Outcomes
- Faster decision workflow for end users
- Strong portfolio signal across product, UX, backend, testing, and DevOps
- Reusable platform for future features (accounts, public stack pages, trend analytics)

## 8) Why This Project Is Important and Useful
- It reduces user decision fatigue: people can move from searching to selecting with less friction.
- It bridges discovery and implementation: WP-CLI copy actions and stack generation convert "ideas" into action.
- It reflects real product development: ranking logic, UX workflows, API design, testing, CI, and deployment are integrated.
- It demonstrates engineering maturity: not only features, but maintainability, security posture, and delivery discipline.
- It is portfolio-relevant to hiring managers and clients: it proves end-to-end ownership from concept to deployable system.

## 9) Suggested Images to Include (With Why)
1. Homepage hero screenshot (search + category + trending visible)
Reason: immediately communicates product scope and visual polish.

2. Discovery Lab screenshot (Hidden Gems / Heavy Hitters / Fresh Finds)
Reason: highlights curated UX thinking beyond basic CRUD lists.

3. Recommendation Radar screenshot with scores visible
Reason: shows data-driven ranking and product intelligence.

4. Stack Builder screenshot (`goal` selected with generated stack)
Reason: demonstrates workflow design tied to real user outcomes.

5. Compare Bench screenshot (2-3 items side by side)
Reason: proves practical decision-support capability.

6. Launch Blueprint screenshot (checklist + WP-CLI commands)
Reason: shows implementation-focused feature depth and originality.

7. CI pipeline screenshot from GitHub Actions (all checks green)
Reason: validates production-grade engineering and quality controls.

8. Architecture diagram image (frontend/backend/db/deploy)
Reason: helps technical reviewers understand system boundaries quickly.

Image guidance:
- Use desktop width screenshots (at least 1440px) for clarity.
- Include short captions describing user value, not just feature names.
- Compress images for web performance.
- Add descriptive alt text for accessibility and SEO.

## 10) Challenges and Tradeoffs
- Data quality depends on scraping consistency and source markup
- Score weights are heuristic and may need calibration with user behavior data
- Local-only persistence is simple but not cross-device

## 11) What I’d Build Next
- Public stack pages with shareable slugs
- User accounts + cloud sync
- Trend delta analytics with time series snapshots
- Explainable recommendation breakdown per item

## 12) Links
- Repo: https://github.com/2242251mahmoud/wp-archive-fullstack
- Active enhancement PR: https://github.com/2242251mahmoud/wp-archive-fullstack/pull/8
