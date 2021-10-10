require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

// Import schema
const schema = require("./schema/schema");

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Colories2Time." });
});

//Apply graphql middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Import auth routes
require("./routes/auth_routes")(app);

// Import user routes
require("./routes/user_routes")(app);

// Import food routes
require("./routes/food_routes")(app);


// Testing


// Save user with roles
/* 
const User = require('./models/user');
const user = new User({
  username: "roletest",
  password: "password",
  email: "ab@as.com",
  roles: ["admin", "mod"]
}).save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("User saved");
  }
});
*/

// is Admin test
/*const User = require('./models/user');
User.findOne({ username: "roletest", roles: "adminas" })
    .then( user => {
      console.log(user);
        if (user) {
          for (role of user.roles) {
            if (role === "admin") {
              console.log("Is admin");
            }
          }
          console.log("Not admin");
        }
    });
*/