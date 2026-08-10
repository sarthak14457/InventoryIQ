import jwt from "jsonwebtoken";

import { config } from "../configs/index.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new UnauthorizedError("Missing auth token."));
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token."));
  }
}

// Use after requireAuth to restrict a route to Admins only.
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    return next();
  }

  next(new UnauthorizedError("Admin access required."));
}

export { requireAuth, requireAdmin };
