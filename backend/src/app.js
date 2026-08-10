import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Stock Ledger API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
