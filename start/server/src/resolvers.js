module.exports = {
    Query: {
        artworks: async (_, __, { dataSources }) => 
            dataSources.artworkAPI.getAllArtworks(),
        artwork: async (_, { id }, { dataSources }) => 
            dataSources.artworkAPI.getArtworkById({ artworkId: id }),
        me: async (_, __, { dataSources }) => 
            dataSources.userAPI.findOrCreateUser(),
    },
};