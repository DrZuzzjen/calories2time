require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const {graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

// Import models
const {Food} = require('./models/food');
const User = require('./models/user');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

// Testing save
// const food = new Food({
//   name: "Almonds",
//   time: 10
// }).save().then( () => console.log("Food saved"));

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
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


// Add GraphQL stuff

// Vars in place of DB to make it easier
const foods = [
	{ id: 1, name: 'almonds', time: 10 },
	{ id: 2, name: 'beef', time: -25 }
];

const users = [
	{ id: 1, name: 'Francois' },
	{ id: 2, name: 'Hugo' },
];

// GraphQlObjects Schema
const FoodEntry = new GraphQLObjectType({
  name: "Food",
  fields: () => ({
    name: {type: GraphQLString},
    time: {type: GraphQLInt},
    id: {type: GraphQLInt}
  })
});

const UserEntry = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    name: {type: GraphQLString},
    password: {type: GraphQLString},
    id: {type: GraphQLInt}
  })
});

// Build query structure
const rootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: GraphQLList(UserEntry),
      resolve: () => {console.log(Food.find({}));}
    },
    foods: {
      type: GraphQLList(FoodEntry),
      resolve: () => {return foodsquery().then(result => { return result;});}
    },
    user: {
      type: UserEntry,
      args: {name: {type: GraphQLString}},
      resolve: (parent, args) => {return (users.find(user => {return user.name === args.name;}))}
    },
    food: {
      type: FoodEntry,
      args: {name: {type: GraphQLString}},
      resolve: (parent, args) => {return (foods.find(food => {return food.name === args.name;}))}
    }
  })
});

// Build mutation query
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addUser: {
      name: "Add user",
      type: GraphQLList(UserEntry),
      args: {name: {type: GraphQLNonNull(GraphQLString)}, password: {type: GraphQLNonNull(GraphQLString)}},
      resolve: (parent, args) => {
        // Build user object from args received
        const user = {};
        user.name = args.name;
        user.password = args.password;
        user.id = users.length + 1;

        // Add to list of users
        users.push(user);
        return users;
      }
    },
  addFood: {
    name: "Add food",
    type: GraphQLList(FoodEntry),
    args: {name: {type: GraphQLNonNull(GraphQLString)}, time: {type: GraphQLNonNull(GraphQLInt)}},
    resolve: (parent, args) => {
      // Build food object from args received
      const food = {};
      food.name = args.name;
      food.time = args.time;
      food.id = foods.length + 1;

      // Add to list of foods
      foods.push(food);
      return foods;
    }
  }})
});

// Construct a schema, using GraphQL schema language
var schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: mutationType
});

//Apply graphql middleware
app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// const foodsquery = async() => {return await Food.find().exec()};
const foodsquery = async() => {return await Food.find()};
