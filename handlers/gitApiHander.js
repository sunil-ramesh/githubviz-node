const axios = require('axios');
var GitHub = require('github-api');
const _ = require('lodash');
const gitApiHander = {};

gitApiHander.reposAndCommits = (req, reply) => {
  const query = `
  query {
    organization(login: "Qwinix") {
    repositories(first:100) {
        nodes{
          ... on Repository{
            name
            defaultBranchRef{
              target{
                ... on Commit{
                  history(first:10){
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
  axios({
    url: 'https://api.github.com/graphql', 
    method: 'POST',
    data: JSON.stringify({query}),
    headers: {
      'Authorization': `Bearer ${process.env.GIT_ACCESS_TOKEN}`,
    },
  })
  .then(res => {
    filtered = [];
    data = res.data.data.organization.repositories.nodes;
    data.forEach(element => {
      filtered.push({
        x: element.name,
        y: element.defaultBranchRef.target.history.totalCount
      })
    })
    return reply.response({repoNCommits: filtered})
  })
  .catch(error => console.error(error));  
};

gitApiHander.usersAndPullreq = (req, reply) => {
  const query =
  `query {
    organization(login: "Qwinix") {
      members(first: 100) {
        nodes {
          login
          pullRequests {
            totalCount
          }
        }
      }
    }
  }
  `;
  axios({
    url: 'https://api.github.com/graphql', 
    method: 'POST',
    data: JSON.stringify({query}),
    headers: {
      'Authorization': `Bearer ${process.env.GIT_ACCESS_TOKEN}`,
    },
  })
  .then(res => {
    filtered = [];
    data = res.data.data.organization.members.nodes;
    data.forEach(member => {
      label = member.login;
      theta = member.pullRequests.totalCount;
      filtered.push({label, theta})
    })
    return reply.response({usersAndPullreq: filtered})
  })
  .catch(error => {
    return reply.response({error}).code(503)
  });  
}

module.exports = gitApiHander;