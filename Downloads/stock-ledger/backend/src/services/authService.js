import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { config } from "../configs/index.js";

import ValidationError from "../errors/ValidationError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    },
  );
}

async function signup({ name, email, password, role = "Staff" }) {
  const existing = await User.findOne({
    where: { email },
  });

  if (existing) {
    throw new ValidationError("Email already in use.", {
      email: "Already registered.",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  return {
    user: user.toSafeJSON(),
    token: signToken(user),
  };
}

async function login({ email, password }) {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  if (user.status === "Suspended") {
    throw new UnauthorizedError("Account is suspended.");
  }

  return {
    user: user.toSafeJSON(),
    token: signToken(user),
  };
}

const authService = {
  signup,
  login,
};

export default authService;
