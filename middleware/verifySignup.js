const User = require("../models/user.js");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Look for username
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        res.status(403).send("User already exists");
        return;
      }

      // Look for email
      User.findOne({ email: req.body.email })
        .then((usera) => {
          if (usera) {
            res.status(403).send("Email already in use");
            return;
          }

          // If got here then it's a new user
          next();
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      return;
    });
};

checkIfRolesExist = (req, res, next) => {
  // req.body.roles let's assume right now [admin,user]
  const roles = ["mod", "user"];
  for (let role of roles) {
    if ("admin user mod".includes(role)) {
      console.log("Role matched", role);
    } else {
      console.log("Role didn't match", role);
      return;
    }
  }

  next();
};

module.exports = {checkDuplicateUsernameOrEmail, checkIfRolesExist};
