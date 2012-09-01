var controllers = require('./controllers');
var directives = require('./directives');

var app = angular.module('xgen', []);

// Directives

app.directive('popover', directives.popover);

// Controllers

app.controller('BundleCtrl', controllers.BundleCtrl);
