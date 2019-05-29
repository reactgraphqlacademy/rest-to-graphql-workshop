# Thinking in GraphQL exercise

This exercise is part of the [React GraphQL Academy](http://reactgraphql.academy) learning material. The goal of the exercise is to help you get started transitioning from REST to GraphQL.

## Learning objectives

- Thinking in Graphs
- Learn how to connect resolvers to a REST API
- Understand Schema Design principles

## Exercise part 1

[https://rickandmortyapi.com/graphql/](https://rickandmortyapi.com/graphql/)

- Query a list of characters are in the system
- Query a list with all the character names
- Query how many characters are in the system
- Query a single characther by id (try id equals 1) and get its name
- How many types do we have in the system?

## Exercise part 2

### To get started

We are going to create our own GraphQL API on top of this [Rick and Morty API](https://rickandmortyapi.com/documentation/#rest)

- `git clone git@github.com:reactgraphqlacademy/rest-to-graphql-workshop.git`
- `cd rest-to-graphql-workshop`
- `yarn install` or `npm install`
- `yarn start` or `npm start`

### Tasks

- [ ] 1. Create a Character type in your schema. Here is the [documentation of the character endpont](https://rickandmortyapi.com/documentation/#character-schema).

- [ ] 2. Create an Episode type in your schema. Here is the [documentation of the episode endpont](https://rickandmortyapi.com/documentation/#episode-schema).

- [ ] 3. Create a relationship between Episode type in your schema. Here is the [documentation of the episode endpont](https://rickandmortyapi.com/documentation/#episode-schema). Hints

  - You need to add a Character type in the resolvers object and an episodes field to it. Similar to the Author type and books field in the example [https://www.apollographql.com/docs/apollo-server/essentials/data#resolver-map](map) the episodes
  - You can filter the episodes in our case using the `mapEpisodeUrlToEpisode` defined at the bottom of this file `src/index.js` of this project.

- [ ] 4. Replace the mock data using https://rickandmortyapi.com/documentation/#rest.

  - You can use the `fetchEpisodes` and `fetchCharacters` defined at the bottom of this file `src/index.js`
  - You'll need to replace mock data in 3 different places:
    - Query characters
    - Query episodes
    - Field episodes in the Character type

- [ ] 5. Create a query that returns a single Character given an id. You need to fetch the character using `https://rickandmortyapi.com/documentation/#get-a-single-character`

### Bonus

Create a field in Episode that returns a list the Character types in that episode using the [REST API](https://rickandmortyapi.com/documentation/#rest)

## Articles and links

- http://graphql.org/learn/
- http://graphql.org/learn/thinking-in-graphs/
- https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b
- https://dev-blog.apollodata.com/graphql-explained-5844742f195e
- https://facebook.github.io/relay/docs/thinking-in-graphql.html
- https://dev-blog.apollodata.com/the-anatomy-of-a-graphql-query-6dffa9e9e747
- https://github.com/apollographql/apollo-server
- https://www.youtube.com/watch?v=PHabPhgRUuU
- https://facebook.github.io/relay/graphql/connections.htm
- https://dev-blog.apollodata.com/introducing-launchpad-the-graphql-server-demo-platform-cc4e7481fcba
- https://dev-blog.apollodata.com/
- http://dev.apollodata.com
- https://astexplorer.net/

## License

This material is available for private, non-commercial use under the [GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html).
