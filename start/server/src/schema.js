const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        artworks(
            pageSize: Int
            after: String
          ): ArtworkConnection!
          artwork(id: ID!): Artwork
          me: User
    }

    type ArtworkConnection {
        cursor: String!
        hasMore: Boolean!
        artworks: [Artwork]!
    }

    type Artwork {
        id: ID!
        artist: Artist
        title: String
        year: Int
        medium: String
        height: Int
        width: Int
        style: Style
    }

    enum Style {
        ABSTRACT
        EXPRESSIONISM
        IMPRESSIONISTS
        POP
        SUREALISM
    }

    type User {
        id: ID!
        email: String!
        artworks: [Artwork]!
    }

    type Artist {
        id: ID!
        firstName: String
        lastName: String
        dateOfBirth: Int
        style: Style
        isAlive: Boolean
    }

    type Mutation {
        addArtworks(artworkIds: [ID]!): ArtworkUpdateResponse!
        deleteArtwork(artworkId: ID!): ArtworkUpdateResponse!
        login(email: String): String
        buyArtworks(artworkIds: [Int]): [Artwork]
        cancelArtworkPurchase(artworkId: Int): [Artwork]
    }

    type ArtworkUpdateResponse {
        success: Boolean!
        message: String
        artwokrs: [Artwork]
    }
`;

module.exports = typeDefs;