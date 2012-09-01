bundle = {
  required: true
  name: 'The App'
  description: """
               The express() function creates an application (app). 
               Each project needs atleast one these
               """
  code: """
        // The App
        var express = require("express");
        var app = express();
        """
}

module.exports = bundle
