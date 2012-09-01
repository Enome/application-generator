bundle = {
  name: '404 Handler'
  description: """
               Middleware is a list of functions that get 
               executed in order. If no middleware is ending
               the response it will look like the request is
               hanging.
               <br /><br />
               To prevent this you you need to make the last middleware
               in the stack end the response with a 404 message.
               """

  code: """
        // Middleware with 4 parameters instead of 3
        app.use(function(req, res, next){
          res.send(404, 'page not found');
        });
        """
}

module.exports = bundle
