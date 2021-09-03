const mongoose = require('mongoose');

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
  
  const User = mongoose.model("user", UserSchema);
  module.exports = User;