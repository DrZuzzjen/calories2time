const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
  } = require("graphql");

// Import models
const { Food } = require("../models/food");
const User = require("../models/user");

// GraphQlObjects Schema
const FoodEntry = new GraphQLObjectType({
    name: "Food",
    fields: () => ({
      name: { type: GraphQLString },
      time: { type: GraphQLInt },
      id: { type: GraphQLID },
    }),
  });
  
  const UserEntry = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      id: { type: GraphQLID },
      foods: {
        type: GraphQLList(FoodEntry)
    }
    }),
  });
  
  // Build query structure
  const rootQueryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      users: {
        type: GraphQLList(UserEntry),
        resolve: () => {
          return User.find();
        },
      },
      foods: {
        type: GraphQLList(FoodEntry),
        resolve: () => {
          return Food.find();
        },
      },
      user: {
        type: UserEntry,
        args: { name: { type: GraphQLNonNull(GraphQLString) } },
        resolve: async (parent, args) => {
          return User.findOne({username: args.name});
        },
      },
      userTime: {
        type: GraphQLString,
        args: {name: {type: GraphQLNonNull(GraphQLString)}},
        resolve: async (parent,args) => {
          const userDocument = await User.findOne({username: "Test"});
          const timeSum = userDocument.foods.reduce( (total, currentValue) => {
            return total + currentValue.time ;
          }, 0);
          return "Your time is " + timeSum;    
        }
      },
      food: {
        type: FoodEntry,
        args: { name: { type: GraphQLNonNull(GraphQLString) } },
        resolve: (parent, args) => {
          return Food.findOne({name: args.name});
        },
      },
    }),
  });
  
  // Build mutation query
  const mutationType = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      addUser: {
        name: "Add user",
        type: GraphQLList(UserEntry),
        args: {
          username: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args) => {
          // Build user object from args received
          const userToAdd = new User({
            username: args.username,
            password: args.password,
            email: args.email,
          });
  
          // Add to DB
          await userToAdd.save().then(() => {
            console.log("User saved");
          });
  
          // Return all foods in DB
          return User.find();
        },
      },
      removeUser: {
        name: "Remove user",
        type: GraphQLList(UserEntry),
        args: { username: { type: GraphQLNonNull(GraphQLString) } },
        resolve: async (parent, args) => {
          // Delete user from database
          await User.deleteOne({ username: args.username });
  
          // Return all users in DB
          return User.find();
        },
      },
      updateUser: {
        name: "Update user",
        type: GraphQLList(UserEntry),
        args: {
          username: { type: GraphQLNonNull(GraphQLString) },
          newUsername: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args) => {
          // Update user from database
          // Problem we are going to have, different caps, convert everything to Titlecase or lowercase?
          await User.updateOne(
            { username: args.username },
            { username: args.newUsername }
          );
  
          // Return all users in DB
          return User.find();
        },
      },
  
      addFood: {
        name: "Add food",
        type: GraphQLList(FoodEntry),
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          time: { type: GraphQLNonNull(GraphQLInt) },
        },
        resolve: async (parent, args) => {
          // Build food object from args received
            const foodToAdd = new Food({
            name: args.name,
            time: args.time,
          });
  
          // Add to DB
          await foodToAdd.save().then(() => {
            console.log("Food saved");
          });
  
          // Return all foods in DB
          return Food.find();
        },
      },
      removeFood: {
        name: "Remove food",
        type: GraphQLList(FoodEntry),
        args: { name: { type: GraphQLNonNull(GraphQLString) } },
        resolve: async (parent, args) => {
          // Delete food from database
          await Food.deleteOne({ name: args.name });
  
          // Return all foods in DB
          return Food.find();
        },
      },
      updateFood: {
        name: "Update food",
        type: GraphQLList(FoodEntry),
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          time: { type: GraphQLNonNull(GraphQLInt) },
        },
        resolve: async (parent, args) => {
          // Update food from database
          // Problem we are going to have, different caps, convert everything to Titlecase or lowercase?
          await Food.updateOne({ name: args.name }, { time: args.time });
  
          // Return all foods in DB
          return Food.find();
        },
      },
      //TODO add query that returns time for a user calculated on the food the user has eaten
      addFoodToUser: {
          name: "Add food to user",
          type: UserEntry,
          args: {
              username: {type: GraphQLNonNull(GraphQLString)},
              food: {type: GraphQLNonNull(GraphQLString)}
          },
          resolve: async (parent, args) => {
            const foodToAdd = await Food.findOne({name: args.food});
            const user = await User.findOne({ username: args.username });
            //Spread so it appends instead of replacing the current foods declared
            user.foods =  [...user.foods, foodToAdd];
            await user.save();
          
            return user;
          }
      }
    }),
  });

  module.exports = new GraphQLSchema({
    query: rootQueryType,
    mutation: mutationType,
  });
