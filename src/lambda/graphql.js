const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  buildSchema
} = require('graphql')

var async   = require('async');
var request = require('request');
var querystring = require('querystring');

var eventbrite_client_token = process.env.EVENTBRITE_CLIENT_TOKEN;
var eventbrite_client_key= process.env.EVENTBRITE_CLIENT_KEY;
var hasura_database_password = process.env.HASURA_DATABASE_PASSWORD;
var url = "https://data.continental75.hasura-app.io/v1/query";

function getUser(dbToken, userToken, callback) {
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
  }, function(error, response, body) {
    console.log(error, response, body);
    if (error) {
      callback(error);
    }
    else if (response.statusCode != 200) {
      callback(response);
    }
    else {
      body = typeof body === 'string' ? JSON.parse(body) : body;
      console.log(body);
      callback(null, body);
    }
  });
}

function addUser(dbToken, user, userToken, id, callback) {
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
          { user: user, token: userToken, id: id }
        ],
        returning: ['user', 'token', 'id']
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
      body = typeof body === 'string' ? JSON.parse(body) : body;
      callback(null, body);
    }
  });
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
      response.token = userToken || 'token undefined';
      callback(response);
    }
    else {
      body = typeof body === 'string' ? JSON.parse(body) : body;
      body.token = userToken;
      callback(null, body);
    }
  });
};

function getEventbriteInfo(token, path, query) {
  return new Promise(function (resolve, reject) {
    request({
      url: 'https://www.eventbriteapi.com/v3' + path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      qs: query
    }, function (error, response, body) {
      console.log(error, response, body);
      if (error) {
        reject(error);
      }
      else if (response.statusCode != 200) {
        reject(response);
      }
      else {
        body = typeof body === 'string' ? JSON.parse(body) : body;
        resolve(body);
      }
    });

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
      callback(null, typeof body === 'string' ? JSON.parse(body) : body);
    }
  });
}

const schema =  buildSchema(`
type Query {
  ownedEvents(currentUserId: String!, userToken: String!): [Event!]!
  joinedEvents(currentUserId: String!, userToken: String!): [Event!]!
  event(id: ID!, currentUserId: String!, userToken: String!): Event
}

type Mutation {
  startEvent(id: ID!, currentUserId: String!, userToken: String!): Event
  endEvent(id: ID!, currentUserId: String!, userToken: String!): Event
  requestToStream(id: ID!, currentUserId: String!, userToken: String!): Event
  selectStream(sessionId: ID!, userId: ID!, currentUserId: String!, userToken: String!): Event
}

type Event {
  id: ID!
  title: String!
  session: Session
}

type Session {
  id: ID!
  requests: [User!]
  accessToken: String
  stream: ID
}

type User {
  id: ID!
}
`);

// The root provides the top-level API endpoints
var root = {
  ownedEvents: function ({currentUserId, userToken}) {
    return getEventbriteInfo(userToken, '/users/' + currentUserId + '/ownedEvents', {});
  },
  joinedEvents: function ({currentUserId, userToken}) {
    return getEventbriteInfo(userToken, '/users/' + currentUserId + '/orders', {});
  },
  event: function ({currentUserId, userToken, id}) {
    return getEventbriteInfo(userToken, '/events/search', {
      'user.id': currentUserId
    });
  }
}


exports.handler = function(event, context, cb) {
  console.log(event);
  var access_token = event.queryStringParameters.code;
  var bearer = event.headers.Authorization && event.headers.Authorization.split(' ')[1];

  if (bearer) {
    context.success({ statusCode: '200', body: bearer})
    // getUser(hasura_database_password, bearer, function (err, resp) {
    //   console.log(err, resp);
    //   cb(err, {statusCode: 200, body: JSON.stringify(resp)});
    // });
    // async.waterfall([
    //   function (callback) {
    //     getUser(hasura_database_password, bearer, callback);
    //   }, function (response, callback) {
    //     return cb(null, {
    //       isBase64Encoded: false,
    //       statusCode: 200,
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: response
    //     });
    //   }, function (response, callback) {
    //     params = event.queryStringParameters.query;
    //     params.userToken = bearer;
    //     params.currentUserId = response[0].id;
    //     console.log(params);
    //     graphql(schema, params)
    //       .then(
    //         function (result) { cb(null, {statusCode: 200, body: JSON.stringify(result)})},
    //         function (err) { cb(JSON.stringify(err)) }
    //       );
    // }], function (error) {
    //   if (error) {
    //     // Something wrong has happened.
    //     return cb(JSON.stringify(error));
    //   }
    // });
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
        getEventbriteUser(response.access_token, callback);
      },
      function(response, callback) {
        addUser(hasura_database_password, response.name, response.token, response.id, callback);
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



