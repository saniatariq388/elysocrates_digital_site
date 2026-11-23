# Elysocrates Content API

FastAPI service that stores every editable part of the site (artwork cards,
selected works, client/project logo strips, social links, page copy and
uploaded images) in Supabase Postgres + Storage, and exposes guarded CRUD
endpoints for the Next.js dashboard.

## 1. Create the database schema

Open the Supabase SQL editor and run:

1. `sql/schema.sql`
2. `sql/seed.sql` (optional, seeds the current site content)

## 2. Configure

From the site root (`elysocrates_digital_site\`):

```bash
cd backend
cp .env.example .env
uv sync
uv run python scripts/hash_password.py   # paste the output into ADMIN_PASSWORD_HASH
```

Fill in `.env`:

- `DATABASE_URL` — Supabase Session pooler URI, prefixed with
  `postgresql+psycopg://`
- `JWT_SECRET` — same value as `JWT_SECRET` in the frontend's
  `elysocrates_digital/.env.local`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` — bootstrap fallback only. Login
  checks the `admin_users` table first; the env hash is used until an admin
  row exists for that email.
- `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` — from Project Settings → API.
  Used only for image uploads; the public `media` bucket is created
  automatically on the first upload.

Then create the dashboard login (bcrypt hash stored in Postgres):

```bash
uv run python scripts/create_admin.py
```

Enter the email and password you want to use. Re-run the script at any time
to change the password.

## 3. Run

From the `backend` folder (settings load `.env` relative to the working
directory, so always start the server from here):

```bash
uv run uvicorn app.main:app --reload --port 8001
```

Interactive docs: http://127.0.0.1:8001/docs

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | public | Check email + bcrypt hash in `admin_users`, return a JWT |
| GET | `/auth/me` | bearer | Current admin |
| GET | `/artworks?category=` | public | List artwork cards |
| POST | `/artworks` | bearer | Create artwork card |
| PUT | `/artworks/{id}` | bearer | Update artwork card |
| DELETE | `/artworks/{id}` | bearer | Delete artwork card |
| GET | `/work-entries?column_key=` | public | List selected works |
| POST | `/work-entries` | bearer | Create selected work |
| PUT | `/work-entries/{id}` | bearer | Update selected work |
| DELETE | `/work-entries/{id}` | bearer | Delete selected work |
| GET | `/logo-items?kind=` | public | List client or project logo items |
| POST | `/logo-items` | bearer | Create logo item |
| PUT | `/logo-items/{id}` | bearer | Update logo item |
| DELETE | `/logo-items/{id}` | bearer | Delete logo item |
| GET | `/social-links` | public | List footer/social links |
| POST | `/social-links` | bearer | Create social link |
| PUT | `/social-links/{id}` | bearer | Update social link |
| DELETE | `/social-links/{id}` | bearer | Delete social link |
| GET | `/site-content` | public | All page copy fields merged with defaults |
| PUT | `/site-content` | bearer | Save `{ "values": { key: text } }` |
| GET | `/media` | public | List uploaded images |
| POST | `/media` | bearer | Upload image (multipart `file`, `alt`) |
| DELETE | `/media/{id}` | bearer | Delete image from Storage + DB |

The Next.js dashboard never calls this API from the browser: it goes through
`/api/admin/*` route handlers that attach the bearer token, so CORS only
matters for direct API testing.

## Deploy on Render

- Service root directory: `backend`
- Build command: `uv sync --frozen`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `DATABASE_URL`, `JWT_SECRET` (must match the
  frontend), `ADMIN_EMAIL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`,
  `ALLOWED_ORIGINS` (set to the deployed frontend URL), and optionally
  `ADMIN_PASSWORD_HASH` / `MAX_UPLOAD_MB`.
- Python version comes from `.python-version`. `requirements.txt` is
  generated with `uv export --no-hashes > requirements.txt`; keep it in sync
  after dependency changes.
