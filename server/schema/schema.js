const graphQL = require('graphql');
const User = require('./../model/user');
const Todo = require('./../model/todo');

const _ = require('lodash');
const { truncate } = require('lodash');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
} = graphQL;

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return Todo.find({ userId: parent.id });
      },
    },
  }),
});

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'Documentation for Todo',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    userId: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ userId: args.userId });
      },
    },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Todo.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return Todo.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(parent, args) {
        let user = User({
          name: args.name,
        });

        return user.save();
      },
    },
    UpdateUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
            },
          },
          {
            new: true,
          }
        ));
      },
    },
    DeleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();

        if (!removedUser) {
          throw new 'Error'();
        }

        return removedUser;
      },
    },

    CreateTodo: {
      type: TodoType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let todo = Todo({
          id: args.id,
          title: args.title,
          description: args.description,
          userId: args.userId,
          completed: false,
        });

        return todo.save();
      },
    },
    UpdateTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        return (updateTodo = Todo.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
              completed: args.completed,
            },
          },
          {
            new: true,
          }
        ));
      },
    },
    DeleteTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedTodo = Todo.findByIdAndRemove(args.id).exec();

        if (!removedTodo) {
          throw new 'Error'();
        }

        return removedTodo;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
