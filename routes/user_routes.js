module.exports = (app) => {
  const user = require("../controllers/user");
  const router = require("express").Router();

  // Import models
  const User = require("../models/user");
  const { Food } = require("../models/food");

  // Find all users
  router.get("/", user.findAllUsers);

  // Create user
  router.post("/", user.createUser);

  // Find one user
  router.get("/:username", user.findOneUser);

  // Update user
  router.post("/:username", user.updateUser);

  // Delete user
  router.delete("/:username", user.deleteUser);

  // Delete all users
  router.delete("/", user.deleteAllUsers);

  app.use("/users", router);
};
