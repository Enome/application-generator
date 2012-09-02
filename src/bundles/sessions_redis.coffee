bundle = {
  name: 'Sessions (redis)'
  link: 'https://github.com/visionmedia/connect-redis'

  description: """
               This enables req.session for storing data outside
               the request / response cycle. The redis session 
               middleware will store data inside redis.
               <br /><br />
               <span class='label label-warning'>Needs redis</span>
               """

  code: """
        var RedisStore = require('connect-redis')(express);

        app.use(express.session({ 
          store: new RedisStore,
          secret: 'MyLittleSecret' 
        }));
        """
}

module.exports = bundle
