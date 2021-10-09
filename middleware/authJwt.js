const User = require("../models/user.js");
const jwt = require('jsonwebtoken');


verifyToken = (req,res,next) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return;
        } 
        console.log(decoded);
        next();
    });
}

isAdmin = (req,res,next) => {
    User.findOne({ username: "roletest", roles: "admin" })
        .then( user => {
            if (user) {
                  console.log("Is admin");
                }
              console.log("Not admin");
            });
}

isMod = (req,res,next) => {
    User.findOne({ username: "roletest", roles: "mod" })
        .then( user => {
            if (user) {
                  console.log("Is mod");
                }
              console.log("Not mod");
            });
}

const authJwt = {
    verifyToken,
    isAdmin,
    isMod
}

module.exports = authJwt;