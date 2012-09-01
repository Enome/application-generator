var events = function ($rootScope) {

  return {

    on: function (event, handler) {
      $rootScope.$on(event, handler);
    },

    emit: function (event, msg) {
      $rootScope.$emit(event, msg);
    }

  };

};

module.exports = events;
