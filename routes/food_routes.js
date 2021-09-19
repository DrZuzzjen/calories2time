module.exports = (app) => {
  const food = require("../controllers/food");
  const router = require("express").Router();

  // Get all foods
  router.get("/", food.getAllFoods);

  // Add a food
  router.post("/", food.addFoodRest);

  // Delete all food
  router.delete("/", food.deleteFoods);

  // Get a food
  router.get("/:food", food.getFood);

  // Update a food
  router.post("/:food", food.updateFoodRest);

  // Delete a food
  router.delete("/:food", food.deleteFood);

  app.use("/foods", router);
};
