'use strict';

const Hapi = require('hapi');
const routes = require('./config/routes');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8000
});

const start = async () => {
  try {
    await server.route(routes);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Server running at:', server.info.uri);
};

start();