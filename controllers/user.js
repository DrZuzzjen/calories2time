// Import models
const User = require("../models/user");
const { Food } = require("../models/food");

// Create and save new user
exports.createUser = async (req, res) => {
  const userToAdd = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  // Add to DB
  userToAdd
    .save()
    .then(
      // Return all users in DB
      res.json(await User.find())
    )
    .catch((err) => {
      res.send(err.message);
    });
};

// Find all users
exports.findAllUsers = async (req, res) => {
  res.json(await User.find());
};

// Find user
exports.findOneUser = async (req, res) => {
  const username = req.params.username;
  res.json(await User.findOne({ username: username }));
};

/* Update user
 Params possible to update: username, food
*/
exports.updateUser = async (req, res) => {
  let username = req.params.username;

  // Look for user in DB
  const user = await User.findOne({ username: username });
  if (user === null) {
    res.json({ message: "User not found." });
    return;
  }

  // Look for food in DB and append to user
  if (req.body.food != null) {
    const foodToAdd = await Food.findOne({ name: req.body.food });
    //Spread so it appends instead of replacing the current foods declared
    if (foodToAdd != null) {
      user.foods = [...user.foods, foodToAdd];
      await user.save();
    }
  }

  // Update username is key passed
  if (req.body.username != null) {
    await User.findOneAndUpdate(
      { username: username },
      { username: req.body.username },
      { new: true }
    );
    // Kinda cheating so query below works, if username has been changed look for new name, else look for name defined in url
    // There has to be a better way but first that came to mind and it works...
    username = req.body.username;
  }
  res.json(await User.findOne({ username: username }));
};

// Delete user
exports.deleteUser = async (req, res) => {
  const username = req.params.username;
  const result = await User.findOneAndDelete({ username: username });
  if (result === null) {
    res.send("User not found");
  } else {
    res.send(`User ${username} deleted.`);
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  const result = await User.deleteMany();
  res.send(`${result.deletedCount} users deleted.`);
};
