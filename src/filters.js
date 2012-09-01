var filters = {

  selected: function () {

    return function (input) {
      if (input.selected) {
        return input;
      }
    };

  }

};

module.exports = filters;
