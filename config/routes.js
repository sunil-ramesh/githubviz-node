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
  },
  {
    method: 'GET',
    path: '/usersAndPullreq',
    config:{
      cors: corsHeader,
      auth: 'jwt',
      handler: gitApiHander.usersAndPullreq
    }
  },
  {
    method: 'GET',
    path: '/teamsNMembersNPrs',
    config:{
      cors: corsHeader,
      auth: 'jwt',
      handler: gitApiHander.teamsNMembersNPrs
    }
  },
  {
    method: 'GET',
    path: '/singleRepoNCommits/{repoName}',
    config:{
      cors: corsHeader,
      auth: false,
      handler: gitApiHander.singleRepoNCommits
    }
  }
];

module.exports = [].concat(defaultRoutes, gitHubRoutes);