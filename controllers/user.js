// Import User model
const User = require("../models/user");

//TODO create user
exports.createUser = (req,res) => {

}
//TODO findAll user
exports.findAllUsers = (req,res) => {
    User.find().then(users => {
        res.send(users)
    });
}
//TODO findOne user
exports.findOneUser = (req,res) => {

}
//TODO update user
exports.updateUser = (req,res) => {

}
//TODO delete user
exports.deleteUser = (req,res) => {

}
//TODO delete all users
exports.deleteAllUsers = (req,res) => {

}


