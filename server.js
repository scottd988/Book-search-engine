const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});


