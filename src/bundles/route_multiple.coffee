bundle = {
  name: 'Route (Multiple)'

  description: """
               A route has a url and one or more middleware. You add
               a route to your app by using app.&lt;http_verb&gt;.
               <br /><br />
               <span class='label label-important'>Needs router</span>
               """

  code: """
        // Get route with multiple middleware
        app.get("/", function (req, res, next) {
          // Do something with request or response
          next();
        }, function (req, res) {
          res.render('view');
        });
        """
}

module.exports = bundle
