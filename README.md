# Cinepick Backend API

Node.js + Express + PostgreSQL backend for the existing Cinepick HTML/CSS/JavaScript app.

## Included
- Email/password registration and login (bcrypt password hashing, JWT sessions)
- Authenticated profile endpoint
- Public review list and authenticated create/edit/delete
- Review likes
- Per-account movie bookmarks
- Per-account ticketbook records
- PostgreSQL schema in `database/schema.sql`

## Requirements
- Node.js 20+
- PostgreSQL 14+
- A PostgreSQL database reachable from the backend host

## Local setup
1. Create a PostgreSQL database named `cinepick`.
2. Run `database/schema.sql` in that database.
3. Copy `.env.example` to `.env`.
4. Set `DATABASE_URL`, `JWT_SECRET` (32+ random characters), and `CLIENT_ORIGIN`.
5. Run:

```bash
npm install
npm run dev
```

Health check: `GET http://localhost:3000/api/health`

## API
- `POST /api/auth/register` `{ email, nickname, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (Bearer token)
- `GET /api/reviews?movieId=mov_001`
- `POST /api/reviews` (Bearer) `{ movieId, rating, title, content }`
- `PATCH /api/reviews/:id` (Bearer) `{ rating, title, content }`
- `DELETE /api/reviews/:id` (Bearer)
- `PUT /api/reviews/:id/like` / `DELETE /api/reviews/:id/like` (Bearer)
- `GET /api/bookmarks` (Bearer)
- `PUT /api/bookmarks/:movieId` / `DELETE /api/bookmarks/:movieId` (Bearer)
- `GET /api/tickets` (Bearer)
- `POST /api/tickets` (Bearer) `{ movieId, watchedOn, memo }`
- `DELETE /api/tickets/:id` (Bearer)

## Important integration notes
- The current frontend still uses browser `localStorage` for demo accounts and user records. This API is a backend foundation; the UI is not switched to API calls yet.
- Frontend must store the returned JWT carefully and send `Authorization: Bearer <token>` for protected routes. Do not store passwords.
- Movie records remain in the existing frontend/TMDB catalog. User-generated records refer to the current movie IDs as text.
- Configure CORS `CLIENT_ORIGIN` to the exact deployed frontend origin(s), comma-separated.
- Do not expose `.env`, database credentials, JWT secret, or TMDB secret keys in GitHub.
- Before public launch, add email verification, password reset, rate limiting, request logging, backups, and HTTPS. This starter does not claim production-hardening is complete.
