import ValidationError from "../errors/ValidationError.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body) {
  const { name, email, password } = body;
  const fields = {};

  if (!name || !name.trim()) {
    fields.name = "Name is required.";
  }

  if (!email || !emailRegex.test(email)) {
    fields.email = "A valid email is required.";
  }

  if (!password || password.length < 6) {
    fields.password = "Password must be at least 6 characters.";
  }

  if (Object.keys(fields).length) {
    throw new ValidationError("Invalid signup details.", fields);
  }
}

function validateLogin(body) {
  const { email, password } = body;
  const fields = {};

  if (!email || !emailRegex.test(email)) {
    fields.email = "A valid email is required.";
  }

  if (!password) {
    fields.password = "Password is required.";
  }

  if (Object.keys(fields).length) {
    throw new ValidationError("Invalid login details.", fields);
  }
}

export { validateSignup, validateLogin };
