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

// Import user routes
require("./routes/user_routes")(app);

// Import food routes
require("./routes/food_routes")(app);

/* // Food REST API
// Get all foods
app.get("/foods", async (req, res) => {
  res.json(await Food.find());
});

// Add a food
app.post("/foods", async (req, res) => {
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
});

// Delete all food
app.delete("/foods", async (req, res) => {
  const {deletedCount} = await Food.deleteMany();
  res.send(`Deleted ${deletedCount} foods`);
});

// Get a food
app.get("/foods/:food", async (req, res) => {
  res.json(await Food.findOne({ name: req.params.food }));
});

// Update a food
app.post("/foods/:food", async (req, res) => {
  const newTime = req.body.time;
  res.json(
    await Food.findOneAndUpdate({ name: req.params.food }, { time: newTime }, {new: true})
  );
});

// Delete a food
app.delete("/foods/:food", async (req, res) => {
  const food = req.params.food;
  const result = await Food.findOneAndDelete({ name: food });
  console.log(result);
  if (result === null) {
    res.send("Food not found");
  } else {
    res.send(`Food ${food} deleted.`);
  }
});


*/