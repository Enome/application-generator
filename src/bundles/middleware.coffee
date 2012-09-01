bundle = {
  name: 'Middleware'
  description: """
               Middleware is a function that takes 3 parameters:
               request, response and next. These 
               functions are inside a stack. When a request
               is made it starts with the first function in 
               the stack. When you call next the following 
               function is executed.
               <br /><br />
               If you call next with a parameter the request
               and response is passed to error middleware 
               (see Error Handler).
               """

  code: """
        // Middleware
        app.use(function(req, res, next){
          // do something with the request or response
          next();
        });

        // Middleware with error
        app.use(function(req, res, next){
          // do something with the request or response
          next('something went wrong');
        });
        """
}

module.exports = bundle
