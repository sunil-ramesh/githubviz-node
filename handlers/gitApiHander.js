const axios = require('axios');
var GitHub = require('github-api');
const gitApiHander = {};

gitApiHander.reposAndCommits = (req, reply) => {
  var gitAuth = new GitHub({token: ""})
  var qwinix = gitAuth.getOrganization('Qwinix');
  // return qwinix.getRepos()
  return qwinix.listMembers()._requestAllPages()
  .then(res => {
    return reply.response({res: res.data})
  })
  .catch(e => {
    return reply.response({e})
  })
};

module.exports = gitApiHander;