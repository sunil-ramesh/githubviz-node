const axios = require('axios');
var GitHub = require('github-api');
const _ = require('lodash');
const gitApiHander = {};

gitApiHander.reposAndCommits = (req, reply) => {
  const repoCount = req.query.repoCount || 100;
  const query = `
  query {
    organization(login: "Qwinix") {
    repositories(first:${repoCount}) {
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
  const usersCount = req.query.usersCount || 100;
  const query =
  `query {
    organization(login: "Qwinix") {
      members(first: ${usersCount}) {
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

gitApiHander.teamsNMembersNPrs = (req, reply) => {
  const query =
  `query {
    organization(login: "Qwinix") {
      teams(first: 5){
        nodes{
          slug
          members(last: 10){
            nodes{
              login
              pullRequests(){
                totalCount
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
    data = res.data.data.organization.teams.nodes;
    // should implement async await
    data.forEach(team => {
      graphValues = [];
      name = team.slug;
      team.members.nodes.forEach(member => {
        graphValues.push({x: member.login, y: member.pullRequests.totalCount})
      })
      filtered.push({name, graphValues});
    })
    return reply.response({teamsNMembersNPrs: filtered})
  })
  .catch(error => {
    return reply.response({error}).code(503)
  });  
}

gitApiHander.singleUserNCommits = (req, reply) => {
  const user_name = req.params.userName;
  const query = `
  query {
    user(login: "${user_name}"){
      pullRequests(last: 20){
        nodes{
          repository{
            name
          }
          number
          commits{
            totalCount
          }
        }
      }
    }
  }`;
  axios({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    data: JSON.stringify({ query }),
    headers: {
      'Authorization': `Bearer ${process.env.GIT_ACCESS_TOKEN}`,
    },
  })
  .then(res => {
    filtered = [];
    data = res.data.data.user.pullRequests.nodes;
    data.forEach(pullRequests => {
      label = pullRequests.number;
      repo = pullRequests.repository.name;
      theta = pullRequests.commits.totalCount;
      filtered.push({ label, theta, repo })
    })
    return reply.response({ singleUserNCommits: filtered })
  })
  .catch(error => {
    return reply.response({ error }).code(503)
  });
}

gitApiHander.singleRepoNCommits = (req, reply) => {
  const repo_name = req.params.repoName;
  const query = `
    query {
      repository(owner: "Qwinix", name: "${repo_name}") {
        refs(first: 100, refPrefix: "refs/heads/") {
          nodes {
            name
            target {
              ...on Commit {
                history {
                  totalCount
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
    data = res.data.data.repository.refs.nodes;
    data.forEach(element => {
      filtered.push({
        x: element.name,
        y: element.target.history.totalCount
      })
    })
    return reply.response({singleRepoNCommits: filtered})
  })
  .catch(error => {
    return reply.response({error}).code(503)
  }); 
}

gitApiHander.teamAdditionsDeletions = (req, reply) => {
  const team_name = req.params.teamName;
  const query =
  `query {
    organization(login: "Qwinix") {
      team(slug: "${team_name}") {
        members(last: 10) {
          nodes {
            login
            pullRequests(last: 10) {
              nodes {
                additions
                deletions
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
    additionsArray = [];
    deletionsArray = [];
    data = res.data.data.organization.team.members.nodes;
    data.forEach(member => {
      name = member.login;
      var additions = _.sumBy(member.pullRequests.nodes, (pr)=>{return pr.additions });
      var deletions = _.sumBy(member.pullRequests.nodes, (pr)=>{return pr.deletions });
      additionsArray.push({x: name, y: additions, type: 'Additions'});
      deletionsArray.push({x: name, y: deletions, type: 'Deletions'});
    })
    filtered = { additions: additionsArray, deletions: deletionsArray }
    return reply.response({teamAdditionsDeletions: filtered})
  })
  .catch(error => {
    return reply.response({error}).code(503)
  });  
}
gitApiHander.committedDateNMessage = (req, reply) => {
  const repo_name = req.params.repoName;
  const branch_name = req.params.branchName;
  const query = `
  query { 
    repository(name: "${repo_name}", owner: "Qwinix") {
      ref(qualifiedName: "${branch_name}") {
        target {
          ... on Commit {
            history(first: 10) {
              edges {
                node {
                  committedDate
                  message
                  oid
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
    data = res.data.data.repository.ref.target.history.edges;
    // console.log(res.data.data.repository.ref.target.history.edges)
    data.forEach(element => {
      filtered.push({
        committedDate: element.node.committedDate,
        message: element.node.message,
        id: element.node.oid
      })
    })
    return reply.response({committedDateNMessage: filtered})
  })
  .catch(error => {
    return reply.response({error}).code(503)
  }); 
}
gitApiHander.singlePullreqNcommits = (req, reply) => {
  const repo_name = req.params.repoName;
  const pulreq_number=req.params.pullreqnumber;
  const query = `
  query {
    repository(owner: "Qwinix", name: "${repo_name}") {
      pullRequest(number: ${pulreq_number}) {
        commits(first: 10) {
          edges {
            node {
              commit {
                oid
                message
                author{
                  name
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  axios({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    data: JSON.stringify({ query }),
    headers: {
      'Authorization': `Bearer ${process.env.GIT_ACCESS_TOKEN}`,
    },
  })
  .then(res => {
    filtered = [];
    data = res.data.data.repository.pullRequest.commits.edges;
    data.forEach(element => {
      oid = element.node.commit.oid;
      message = element.node.commit.message;
      author = element.node.commit.author.name;
      filtered.push({ oid, message, author })
    })
    return reply.response({ singlePullreqNcommits: filtered})
  })
  .catch(error => {
    return reply.response({ error }).code(503)
  });
}
module.exports = gitApiHander;