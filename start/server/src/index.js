const { ApolloServer } = require('apollo-server');
const { createStore } = require('./utils');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers');
const server = new ApolloServer({ 
        typeDefs,
        resolvers,
        dataSources: () => ({
            ArtworkAPI: new ArtworkAPI(),
            UserAPI: new UserAPI({ store }),
        }) 
    });

const store = createStore();

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });