bundle = {
  name: 'Forms'
  link: 'http://www.senchalabs.org/connect/bodyParser.html'
  description: """
               Parse request bodies, supports application/json,
               application/x-www-form-urlencoded, and multipart/form-data.
               """

  code: """
        // Use the bodyParser middleware.
        app.use(express.bodyParser());
        """
}

module.exports = bundle
