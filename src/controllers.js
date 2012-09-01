var bundles = require('./bundles');

var controllers = {

  BundleCtrl: function ($scope) {

    bundles.sort(function (a, b) {
      return a.order > b.order;
    });

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

  }

};

module.exports = controllers;
