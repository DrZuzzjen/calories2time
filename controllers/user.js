// Import models
const User = require("../models/user");
const { Food } = require("../models/food");

// Import food controller functions
const food = require("./food");

/* ------------------------ GENERAL PURPOSE FUNCTIONS -------------------------
  Since GraphQL and REST have an overlap on the requests, common functions are defined here */

// Create and save new user
const createUserRequest = async (username, password, email) => {
  const userToAdd = new User({
    username: username,
    password: password,
    email: email,
  });

  // Add to DB
  return await userToAdd.save();
};

// Find all users
const findAllUsersRequest = async () => {
  return await User.find();
};

// Find user
const findOneUserRequest = async (username) => {
  return await User.findOne({ username: username });
};

const updateUsernameRequest = async (username, newUsername) => {
  // Look for user in DB
  const user = await findOneUserRequest(username);
  if (user === null) {
    return;
  }

  // Update username
  return await User.findOneAndUpdate(
    { username: username },
    { username: newUsername },
    { new: true }
  );
};

const addFoodToUserRequest = async (username, foodName) => {
  // Look for user in DB
  const user = await findOneUserRequest(username);
  if (user === null) {
    return "User not found";
  }

  // Look for food in DB and append to user
  const foodToAdd = await food.getFoodRequest(foodName);
  if (foodToAdd != null) {
    //Spread so it appends instead of replacing the current foods declared
    user.foods = [...user.foods, foodToAdd];
    await user.save();
  }

  return await findOneUserRequest(username);
};

// Delete user
const deleteUserRequest = async (username) => {
  return await User.findOneAndDelete({ username: username });
};

// Delete all users
const deleteAllUsersRequest = async () => {
  return await User.deleteMany();
};

/* ------------------------ REST FUNCTIONS -------------------------*/

// Create and save new user
exports.createUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const result = await createUserRequest(username, password, email);

  res.send(result);
};

// Find all users
exports.findAllUsers = async (req, res) => {
  res.json(await findAllUsersRequest());
};

// Find user
exports.findOneUser = async (req, res) => {
  const username = req.params.username;
  res.json(await findOneUserRequest(username));
};

/* Update user
 Params possible to update: username, food
*/
exports.updateUserREST = async (req, res) => {
  let username = req.params.username;
  const food = req.body.food;
  const newUsername = req.body.username;
  let user = {};
  console.log(username, food, newUsername);

  // Look for food in DB and append to user
  if (food != null) {
    user = await addFoodToUserRequest(username, food);
  }

  if (newUsername != null) {
    user = await updateUsernameRequest(username, newUsername);
    if (user === null) {
      res.send("Error has occurred while updating username");
    }
  }
  res.json(user);
};

// Delete user
exports.deleteUser = async (req, res) => {
  const username = req.params.username;
  const result = await deleteUserRequest(username);
  if (result === null) {
    res.send("User not found");
  } else {
    res.send(`User ${username} deleted.`);
  }
};

// Delete all users
exports.deleteAllUsers = async (req, res) => {
  const { deletedCount } = await deleteAllUsersRequest();
  res.send(`${deletedCount} users deleted.`);
};

/* ------------------------ GRAPHQL FUNCTIONS -------------------------*/

exports.addFoodToUser = async (parent, args) => {
  const foodToAdd = args.food;
  const user = args.username;
  return await addFoodToUserRequest(user, foodToAdd);
};

exports.updateUserGraph = async (parent, args) => {
  // Update user from database
  const username = args.username;
  const newUsername = args.newUsername;
  await updateUsernameRequest(username, newUsername);

  // Return all users in DB
  return await findAllUsersRequest();
};

exports.removeUser = async (parent, args) => {
  // Delete user from database
  const username = args.username;
  await deleteUserRequest(username);

  // Return all users in DB
  return findAllUsersRequest();
};

exports.addUser = async (parent, args) => {
  const username = args.username;
  const password = args.password;
  const email = args.email;
  // Add user to DB
  await createUserRequest(username, password, email);

  // Return all users in DB
  return findAllUsersRequest();
};

exports.userTime = async (parent, args) => {
  username = args.username;
  const userDocument = await findOneUserRequest(username);
  console.log(userDocument);
  const timeSum = userDocument.foods.reduce((total, currentValue) => {
    return total + currentValue.time;
  }, 0);
  return "Your time is " + timeSum;
};

exports.findUser = async (parent, args) => {
  return findOneUserRequest(args.username);
};

exports.findUsers = async () => {
  return await findAllUsersRequest();
};
