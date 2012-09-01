bundle = {
  name: 'Locals (middleware)'
  description: """
               You can use res.locals to create a function or 
               variable that is available in your routes and views.
               <br /><br /> 
               The functions can't use callbacks but they do
               have access to the request and the response objects. 
               In 2.x these were called dynamic helpers.
               <br /><br />
               <span class='label label-important'>Needs middleware</span>
               """

  code: """
        app.use(function (req, res, next) {
          // Variable
          res.locals.variable = 'foobar';

          // Function
          res.locals.function = function (param) {
            return param + req.url;
          };

          next();
        });
        """
}

module.exports = bundle
