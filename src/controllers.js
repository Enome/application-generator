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

    for (var i = 0; i < $scope.bundles.length; i++) {
      var current = $scope.bundles[i];
      if (current.required) {
        $scope.select(current);
      }
    }

  }

};

module.exports = controllers;
