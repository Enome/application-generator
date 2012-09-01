var bundles = require('./bundles');

var controllers = {

  BundleCtrl: function ($scope) {

    $scope.bundles = bundles;

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
      console.log(bundle.link);
      return typeof bundle.link !== 'undefined';
    };

    for (var i = 0; i < $scope.bundles.length; i++) {
      var current = $scope.bundles[i];
      if (current.required) {
        $scope.select(current);
      }
    }

  }

};

module.exports = controllers;
