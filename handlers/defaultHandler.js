const axios = require('axios');
var csv = require("fast-csv");
var fs = require('fs');
var path = require('path');

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

defaultHandler.imdbSachMoviesByYear = (req, reply) => {
  var filtered;
  var csvData = {};
  var stream = fs.createReadStream(path.join(__dirname, '../', 'data/ratingsSach.csv'));
  csv
  .fromStream(stream, {headers : true})
  .on("data", (data) => {
    var year = data['Year'];
    csvData[year] = (csvData[year]+1) || 1;
  })
  .on("end", () => {
    csvData = Object.keys(csvData).map((key) => {
      return {x: key, y: csvData[key]}
    });
    return reply.response({imdbSachMoviesByYear: csvData})
  });
}

module.exports = defaultHandler;