# Troubleshooting Log - March 24, 2026

Author(s): Michael Hale and GitHub Copilot (GPT-5.3-Codex)

## Issue 1
Symptom:
- Seed and API connectivity problems against external Render Postgres.

Root cause:
- External Postgres connection required SSL/TLS.

Resolution:
- Updated backend DB connection logic to auto-enable SSL for render.com hosts or DB_SSL=true.

Verification:
- Seed scripts completed successfully.
- API health endpoint responded with status ok.

## Issue 2
Symptom:
- API endpoint sometimes showed empty results in deployed environment.

Root cause:
- Service/branch/database configuration mismatch during deployment iterations.

Resolution:
- Standardized deployment to service wp-archive-api-2 and corrected environment setup.
- Re-seeded data in target database.

Verification:
- /api/items returned populated JSON with total 9 items.

## Issue 3
Symptom:
- Frontend loaded then went blank.
- Browser console error: rating.toFixed is not a function.

Root cause:
- Rating values arrived as strings from API/database, but frontend called toFixed directly.

Resolution:
- Wrapped rating rendering with Number(...) conversion in:
  - frontend/src/components/ItemCard.jsx
  - frontend/src/components/Sidebar.jsx

Verification:
- UI renders correctly with ratings and no crash.

## Notes
- Browser warning about forced layout during stylesheet load is non-blocking and unrelated to the crash.
