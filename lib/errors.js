import "core-js/modules/es6.string.iterator";
import "core-js/modules/es6.array.from";
import "core-js/modules/es6.regexp.to-string";
import "core-js/modules/es6.date.to-string";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.array.is-array";
import "core-js/modules/es6.function.name";
import "core-js/modules/es6.array.find";
import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/web.dom.iterable";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { getIn } from 'formik';
import { iterateFields } from './utils';
import renderTextNode from './renderTextNode';
import { getComputedProperties } from './rules';
export var getFieldErrors = function getFieldErrors(path, internal, external) {
  var internalErrors = getIn(internal, path) || [];
  var externalErrors = getIn(external, path) || [];

  if (typeof internalErrors === 'string') {
    internalErrors = [internalErrors];
  }

  if (typeof externalErrors === 'string') {
    externalErrors = [externalErrors];
  }

  return [].concat(_toConsumableArray(externalErrors), _toConsumableArray(internalErrors));
};

var getErrorSummaryFieldLabel = function getErrorSummaryFieldLabel(fieldConfig, context) {
  if (fieldConfig.errorSummaryLabel) {
    return fieldConfig.errorSummaryLabel;
  } // Attempt to use the field's 'label', this is just a convention.


  if (fieldConfig.data && fieldConfig.data.label) {
    return renderTextNode(fieldConfig.data.label, 'span', context);
  }

  return '';
};

export var getErrorSummaryData = function getErrorSummaryData(config, internalErrors, externalErrors, computedProperties) {
  var errorSummaryData = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterateFields(config)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _step.value,
          treePath = _step$value.treePath,
          fieldConfig = _step$value.fieldConfig;
      var fieldErrors = null;
      var fieldComputedProperties = getComputedProperties(computedProperties, treePath);

      if (fieldConfig.path && fieldComputedProperties.shown) {
        fieldErrors = getFieldErrors(fieldConfig.path, internalErrors, externalErrors);
      }

      if (fieldErrors && fieldErrors.length) {
        errorSummaryData.push({
          fieldId: "".concat(config.id, ".").concat(treePath),
          label: getErrorSummaryFieldLabel(fieldConfig, config.context),
          errors: fieldErrors
        });
      }
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

  return errorSummaryData;
};

var getFieldErrorToDisplay = function getFieldErrorToDisplay(errors, externalErrors, touched) {
  if (externalErrors && externalErrors.length) {
    return externalErrors[0];
  }

  if (touched && errors && errors.length) {
    return errors[0];
  }

  return undefined;
};

export var renderFieldError = function renderFieldError(errors, externalErrors, touched) {
  var error = getFieldErrorToDisplay(errors, externalErrors, touched);

  if (error && typeof error === 'string') {
    return error;
  }

  if (error && error.message) {
    return error.message;
  }

  return undefined;
};
export var renderChildError = function renderChildError(childName, errors, externalErrors, touched) {
  var error = getFieldErrorToDisplay(errors, externalErrors, touched);
  var childError;

  if (error && error.children && error.children.length) {
    childError = error.children.find(function (child) {
      return child.name === childName;
    });
  }

  return childError ? childError.message : undefined;
};
//# sourceMappingURL=errors.js.map