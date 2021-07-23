const { gql } = require("apollo-server");
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    characters: [Character]
  }

  type Character {
    id: ID
    name: String
    status: String
    species: String
    type: String
    gender: String
    # origin: object
    # location: object
    image: String
    # episode: array
    url: String
    created: String
  }
`;
module.exports = { typeDefs };
