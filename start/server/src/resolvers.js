const { paginateResults } = require('./utils.js'); 

module.exports = {
    Query: {
        artworks: async (_, { pageSize = 10, after }, { dataSources }) => { 
            const allArtworks = await dataSources.artworkAPI.getAllArtworks();
            const artworks = paginateResults({
                after,
                pageSize,
                results: allArtworks,
            });

            return {
                artworks,
                cursor: artworks.length ? artworks[artworks.length - 1].cursor : null,
                hasMore: artworks.length
                  ? artworks[artworks.length - 1].cursor !==
                    allArtworks[allArtworks.length - 1].cursor
                  : false,
              };
        },
        artwork: async (_, { id }, { dataSources }) => 
            dataSources.artworkAPI.getArtworkById({ artworkId: id }),
        me: async (_, __, { dataSources }) => 
            dataSources.userAPI.findOrCreateUser(),
    },
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
          const user = await dataSources.userAPI.findOrCreateUser({ email });
          if (user) return Buffer.from(email).toString('base64');
        },
        buyArtworks: async (_, { artworkIds }, { dataSources }) => {
            const results = await dataSources.userAPI.buyArtworks({ artworkIds });
            const artworks = await dataSources.artworkAPI.getArtworksByIds({
              artworkIds,
            });
        
            return {
              success: results && results.length === artworkIds.length,
              message:
                results.length === artworkIds.length
                  ? 'Artworks purchased successfully!'
                  : `The following artworks couldn't be purchased: ${artworkIds.filter(
                      id => !results.includes(id),
                    )}`,
                    artworks,
            };
        },
        cancelArtworkPurchase: async (_, { artworkId }, { dataSources }) => {
            const result = dataSources.userAPI.cancelArtworkPurchase({ artworkId });
        
            if (!result)
                return {
                success: false,
                message: 'Failed to cancel purchase.',
                };
        
            const artwork = await dataSources.artworkAPI.getArtworkById({ artworkId });
            return {
                success: true,
                message: 'Artwork purchase cancelled.',
                artworks: [artwork],
            };
        },
    },
    Artist: {
        isAlive: async (artist, _, { dataSources }) => {
            const artwork = dataSources.artworkAPI.getArtworkById({ artworkId: id });
            if (!artwork === null) {
                if (artwork.artist.isAlive === null) {
                    artwork.artist.isAlive = true
                };
            }
        }
    },
    User: {
        artworks: async (_, __, { dataSources }) => {
          const artworkIds = await dataSources.userAPI.getArtworkIdsByUser();
      
          if (!artworkIds.length) return [];
      
          return (
            dataSources.artworkAPI.getArtworksByIds({ artworkIds, }) || []
          );
        },
      },
};