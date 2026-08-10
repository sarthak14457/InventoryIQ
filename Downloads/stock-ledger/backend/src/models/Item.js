import { DataTypes } from "sequelize";
import { sequelize } from "../configs/database.js";

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "items",
    timestamps: true,
  },
);

export default Item;
