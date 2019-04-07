const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema.js');
const server = new ApolloServer({ typeDefs });

const store = createStore();

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);

    dataSources: () => ({
        ArtworkAPI: new ArtworkAPI(),
        UserAPI: new UserAPI({ store }),
    })
  });