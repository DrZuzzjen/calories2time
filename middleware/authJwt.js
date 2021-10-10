const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(403).send("Token needed");
    return;
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    console.log("Decoded", decoded);
    if (err) {
        res.status(403).send("Token invalid");
      return;
    }
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findOne({ username: req.body.username, roles: "admin" }).then((user) => {
    if (user) {
      console.log("Is admin");
      next();
    } else {
    console.log("Not admin");
    res.status(403).send("Not authorized. Admin only");
    return;
    }
  });
};

isMod = (req, res, next) => {
  User.findOne({ username: req.body.username, roles: "mod" }).then((user) => {
    if (user) {
      console.log("Is mod");
      next();
      return;
    }
    console.log("Not mod");
    res.status(403).send("Not authorized. Mod only");
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMod,
};

module.exports = authJwt;
