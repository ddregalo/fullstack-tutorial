const { RESTDataSource } = require('apollo-datasource-rest');

class ArtworkAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllArtworks() {
        const response = await this.get('launches');
        return Array.isArray(response)
          ? response.map(artwork => this.artworkReducer(artwork))
          : [];
    }

    async getArtworkById() {
        const response = await this.get('launches');
        return Array.isArray(response)
          ? response.map(artwork => this.artworkReducer(artwork))
          : [];
    }

    getArtworksByIds({ artworkIds }) {
        return Promise.all(
          artworkIds.map(artworkId => this.getArtworkById({ artworkId })),
        );
      }

    artworkReducer(artwork) {
        return {
          id: artwork.flight_number || 0,
          artist: {
            id: artwork.rocket.rocket_id,
            firstName: artwork.mission_name,
            lastName: artwork.rocket.rocket_name,
            dateOfBirth: parseInt(Math.floor(Math.random() * 2000)),
            isAlive: true
          },
          title: artwork.launch_site.site_name,
          year: parseInt(Math.floor(Math.random() * 2000)),
          medium: artwork.rocket.rocket_type,
          height: parseInt(Math.floor(Math.random() * 200)),
          width: parseInt(Math.floor(Math.random() * 500))
        };
      }
}
  
module.exports = ArtworkAPI;