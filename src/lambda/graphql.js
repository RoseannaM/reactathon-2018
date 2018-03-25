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
var OpenTok = require('opentok');

var eventbrite_client_token = process.env.EVENTBRITE_CLIENT_TOKEN;
var eventbrite_client_key= process.env.EVENTBRITE_CLIENT_KEY;
var hasura_database_password = process.env.HASURA_DATABASE_PASSWORD;
var opentokApiKey = process.env.OPENTOK_API_KEY;
var opentokApiSecret = process.env.OPENTOK_API_SECRET;
var url = "https://data.continental75.hasura-app.io/v1/query";

var openTokClient = new OpenTok(opentokApiKey, opentokApiSecret);

function dbRequest(reqBody, callback) {
  request({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + hasura_database_password
    },
    body: JSON.stringify(reqBody)
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

function getUser(userToken, callback) {
  dbRequest({
      type: 'select',
      args: {
        table: 'oauth-tokens',
        columns: ['*'],
        where: { token: { '$eq': userToken }}
      }
    }, callback);
}

function addUser(user, userToken, id, callback) {
  if (typeof user === 'string') {
    dbRequest({
      type:'insert',
      args:{
        table:'oauth-tokens',
        objects:[
          { user: user, token: userToken, id: id }
        ],
        returning: ['user', 'token', 'id']
      }
    }, callback);
  } else {
    dbRequest({
      type:'update',
      args:{
        table:'oauth-tokens',
        "$set": {"token": userToken },
        where: {
          id: id
        },
        returning: ['user', 'token', 'id']
      }
    }, callback);
  }
}

function createSession(session, event, callback) {
  dbRequest({
    type:'insert',
    args:{
      table:'events',
      objects:[
        { event_id: event, session: session, title: 'Something' }
      ],
      returning: ['event_id', 'session']
    }
  }, callback);
}

function getSessionByEvent(event, callback) {
  dbRequest({
    type:'select',
    args:{
      table:'events',
      columns: ['*'],
      where: { event_id: { '$eq': event }}
    }
  }, callback);
}

function getEventBySession(session, callback) {
  dbRequest({
    type:'select',
    args:{
      table:'events',
      columns: ['*'],
      where: { session: { '$eq': session }}
    }
  }, callback);
}

function getRequestsForSession(session, callback) {
  dbRequest({
    type:'select',
    args:{
      table:'requests',
      columns: ['*'],
      where: { session: { '$eq': session }}
    }
  }, callback);
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

function getEventbriteInfo(token, path, query, callback) {
  request({
    url: 'https://www.eventbriteapi.com/v3' + path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    qs: query
  }, function (error, response, body) {
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

function getEventbriteInfoPromise(token, path, query) {
  return new Promise(function (resolve) {
    getEventbriteInfo(token, path, query, resolve);
  });
};

function introspect(api_key, api_secret, access_token, callback) {
  var body = querystring.stringify({
      code: access_token,
      client_secret: api_secret,
      client_id: api_key,
      grant_type: 'authorization_code',
      state: 'some-user'
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

function oauthDance(api_key, api_secret, access_token, user, final_callback) {
  username = user && user.user || user;
    async.waterfall([
      function(callback) {
        introspect(eventbrite_client_token, eventbrite_client_key, access_token, username, callback);
      },
      function(response, callback) {
        getEventbriteUser(response.access_token, callback);
      },
      function(response, callback) {
        addUser(user, response.token, response.id, callback);
      },
      function(response, callback) {
        return final_callback(null, {
          isBase64Encoded: false,
          statusCode: 302,
          headers: {
            'Location': '/',
            'Bearer': response.token
          },
          body: 'Hello World'
        })
      }], function (error) {
        final_callback(error);
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
  requests: [Request!]
  accessToken: String
  stream: ID
}

type Request {
  session: Session!
  user: User!
}

type User {
  id: ID!
}
`);

// The root provides the top-level API endpoints
var root = {
  ownedEvents: function ({currentUserId, userToken}) {
    return getEventbriteInfoPromise(userToken, '/users/' + currentUserId + '/ownedEvents', {});
  },
  joinedEvents: function ({currentUserId, userToken}) {
    return getEventbriteInfoPromise(userToken, '/users/' + currentUserId + '/orders', {});
  },
  event: function ({currentUserId, userToken, id}) {
    return getEventbriteInfoPromise(userToken, '/events/search', {
      'user.id': currentUserId
    });
  },
  startEvent: function ({id, currentUserId, userToken}) {
    return new Promise(function (resolve) {
      opentokClient.createSession(function(err, session) {
        if (err) resolve(err);
        else createSession(session.sessionId, id, resolve);
      });
    });
  },
  endEvent: function ({id, currentUserId, userToken}) {
    return true;
  },
  requestToStream: function({id, currentUserId, userToken}) {
    return new Promise(function (resolve) {
      async.waterfall([
        function (callback) {
          getEventbriteInfo(userToken, '/users/' + currentUserId + '/orders', {}, callback);
        }, function (response, callback) {
          for (var order in response) {
            if (order.event_id === id) {
              return getSessionByEvent(order.event_id, callback);
            }
          }
          callback({
            statusCode: 404, body: 'No event found for user ' + currentUserId
          });
        }, function (response, callback) {
          sessionId = response[0].session;
          token = opentokClient.generateToken(sessionId);
          callback({
            statusCode: 200, body: {
              id: response[0].event_id,
              accessToken: token
            }
          });
        }], function (err) {
          resolve(err);
        });
    });
  },
  selectStream: function ({sessionId, userId, currentUserId, userToken}) {
    return new Promise(function (resolve) {
      let eventId;
      async.waterfall([
        function (callback) {
          getEventBySession(sessionId, callback);
        }, function (response, callback) {
          eventId = response[0].event_id;
          getRequestsForSession(sessionId, callback);
        }, function (response, callback) {
          callback({
            statusCode: 200,
            body: {
              id: eventId,
              title: 'shrug',
              session: {
                id: sessionId,
                requests: response.map(req => ({
                  session: req.session,
                  user: {
                    id: req.id
                  }
                }))
              }
            }
          });
        }], function (err) {
          resolve(err)
        });
    });
  }
}


exports.handler = function(event, context, cb) {
  console.log(event);
  console.log(context);
  var access_token = event.queryStringParameters.code;
  var {identity, user} = context.clientContext;
  user = user || 'nhiggins';

  if (!user && !access_token || event.httpMethod === 'OPTIONS') {
    return cb(null, {
      statusCode: 401,
      body: 'Missing user'
    });
  } else {
    async.waterfall([
      function (callback) {
        getUser(user, callback);
      }, function (response, callback) {
        if (event.httpMethod !== 'OPTIONS' && !access_token && (!response || !response[0] || !response[0].token)) {
          return cb(null, {
            isBase64Encoded: false,
            statusCode: 302,
            headers: {
              'Location': 'https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=' + eventbrite_client_token
            },
            body: 'Hello World'
          });
        } else if (event.httpMethod !== 'OPTIONS' && access_token && (!response || !response[0] || !response[0].token)) {
          console.log(response);
          oauthDance(eventbrite_client_token, eventbrite_client_key, access_token, response && response[0] || user, callback);
        } else if (event.httpMethod === 'OPTIONS' || response && response[0] && response[0].token) {
          params = event.queryStringParameters.query;
          params.userToken = response[0].token;
          params.currentUserId = response[0].id;
          console.log(params);
          graphql(schema, params)
            .then(
              function (result) { cb(null, {statusCode: 200, body: JSON.stringify(result)})},
              function (err) { cb(JSON.stringify(err)) }
            );
        } else {
          cb('Missing auth creds');
        }
    }], function (error) {
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



