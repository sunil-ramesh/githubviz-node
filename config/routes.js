const defaultHandler = require('../handlers/defaultHandler');

const corsHeader = {
  origin: ['*'],
  headers: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'AuthKey', 'Authorization', 'Email'],
  credentials: true
};

const defaultRoutes = [
  {
    method: 'GET',
    path: '/',
    config: {
      cors: corsHeader,
      handler: (req, reply) => {
        return reply.response({message: "hello !!!!"})
      } 
    }
  },
  {
    method: 'POST',
    path: '/auth/github',
    config: {
      cors: corsHeader,
      handler: defaultHandler.gitLogin
    }
  }
];

module.exports = [].concat(defaultRoutes);