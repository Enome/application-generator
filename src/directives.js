var directives = {

  popover: function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var $el = $(element);
        var bundle = scope.$eval(attrs.popover);

        $el.popover({
          trigger: 'hover',
          animation: false,
          title: bundle.name,
          content: bundle.description
        });

      }

    };

  }

};


module.exports = directives;
