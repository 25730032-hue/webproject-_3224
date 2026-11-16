# CINEPICK Backend

Node.js + Express + PostgreSQL REST API.

## Included
- Email/password registration and login (bcrypt hash + JWT)
- Session restore (`GET /api/auth/me`)
- Review CRUD and likes
- User bookmarks
- Ticketbook records
- PostgreSQL schema and health check

## Local setup
1. Install Node.js 20+ and PostgreSQL 14+.
2. Create an empty database named `cinepick`.
3. Run `psql "$DATABASE_URL" -f database/schema.sql`.
4. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, a random `JWT_SECRET` (32+ chars), and `CLIENT_ORIGIN`.
5. `npm install`
6. `npm run dev`
7. Open `http://localhost:3000/api/health` and confirm `{"status":"ok","database":"connected"}`.

Never commit `.env`. Only `.env.example` belongs in Git.

## Environment
- `PORT`: server port (default 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: random secret, 32+ characters
- `CLIENT_ORIGIN`: comma-separated allowed frontend origins

## API
- `POST /api/auth/register` `{email,nickname,password}` (password 8+ chars)
- `POST /api/auth/login` `{email,password}`
- `GET /api/auth/me` (Bearer token)
- `GET /api/reviews?movieId=...`
- `POST /api/reviews` `{movieId,rating,title,content}` (auth)
- `PATCH /api/reviews/:id` `{rating,title,content}` (auth, owner)
- `DELETE /api/reviews/:id` (auth, owner)
- `PUT/DELETE /api/reviews/:id/like` (auth)
- `GET /api/bookmarks` (auth)
- `PUT/DELETE /api/bookmarks/:movieId` (auth)
- `GET/POST /api/tickets` (auth; POST `{movieId,watchedOn,memo}`)
- `DELETE /api/tickets/:id` (auth)

## Before public launch
Configure HTTPS, database backups, rate limiting, email verification, password reset, monitoring, and a production database. Set CORS to the exact frontend domain. Do not use demo credentials or commit secrets.
