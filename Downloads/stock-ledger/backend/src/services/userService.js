import { User } from "../models/index.js";
import NotFoundError from "../errors/NotFoundError.js";

async function listUsers() {
  const users = await User.findAll({
    order: [["createdAt", "DESC"]],
  });

  return users.map((u) => u.toSafeJSON());
}

async function createUser(data) {
  const user = await User.create(data);

  return user.toSafeJSON();
}

async function updateUser(id, data) {
  const user = await User.findByPk(id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  await user.update(data);

  return user.toSafeJSON();
}

async function deleteUser(id) {
  const user = await User.findByPk(id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  await user.destroy();
}

const userService = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
