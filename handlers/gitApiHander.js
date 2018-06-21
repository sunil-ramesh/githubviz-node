const axios = require('axios');
var GitHub = require('github-api');
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

gitApiHander.teamsAndPullreq = (req, reply) => {
  const query =
  `query {
    organization(login: "Qwinix") {
      teams(first: 100, after: null) {
        edges {
          cursor
          node {
            name
            members(first:100){
              totalCount
              nodes{
                name
                pullRequests{
                  totalCount
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
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
    data = res.data.data.organization.teams.edges;
    data.forEach(team => {
      label = team.node.name;
      console.log(team.node.members.nodes)
      if (team.node.members.nodes){
        theta = team.node.members.nodes.reduce((v1, v2) => {
          if (v1 && v2 && v1.pullRequests && v2.pullRequests) {
            return (v1.pullRequests.totalCount + v2.pullRequests.totalCount)
          } else {
            return 0
          }
        },0);
        // theta = team.node.members.nodes.reduce((v1, v2) => console.log(v1));
        filtered.push({label, theta});
      }
    })
    return reply.response({teamsAndPullreq: filtered})
    // return reply.response({teamsAndPullreq: data})
  })
  .catch(error => console.error(error));  
}

module.exports = gitApiHander;