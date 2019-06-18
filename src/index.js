const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Character {
    id: ID
    name: String
    status: String
    episodes: [Episode]
  }

  type Episode {
    id: ID
    name: String
    characters: [Character]
  }

  type Query {
    characters: [Character]
    character(id: Int): Character
    episodes: [Episode]
    episode(id: Int): Episode
  }
`;

const resolvers = {
  Query: {
    characters: () => fetchCharacters(),
    character: (_, args) => fetchCharacterById(args.id),
    episodes: () => fetchEpisodes(),
    episode: (_, args) => fetchEpisodeById(args.id)
  },
  Episode: {
    characters: parent => {
      const { characters = [] } = parent;
      return characters.map(fetchCharacterByUrl);
    }
  },
  Character: {
    episodes: parent => {
      const characterEpisodes = parent.episode || [];
      return characterEpisodes.map(fetchEpisodeByUrl);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function fetchEpisodes() {
  return fetch("https://rickandmortyapi.com/api/episode/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchEpisodeById(id) {
  return fetch("https://rickandmortyapi.com/api/episode/" + id)
    .then(res => res.json())
    .then(json => json);
}

function fetchEpisodeByUrl(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => json);
}

function fetchCharacters() {
  return fetch("https://rickandmortyapi.com/api/character/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchCharacterById(id) {
  return fetch("https://rickandmortyapi.com/api/character/" + id)
    .then(res => res.json())
    .then(json => json);
}

function fetchCharacterByUrl(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => json);
}
