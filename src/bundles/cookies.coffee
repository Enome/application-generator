bundle = {
  name: 'Cookies'
  link: 'http://www.senchalabs.org/connect/cookieParser.html'
  description: """
               Parse Cookie header and populate req.cookies
               with an object keyed by the cookie names.
               """

  code: """
        // Use the cookieParser middleware
        app.use(express.cookieParser());
        """
}

module.exports = bundle
