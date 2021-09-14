module.exports = (app) => {
  const user = require("../controllers/user");
  const router = require("express").Router();

  // Find all users
  router.get("/", user.findAllUsers);

  // Create user
  router.post("/", user.createUser);
  
  // Delete all users
  router.delete("/", user.deleteAllUsers);

  // Find one user
  router.get("/:username", user.findOneUser);

  // Update user
  router.post("/:username", user.updateUser);

  // Delete user
  router.delete("/:username", user.deleteUser);

  app.use("/users", router);
};
