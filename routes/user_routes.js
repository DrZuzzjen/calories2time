const authJwt = require("../middleware/authJwt");
const verifySignup = require("../middleware/verifySignup");

module.exports = (app) => {
  app.use( (req,res,next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const user = require("../controllers/user");
  const router = require("express").Router();

  // Find all users
  router.get("/", user.findAllUsers);

  // Create user
  router.post("/", [verifySignup.checkDuplicateUsernameOrEmail], user.createUser);
  
  // Delete all users
  router.delete("/", user.deleteAllUsers);

  // Find one user
  router.get("/:username", user.findOneUser);

  // Update user
  router.post("/:username", user.updateUserREST);

  // Delete user
  router.delete("/:username", user.deleteUser);

  // Test roles
  router.get("/test/all", user.allAcess);
  router.get("/test/user", [authJwt.verifyToken], user.userBoard);
  router.get("/test/mod", [authJwt.verifyToken, authJwt.isMod], user.modBoard);
  router.get("/test/admin", [authJwt.verifyToken, authJwt.isAdmin], user.adminBoard);

  app.use("/users", router);
};
