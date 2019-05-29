const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Character" type can be used in other type declarations.
  type Character {
    id: Int
    name: String
    status: String
    episodes: [Episode]
  }

  type Episode {
    id: Int
    name: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    characters: [Character]
    character(id: Int): Character
    episodes: [Episode]
  }
`;

const resolvers = {
  Query: {
    characters: () => fetchCharacters(),
    character: (_, args) => fetchCharacter(args.id),
    episodes: () => fetchEpisodes()
  },
  Character: {
    episodes: async obj => {
      const characterEpisodes = obj.episode || [];
      const episodes = await fetchEpisodes();

      if (characterEpisodes.length === 0) {
        return [];
      }

      return characterEpisodes.map(episodeUrl => {
        return mapEpisodeUrlToEpisode(episodes, episodeUrl);
      });
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const characters = [
  {
    name: "Rick Sanchez",
    id: 1,
    status: "Alive",
    episodes: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/2"
    ]
  },
  {
    name: "Morty Smith",
    id: 2,
    status: "Alive",
    episodes: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/3"
    ]
  }
];

const episodes = [
  {
    name: "Pilot",
    id: 1
  },
  {
    name: "Lawnmower Dog",
    id: 2
  }
];

function getEpisodeIdFromUrl(url) {
  return url && url.split("/").pop();
}

function mapEpisodeUrlToEpisode(episodes, episodeUrl) {
  return episodes.find(e => e.id == getEpisodeIdFromUrl(episodeUrl));
}

function fetchEpisodes() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchCharacters() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchCharacter(id) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/" + id)
    .then(res => res.json())
    .then(json => json);
}
