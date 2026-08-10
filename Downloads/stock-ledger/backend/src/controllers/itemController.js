import itemService from "../services/itemService.js";

async function list(req, res, next) {
  try {
    const items = await itemService.listItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const item = await itemService.createItem(req.body, req.user.id);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await itemService.deleteItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

const itemController = {
  list,
  create,
  update,
  remove,
};

export default itemController;
