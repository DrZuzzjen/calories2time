require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

// Import models
const { Food } = require("./models/food");
const User = require("./models/user");

// Import schema
const schema = require("./schema/schema");

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Colories2Time." });
});

//Apply graphql middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// TODO implement REST API for users
//COMPLETED findAll user
app.get("/users", async (req,res) => {
  res.json(await User.find());
});

//COMPLETED create user
app.post("/users", (req,res) => {
  const userToAdd = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  console.log(req.body.username);

  // Add to DB
  userToAdd.save().then( async() => {
    // Return all users in DB
  res.json( await User.find());
  }).catch( (err) => {res.send(err.message)});
});

//Completed findOne user
app.get("/users/:username", async (req,res) => {
  const username = req.params.username;
  res.json(await User.findOne({username: username}));

});

//Completed update user
app.post("/users/:username", async (req,res) => {
  const username = req.params.username;
  res.json( await User.findOneAndUpdate({username: username}, {username: req.body.username}, {new: true}));
});

//Completed delete user
app.delete("/users/:username", async (req,res) => {
  const username = req.params.username;
  const result = await User.findOneAndDelete({username: username})
  if (result === null) {
    res.send("User not found");
  } else {
    res.send(`User ${username} deleted.`);
  }
});

//Completed delete all users
app.delete("/users", async (req,res) => {
  const result = await User.deleteMany();
  res.send(`${result.deletedCount} users deleted.`);
});