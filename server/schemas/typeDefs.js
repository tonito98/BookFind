// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    input savedBook {
        description: String
        title: String
        bookId: String
        link: String
        authors: [String]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    type Auth {
        token: ID!
        user: User
    }
    type Query {
        me: User
    }

    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email:String!, password:String!): Auth
        saveBook(bookId: ID!): User
        removeBook(bookId: ID!): User
    }   
    `;

//export the typeDefs
module.exports = typeDefs;