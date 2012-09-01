bundle = {
  name: 'Templates (jade)'
  link: 'http://jade-lang.com/'
  description: """
               Jade is a high performance template engine heavily 
               influenced by Haml and implemented with JavaScript 
               for node. 
               """

  code: """
        // Set the view engine
        app.set('view engine', 'jade');

        // Set the directory that contains the views
        app.set('views', __dirname + '/views');
        """
}

module.exports = bundle
