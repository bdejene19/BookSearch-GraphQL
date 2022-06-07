const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models/index");
const { signToken } = require("../utils/auth");
const resolvers = {
  Query: {
    me: () => {},
  },

  Mutation: {
    login: async (parents, { email, password }) => {
      const user = await User.findOne({ email: email }).catch((err) => err);

      if (!user) {
        return new AuthenticationError(
          "Email is does not exist in our database, or email and/or password is incorrect"
        );
      }

      const signUserIn = user.isCorrectPassword(password);

      if (signUserIn) {
        const token = signToken(user);
        return { token, user };
      } else {
        return new AuthenticationError(
          "Email is does not exist in our database, or email and/or password is incorrect"
        );
      }
    },
    addUser: async (parents, { username, email, password }) => {
      const newUser = await User.create({
        username: username,
        email: email,
        password: password,
      }).catch((err) => err);

      if (!newUser) {
        return new Error("New user could not be created");
      }

      const token = signToken(newUser);
      return { token, newUser };
    },

    // saveBook: async (parents, { bookContent }, context) => {
    //   const user = await User.findOneAndUpdate(
    //     { _id: context._id },
    //     { $addToSet: { savedBooks: bookContent } }
    //   ).catcher((err) => err);

    //   if (!user) {
    //     return new Error("Book could not be saved to user in database");
    //   } else {
    //     return user;
    //   }
    // },
    removeBook: async (parents, { bookId }, context) => {
      const user = await User.findOneAndUpdate(
        { _id: context._id },
        { $pullAll: { savedBooks: bookId } }
      ).catch((err) => err);

      if (!user) {
        return new Error(
          "Book could not be removed from saved list in database"
        );
      } else {
        return user;
      }
    },
  },
};

module.exports = resolvers;
