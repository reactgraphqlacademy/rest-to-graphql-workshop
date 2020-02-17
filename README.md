# Thinking in GraphQL exercise

This exercise is part of the [React GraphQL Academy](http://reactgraphql.academy) learning material. The goal of the exercise is to help you get started transitioning from REST to GraphQL.

## Learning objectives

- Understand the main functionalities and responsibilities of a GraphQL server
- Learn how to migrate an existent REST API to GraphQL and start “thinking in graphs”
- Start identifying potential problems when running real-world GraphQL APIs

## Exercise part 1

[https://rickandmortyapi.com/graphql/](https://rickandmortyapi.com/graphql/)

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

- [ ] 1. Create a `Character` type in your schema. Use the [documentation of the character endpoint](https://rickandmortyapi.com/documentation/#character-schema) to define the shape of the `Character` type.

  - [ ] 1.1. Add a `characters` field to the `Query` type. You can replace the `books` field from Query type on line 32 with `characters` since we won't use books. The `characters` field in the `Query` type should return an array of [Character].
  - [ ] 1.2. Add a `characters` resolver to the Query's resolvers. You can replace the `books` field from Query type on line 40 with `characters` since we won't use books. You can return the mock characters array (which is in the scope and defined at the bottom of the file index.js) in the resolver function.
  - [ ] 1.3 You should be able to manually test the `characters` query in Playground at [http://localhost:4000/](http://localhost:4000/)

- [ ] 2. Create an `Episode` type in your schema. Use the [documentation of the episode endpoint](https://rickandmortyapi.com/documentation/#episode-schema) to define the shape of the `Episode` type. Here you are practicing what you've learned on the previous task (1).

  - [ ] 2.1. Add an `episodes` field to the `Query` type. The `episodes` field should return an array of [Episode]
  - [ ] 2.2. Add an `episodes` resolver to the Query's resolvers. You can return the mock episodes array (which is in the scope and defined at the bottom of the file index.js) in the resolver function.
  - [ ] 2.3 You should be able to manually test the `episodes` query in Playground at [http://localhost:4000/](http://localhost:4000/)

- [ ] 3. Replace the mock data using https://rickandmortyapi.com/documentation/#rest.

  - You can use the `fetchEpisodes` and `fetchCharacters` defined at the bottom of this file `src/index.js`
  - You'll need to replace mock data in 2 different places:
    - Query characters
    - Query episodes

- [ ] 4. Create a relationship between Episode type and Character type in your schema. Please have a look at the [documentation of the episode endpoint](https://rickandmortyapi.com/documentation/#episode-schema) to see how to get the episodes of a given character (heads up! we are calling the field in our Characters `episodes` but the REST API is calling the field that returns an array of episodes as `episode` - singular!). Hints:

  - You need to add a `Character` key in the resolvers object and an object with an `episodes` key in `Character`. Similar to the Author type and books field in the [Apollo documentation](https://www.apollographql.com/docs/apollo-server/essentials/data#resolver-map). Hint: The first argument of the resolver is the 'parent' type, in this case, the parent of the `episodes` field is the `Character`. parent.episode gives you the array of episodes returned from the REST API.
  - You can use the helper fetch functions defined at the bottom of this file `src/index.js`.

- [ ] 5. Create a query that returns a single Character given an id. You need to fetch the character using `https://rickandmortyapi.com/documentation/#get-a-single-character`. Hint, you need to use [arguments](https://graphql.org/graphql-js/passing-arguments/)

### Bonus

- Create the types and resolvers so the following query works:

```
query episode {
  episode(id: 1) {
    name
    characters {
      name
    }
  }
}
```

- Once implemented, do you see any vulnerability issues on that query?

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
