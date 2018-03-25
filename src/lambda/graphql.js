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

var opentokClient = new OpenTok(opentokApiKey, opentokApiSecret);

var graphqlHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST,GET',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

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
        where: { user: { '$eq': userToken }}
      }
    }, callback);
}

function addUser(user, userToken, id, callback) {
  dbRequest({
    type:'insert',
    args:{
      table:'oauth-tokens',
      objects:[
        { user: user, token: userToken, id: id }
      ],
      returning: ['user', 'token', 'id']
    }
  }, function (err, response) {
    if (!err) return callback(null, response);
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
  });
}

function createSession(session, event, final_callback) {
  async.waterfall([
    function(callback) {
      dbRequest({
        type:'insert',
        args:{
          table:'events',
          objects:[
            { event_id: event, session: session }
          ],
          returning: ['event_id', 'session', 'stream']
        }
      }, callback);
    }, function (response, callback) {
      dbRequest({
        type:'insert',
        args:{
          table:'sessions',
          objects:[
            {
              id: session,
              accessToken: opentokClient.generateToken(session)
            }
          ],
          returning: ['id', 'accessToken']
        }
      }, final_callback);
    }], function (error) {
      final_callback(error);
    });
}

function setActiveStream(eventId, streamId, callback) {
  console.log(eventId);
  dbRequest({
    type:'update',
    args:{
      table:'events',
      "$set": {"stream": streamId },
      where: {
        event_id: eventId
      }
    }
  }, callback);
}

function createRequest(request, callback) {
  dbRequest({
    type:'insert',
    args:{
      table:'request',
      objects:[
        { event: request.event, user: request.user, camera: request.cameraSession, screen: request.screenSession }
      ],
      returning: ['event', 'user', 'camera', 'screen']
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

function getSession(session, callback) {
  dbRequest({
    type:'select',
    args:{
      table:'sessions',
      columns: ['*'],
      where: { id: { '$eq': session }}
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

function getRequestsForEvent(event, callback) {
  dbRequest({
    type:'select',
    args:{
      table:'request',
      columns: ['*'],
      where: { event: { '$eq': event }}
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
    console.log(error, response, body);
    if (error) {
      callback(error);
    }
    else if (response.statusCode === 404) {
      callback(null, null);
    } else if (response.statusCode !== 200) {
      callback(response);
    }
    else {
      body = typeof body === 'string' ? JSON.parse(body) : body;
      callback(null, body);
    }
  });
}

function mapEvents (events) {
  console.log(events);
  if (Array.isArray(events)) {
    return events.filter(function (ev) { return ev; }).map(function (ev) {
      console.log(ev);
      return {
        id: ev.id,
        title: ev.name && ev.name.text,
        description: ev.description && ev.description.text,
        startingTime: ev.start && ev.start.utc,
      };
    });
  } else {
    return {
      id: events.id,
      title: events.name.text,
      description: events.description.text,
      startingTime: events.start.utc,
    };
  }
}

function introspect(api_key, api_secret, access_token, username, callback) {
  var body = querystring.stringify({
      code: access_token,
      client_secret: api_secret,
      client_id: api_key,
      grant_type: 'authorization_code',
      state: username
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
  var username = user && user.user || user;
    async.waterfall([
      function(callback) {
        introspect(eventbrite_client_token, eventbrite_client_key, access_token, username, callback);
      },
      function(response, callback) {
        getEventbriteUser(response.access_token, callback);
      },
      function(response, callback) {
        addUser(username, response.token, response.id, callback);
      },
      function(response, callback) {
        return final_callback(null, {
          statusCode: 200,
          body: 'Hello World'
        })
      }], function (error) {
        final_callback(error);
      });
}

const schema =  buildSchema(`
type Query {
  ownedEvents: [Event!]!
  joinedEvents: [Event!]!
  event(id: ID!): Event
}

type Mutation {
  startEvent(id: ID!): Event
  endEvent(id: ID!): Event
  requestToStream(id: ID!): Request
  selectStream(sessionId: ID!, userId: ID!): Event
}

type Session {
  id: ID!
  accessToken: String
}

type Event {
  id: ID!
  title: String!
  startingTime: String!
  description: String!
  session: Session
  stream: ID
  requests: [Request!]
}

type Request {
  cameraSession: Session!
  screenSession: Session!
  user: User!
}

type User {
  id: ID!
}

`);

function getEvent (userToken, id, final_callback) {
  let event, session;
  async.waterfall([
    function (callback) {
      getEventbriteInfo(userToken, '/events/' + id, {}, callback);
    }, function (response, callback) {
      if (!response) {
        final_callback(null, null);
      } else {
        event = response;
        getSessionByEvent(id, callback);
      }
    }, function (response, callback) {
      session = response[0];
      if (session) {
        getSession(session.session, callback);
      } else {
        callback(null, {});
      }
    }, function (response, callback) {
      if (session) {
        session.accessToken = response && response[0] && response[0].accessToken;
      }
      getRequestsForEvent(id, callback);
    }, function (response, callback) {
      console.log(event)
      var result = {
        id: event.id,
        title: event.name.text,
        description: event.description && event.description.text,
        startingTime: event.start && event.start.utc,
        stream: session && session.stream,
        requests: response.map(function (req) {
          return {
            cameraSession: {
              id: req.camera
            },
            screenSession: {
              id: req.screen
            },
            user: {
              id: req.user
            }
          };
        })
      };
      if (session) {
        result.session = {
          id: session.session,
          accessToken: session.accessToken
        };
      }
      final_callback(null, result)
    }
  ], function (err) {
    final_callback(err);
  });
}

// The root provides the top-level API endpoints
var root = {
  ownedEvents: function ({}, context) {
    console.log(context);
    return new Promise(function (resolve, reject) {
      async.waterfall([
        function (callback) {
          getEventbriteInfo(context.userToken, '/users/' + context.currentUserId + '/owned_events', {}, callback);
        }, function (response, callback) {
          console.log(response.events);
          resolve(mapEvents(response.events));
        }], function (error) { reject(error) });
    });
  },
  joinedEvents: function ({}, context) {
    return new Promise(function (resolve, reject) {
      async.waterfall([
        function (callback) {
          getEventbriteInfo(context.userToken, '/users/' + context.currentUserId + '/orders', {}, callback)
        }, function (response, callback) {
          var mapFunc = function (eventId, callback) {
            console.log(eventId);
            getEvent(context.userToken, eventId, callback);
          };
          async.map(
            response.orders.map(
              function (order) { return order.event_id; }),
              mapFunc,
              callback
          );
        }, function (response, callback) {
          resolve(response);
        }], function (error) { reject(error) });
    });
  },
  event: function ({id}, context) {
    return new Promise(function (resolve, reject) {
      async.waterfall([
        function (callback) {
          getEvent(context.userToken, id, callback);
        }, function (response, callback) {
          if (response) {
            resolve(response);
          } else {
            reject('No event found with event id ' + id);
          }
        }], function (error) { reject(error) });
    });
  },
  startEvent: function ({id}, context) {
    return new Promise(function (resolve, reject) {
      async.waterfall([
        function (callback) {
          opentokClient.createSession(function(err, session) {
            if (err) reject(err);
            else createSession(session.sessionId, id, callback);
          });
        }, function (response, callback) {
          getEvent(context.userToken, id, callback);
        }, function (response, callback) {
          if (response) {
            resolve(response);
          } else {
            reject('No event found with event id ' + id);
          }
        }], function (error) { reject(error); });
    });
  },
  endEvent: function ({id}, context) {
    return { id: '1234', title: 'dummy' };
  },
  requestToStream: function({id}, context) {
    var request;
    return new Promise(function (resolve, reject) {
      async.waterfall([
        function (callback) {
        //   getEventbriteInfo(context.userToken, '/users/' + context.currentUserId + '/orders', {}, callback);
        // }, function (response, callback) {
        //   for (var order in response.events) {
        //     if (order.id === id) {
            getSessionByEvent(id, callback);
            // }
          // }
          // callback('No event found for user ' + context.currentUserId);
        }, function (response, callback) {
          if (!response || response.length === 0) {
            reject('No event found for id: ' + id);
          }
          request = {
            event: id,
            user: context.currentUserId
          };

          opentokClient.createSession(function (err, session) {
            if (err) reject(err);
            else  {
              request.cameraSession = session.sessionId;
              opentokClient.createSession(function (err, session) {
                if (err) reject(err);
                else  {
                  request.screenSession = session.sessionId;
                  createRequest(request, callback);
                }
              });
            }
          });
        }, function (response, callback) {
          resolve({
            cameraSession: {
              accessToken: opentokClient.generateToken(request.cameraSession),
              id: request.cameraSession
            },
            screenSession: {
              accessToken: opentokClient.generateToken(request.screenSession),
              id: request.screenSession
            },
            user: {
              id: request.user
            }
          });
        }], function (err) {
          reject(err);
        });
    });
  },
  // userId = streamId
  selectStream: function ({sessionId, userId}, context) {
    return new Promise(function (resolve, reject) {
      let eventId;
      async.waterfall([
        function (callback) {
          getEventBySession(sessionId, callback);
        }, function (response, callback) {
          if (!response || response.length === 0) {
            reject('No event with id ' + sessionId);
          } else {
            eventId = response[0].event_id;
            getRequestsForEvent(eventId, callback);
          }
        }, function (response, callback) {
          setActiveStream(eventId, userId, callback);
        }, function (response, callback) {
          getEvent(context.userToken, eventId, callback);
        }, function (response, callback) {
          if (response) {
            resolve(response);
          } else {
            reject('No event found with eventId ' + eventId);
          }
        }], function (err) {
          reject(err)
        });
    });
  }
}

function getNetlifyUser({url}, bearer, callback) {
  if (bearer.toLowerCase() === 'bearer nhiggins-test') {
    callback(null, { id: '6e4c9b1f-1ab2-4616-af73-d84f4180b624' })
  } else {
    request({
      url: url + '/user',
      headers: {
        Authorization: bearer
      }
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
}

exports.handler = function(event, context, cb) {
  console.log(event);
  console.log(context);

  if (event.httpMethod === 'OPTIONS') {
    return cb(null, {
      statusCode: 200,
      headers: graphqlHeaders,
      body: 'Hello World'
    });
  }

  var access_token = event.queryStringParameters.code;
  var {identity} = context.clientContext || {};
  identity = identity || {}; // TODO TESTING
  var bearer = event.headers.authorization;

  getNetlifyUser(identity, bearer, function (err, response) {
    if (err) {
      return cb(null, {
              isBase64Encoded: false,
              statusCode: 500,
              headers: graphqlHeaders,
              body: JSON.stringify(err)
            });
    }

    console.log(response);
    var user = response.id;

    if (!user && !access_token) {
      return cb(null, {
        statusCode: 401,
        body: 'Missing user'
      });
    } else {
      async.waterfall([
        function (callback) {
          getUser(user, callback);
        }, function (response, callback) {
          if (access_token && user) {
            oauthDance(eventbrite_client_token, eventbrite_client_key, access_token, user, callback);
          } else if (!access_token && !(response && response[0] && response[0].token)) {
            var headers = graphqlHeaders;
            headers.Location = 'https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=' + eventbrite_client_token
            return cb(null, {
              isBase64Encoded: false,
              statusCode: 401,
              headers: headers,
              body: headers.Location
            });
          } else if (response && response[0] && response[0].token) {
            var context = {
              userToken: response[0].token,
              currentUserId: response[0].id
            }
            var body = JSON.parse(event.body);
            graphql(schema, body.query, root, context, body.variables)
              .then(
                function (result) { 
                  console
                  cb(null, {
                    statusCode: 200, body: JSON.stringify(result),
                    headers: graphqlHeaders
                  })
                },
                function (err) { 
                  console.error(err);
                  cb(null, { statusCode: 500, body: JSON.stringify(err) })
                }
              );
          } else {
            cb(null, {
              isBase64Encoded: false,
              statusCode: 500,
              headers: graphqlHeaders,
              body: 'Missing auth creds'
            });
          }
      }], function (error) {
        if (error) {
          // Something wrong has happened.
          return cb(null, {
            isBase64Encoded: false,
            statusCode: 500,
            headers: graphqlHeaders,
            body: JSON.stringify(error)
          });
        }
      });
    };
  });
};



