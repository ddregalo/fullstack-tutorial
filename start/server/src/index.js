const { ApolloServer } = require('apollo-server');
const { createStore } = require('./utils');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers');
const store = createStore();

const ArtworkAPI = require('./datasources/artwork.js');
const UserAPI = require('./datasources/user.js');

const isEmail = require('isemail');
const server = new ApolloServer({
        context: async ({ req }) => {
            const auth = (req.headers && req.headers.authorization) || '';
            const email = Buffer.from(auth, 'base64').toString('ascii');
            
            if (!isEmail.validate(email)) return {user: null};

            const users = await store.users.findOrCreate({ where: { email } });
            const user = users && users[0] ? users[0] : null;

            return { user: { ...user.dataValues } };
        },
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