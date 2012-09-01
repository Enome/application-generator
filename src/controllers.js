var bundles = require('./bundles');

var controllers = {

  BundleCtrl: function ($scope, events) {

    $scope.bundles = bundles;

    $scope.select = function (bundle) {
      bundle.selected = !bundle.selected;
      events.emit('bundle selected', bundle);
    };
  },

  CodeCtrl: function ($scope, events) {

    var i;
    var stack = [];

    var render = function () {

      $scope.code = '';

      stack.sort(function (a, b) {
        return a.order > b.order;
      });


      for (i = 0; i < stack.length; i += 1) {
        $scope.code += stack[i].code;
      }

    };


    events.on('bundle selected', function (e, bundle) {

      if (bundle.selected) {
        stack.push(bundle);
      } else {
        stack.splice(stack.indexOf(bundle), 1);
      }

      render();
    });

  }

};

module.exports = controllers;
