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