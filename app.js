'use strict';

const Hapi = require('hapi');
const routes = require('./config/routes');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();
const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      // change this for production
      origin: ['http://localhost:3000']
    }
  }
});

const validateUser = (decoded, request, callback) => {
  // This is a simple check that the `sub` claim
  // exists in the access token. Modify it to suit
  // the needs of your application
  if (decoded && decoded.sub) {
    if (decoded.scope)
      return callback(null, true, {
        scope: decoded.scope.split(' ')
      });

    return callback(null, true);
  }

  return callback(null, false);
};

server.register(jwt, err => {
  if (err) throw err;
  server.auth.strategy('jwt', 'jwt', 'required', {
    complete: true,
    // verify the access token against the
    // remote Auth0 JWKS
    key: jwksRsa.hapiJwt2Key({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    verifyOptions: {
      audience:  process.env.NODE_ENV === 'development' ? process.env.AUTH0_AUDIENCE_DEV : process.env.AUTH0_AUDIENCE_PROD,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    },
    validateFunc: validateUser
  });

  server.route(routes);
});

server.start(err => {
  if (err) throw err;
  console.info(`Server running at: ${server.info.uri}`);
});