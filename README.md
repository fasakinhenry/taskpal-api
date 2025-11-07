# taskpal-api

A marketplace where users can post small tasks(errands,repairs, deliveries) and others can accept them"

## Setup

- copy `.env.example` to `.env` and fill values
- `npm install`
- `npm run dev` (use nodemon)

## Notes

- JWT stored in secure httpOnly cookie named `token`.
- Cursor-based pagination via `GET /api/tasks?limit=10&cursor=<cursor>`.
- Google OAuth placeholder exists at `/api/auth/google`.
