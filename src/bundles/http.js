var bundle = {
  order: 99,
  name: 'HTTP Server',
  description: 'An Express.js app is a handler for a Node.js http server.',
  code: '// Create a http server and listen to port 3000\n' +
        'var http = require("http"); \n' +
        'http.createServer(app).listen(3000) \n' +
        '\n'
};

module.exports = bundle;
