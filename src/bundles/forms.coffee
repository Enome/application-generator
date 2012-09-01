bundle = {
  order: 1
  name: 'Forms'
  link: 'http://expressjs.com/api.html#req.body'
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
