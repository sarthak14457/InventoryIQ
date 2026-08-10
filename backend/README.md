# Inventory Backend

Node.js + Express + Sequelize (SQLite) backend matching the app's front-end
(Stock Ledger inventory + admin + login/signup pages).

## Setup
```
npm install
cp .env.example .env
npm run sync-db     # creates database.sqlite from the models
npm start            # runs on http://localhost:4000
```

## Endpoints

### Auth — /api/auth
- POST /signup   { name, email, password, role? }  -> { user, token }
- POST /login     { email, password }               -> { user, token }

### Items — /api/items  (requires "Authorization: Bearer <token>")
- GET    /          list all items
- POST   /          create item     { name, qty, threshold, price }
- PUT    /:id       update item
- DELETE /:id       delete item

### Users — /api/users  (requires an Admin token)
- GET    /          list all users
- PUT    /:id       update a user (role/status)
- DELETE /:id       delete a user

## Structure
```
src/
  configs/       env + sequelize connection
  controllers/   request handlers
  errors/        custom error classes (ValidationError, NotFoundError, UnauthorizedError)
  middlewares/   requireAuth, requireAdmin, validationMiddleware, errorHandler, notFoundHandler
  models/        Sequelize models (User, Item)
  routes/        Express routers
  scripts/       syncDb.js — creates/updates tables
  services/      business logic used by controllers
  validators/    plain functions that check request bodies
  app.js         Express app (middleware + route wiring)
  server.js      boots the DB connection and starts listening
```

Connect the front-end pages to this API:
- login.html / signup.html -> POST /api/auth/login and /api/auth/signup
- admin-login.html -> POST /api/auth/login (check role === 'Admin' in the response)
- inventory.html -> GET/POST/PUT/DELETE /api/items with the token from login
- admin.html -> GET/PUT/DELETE /api/users with an Admin token
