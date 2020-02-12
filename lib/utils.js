import "core-js/modules/es6.array.reduce";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "regenerator-runtime/runtime";
import cloneDeep from 'lodash.clonedeep';
import { setIn } from 'formik';
import unset from 'lodash.unset';
import { getComputedProperties } from './rules';
export var getComponent = function getComponent(registeredComponents, componentName) {
  if (!registeredComponents || !registeredComponents[componentName] || !registeredComponents[componentName].component) {
    console.warn("SchematikForms: No component of type '".concat(componentName, "' is registered"));
    return undefined;
  }

  return registeredComponents[componentName].component;
};
export var getValidator = function getValidator(registeredValidators, validatorName) {
  if (!registeredValidators || !registeredValidators[validatorName]) {
    console.warn("SchematikForms: No validator of type '".concat(validatorName, "' is registered"));
    return undefined;
  }

  return registeredValidators[validatorName];
};

var _iterateFieldsAux =
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee(config) {
  var partialTreePath,
      _iteratorNormalCompletion,
      _didIteratorError,
      _iteratorError,
      _iterator,
      _step,
      fieldConfig,
      treePath,
      _args = arguments;

  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          partialTreePath = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';

          if (!(!config || !config.fields)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 6;
          _iterator = config.fields[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 17;
            break;
          }

          fieldConfig = _step.value;
          treePath = partialTreePath ? "".concat(partialTreePath, ".").concat(fieldConfig.id) : fieldConfig.id;
          _context.next = 13;
          return {
            treePath: treePath,
            fieldConfig: fieldConfig
          };

        case 13:
          return _context.delegateYield(_iterateFieldsAux(fieldConfig, treePath), "t0", 14);

        case 14:
          _iteratorNormalCompletion = true;
          _context.next = 8;
          break;

        case 17:
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t1 = _context["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 23:
          _context.prev = 23;
          _context.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context.prev = 26;

          if (!_didIteratorError) {
            _context.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context.finish(26);

        case 30:
          return _context.finish(23);

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[6, 19, 23, 31], [24,, 26, 30]]);
});
/**
 * Creates an iterator which loops over each field in the form config.
 *
 * Nested fields will be iterated over depth first.
 *
 * @param {object} config
 */


export var iterateFields =
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee2(config) {
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.delegateYield(_iterateFieldsAux(config, ''), "t0", 1);

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
});
/**
 * Create a map of paths to 'treePaths'
 *
 * @param {*} config
 */

export var mapPathsToTree = function mapPathsToTree(config) {
  var mapping = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = iterateFields(config)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _step2.value,
          fieldConfig = _step2$value.fieldConfig,
          treePath = _step2$value.treePath;
      mapping[fieldConfig.path] = mapping[fieldConfig.path] || [];
      mapping[fieldConfig.path].push({
        fieldConfig: fieldConfig,
        treePath: treePath
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

  return mapping;
};
/**
 * Filter out values from fields that are disabled or have the doNotSubmit flag
 *
 * @param {*} values - form values
 * @param {*} computed - map of computed properties
 */

export var filterFormValues = function filterFormValues(values, config, computed, pathsToTreeMap) {
  var valuesClone = cloneDeep(values);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    var _loop = function _loop() {
      var _step3$value = _step3.value,
          treePath = _step3$value.treePath,
          fieldConfig = _step3$value.fieldConfig;
      var shouldFilter = fieldConfig.doNotSubmit || computed[treePath].disabled;

      if (shouldFilter) {
        var fieldsWithThisPath = pathsToTreeMap[fieldConfig.path];
        shouldFilter = (fieldsWithThisPath || []).reduce(function (acc, field) {
          // Don't check this field
          if (field.treePath === treePath) {
            return acc;
          }

          var fieldComputedProperties = getComputedProperties(computed, field.treePath);
          return acc && (field.fieldConfig.doNotSubmit || fieldComputedProperties.disabled);
        }, true);
      }

      if (shouldFilter) {
        unset(valuesClone, fieldConfig.path);
      }
    };

    for (var _iterator3 = iterateFields(config)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return valuesClone;
};
export var getDefaultValues = function getDefaultValues(config, registeredComponents) {
  var defaultValues = {};
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = iterateFields(config)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var fieldConfig = _step4.value.fieldConfig;
      var type = fieldConfig.type;
      var path = fieldConfig.path;

      if (!path) {
        continue;
      }

      var defaultVal = undefined;

      if (registeredComponents[type] && typeof registeredComponents[type].defaultValue !== 'undefined') {
        defaultVal = registeredComponents[type].defaultValue;
      }

      if (fieldConfig && typeof fieldConfig.defaultValue !== 'undefined') {
        defaultVal = fieldConfig.defaultValue;
      }

      defaultValues = setIn(defaultValues, path, defaultVal);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return defaultValues;
};
//# sourceMappingURL=utils.js.map