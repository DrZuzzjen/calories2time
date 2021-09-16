// Import Food model
const { Food } = require("../models/food");

// Get all foods
exports.getAllFoods = async (req, res) => {
  res.json(await Food.find());
};

// Add a food
exports.addFood = async (req, res) => {
  // Create food object from body request
  const foodToAdd = new Food({
    name: req.body.name,
    time: req.body.time,
  });

  // Save in DB
  foodToAdd
    .save()
    .then(res.json(await Food.find()))
    .catch((err) => {
      res.send(err);
    });
};

// Delete all food
exports.deleteFoods =  async (req, res) => {
  const { deletedCount } = await Food.deleteMany();
  res.send(`Deleted ${deletedCount} foods`);
}

// Get a food
exports.getFood = async (req, res) => {
  res.json(await Food.findOne({ name: req.params.food }));
}

// Update a food
exports.updateFood =  async (req, res) => {
  const newTime = req.body.time;
  res.json(
    await Food.findOneAndUpdate(
      { name: req.params.food },
      { time: newTime },
      { new: true }
    )
  );
}

// Delete a food
exports.deleteFood =  async (req, res) => {
  const food = req.params.food;
  const result = await Food.findOneAndDelete({ name: food });
  console.log(result);
  if (result === null) {
    res.send("Food not found");
  } else {
    res.send(`Food ${food} deleted.`);
  }
}
