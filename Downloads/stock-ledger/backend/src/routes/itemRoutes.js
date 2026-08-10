import express from "express";

import itemController from "../controllers/itemController.js";
import validate from "../middlewares/validationMiddleware.js";
import { validateItem } from "../validators/itemValidator.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", itemController.list);
router.post("/", validate(validateItem), itemController.create);
router.put("/:id", itemController.update);
router.delete("/:id", itemController.remove);

export default router;
