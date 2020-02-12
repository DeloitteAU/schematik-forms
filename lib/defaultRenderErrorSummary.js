import "core-js/modules/es6.string.iterator";
import "core-js/modules/es6.array.from";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.date.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.is-array";
import "core-js/modules/es6.object.define-property";
import "core-js/modules/es6.object.create";
import "core-js/modules/es6.object.set-prototype-of";
import "core-js/modules/es6.array.reduce";
import "core-js/modules/es6.array.for-each";
var _jsxFileName = "/Users/tejeong/Desktop/deloitte-projects/schematik-forms/src/defaultRenderErrorSummary.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import PropTypes from 'prop-types';

var focusField = function focusField(fieldId) {
  var element = document.getElementById(fieldId);

  if (element && element.focus) {
    element.focus();
    var rect = element.getBoundingClientRect();
    window.scrollTo(0, rect.y);
  }
};

var renderItem = function renderItem(id, label, message) {
  return React.createElement("li", {
    key: id,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, React.createElement("a", {
    onClick: function onClick(e) {
      e.preventDefault();
      focusField(id);
    },
    href: "#".concat(id),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, label, ": ", message));
};

var renderField = function renderField(field) {
  if (!field.errors || !field.errors.length) {
    return null;
  }

  var error = field.errors[0];

  if (error && typeof error === 'string') {
    return [renderItem(field.fieldId, field.label, error)];
  }

  var items = [];

  if (error && error.message) {
    items.push(renderItem(field.fieldId, field.label, error.message));
  }

  if (error && error.children && error.children.length) {
    error.children.forEach(function (child) {
      items.push(renderItem(field.fieldId, child.summaryLabel, child.message));
    });
  }

  return items;
};

var ErrorSummary =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ErrorSummary, _React$Component);

  function ErrorSummary(props) {
    var _this;

    _classCallCheck(this, ErrorSummary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorSummary).call(this, props));
    _this.state = {
      submitCount: _this.props.submitCount,
      summaryData: _this.props.summaryData
    };
    return _this;
  }

  _createClass(ErrorSummary, [{
    key: "render",
    value: function render() {
      return React.createElement("ul", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 85
        },
        __self: this
      }, this.state.summaryData.reduce(function (items, field) {
        return [].concat(_toConsumableArray(items), _toConsumableArray(renderField(field)));
      }, []));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.submitCount !== state.submitCount) {
        return {
          submitCount: props.submitCount,
          summaryData: props.summaryData
        };
      }

      return null;
    }
  }]);

  return ErrorSummary;
}(React.Component);
/* eslint-disable react/prop-types */


ErrorSummary.propTypes = {
  submitCount: PropTypes.number.isRequired,
  summaryData: PropTypes.array.isRequired
};

var defaultRenderErrorSummary = function defaultRenderErrorSummary(_ref) {
  var summaryData = _ref.summaryData,
      submitCount = _ref.submitCount;
  return React.createElement(ErrorSummary, {
    submitCount: submitCount,
    summaryData: summaryData,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  });
};
/* eslint-enable react/prop-types */


export default defaultRenderErrorSummary;
//# sourceMappingURL=defaultRenderErrorSummary.js.map