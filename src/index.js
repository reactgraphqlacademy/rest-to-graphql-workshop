const fetch = require("node-fetch");
const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./graphql/typeDefinitions");
const { resolvers } = require("./graphql/resolvers");

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function fetchEpisodes() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/episode/")
    .then((res) => res.json())
    .then((json) => json.results);
}

function fetchEpisodeById(id) {
  return fetch("https://rickandmortyapi.com/api/episode/" + id)
    .then((res) => res.json())
    .then((json) => json);
}

function fetchEpisodeByUrl(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((json) => json);
}

function fetchCharacters() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/")
    .then((res) => res.json())
    .then((json) => json.results);
}

function fetchCharacterById(id) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://rickandmortyapi.com/api/character/" + id)
    .then((res) => res.json())
    .then((json) => json);
}

function fetchCharacterByUrl(url) {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch(url)
    .then((res) => res.json())
    .then((json) => json);
}
