const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signInUserRequest = (req, res) => {
  console.log("In sign in user request", req.body);
  User.findOne({ username: req.body.username }).then((user) => {
    console.log("If user", user);
    if (user) {
      let isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: 86400, //24 hours
        });
        res.status(200).send({
          accessToken: token,
          username: user.username,
          roles: user.roles,
          email: user.email,
        });
      } else {
        console.log("Exit here: Password is not valid");
        res.status(403).send("Password doesn't match");
        return;
      }
    } else {
      res.status(403).send("User doesn't exist");
    }
  });
};
