const verifySignup = require("../middleware/verifySignup");

module.exports = (app) => {
  app.use( (req,res,next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const controller = require("../controllers/auth_controller");
  const user = require("../controllers/user");
  const router = require("express").Router();


  // Test auth
  router.post("/signin", controller.signInUserRequest);
  router.post("/signup", [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkIfRolesExist], user.createUser);

  app.use("/auth", router);
};
