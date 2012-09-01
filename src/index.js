var controllers = require('./controllers');
var directives = require('./directives');

var app = angular.module('xgen', []);

// Directives

app.directive('popover', directives.popover);

// Services

app.factory('events', require('./events'));

// Controllers

app.controller('BundleCtrl', controllers.BundleCtrl);
app.controller('CodeCtrl', controllers.CodeCtrl);
