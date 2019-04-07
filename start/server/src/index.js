const { ApolloServer } = require('apollo-server');
const { createStore } = require('./utils');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers');
const store = createStore();
const ArtworkAPI = require('./datasources/artwork.js');
const UserAPI = require('./datasources/user.js');
const server = new ApolloServer({ 
        typeDefs,
        resolvers,
        dataSources: () => ({
            artworkAPI: new ArtworkAPI(),
            userAPI: new UserAPI({ store }),
        }),
        introspection: true 
    });

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });