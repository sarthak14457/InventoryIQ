import express from "express";
import userController from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", userController.list);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);
router.post("/", userController.create);
export default router;
