import "core-js/modules/es6.array.from";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.date.to-string";
import "core-js/modules/es6.array.is-array";
import "core-js/modules/es6.array.filter";
import "core-js/modules/es6.object.define-property";
import "core-js/modules/es6.array.reduce";
import "core-js/modules/es6.array.for-each";
import "core-js/modules/es6.string.iterator";
import "core-js/modules/es6.set";
import "core-js/modules/es6.array.find";
import "core-js/modules/es6.string.starts-with";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.object.keys";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es7.object.values";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { getIn } from 'formik';
import { iterateFields } from './utils';
export var properties = {
  SHOWN: 'shown',
  DISABLED: 'disabled',
  REQUIRED: 'required'
};
var conditionTypes = {
  EQUALITY: 'eq',
  ALL: 'all',
  ANY: 'any',
  NOT: 'not'
};
/**
 * Gets the type (e.g. 'eq', 'all') from a condition object.
 *
 * If no type can be determined, returns undefined
 *
 * @param {Object} condition
 * @returns {String|undefined}
 */

var getConditionType = function getConditionType(condition) {
  var customRuleConditions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!condition) {
    return undefined;
  }

  for (var _i = 0, _Object$values = Object.values(conditionTypes); _i < _Object$values.length; _i++) {
    var type = _Object$values[_i];

    if (condition.hasOwnProperty(type)) {
      return type;
    }
  }

  for (var _i2 = 0, _Object$keys = Object.keys(customRuleConditions); _i2 < _Object$keys.length; _i2++) {
    var _type = _Object$keys[_i2];

    if (condition.hasOwnProperty(_type)) {
      return _type;
    }
  }

  return undefined;
};

export var isShown = function isShown(computedProperties, treePath) {
  if (!computedProperties || !treePath) {
    return true;
  }

  var fieldProperties = computedProperties[treePath];

  if (fieldProperties && fieldProperties.shown) {
    return true;
  }

  return false;
};
export var getComputedProperties = function getComputedProperties(computedProperties, treePath) {
  if (!computedProperties || !treePath) {
    return {};
  }

  return computedProperties[treePath] || {};
};
/**
 * Implements the 'eq' condition.
 *
 * Returns true if any values in `args` match `value`, false otherwise.
 *
 * @param {*} value - The value to compare against
 * @param {Array<*>} args - The values to compare
 *
 * @returns {boolean}
 */

var equal = function equal(_ref) {
  var fieldValue = _ref.fieldValue,
      params = _ref.params;
  return params.values.includes(fieldValue);
};

var RulesParser =
/*#__PURE__*/
function () {
  function RulesParser(config, pathsToTreeMap, formValues, registeredRuleCondtions) {
    _classCallCheck(this, RulesParser);

    this.config = config;
    this.pathsToTreeMap = pathsToTreeMap;
    this.formValues = formValues;
    this.registeredRuleCondtions = _objectSpread(_defineProperty({}, conditionTypes.EQUALITY, equal), registeredRuleCondtions);
  }

  _createClass(RulesParser, [{
    key: "parseRules",
    value: function parseRules() {
      var shown = {};
      var computed = {};
      var lastHiddenParent = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iterateFields(this.config)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value,
              fieldConfig = _step$value.fieldConfig,
              treePath = _step$value.treePath;

          var _isShown = void 0;

          var parentWasHidden = void 0;

          if (lastHiddenParent && treePath.startsWith(lastHiddenParent)) {
            _isShown = false;
            parentWasHidden = true;
          } else {
            _isShown = this.computeShown(fieldConfig, shown);
          }

          shown[fieldConfig.path] = _isShown;

          if (!parentWasHidden && !_isShown) {
            lastHiddenParent = treePath;
          }

          computed[treePath] = {
            shown: _isShown
          };
        } // After the shown property is resolved for all fields, other properties can be computed

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = iterateFields(this.config)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _step2.value,
              fieldConfig = _step2$value.fieldConfig,
              treePath = _step2$value.treePath;
          computed[treePath] = _objectSpread({}, computed[treePath] || {}, {
            disabled: this.computeProperty(properties.DISABLED, !!fieldConfig.disabled, fieldConfig, shown),
            required: this.computeProperty(properties.REQUIRED, !!fieldConfig.required, fieldConfig, shown)
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return computed;
    }
  }, {
    key: "computeShown",
    value: function computeShown(fieldConfig, partialShownMap) {
      var _this = this;

      var shownRule = (fieldConfig.rules || []).find(function (rule) {
        return rule.property === properties.SHOWN;
      });

      if (!shownRule) {
        return true;
      }

      var dependencies = new Set(); // This will add any dependencies to the dependencies set, need to make this functional

      this.getConditionDependencies(shownRule.when, dependencies);
      dependencies.forEach(function (dependencyPath) {
        var dependencyFields = _this.pathsToTreeMap[dependencyPath]; // If we know there's a field with this path already shown, there's no need for extra calculations

        if (dependencyFields && !partialShownMap[dependencyPath]) {
          var _isShown2 = dependencyFields.reduce(function (acc, field) {
            var dependencyConfig = field.fieldConfig;
            return acc || _this.computeShown(dependencyConfig, partialShownMap);
          }, false);

          partialShownMap[dependencyPath] = _isShown2;
        }
      });
      return this.parseCondition(shownRule.when, partialShownMap);
    }
  }, {
    key: "computeProperty",
    value: function computeProperty(property, defaultValue, fieldConfig, shownMap) {
      var rule = (fieldConfig.rules || []).find(function (rule) {
        return rule.property === property;
      });

      if (!rule) {
        return defaultValue;
      }

      return this.parseCondition(rule.when, shownMap);
    }
    /**
    * TODO make this functional
    *
    * Recursively find the dependencies of a condition.
    *
    * In this context, a field is a dependency of a condition if the field's path is referenced in the condition.
    *
    * @param {Object} condition - the condition
    * @param {Object} found - The partial list of dependencies found so far
    */

  }, {
    key: "getConditionDependencies",
    value: function getConditionDependencies(condition, found) {
      var _this2 = this;

      var type = getConditionType(condition, this.registeredRuleCondtions);

      switch (type) {
        case conditionTypes.ALL:
        case conditionTypes.ANY:
          var args = condition[type];
          (args || []).forEach(function (arg) {
            _this2.getConditionDependencies(arg, found);
          });
          break;

        case conditionTypes.NOT:
          var arg = condition[type];
          this.getConditionDependencies(arg, found);
          break;

        default:
          var params = condition[type];

          if (params && params.fieldPath) {
            found.add(params.fieldPath);
          }

          break;
      }
    }
    /**
     * Takes a condition object, evaluates the condition against the current form values and returns a
     * boolean value.
     *
     * If a field is hidden, checking equality with that field should always return false. For this
     * reason, any field that is referenced in a condition must be evaluated first.
     *
     * @param {Object} condition - the condition to evaluate
     * @param {Object} formValues - The current values of the form
     * @param {Object} shownMap - The current visibility of fields in the form
     *
     * @returns {boolean}
     */

  }, {
    key: "parseCondition",
    value: function parseCondition(condition, shownMap) {
      if (typeof condition === 'boolean') {
        return condition;
      }

      var type = getConditionType(condition, this.registeredRuleCondtions);

      switch (type) {
        case conditionTypes.ALL:
          return this.all(shownMap).apply(void 0, _toConsumableArray(condition[conditionTypes.ALL]));

        case conditionTypes.ANY:
          return this.any(shownMap).apply(void 0, _toConsumableArray(condition[conditionTypes.ANY]));

        case conditionTypes.NOT:
          return this.not(shownMap)(condition[conditionTypes.NOT]);

        default:
          {
            var params = condition[type];

            if (!type || !params) {
              return false;
            }

            var fieldValue;
            var isFieldShown = true; // IF PATH CORRESPONDS TO A FIELD IN THIS FORM:
            // 		Continue normally
            // IF PATH IS NOT IN FORM:
            // 		Get that value from 'context', value is undefined if not found

            if (this.pathsToTreeMap[params.fieldPath]) {
              if (typeof params.fieldPath !== 'undefined') {
                fieldValue = getIn(this.formValues, params.fieldPath);
              }

              if (shownMap && !shownMap[params.fieldPath]) {
                fieldValue = undefined;
                isFieldShown = false;
              }
            } else {
              fieldValue = getIn(this.config.context, params.fieldPath);
            }

            var conditionFn = this.registeredRuleCondtions[type];

            if (conditionFn) {
              return conditionFn({
                fieldValue: fieldValue,
                isFieldShown: isFieldShown,
                params: params
              });
            }

            return false;
          }
      }
    }
    /**
     * Implements the 'all' condition.
     *
     * Returns a function that evaluates each condition and returns true if all provided conditions evalute to true.
     *
     * @param {Object} formValues - The current values of the form
     * @param {Object} shownMap - The current visibility of fields in the form
     *
     * @returns {function} - Takes n conditions and returns a boolean
     */

  }, {
    key: "all",
    value: function all(shownMap) {
      var _this3 = this;

      return function () {
        for (var _len = arguments.length, conditions = new Array(_len), _key = 0; _key < _len; _key++) {
          conditions[_key] = arguments[_key];
        }

        return conditions.reduce(function (acc, currentCondition) {
          return acc && _this3.parseCondition(currentCondition, shownMap); // eslint-disable-line no-use-before-define
        }, true);
      };
    }
    /**
     * Implements the 'any' condition.
     *
     * Returns a function that evaluates each condition and returns true if at least one of the provided conditions evalutes to true.
     *
     * @param {Object} formValues - The current values of the form
     * @param {Object} shownMap - The current visibility of fields in the form
     *
     * @returns {function} - Takes n conditions and returns a boolean
     */

  }, {
    key: "any",
    value: function any(shownMap) {
      var _this4 = this;

      return function () {
        for (var _len2 = arguments.length, conditions = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          conditions[_key2] = arguments[_key2];
        }

        return conditions.reduce(function (acc, currentCondition) {
          return acc || _this4.parseCondition(currentCondition, shownMap); // eslint-disable-line no-use-before-define
        }, false);
      };
    }
    /**
     * Implements the 'not' condition.
     *
     * Returns a function that evaluates to the negation of the provided condition.
     *
     * @param {Object} formValues - The current values of the form
     * @param {Object} shownMap - The current visibility of fields in the form
     *
     * @returns {function} - Takes a condition and returns a boolean
     */

  }, {
    key: "not",
    value: function not(shownMap) {
      var _this5 = this;

      return function (condition) {
        return !_this5.parseCondition(condition, shownMap); // eslint-disable-line no-use-before-define
      };
    }
  }]);

  return RulesParser;
}();

export var parseRules = function parseRules(config, pathsToTreeMap, formValues, registeredRuleCondtions) {
  var parser = new RulesParser(config, pathsToTreeMap, formValues, registeredRuleCondtions);
  return parser.parseRules();
};
//# sourceMappingURL=rules.js.map