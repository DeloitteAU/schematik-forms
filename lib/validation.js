import "core-js/modules/es6.array.for-each";
import "core-js/modules/es6.array.filter";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.object.define-property";
import "core-js/modules/es6.string.iterator";
import "core-js/modules/es6.array.from";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.date.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.reduce";
import "core-js/modules/es6.array.is-array";
import "core-js/modules/es6.string.trim";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { getIn, setIn } from 'formik';
import { getValidator } from './utils';
import { getComputedProperties } from './rules';
export var REQUIRED_VALIDATOR_KEY = 'required';
export var defaultRequiredFn = function defaultRequiredFn(_ref) {
  var fieldValue = _ref.fieldValue,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? 'This field is required' : _ref$message,
      falseCountsAsNoValue = _ref.falseCountsAsNoValue;

  if (!fieldValue && typeof fieldValue !== 'boolean') {
    return message;
  }

  if (falseCountsAsNoValue && fieldValue === false) {
    return message;
  }

  if ((typeof fieldValue === 'string' || fieldValue instanceof String) && !fieldValue.trim()) {
    return message;
  }

  if (Array.isArray(fieldValue) && !fieldValue.length) {
    return message;
  }

  return undefined;
};
export var makeFieldValidationFunction = function makeFieldValidationFunction(registeredValidators, formValues, computedProperties) {
  var registeredComponents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var validateField = function validateField(fieldConfig) {
    var partialId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var partialErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var fieldIsShown = !computedProperties || !partialId || computedProperties && computedProperties[partialId] && computedProperties[partialId].shown;

    if (!fieldIsShown) {
      return partialErrors;
    }

    var fieldComputedProperties = getComputedProperties(computedProperties, partialId);
    var componentDefinition = registeredComponents[fieldConfig.type] || {}; // Some component may have boolean values, and some components may wish that `false` be treated as an empty
    // value so that it gets picked up by the required validator

    var falseCountsAsNoValue = false;

    if (typeof componentDefinition.falseCountsAsNoValue === 'boolean') {
      falseCountsAsNoValue = componentDefinition.falseCountsAsNoValue;
    }

    var validators = [];

    if (fieldConfig.validators) {
      validators = _toConsumableArray(fieldConfig.validators);
    } // A required validator is just a validator, but it's added to the config differently.
    // Here we add a required validator to the top of the existing list of validators.
    // In this way we can treat it the same way as the rest of the validation rules applied
    // to this field.


    if (fieldComputedProperties.required) {
      validators = [{
        type: REQUIRED_VALIDATOR_KEY,
        message: fieldConfig.requiredMessage || undefined
      }].concat(_toConsumableArray(validators));
    } // Loop through each validator on the field


    var fieldErrors = validators.reduce(function (errorsAccumulator, validatorConfig) {
      var validationFn = getValidator(registeredValidators, validatorConfig.type);

      if (typeof validationFn !== 'function') {
        throw Error("SchematikForms: No validation function found for type '".concat(validatorConfig.type, "'"));
      } // Call the validation function


      var error = validationFn({
        fieldConfig: fieldConfig,
        fieldValue: getIn(formValues, fieldConfig.path),
        formValues: formValues,
        message: validatorConfig.message,
        options: validatorConfig.options,
        falseCountsAsNoValue: falseCountsAsNoValue
      });

      if (error) {
        return [].concat(_toConsumableArray(errorsAccumulator), [error]);
      } else {
        return errorsAccumulator;
      }
    }, []);
    var errors = partialErrors; // Populate the errors object if there were errors

    if (fieldErrors.length) {
      errors = setIn(errors, fieldConfig.path, fieldErrors);
    }

    if (fieldConfig.fields && fieldConfig.fields.length) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = fieldConfig.fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;
          var fullId = partialId ? "".concat(partialId, ".").concat(field.id) : field.id;
          errors = validateField(field, fullId, errors);
        }
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
    }

    return errors;
  };

  return validateField;
};
export var validateForm = function validateForm(config, registeredValidators, formValues, computedProperties, registeredComponents) {
  // Add the default required validation function to the custom validation functions.
  // The default will be overridden by a custom 'required' validation function.
  var validationFunctions = _objectSpread(_defineProperty({}, REQUIRED_VALIDATOR_KEY, defaultRequiredFn), registeredValidators);

  var validateFieldFn = makeFieldValidationFunction(validationFunctions, formValues, computedProperties, registeredComponents);
  return validateFieldFn(config);
};
//# sourceMappingURL=validation.js.map