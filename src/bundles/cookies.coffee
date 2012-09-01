bundle = {
  name: 'Cookies'
  link: 'http://www.senchalabs.org/connect/cookieParser.html'
  description: """
                Parse Cookie header and populate req.cookies
                with an object keyed by the cookie names. Optionally
                you may enabled signed cookie support by passing
                a secret string, which assigns req.secret so
                it may be used by other middleware.
               """

  code: """
        // Use the cookieParser middleware
        app.use(express.cookieParser());
        """
}

module.exports = bundle
