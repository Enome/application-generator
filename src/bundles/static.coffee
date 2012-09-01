bundle = {
  name: 'Css / Images / Js'
  link: 'http://www.senchalabs.org/connect/static.html'
  description: """
               Middleware that lets you serve static files
               from a directory. Use this for css, images
               or client-side Javascript.
               """

  code: """
        // Use static middleware
        app.use(express.static(__dirname + '/public'));
        """
}

module.exports = bundle
