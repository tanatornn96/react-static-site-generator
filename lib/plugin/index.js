'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _eval2 = require('eval');

var _eval3 = _interopRequireDefault(_eval2);

var _helper = require('./helper');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorPlugin = function () {
  function GeneratorPlugin(options) {
    _classCallCheck(this, GeneratorPlugin);

    this.options = options;
  }

  // Called by webpack when loading the plugin


  _createClass(GeneratorPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('emit', function (compilation, callback) {

        var js = _this.options.js;
        var css = _this.options.css;

        var asset = compilation.assets[js];
        var source = (0, _eval3.default)(asset.source(), true);

        var name = _this.options.name;

        if (_this.options.noJS) {
          delete compilation.assets[js];
        }

        // Trying to find the base route
        var routes = void 0;
        if (_react2.default.isValidElement(source.default) && (0, _helper.isRoute)(source.default)) {
          routes = source.default;
        } else if (_react2.default.isValidElement(source.routes) && (0, _helper.isRoute)(source.routes)) {
          routes = source.routes;
        } else if (_react2.default.isValidElement(source) && (0, _helper.isRoute)(source)) {
          routes = source;
        }

        var directories = (0, _helper.getDirectory)(routes);
        directories.forEach(function (directory) {
          // Match each directory to a route and render out the page
          (0, _reactRouter.match)({ routes: routes, location: directory }, function (error, redirect, props) {
            var file = (0, _helper.render)(_react2.default.createElement(_reactRouter.RouterContext, props), _this.options, { js: js, css: css, name: name });

            // Adding a .html suffix to the directory as well as checking to see if it is an index
            // route, if it is an index route, we have to rename the directory from '/.html'
            // to '/index.html'
            var fullPath = directory + '.html';
            if (fullPath.indexOf('/.html') !== -1) {
              fullPath = fullPath.replace('/.html', '/index.html');
            }

            if (fullPath.indexOf('*.html') !== -1) {
              fullPath = fullPath.replace('*.html', '404.html');
            }

            // Wrting file back into the assets
            compilation.assets[fullPath] = { source: function source() {
                return file;
              }, size: function size() {
                return file.length;
              } };
          });
        });

        // Proceed with the with build
        callback();
      });
    }
  }]);

  return GeneratorPlugin;
}();

exports.default = GeneratorPlugin;