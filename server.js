require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const {graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

// Import models
const {Food} = require('./models/food');
const User = require('./models/user');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

// Testing save
 const food = new Food({
   name: "Almonds",
   time: 10
 }).save().then( () => console.log("Food saved"));

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


// Add graphql stuff

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
    time: {type: GraphQLInt}
  })
});

const UserEntry = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    name: {type: GraphQLString}
  })
});

// Build query structure
const rootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: GraphQLList(UserEntry),
      resolve: () => {return users;}
    },
    foods: {
      type: GraphQLList(FoodEntry),
      resolve: () => {return foods;}
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


// Construct a schema, using GraphQL schema language
var schema = new GraphQLSchema({
  query: rootQueryType,
  // mutation: mutationType
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
