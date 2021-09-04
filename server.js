require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

// Import models
const {Food} = require('./models/food');
const User = require('./models/user');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

// Testing save
 const food = new Food({
   name: "Almonds",
   time: 10
 }).save().then( () => console.log("Food saved"));

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
