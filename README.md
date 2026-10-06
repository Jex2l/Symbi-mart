# 🛒 SymbiMart

An e-commerce platform built for a university campus, consolidating three
on-campus stores — a food stall (SymbiEat), a stationery shop, and a Rangoli
goods store — into a single site with one login and one cart.

## Architecture

```
frontend/  React 18 (Create React App) + react-router-dom
    │  REST (axios)
    ▼
backend/   Node.js + Express
    │  Mongoose
    ▼
MongoDB (Atlas)
```

- **Backend** (`backend/`): Express API with two endpoints, `/signup` and
  `/login`, backed by a single `User` model (bcrypt-hashed passwords,
  JWT-signed auth tokens).
- **Frontend** (`frontend/`): a React SPA with pages for Home, Login, Signup,
  Cart, and one page per store (`SymbiEat`, `Stationery`, `Rangoli`).
  **Product catalogs are currently hardcoded in the React components** —
  there's no `/products` API or database-backed catalog yet, and the cart
  lives only in React state (cleared on refresh, not persisted).

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # nodemon, or `npm start` for a plain node run
```

Required env vars (`backend/.env`, see `.env.example`):

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign auth tokens — any long random string |
| `PORT` | Optional, defaults to `8080` |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # only needed if the backend isn't on localhost:8080
npm start
```

`REACT_APP_API_URL` (optional, defaults to `http://localhost:8080`) points
the frontend at the backend.

## Security fixes in this pass

This repo previously had **a live MongoDB Atlas connection string (with
username and password) and a hardcoded JWT secret committed directly in
source** (`backend/db.js`, `backend/index.js`). Both are now read from
environment variables instead (`MONGO_URI`, `JWT_SECRET`), with
`backend/.env.example` documenting what's needed and `backend/.gitignore`
added so `.env` is never committed.

**⚠️ If this repository was ever pushed to GitHub with the old `db.js`,
treat that Atlas password as compromised — rotate/reset the database user's
password in MongoDB Atlas, since it's visible in git history even after
this fix.**

`backend/node_modules/` (over 4,000 files) and a stray, unused root
`package-lock.json` were also removed from git tracking — they were
committed by accident since no `.gitignore` previously existed for the
backend.

## Other fixes in this pass

- `backend/index.js`: `User.create(...)` was called without `await`, so
  every signed-up user got an auth token signed with `id: undefined`. Now
  awaited correctly, and duplicate-email signups return a clean error
  instead of a raw MongoDB error object.
- Error responses are now consistent JSON (`{ error: "..." }`) across both
  endpoints — the frontend was already reading `error.response.data.error`,
  which only worked by accident before.
- `frontend/src/pages/Login.js` received an auth token on login but never
  stored it — `Cart.js`'s logout button called
  `localStorage.removeItem("token")` for a token that was never set. Login
  now stores it.
- Both `Login.js` and `Signup.js` had the backend URL (`localhost:8080`)
  hardcoded; both now read `REACT_APP_API_URL` with that same value as the
  default, so the frontend can point at a non-local backend without code
  changes.
- Removed `frontend/package copy.json`, an accidental stray duplicate of
  `package.json`.

## Known gaps (not fixed in this pass — real feature work, not cleanup)

- No `Product`/`Order`/`Store` models or API — the three stores' catalogs
  are static data inside the React components, and the cart isn't persisted
  anywhere. Turning this into a real e-commerce backend would need product
  and order schemas, cart persistence (server-side or `localStorage`), and
  routes for each.
- No input validation beyond "field is present" (no email format check, no
  password strength requirement) and no rate limiting on `/login`.
