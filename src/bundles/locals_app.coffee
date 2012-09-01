bundle = {
  name: 'Locals (app)'
  description: """
               You can use app.locals to create a function or 
               variable that is available in your middleware,
               routes and views.
               <br /><br /> 
               The functions can't use callbacks and don't 
               have access to the request or the response objects. 
               They are also called helpers.
               """

  code: """
        // Variable
        app.locals.variable = 'foobar';

        // Function
        app.locals.function = function () {
          return 'foobar'
        };
        """
}

module.exports = bundle
