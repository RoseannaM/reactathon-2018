const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

var async   = require('async');
var request = require('request');
var querystring = require('querystring');

var eventbrite_client_token = process.env.EVENTBRITE_CLIENT_TOKEN;
var eventbrite_client_key= process.env.EVENTBRITE_CLIENT_KEY;
var hasura_database_password = process.env.HASURA_DATABASE_PASSWORD;
var url = "https://data.continental75.hasura-app.io/v1/query";

function getUser(dbToken, userToken, cb) {
  request({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + dbToken
    },
    body: JSON.strinfigy({
      type: 'select',
      args: {
        table: 'oauth-tokens',
        columns: ['*'],
        where: { token: { '$eq': userToken }}
      }
    })
  }, cb);
}

function getEventbriteUser(userToken, callback) {
  request({
    url: 'https://www.eventbriteapi.com/v3/users/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    qs: {
      token:userToken
    }
  }, function (error, response, body) {
    console.log(error, response, body);
    if (error) {
      callback(error);
    }
    else if (response.statusCode != 200) {
      callback(response);
    }
    else {
      body.token = userToken;
      callback(null, body);
    }
  });
};

function addUser(dbToken, user, userToken, callback) {
  console.log('user info', user, userToken);
  request({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + dbToken
    },
    body: JSON.stringify({
      type:'insert',
      args:{
        table:'oauth-tokens',
        objects:[
          { user: user, token: userToken }
        ],
        returning: ['user', 'token']
      }
    })
  }, function(error, response, body) {
    console.log(error, response, body);
    if (error) {
      callback(error);
    }
    else if (response.statusCode != 200) {
      callback(response);
    }
    else {
      callback(null, body);
    }
  });
}

function introspect(api_key, api_secret, access_token, callback)
{

  var body = querystring.stringify({
      code: access_token,
      client_secret: api_secret,
      client_id: api_key,
      grant_type: 'authorization_code'
    });

  console.log(body);

  request({
    url: 'https://www.eventbrite.com/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    },

    body: body,
  }, function(error, response, body) {
    if (error) {
      callback(error);
    }
    else if (response.statusCode != 200) {
      callback(response);
    }
    else {
      callback(null, body);
    }
  });
}
 
function main(event, context, info)
{
  console.log(info);


  // Returns a JSON.
  context.succeed({
    "Hello": "World",
 
    // The ID of the client application that is associated with the access token.
    "clientId": info.clientId,
 
    // The subject (= unique identifier) of the end-user that is associated with
    // the access token. This is not available if the access token has been created
    // by using 'Client Credentials Flow' (RFC 6749, 4.4. Client Credentials Grant).
    "subject": info.subject,
 
    // The scopes (= permissions) that are associated with the access token.
    // This may be null.
    "scopes": info.scopes
  });
}
 
// This method just inserts the user's first name into the greeting message.
const getGreeting = function (firstName) { return `Hello, ${firstName}.` }

// Here we declare the schema and resolvers for the query
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType', // an arbitrary name
    fields: {
      // the query has a field called 'greeting'
      greeting: {
        // we need to know the user's name to greet them
        args: { firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) } },
        // the greeting message is a string
        type: GraphQLString,
        // resolve to a greeting message
        resolve: function (parent, args) { return getGreeting(args.firstName) }
      }
    }
  }),
})

exports.handler = function(event, context, cb) {
  console.log(event);
  var access_token = event.queryStringParameters.code;
  var bearer = event.headers.Authorization && event.headers.Authorization.split(' ')[1];

  if (bearer) {
    async.waterfall([
      function (callback) {
        getUser(hasura_database_password, bearer, callback);
      }, function (response, callback) {
        console.log(response);
        callback();
      }, function (response, callback) {
        graphql(schema, event.queryStringParameters.query)
          .then(
            function (result) { cb(null, {statusCode: 200, body: JSON.stringify(result)})},
            function (err) { cb(err) }
          );
    }], function (error) {
      if (error) {
        // Something wrong has happened.
        return cb(JSON.stringify(error));
      }
    });
  } else if (!access_token) {
    return cb(null, {
      isBase64Encoded: false,
      statusCode: 302,
      headers: {
        'Location': 'https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=' + eventbrite_client_token
      },
      body: 'Hello World'
    });
  } else {
    async.waterfall([
      function(callback) {
        introspect(eventbrite_client_token, eventbrite_client_key, access_token, callback);
      },
      function(response, callback) {
        console.log(response);
        getEventbriteUser(response.access_token, callback);
      },
      function(response, callback) {
        console.log('introspection successful');
        console.log(response);
        addUser(hasura_database_password, response.name, response.token, callback);
      },
      function(response, callback) {
        console.log(response);
        return cb(null, {
          isBase64Encoded: false,
          statusCode: 302,
          headers: {
            'Location': '/',
            'Bearer': response.token
          },
          body: 'Hello World'
        })
      }
    ], function (error) {
      if (error) {
        // Something wrong has happened.
        return cb(null, {
          isBase64Encoded: false,
          statusCode: 500,
          body: JSON.stringify(error)
        });
      }
    });
  }
};



