const { AuthenticationError } = require('apollo-server-express');
const {User, Book } = require("../models");
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-_v -password')
                .populate('savedBooks');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
           
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async ({ user, body }, res) => {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return res.json(updatedUser);
            } catch (err) {
              console.log(err);
              return res.status(400).json(err);
            }
          },
        removeBook: async ({ user, params }, res) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: user._id },
              { $pull: { savedBooks: { bookId: params.bookId } } },
              { new: true }
            );
            if (!updatedUser) {
              return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return res.json(updatedUser);
          },
    }
   
};

module.exports = resolvers;