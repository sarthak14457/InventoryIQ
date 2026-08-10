import { sequelize } from "../configs/database.js";
import User from "./User.js";
import Item from "./Item.js";

// Associations
User.hasMany(Item, {
  foreignKey: "createdBy",
  as: "items",
});

Item.belongsTo(User, {
  foreignKey: "createdBy",
  as: "owner",
});

export { sequelize, User, Item };
