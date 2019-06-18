// We use this `fetch` to fetch data from the REST API
// Feel free to replace it with Axios or any other
// I like fetch because it's standard https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
const fetch = require("node-fetch");

// We are using the (default) Apollo Express server https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server/src/index.ts
// gql will transform the SDL (Schema Definition Language) into AST (Abstract Syntax Tree)
//    - https://www.apollographql.com/docs/apollo-server/essentials/schema/#schema-definition-language
//    - https://github.com/apollographql/graphql-tag#gql
//    - https://astexplorer.net/
// AST is used by graphql (https://www.npmjs.com/package/graphql) to validate your queries.
// graphql is a dependency of Apollo Server https://www.apollographql.com/docs/apollo-server/getting-started/#step-2-install-dependencies
const { ApolloServer, gql } = require("apollo-server");

// Notice GraphQL is a specification https://graphql.github.io/graphql-spec/, it's not a tool or framework.
// The GraphQL reference implementation is written in JavaScript https://www.npmjs.com/package/graphql,
// but there are many other implementations in different languages https://www.graphql.org/code/

// Type definitions define the "shape" of your data
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Character {
    # id is a Field https://graphql.github.io/learn/queries/#fields in Character type. ID is a type https://www.graphql.org/learn/schema/#scalar-types
    id: ID

    # name is a Field https://graphql.github.io/learn/queries/#fields in Character type. String is a type https://www.graphql.org/learn/schema/#scalar-types
    name: String

    # status is a Field https://graphql.github.io/learn/queries/#fields in Character type. String is a type https://www.graphql.org/learn/schema/#scalar-types
    status: String

    # episodes is a Field https://graphql.github.io/learn/queries/#fields in Character type.
    # Here we are creating an explicit relationship between Character type and Episode type
    episodes: [Episode]
  }

  # Types can be used in other type declarations. E.g. we use the Episode type in Character type episodes Field
  type Episode {
    # id is a Field https://graphql.github.io/learn/queries/#fields in Episode type. ID is a type https://www.graphql.org/learn/schema/#scalar-types
    id: ID

    # name is a Field https://graphql.github.io/learn/queries/#fields in Episode type. String is a type https://www.graphql.org/learn/schema/#scalar-types
    name: String

    # characters is a Field https://graphql.github.io/learn/queries/#fields in Episode type. Character is a type https://www.graphql.org/learn/schema/#scalar-types
    characters: [Character]
  }

  # The "Query" type is the root of all GraphQL queries.
  # Notice the "Query" is simply an object type like Character or Episode (https://graphql.github.io/learn/schema/#object-types-and-fields)
  type Query {
    # characters is a Field https://graphql.github.io/learn/queries/#fields in Query type
    characters: [Character]

    # character is a Field https://graphql.github.io/learn/queries/#fields in Query type
    # notice character has an argument https://graphql.github.io/learn/schema/#arguments
    character(id: Int): Character

    # episodes is a Field https://graphql.github.io/learn/queries/#fields in Query type
    episodes: [Episode]

    # episode is a Field https://graphql.github.io/learn/queries/#fields in Query type
    episode(id: Int): Episode
  }
`;

// Resolvers connect types with a data source/s.
// They “resolve” GraphQL operations into data
const resolvers = {
  Query: {
    // This resolves the Field "characters" in the Query type
    characters: () => fetchCharacters(),

    // This resolves the Field "character" in the Query type
    // Each resolver function has 4 arguments: (parent_object, args, context, info)
    // https://www.apollographql.com/docs/graphql-tools/resolvers/#resolver-function-signature
    // We only need the second argument and I'm naming the first one with an underscore (_),
    // that's a naming convention that means I'm not using that argument.
    // Feel free to do the same or change the name of the arguments
    character: (_, args) => fetchCharacterById(args.id),

    // This resolves the Field "episodes" in the Query type.
    // Notice we are not using any of the 4 resolver arguments (parent, args, context, info),
    // I'm only adding them here for you to notice them and reinforce they are always passed on.
    // In this case you could simply do `episodes: () => fetchEpisodes()`
    episodes: (parent, args, context, info) => fetchEpisodes(),

    // This resolves the Field "episode" in the Query type
    // We only need the second argument and I'm naming the first one with an underscore (_),
    // that's a naming convention that means I'm not using that argument.
    // Feel free to do the same or change the name of the arguments
    episode: (_, args) => fetchEpisodeById(args.id)
  },
  Episode: {
    characters: parent => {
      const { characters = [] } = parent;
      return characters.map(fetchCharacterByUrl);
      // previous function without using JavaScript point free
      // return characters.map(
      //   async characterUrl => fetchCharacterByUrl(characterUrl)
      // );
    }
  },
  Character: {
    // We are only using 1 of the 4 arguments but I want to show you again the resolver function signature :)
    episodes: (parent, args, context, info) => {
      // Heads up! Don't overlook this bit, notice the parent argument in the resolver is the parent Field "Character".
      // We don't know ahead of time which Character is that one. When this resolver is invoked the argument `parent` will point
      // to whatever Character is resolved in the parent Field. Example, in the following query the argument `parent` will be Rick Sanchez
      // Therefore the parent.episode will return ["https://rickandmortyapi.com/api/episode/1","https://rickandmortyapi.com/api/episode/2", ...and_more]
      // Full list of Rick's episodes here https://rickandmortyapi.com/api/character/1
      // query {
      //   character(id:1) {
      //     name
      //     episode {
      //       name
      //     }
      //   }
      // }
      const characterEpisodes = parent.episode || [];

      // Here we map the episode URL and fetch the data from the episode endpoint.
      // There are performance optimizations we are not taking into consideration, performance is not the goal of this exercise.
      // The goal of this exercise is to help you understand the types and relationships in the GraphQL schema
      return characterEpisodes.map(fetchEpisodeByUrl);
      // same function without using JavaScript point free:
      // return characterEpisodes.map(episodeUrl => {
      //   return fetchEpisodeByUrl(episodeUrl);
      // });
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function fetchEpisodes() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
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
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/")
    .then(res => res.json())
    .then(json => json.results);
}

function fetchCharacterById(id) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/" + id)
    .then(res => res.json())
    .then(json => json);
}

function fetchCharacterByUrl(url) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch(url)
    .then(res => res.json())
    .then(json => json);
}

// At this point, you might have noticed some code repetition fetching the data from the REST API
// You can use the Apollo REST Data source https://www.apollographql.com/docs/apollo-server/features/data-sources/#rest-data-source
// Here there is an article from the Prisma team about wrapping a REST API so you have diversity of opinion https://www.prisma.io/blog/how-to-wrap-a-rest-api-with-graphql-8bf3fb17547d

/*

# You can paste these queries in Playground to test it works

query character {
  character(id: 1) {
    name
  }
}

query characters {
  characters {
    name
    episodes {
      name
    }
  }
}

query episodes {
  episodes {
    name
  }
}

*/
