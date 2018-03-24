const express = require('express');
const body_parser = require('body-parser');
const expressGraphQL = require('express-graphql');
  // myGraphQLSchema = require('./schema');
const graphqlTools = require('graphql-tools');
const awsServerlessExpress = require('aws-serverless-express');

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: () => books },
};

// Put together a schema
const schema = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
});

 
const app = express();
 
app.use( body_parser.json({ limit: '50mb' }) );
 
app.use(
	'/',
	expressGraphQL( () => {
		return {
			graphiql: true,
			schema: schema,
		}
	})
);

app.listen(1234, function () {
  console.log('lambda setup with "port 1234"')
});

const server = awsServerlessExpress.createServer(app);
 
exports.handler = function (event, context) {
  awsServerlessExpress.proxy(server, event, context);
};
