bundle = {
  name: 'Error Handler'
  link: 'http://expressjs.com/guide.html#error-handling'
  description: """
               Error-handling middleware are defined just 
               like regular middleware, however it's
               defined with with 4 parameters. The extra
               err parameter holds information about the
               error.
               """

  code: """
        // Middleware with 4 parameters instead of 3
        app.use(function(err, req, res, next){
          console.error(err.stack);
          res.send(500, 'Something broke!');
        });
        """
}

module.exports = bundle
