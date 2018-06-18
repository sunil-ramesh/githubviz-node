const axios = require('axios');
const defaultHandler = {}

defaultHandler.gitLogin = (req, reply) => {
  return axios({
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    data: {
      "client_id": process.env.GITHUBVIZREACT_SECRET, 
      "client_secret": process.env.GITHUBVIZREACT_CLIENTID, 
      "code": req.payload.code
    },
    headers: {'Accept': 'application/json', 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'}
  })
  .then(res => {
    return reply.response({gitResponse: res.data}).code(201);
  })
  .catch(error => {
    return reply.response({message: "something went wrong"}).code(503);
  });
}

module.exports = defaultHandler;