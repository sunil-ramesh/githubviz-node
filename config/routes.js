const corsHeader = {
  origin: ['*'],
  headers: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'AuthKey', 'Authorization', 'Email'],
  credentials: true
};

const defaultRoutes = [{
  method: 'GET',
  path: '/',
  config: {
    cors: corsHeader,
    handler: (req, reply) => {
      return reply.response({message: "hello !!!!"})
    } 
  }
}];

module.exports = [].concat(defaultRoutes);