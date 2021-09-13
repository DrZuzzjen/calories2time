module.exports = (app) => {
  const router = require("express").Router();

  // Import model
  const User = require("../models/user");

  // TODO implement REST API for users
  //COMPLETED findAll user
  router.get("/", async (req, res) => {
    res.json(await User.find());
  });

  //COMPLETED create user
  router.post("/", (req, res) => {
    const userToAdd = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    console.log(req.body.username);

    // Add to DB
    userToAdd
      .save()
      .then(async () => {
        // Return all users in DB
        res.json(await User.find());
      })
      .catch((err) => {
        res.send(err.message);
      });
  });

  //Completed findOne user
  router.get("/:username", async (req, res) => {
    const username = req.params.username;
    res.json(await User.findOne({ username: username }));
  });

  //Completed update user
  router.post("/:username", async (req, res) => {
    const username = req.params.username;
    res.json(
      await User.findOneAndUpdate(
        { username: username },
        { username: req.body.username },
        { new: true }
      )
    );
  });

  //Completed delete user
  router.delete("/:username", async (req, res) => {
    const username = req.params.username;
    const result = await User.findOneAndDelete({ username: username });
    if (result === null) {
      res.send("User not found");
    } else {
      res.send(`User ${username} deleted.`);
    }
  });

  //Completed delete all users
  router.delete("/", async (req, res) => {
    const result = await User.deleteMany();
    res.send(`${result.deletedCount} users deleted.`);
  });

  app.use("/users", router);
};
