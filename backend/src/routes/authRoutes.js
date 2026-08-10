import express from "express";
import authController from "../controllers/authController.js";
import validate from "../middlewares/validationMiddleware.js";
import { validateSignup, validateLogin } from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", validate(validateSignup), authController.signup);

router.post("/login", validate(validateLogin), authController.login);

export default router;
