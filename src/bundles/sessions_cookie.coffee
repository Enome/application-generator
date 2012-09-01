bundle = {
  order: 3
  link: 'http://www.senchalabs.org/connect/cookieSession.html'
  name: 'Sessions (cookies)'

  description: """
               This enables req.session for storing data outside
               the request / response cycle. The cookie session 
               middleware will store data inside a cookie.
               <br /><br />
               <strong>This depends on the cookieParse (Cookies) middleware.</strong>
               """

  code: """
        app.use(express.cookieSession({
          secret: "MyLittleSecret" 
        }));
        """
}

module.exports = bundle
