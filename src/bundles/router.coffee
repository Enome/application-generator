bundle = {
  name: 'Router'

  description: """
               The app.router is middleware that can execute 
               one or more middleware for a certain url.
               """

  code: """
        // Use the router middleware
        app.use(app.router);
        """
}

module.exports = bundle
