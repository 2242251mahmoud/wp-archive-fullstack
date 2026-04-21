# Quick Reference - Recovery and Reuse

Author(s): Michael Hale and GitHub Copilot (GPT-5.3-Codex)

## If VS Code is reinstalled
1. Clone repository.
2. Checkout branch feat/release-tests-branch-protection.
3. Confirm frontend env var in Vercel:
   - VITE_API_URL=https://wp-archive-api-2.onrender.com/api
4. Confirm backend service and DB vars in Render.
5. Validate endpoints:
   - /api/health
   - /api/items?limit=5

## Commands Used
Backend seed:
- node seed.js
- node seed-items.js

Frontend and backend status checks:
- Open health endpoint in browser
- Open items endpoint in browser

## Known Good Behavior
- Home page shows categories, trending, recommendation cards, discovery lab, and all results.
- Ratings render as numeric values without crashing.

## Optional Next Improvements
- Rotate DB password and redeploy backend.
- Finalize smoke target URLs under .github/smoke-targets.env.
- Run smoke workflow after updating targets.
