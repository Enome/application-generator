bundle = {
  order: 99
  required: true
  name: 'HTTP Server'
  description: 'Your app is a handler for a Node.js HTTP server.'
  code: """
        // Create HTTP server with your app
        var http = require("http");
        var server = http.createServer(app)

        // Listen to port 3000 
        server.listen(3000);
        """
}

module.exports = bundle
