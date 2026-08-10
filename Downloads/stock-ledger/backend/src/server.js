import app from "./app.js";
import { config } from "./configs/index.js";
import { sequelize } from "./models/index.js";

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
