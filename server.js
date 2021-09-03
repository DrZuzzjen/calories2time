require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

const FruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "needs a name"]
  },
  time: {
    type: Number,
    required: [true, "number needed"]
  }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username needed"]
  },
  password: {
    type: String,
    required: [true, "password needed"]
  },
  email: {
    type: String,
    required: [true, "email needed"]

  },
});

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
