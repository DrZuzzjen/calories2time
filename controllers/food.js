// Import Food model
const { Food } = require("../models/food");

/* ------------------------ GENERAL PURPOSE FUNCTIONS -------------------------
  Since GraphQL and REST have an overlap on the requests, common functions are defined here */

const getFoodsRequest = async () => {
  return await Food.find();
};

const addFoodRequest = async (name, time) => {
  // Build food object from args received
  const foodToAdd = new Food({
    name: name,
    time: time,
  });

  // Add to DB
  await foodToAdd.save();

  // Return all foods in DB
  return Food.find();
};

const updateFoodRequest = async (name, newTime) => {
  // Update food from database
  // Problem we are going to have, different caps, convert everything to Titlecase or lowercase?
  return await Food.findOneAndUpdate(
    { name: name },
    { time: newTime },
    { new: true }
  );
};

const deleteFoodRequest = async (food) => {
  // Delete food from database
  return await Food.findOneAndDelete({ name: food });
};

const getFoodRequest = async function getFoodRequest(name) {
  return await Food.findOne({ name: name });
};

exports.getFoodRequest = getFoodRequest;

const deleteFoodsRequest = async () => {
  return await Food.deleteMany();
};

/* ------------------------ REST FUNCTIONS -------------------------*/

// Get all foods
exports.getAllFoods = async (req, res) => {
  res.json(await getFoodsRequest());
};

// Add a food
exports.addFoodRest = async (req, res) => {
  res.send(await addFoodRequest(req.body.name, req.body.time));
};

// Delete all food
exports.deleteFoods = async (req, res) => {
  const { deletedCount } = await deleteFoodsRequest();
  res.send(`Deleted ${deletedCount} foods`);
};

// Get a food
exports.getFood = async (req, res) => {
  const food = req.params.food;
  res.json(await getFoodRequest(food));
};

// Update a food
exports.updateFoodRest = async (req, res) => {
  const name = req.params.food;
  const newTime = req.body.time;
  res.json(await updateFoodRequest(name, newTime));
};

// Delete a food
exports.deleteFood = async (req, res) => {
  const food = req.params.food;
  const result = await deleteFoodRequest(food);
  console.log(result);
  if (result === null) {
    res.send("Food not found");
  } else {
    res.send(`Food ${food} deleted.`);
  }
};

/* ------------------------ GRAPHQL FUNCTIONS -------------------------*/
exports.updateFoodGraph = async (parent, args) => {
  const name = args.name;
  const newTime = args.time;
  await updateFoodRequest(name, newTime);
  return await getFoodsRequest();
};

exports.removeFood = async (parent, args) => {
  const food = args.name;
  await deleteFoodRequest(food);

  // Return all foods in DB
  return getFoodsRequest();
};

exports.addFoodGraph = async (parent, args) => {
  return addFoodRequest(args.name, args.time);
};

exports.findFood = async (parent, args) => {
  return await getFoodRequest(args.name);
};

exports.findFoods = () => {
  return Food.find();
};

//module.exports = {getFoodRequest};
