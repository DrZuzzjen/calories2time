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

// Import controllers
const food = require("../controllers/food");
const user = require("../controllers/user");

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
      email : {type: GraphQLString},
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
        resolve: user.findUsers,
      },
      foods: {
        type: GraphQLList(FoodEntry),
        resolve: food.findFoods,
      },
      user: {
        type: UserEntry,
        args: { username: { type: GraphQLNonNull(GraphQLString) } },
        resolve: user.findUser,
      },
      userTime: {
        type: GraphQLString,
        args: {username: {type: GraphQLNonNull(GraphQLString)}},
        resolve: user.userTime,
      },
      food: {
        type: FoodEntry,
        args: { name: { type: GraphQLNonNull(GraphQLString) } },
        resolve: food.findFood,
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
        resolve: user.addUser,
      },
      removeUser: {
        name: "Remove user",
        type: GraphQLList(UserEntry),
        args: { username: { type: GraphQLNonNull(GraphQLString) } },
        resolve: user.removeUser,
      },
      updateUser: {
        name: "Update user",
        type: GraphQLList(UserEntry),
        args: {
          username: { type: GraphQLNonNull(GraphQLString) },
          newUsername: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: user.updateUserGraph,
      },
  
      addFood: {
        name: "Add food",
        type: GraphQLList(FoodEntry),
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          time: { type: GraphQLNonNull(GraphQLInt) },
        },
        resolve: food.addFoodGraph,
      },
      removeFood: {
        name: "Remove food",
        type: GraphQLList(FoodEntry),
        args: { name: { type: GraphQLNonNull(GraphQLString) } },
        resolve: food.removeFood,
      },
      updateFood: {
        name: "Update food",
        type: GraphQLList(FoodEntry),
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          time: { type: GraphQLNonNull(GraphQLInt) },
        },
        resolve: food.updateFoodGraph,
      },
      addFoodToUser: {
          name: "Add food to user",
          type: UserEntry,
          args: {
              username: {type: GraphQLNonNull(GraphQLString)},
              food: {type: GraphQLNonNull(GraphQLString)}
          },
          resolve: user.addFoodToUser
        }
    }),
  });

  module.exports = new GraphQLSchema({
    query: rootQueryType,
    mutation: mutationType,
  });
