const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = { 
  Query: {
    /**
    Resolver to fetch user details
    Check if user is logged in
    Find user by id and populate savedBooks
    */ 
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');
          // Return the found user data
        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
        // Find the user by their email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      // Check if the password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      //token for the new user
      const token = signToken(user);
    // Return the token and new user details
      return { token, user };
    },

    // Resolver for the "removeBook" mutation to remove a book from a user's saved books
    removeBook: async (parent, { bookId }, context) => {
        // Check if user is logged in
      if (context.user) {
        // Update the user's saved books by pulling the specified bookId
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
// Return the updated list of books
        return updatedBooks;
      }
    },

    saveBook: async (parent, { bookToSave }, context) => {
      if (context.user) {
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookToSave } },
          { new: true }
        ).populate('savedBooks');

        return updatedBooks;
      }
// If not logged in, throw an authentication error
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;