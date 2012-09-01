var bundle = {
  order: 10,
  name: 'Router',
  description: 'The router middleware is middleware that can execute one or more middleware for a certain url/route',
  code: '// Use the app.router middleware \n ' +
        'app.use(app.router); \n\n ' +
        '// Create a simple route\n ' +
        'app.get("/", function (req, res) { \n' +
        '  res.send("root"); \n' +
        '});'
};

module.exports = bundle;
