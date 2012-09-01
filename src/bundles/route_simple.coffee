bundle = {
  name: 'Route (Simple)'

  description: """
               A route has a url and one or more middleware. You add
               a route to your app by using app.&lt;http_verb&gt;.
               <br /><br />
               <span class='label label-important'>Needs router</span>
               """

  code: """
        // Get route with one middleware
        app.get("/", function (req, res) {
          res.send("root");
        });
        """
}

module.exports = bundle
