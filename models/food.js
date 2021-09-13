const mongoose = require('mongoose');

// Fields that food should have: name, time. Calories?
const FoodSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "needs a name"]
    },
    time: {
      type: Number,
      required: [true, "number needed"]
    }
  });

  const Food = mongoose.model("food", FoodSchema);
  module.exports = {Food, FoodSchema};
