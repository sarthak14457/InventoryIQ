import { Item } from "../models/index.js";
import NotFoundError from "../errors/NotFoundError.js";

async function listItems() {
  return Item.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function createItem(data, userId) {
  return Item.create({
    ...data,
    createdBy: userId,
  });
}

async function updateItem(id, data) {
  const item = await Item.findByPk(id);

  if (!item) {
    throw new NotFoundError("Item not found.");
  }

  return item.update(data);
}

async function deleteItem(id) {
  const item = await Item.findByPk(id);

  if (!item) {
    throw new NotFoundError("Item not found.");
  }

  await item.destroy();
}

const itemService = {
  listItems,
  createItem,
  updateItem,
  deleteItem,
};

export default itemService;
