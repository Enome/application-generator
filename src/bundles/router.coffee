bundle = {
  name: 'Router'

  description: """
               The app.router is middleware that can execute 
               one or more middleware for a certain url.
               """

  code: """
        app.use(app.router);

        // Create a simple route
        app.get("/", function (req, res) {
          res.send("root");
        });
        """
}

module.exports = bundle
