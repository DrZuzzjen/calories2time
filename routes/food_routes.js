module.exports = (app) => {
  const food = require("../controllers/food");
  const router = require("express").Router();

  // Get all foods
  router.get("/", food.getAllFoods);

  // Add a food
  router.post("/", food.addFood);

  // Delete all food
  router.delete("/", food.deleteFoods);

  // Get a food
  router.get("/:food", food.getFood);

  // Update a food
  router.post("/:food", food.updateFood);

  // Delete a food
  router.delete("/:food", food.deleteFood);

  app.use("/foods", router);
};
