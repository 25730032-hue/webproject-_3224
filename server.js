require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const { query } = require("./db");
const { signUser, requireAuth } = require("./auth");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters. Configure it in .env.");
}

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",").map((v) => v.trim())
    : false,
  credentials: false
}));
app.use(express.json({ limit: "1mb" }));

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get("/api/health", asyncRoute(async (_req, res) => {
  await query("SELECT 1");
  res.json({ status: "ok", database: "connected" });
}));

// Registration: passwords are hashed; plaintext passwords are never stored.
app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const nickname = String(req.body.nickname || "").trim();
  const password = String(req.body.password || "");
  if (!emailPattern.test(email)) return res.status(400).json({ error: "올바른 이메일을 입력해 주세요." });
  if (nickname.length < 2 || nickname.length > 24) return res.status(400).json({ error: "닉네임은 2~24자로 입력해 주세요." });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ error: "비밀번호는 8~72자로 입력해 주세요." });

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await query(
      `INSERT INTO users (email, nickname, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, nickname, created_at`,
      [email, nickname, passwordHash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: signUser(user), user });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "이미 가입된 이메일입니다." });
    throw err;
  }
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const result = await query(
    "SELECT id, email, nickname, password_hash, created_at FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "이메일 또는 비밀번호를 확인해 주세요." });
  }
  delete user.password_hash;
  res.json({ token: signUser(user), user });
}));

app.get("/api/auth/me", requireAuth, asyncRoute(async (req, res) => {
  const result = await query(
    "SELECT id, email, nickname, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
  res.json({ user: result.rows[0] });
}));

// Public movie reviews.
app.get("/api/reviews", asyncRoute(async (req, res) => {
  const movieId = req.query.movieId ? String(req.query.movieId) : null;
  const params = movieId ? [movieId] : [];
  const where = movieId ? "WHERE r.movie_id = $1" : "";
  const result = await query(
    `SELECT r.id, r.movie_id, r.rating, r.title, r.content, r.created_at,
            u.id AS user_id, u.nickname,
            COUNT(DISTINCT l.user_id)::int AS like_count
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     LEFT JOIN review_likes l ON l.review_id = r.id
     ${where}
     GROUP BY r.id, u.id
     ORDER BY r.created_at DESC
     LIMIT 100`,
    params
  );
  res.json({ reviews: result.rows });
}));

app.post("/api/reviews", requireAuth, asyncRoute(async (req, res) => {
  const movieId = String(req.body.movieId || "").trim();
  const rating = Number(req.body.rating);
  const title = String(req.body.title || "").trim().slice(0, 120);
  const content = String(req.body.content || "").trim();
  if (!movieId || !Number.isFinite(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0 || content.length < 1 || content.length > 5000) {
    return res.status(400).json({ error: "영화, 별점(0.5~5), 감상평(1~5000자)을 확인해 주세요." });
  }
  const result = await query(
    `INSERT INTO reviews (user_id, movie_id, rating, title, content)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, movie_id, rating, title, content, created_at`,
    [req.user.id, movieId, rating, title || null, content]
  );
  res.status(201).json({ review: result.rows[0] });
}));

app.patch("/api/reviews/:id", requireAuth, asyncRoute(async (req, res) => {
  const rating = Number(req.body.rating);
  const title = String(req.body.title || "").trim().slice(0, 120);
  const content = String(req.body.content || "").trim();
  if (!Number.isFinite(rating) || rating < 0.5 || rating > 5 || rating % 0.5 !== 0 || content.length < 1 || content.length > 5000) {
    return res.status(400).json({ error: "별점 또는 감상평을 확인해 주세요." });
  }
  const result = await query(
    `UPDATE reviews SET rating=$1, title=$2, content=$3, updated_at=NOW()
     WHERE id=$4 AND user_id=$5
     RETURNING id, movie_id, rating, title, content, created_at, updated_at`,
    [rating, title || null, content, req.params.id, req.user.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "리뷰를 찾을 수 없거나 수정 권한이 없습니다." });
  res.json({ review: result.rows[0] });
}));

app.delete("/api/reviews/:id", requireAuth, asyncRoute(async (req, res) => {
  const result = await query(
    "DELETE FROM reviews WHERE id=$1 AND user_id=$2 RETURNING id",
    [req.params.id, req.user.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: "리뷰를 찾을 수 없거나 삭제 권한이 없습니다." });
  res.json({ deleted: true });
}));

app.put("/api/reviews/:id/like", requireAuth, asyncRoute(async (req, res) => {
  await query(
    `INSERT INTO review_likes (review_id, user_id) VALUES ($1, $2)
     ON CONFLICT (review_id, user_id) DO NOTHING`,
    [req.params.id, req.user.id]
  );
  res.json({ liked: true });
}));

app.delete("/api/reviews/:id/like", requireAuth, asyncRoute(async (req, res) => {
  await query("DELETE FROM review_likes WHERE review_id=$1 AND user_id=$2", [req.params.id, req.user.id]);
  res.json({ liked: false });
}));

app.get("/api/bookmarks", requireAuth, asyncRoute(async (req, res) => {
  const result = await query(
    "SELECT movie_id, created_at FROM bookmarks WHERE user_id=$1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ bookmarks: result.rows });
}));

app.put("/api/bookmarks/:movieId", requireAuth, asyncRoute(async (req, res) => {
  await query(
    "INSERT INTO bookmarks (user_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [req.user.id, req.params.movieId]
  );
  res.json({ bookmarked: true });
}));

app.delete("/api/bookmarks/:movieId", requireAuth, asyncRoute(async (req, res) => {
  await query("DELETE FROM bookmarks WHERE user_id=$1 AND movie_id=$2", [req.user.id, req.params.movieId]);
  res.json({ bookmarked: false });
}));

app.get("/api/tickets", requireAuth, asyncRoute(async (req, res) => {
  const result = await query(
    "SELECT id, movie_id, watched_on, memo, created_at FROM tickets WHERE user_id=$1 ORDER BY watched_on DESC, created_at DESC",
    [req.user.id]
  );
  res.json({ tickets: result.rows });
}));

app.post("/api/tickets", requireAuth, asyncRoute(async (req, res) => {
  const movieId = String(req.body.movieId || "").trim();
  const watchedOn = String(req.body.watchedOn || "").trim();
  const memo = String(req.body.memo || "").trim().slice(0, 1000);
  if (!movieId || !/^\\d{4}-\\d{2}-\\d{2}$/.test(watchedOn)) {
    return res.status(400).json({ error: "영화 ID와 관람일(YYYY-MM-DD)을 입력해 주세요." });
  }
  const result = await query(
    `INSERT INTO tickets (user_id, movie_id, watched_on, memo)
     VALUES ($1, $2, $3, $4)
     RETURNING id, movie_id, watched_on, memo, created_at`,
    [req.user.id, movieId, watchedOn, memo || null]
  );
  res.status(201).json({ ticket: result.rows[0] });
}));

app.delete("/api/tickets/:id", requireAuth, asyncRoute(async (req, res) => {
  const result = await query("DELETE FROM tickets WHERE id=$1 AND user_id=$2 RETURNING id", [req.params.id, req.user.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "티켓을 찾을 수 없거나 삭제 권한이 없습니다." });
  res.json({ deleted: true });
}));

app.use((req, res) => res.status(404).json({ error: "요청한 API를 찾을 수 없습니다." }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Cinepick API listening on port ${port}`));
