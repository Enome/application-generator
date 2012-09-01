var controllers = require('./controllers');
var directives = require('./directives');
var filters = require('./filters');

var app = angular.module('xgen', []);

// Directives

app.directive('popover', directives.popover);

// Filters

app.filter('selected', filters.selected);

// Controllers

app.controller('BundleCtrl', controllers.BundleCtrl);
