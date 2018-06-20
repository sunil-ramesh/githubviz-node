const defaultHandler = require('../handlers/defaultHandler');
const gitApiHander = require('../handlers/gitApiHander');

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
      auth: false,
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

const gitHubRoutes = [
  {
    method: 'GET',
    path: '/reposAndCommits',
    config: {
      cors: corsHeader,
      auth: 'jwt',
      handler: gitApiHander.reposAndCommits
    }
  }
];

module.exports = [].concat(defaultRoutes, gitHubRoutes);