(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();
});

require.define("vm",function(require,module,exports,__dirname,__filename,process){module.exports = require("vm-browserify")});

require.define("/node_modules/vm-browserify/package.json",function(require,module,exports,__dirname,__filename,process){module.exports = {"main":"index.js"}});

require.define("/node_modules/vm-browserify/index.js",function(require,module,exports,__dirname,__filename,process){var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInNewContext = function (context) {
    if (!context) context = {};
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
     
    if (!win.eval && win.execScript) {
        // win.eval() magically appears when this is called in IE:
        win.execScript('null');
    }
    
    var res = win.eval(this.code);
    
    forEach(Object_keys(win), function (key) {
        context[key] = win[key];
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInContext = function (context) {
    // seems to be just runInNewContext on magical context objects which are
    // otherwise indistinguishable from objects except plain old objects
    // for the parameter segfaults node
    return this.runInNewContext(context);
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    // not really sure what this one does
    // seems to just make a shallow copy
    var copy = {};
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};
});

require.define("/controllers.js",function(require,module,exports,__dirname,__filename,process){var bundles = require('./bundles');
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
});

require.define("/bundles/index.js",function(require,module,exports,__dirname,__filename,process){module.exports = [
  require('./express'),
  require('./static'),
  require('./forms'),
  require('./templates'),
  require('./cookies'),
  require('./sessions_cookie'),
  require('./sessions_redis'),
  require('./locals_app'),
  require('./locals_middleware'),
  require('./awesome'),
  require('./middleware'),
  require('./router'),
  require('./route_simple'),
  require('./route_multiple'),
  require('./errors'),
  require('./404'),
  require('./http'),
];
});

require.define("/bundles/express.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    required: true,
    name: 'The App',
    description: "The express() function creates an application (app). \nEach project needs atleast one these",
    code: "// The App\nvar express = require(\"express\");\nvar app = express();"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/static.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Css / Images / Js',
    link: 'http://www.senchalabs.org/connect/static.html',
    description: "Middleware that lets you serve static files\nfrom a directory. Use this for css, images\nor client-side Javascript.",
    code: "// Use static middleware\napp.use(express.static(__dirname + '/public'));"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/forms.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Forms',
    link: 'http://www.senchalabs.org/connect/bodyParser.html',
    description: "Parse request bodies, supports application/json,\napplication/x-www-form-urlencoded, and multipart/form-data.",
    code: "// Use the bodyParser middleware.\napp.use(express.bodyParser());"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/templates.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Templates (jade)',
    link: 'http://jade-lang.com/',
    description: "Jade is a high performance template engine heavily \ninfluenced by Haml and implemented with JavaScript \nfor node. ",
    code: "// Set the view engine\napp.set('view engine', 'jade');\n\n// Set the directory that contains the views\napp.set('views', __dirname + '/views');"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/cookies.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Cookies',
    link: 'http://www.senchalabs.org/connect/cookieParser.html',
    description: "Parse Cookie header and populate req.cookies\nwith an object keyed by the cookie names.",
    code: "// Use the cookieParser middleware\napp.use(express.cookieParser());"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/sessions_cookie.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    link: 'http://www.senchalabs.org/connect/cookieSession.html',
    name: 'Sessions (cookies)',
    description: "This enables req.session for storing data outside\nthe request / response cycle. The cookie session \nmiddleware will store data inside a cookie.\n<br /><br />\n<span class='label label-important'>Needs Cookies</span>",
    code: "app.use(express.cookieSession({\n  secret: \"MyLittleSecret\" \n}));"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/sessions_redis.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Sessions (redis)',
    link: 'https://github.com/visionmedia/connect-redis',
    description: "This enables req.session for storing data outside\nthe request / response cycle. The redis session \nmiddleware will store data inside redis.\n<br /><br />\n<span class='label label-warning'>Needs redis</span>",
    code: "var RedisStore = require('connect-redis')(express);\n\napp.use(express.session({ \n  store: new RedisStore,\n  secret: 'MyLittleSecret' \n}));"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/locals_app.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Locals (app)',
    description: "You can use app.locals to create a function or \nvariable that is available in your middleware,\nroutes and views.\n<br /><br /> \nThe functions can't use callbacks and don't \nhave access to the request or the response objects. \nThey are also called helpers.",
    code: "// Variable\napp.locals.variable = 'foobar';\n\n// Function\napp.locals.function = function () {\n  return 'foobar'\n};"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/locals_middleware.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Locals (middleware)',
    description: "You can use res.locals to create a function or \nvariable that is available in your routes and views.\n<br /><br /> \nThe functions can't use callbacks but they do\nhave access to the request and the response objects. \nIn 2.x these were called dynamic helpers.\n<br /><br />\n<span class='label label-important'>Needs middleware</span>",
    code: "app.use(function (req, res, next) {\n  // Variable\n  res.locals.variable = 'foobar';\n\n  // Function\n  res.locals.function = function (param) {\n    return param + req.url;\n  };\n\n  next();\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/awesome.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Awesome',
    description: "Something very awesome.",
    code: "// This is you, cause you are awesome!"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/middleware.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Middleware',
    description: "Middleware is a function that takes 3 parameters:\nrequest, response and next. These \nfunctions are inside a stack. When a request\nis made it starts with the first function in \nthe stack. When you call next the following \nfunction is executed.\n<br /><br />\nIf you call next with a parameter the request\nand response is passed to error middleware \n(see Error Handler).",
    code: "// Middleware\napp.use(function(req, res, next){\n  // do something with the request or response\n  next();\n});\n\n// Middleware with error\napp.use(function(req, res, next){\n  // do something with the request or response\n  next('something went wrong');\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/router.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Router',
    description: "The app.router is middleware that can execute \none or more middleware for a certain url.",
    code: "// Use the router middleware\napp.use(app.router);"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/route_simple.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Route (Simple)',
    description: "A route has a url and one or more middleware. You add\na route to your app by using app.&lt;http_verb&gt;.\n<br /><br />\n<span class='label label-important'>Needs router</span>",
    code: "// Get route with one middleware\napp.get(\"/\", function (req, res) {\n  res.send(\"root\");\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/route_multiple.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Route (Multiple)',
    description: "A route has a url and one or more middleware. You add\na route to your app by using app.&lt;http_verb&gt;.\n<br /><br />\n<span class='label label-important'>Needs router</span>",
    code: "// Get route with multiple middleware\napp.get(\"/\", function (req, res, next) {\n  // Do something with request or response\n  next();\n}, function (req, res) {\n  res.render('view');\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/errors.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: 'Error Handler',
    link: 'http://expressjs.com/guide.html#error-handling',
    description: "Error-handling middleware are defined just \nlike regular middleware, however it's\ndefined with with 4 parameters. The extra\nerr parameter holds information about the\nerror.",
    code: "// Middleware with 4 parameters instead of 3\napp.use(function(err, req, res, next){\n  console.error(err.stack);\n  res.send(500, 'Something broke!');\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/404.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    name: '404 Handler',
    description: "Middleware is a list of functions that get \nexecuted in order. If no middleware is ending\nthe response it will look like the request is\nhanging.\n<br /><br />\nTo prevent this you you need to make the last middleware\nin the stack end the response with a 404 message.",
    code: "app.use(function(req, res, next){\n  res.send(404, 'page not found');\n});"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/bundles/http.coffee",function(require,module,exports,__dirname,__filename,process){(function() {
  var bundle;

  bundle = {
    required: true,
    name: 'HTTP Server',
    description: 'Your app is a handler for a Node.js HTTP server.',
    code: "// Create HTTP server with your app\nvar http = require(\"http\");\nvar server = http.createServer(app)\n\n// Listen to port 3000 \nserver.listen(3000);"
  };

  module.exports = bundle;

}).call(this);
});

require.define("/functions.js",function(require,module,exports,__dirname,__filename,process){var Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
          Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

    }

    return output;
  },

  // public method for decoding
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = Base64._keyStr.indexOf(input.charAt(i++));
      enc2 = Base64._keyStr.indexOf(input.charAt(i++));
      enc3 = Base64._keyStr.indexOf(input.charAt(i++));
      enc4 = Base64._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64._utf8_decode(output);

    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }
    return string;
  }
};


module.exports = {
  Base64: Base64
}
});

require.define("/directives.js",function(require,module,exports,__dirname,__filename,process){var directives = {

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
});

require.define("/index.js",function(require,module,exports,__dirname,__filename,process){var controllers = require('./controllers');
var directives = require('./directives');

var app = angular.module('xgen', []);

// Directives

app.directive('popover', directives.popover);

// Controllers

app.controller('BundleCtrl', controllers.BundleCtrl);
});
require("/index.js");
})();
