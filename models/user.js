const mongoose = require('mongoose');
const {FoodSchema} = require('./food');

// Fields that user should have: username, email, password. Right now they are all required but if we implement OAuth2.0 then this needs to be changed
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
    foods: {
      type: [FoodSchema]
    },
    roles: {
      type: [String],
      enum: ['user', 'admin', 'mod'],
      default: 'user',
      required: [true, "role needed"]
    }
  });
  
  const User = mongoose.model("user", UserSchema);
  module.exports = User;