var bundles = require('./bundles');
var functions = require('./functions');

var controllers = {

  BundleCtrl: function ($scope) {

    $scope.bundles = bundles;
    $scope.code = '';

    $scope.select = function (bundle) {
      bundle.selected = !bundle.selected;
    };

    $scope.getClass = function (bundle) {
      if (bundle.required) {
        return 'required';
      }

      if (bundle.selected) {
        return 'selected';
      }

      return '';
    };

    $scope.hasLink = function (bundle) {
      return typeof bundle.link !== 'undefined';
    };

    $scope.$watch('bundles', function () {

      $scope.code = '';

      for (var i = 0; i < $scope.bundles.length; i++) {

        var current = $scope.bundles[i];

        if (current.selected) {
          $scope.code += current.code;
          $scope.code += '\n\n';
        }

      }

      $scope.code = functions.Base64.encode($scope.code);

    }, true);


    for (var i = 0; i < $scope.bundles.length; i++) {
      var current = $scope.bundles[i];
      if (current.required) {
        $scope.select(current);
      }
    }

  }

};

module.exports = controllers;
