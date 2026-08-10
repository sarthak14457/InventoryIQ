# Stock Ledger — Full Stack

A simple inventory management system: static HTML/CSS/JS frontend +
Node.js/Express/Sequelize backend (SQLite via ORM).

## Folders
- `frontend/` — login, signup, admin-login, inventory, and admin pages (plain HTML/CSS/JS)
- `backend/`  — Express API + Sequelize models (see `backend/README.md` for endpoint details)

## Run it

**1. Start the backend**
```
cd backend
npm install
cp .env.example .env
npm run sync-db     # creates database.sqlite from the Sequelize models
npm start             # runs on http://localhost:4000
```

**2. Open the frontend**
Open `frontend/login.html` (or `admin-login.html`) directly in your browser —
no build step needed. It's a plain static page that calls the backend at
`http://localhost:4000/api`.

## Flow
1. `signup.html` → creates a Staff account → redirects to `login.html`
2. `login.html` → logs in → redirects to `inventory.html?token=...`
3. `inventory.html` → uses the token to call `/api/items` (add, edit qty, delete)
4. `admin-login.html` → logs in an Admin account → redirects to `admin.html?token=...`
5. `admin.html` → uses the token to call `/api/users` (add, change role, suspend, delete)

The token is passed via the URL between pages and kept in memory for API calls —
no browser storage is used.

## Database
All data lives in `backend/database.sqlite`, managed entirely through the
Sequelize ORM (`backend/src/models/User.js`, `backend/src/models/Item.js`).
No raw SQL is written anywhere in the app.
