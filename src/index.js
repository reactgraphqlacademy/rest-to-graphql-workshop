const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");
const {
  fromGlobalId,
  toGlobalId,
  connectionFromArray
} = require("graphql-relay");
const mockedCharacters = require("../mocks/characters.json");

const CHARACTER_TYPE = "Character";
const EPISODE_TYPE = "Episode";

const typeDefs = gql`
  interface INode {
    id: ID!
  }

  union Node = Character | Episode

  type PageInfo {
    # https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo.Fields
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int # this is not part of the Relay specification but it's widely used
  }

  type CharacterEdge {
    # https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
    cursor: String!
    node: Character
  }

  type CharactersConnection {
    # https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types.Fields
    pageInfo: PageInfo!
    edges: [CharacterEdge]
  }

  type Character implements INode {
    id: ID!
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
    node(id: String!): Node
    charactersConnection(
      first: Int
      after: String
      last: Int
      before: String
    ): CharactersConnection
    character(id: Int): Character
    episodes: [Episode]
    episode(id: Int): Episode
  }
`;

const resolvers = {
  Query: {
    charactersConnection: async (_, args) => {
      // partial solution
      // const characters = await fetchCharactersData();
      // const pageInfo = {
      //   hasNextPage: characters.info.next,
      //   hasPreviousPage: characters.info.prev,
      //   totalCount: characters.info.count
      // };
      // const edges = characters.results.map(node => ({
      //   node,
      //   cursor: "" // current page + id + next page
      // }));
      // return { edges, pageInfo };
      const characters = connectionFromArray(mockedCharacters, args);
      return {
        ...characters,
        pageInfo: {
          ...characters.pageInfo,
          totalCount: mockedCharacters.length
        }
      };
    },
    node: (_, { id }) => getObjectById(fromGlobalId(id)),
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
    id: parent => toGlobalId(CHARACTER_TYPE, parent.id),
    episodes: parent => {
      const characterEpisodes = parent.episode || [];
      return characterEpisodes.map(fetchEpisodeByUrl);
    }
  },
  Node: {
    __resolveType(obj) {
      if (obj.episode) {
        return CHARACTER_TYPE;
      }
      if (obj.character) {
        return EPISODE_TYPE;
      }

      return null;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function getObjectById({ type, id }) {
  const types = {
    Character: fetchCharacterById
  };

  return types[type](id);
}

function fetchEpisodesData() {
  return fetch("https://rickandmortyapi.com/api/episode/").then(res =>
    res.json()
  );
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

function fetchCharactersData() {
  return fetch("https://rickandmortyapi.com/api/character/").then(res =>
    res.json()
  );
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
