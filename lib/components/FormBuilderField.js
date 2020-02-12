import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/es6.object.define-property";
import "core-js/modules/es6.object.create";
import "core-js/modules/es6.object.set-prototype-of";
import "core-js/modules/es6.array.map";
import "core-js/modules/es6.array.reduce";
import "core-js/modules/es6.array.for-each";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
var _jsxFileName = "/Users/tejeong/Desktop/deloitte-projects/schematik-forms/src/components/FormBuilderField.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
import isEqual from 'react-fast-compare';
import { getIn, setIn } from 'formik';
import { getComponent } from '../utils';
import { getComputedProperties } from '../rules';
import { renderFieldError, renderChildError } from '../errors';
import _renderTextNode from '../renderTextNode';
import OptimiseField from './OptimiseField';

var FormBuilderField =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FormBuilderField, _React$Component);

  function FormBuilderField(props) {
    var _this;

    _classCallCheck(this, FormBuilderField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormBuilderField).call(this, props));

    _this.runActions = function (value) {
      // Unfortunately this action happens before Formik updates the state of the form.
      // In order to ensure that the all values are sent with this request, we manually add
      // the field value of the changed field.
      var formValues = setIn(_this.props.formik.values, _this.props.config.path, value);
      (_this.props.config.actions || []).forEach(function (action) {
        _this.props.runAction(action, value, formValues);
      });
    };

    _this.state = {
      value: getIn(props.formik.values, props.path)
    };
    return _this;
  }

  _createClass(FormBuilderField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.formik.setFieldTouched(this.props.path, false, false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var nextFieldValue = getIn(this.props.formik.values, this.props.path);
      var prevFieldValue = getIn(prevProps.formik.values, prevProps.path);

      if (!isEqual(nextFieldValue, prevFieldValue)) {
        this.setState({
          value: nextFieldValue
        }); // eslint-disable-line react/no-did-update-set-state
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // When a field unmounts (usually because of a show/hide rule), we need to clear it's value.
      this._checkAndClearValue();
    }
  }, {
    key: "_checkAndClearValue",
    value: function _checkAndClearValue() {
      var _this2 = this;

      // Here we are getting every field that has the same path as this field.
      var fields = this.props.pathsToTreeMap[this.props.path]; // Before we remove this fields value, we first need to check if there are any other fields with the
      // same path still visible. If there is another field visible, we don't want to remove the value.

      var isPathShown = (fields || []).reduce(function (acc, field) {
        // Don't check this field
        if (field.treePath === _this2.props.treePath) {
          return acc;
        }

        var fieldComputedProperties = getComputedProperties(_this2.props.computed, field.treePath);
        return acc || fieldComputedProperties.shown;
      }, false); // If we are safe to remove the value: set the field as untouched and reset back
      // to the fields defaultValue.

      if (!isPathShown) {
        var defaultValue;

        if (typeof this.props.config.defaultValue !== 'undefined') {
          defaultValue = this.props.config.defaultValue;
        } else {
          defaultValue = this.props.registeredComponents[this.props.config.type].defaultValue;
        }

        var currentValue = this.state.value;
        this.props.formik.setFieldTouched(this.props.path, false, false);

        if (!this.props.config.retainValue && currentValue !== defaultValue) {
          this.props.formik.setFieldValue(this.props.path, defaultValue, false);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          formId = _this$props.formId,
          treePath = _this$props.treePath,
          path = _this$props.path,
          config = _this$props.config,
          configTimestamp = _this$props.configTimestamp,
          context = _this$props.context,
          registeredComponents = _this$props.registeredComponents,
          registeredRuleConditions = _this$props.registeredRuleConditions,
          onTriggerCallback = _this$props.onTriggerCallback,
          registeredActions = _this$props.registeredActions,
          computed = _this$props.computed,
          formik = _this$props.formik,
          externalErrors = _this$props.externalErrors,
          clearExternalError = _this$props.clearExternalError,
          pathsToTreeMap = _this$props.pathsToTreeMap;
      var Component = getComponent(registeredComponents, config.type);

      if (!Component) {
        throw new Error("FormBuilderField: Could not find component of type \"".concat(config.type, "\"."));
      }

      if (!formId) {
        throw new Error('FormBuilderField: "config.id" is a required prop.');
      }

      var fieldComputedProperties = getComputedProperties(computed, treePath);
      var fieldTouched = !!getIn(formik.touched, path); // Ensure this is a boolean to keep prop-type warnings away

      var fieldErrors = path ? getIn(formik.errors, path) : undefined;
      var fieldExternalErrors = path ? getIn(externalErrors, path) : undefined;

      if (typeof fieldExternalErrors === 'string') {
        fieldExternalErrors = [fieldExternalErrors];
      }

      var dependsOnOtherFields = this.props.registeredComponents[this.props.config.type].dependsOnOtherFields;
      var shouldOptimise = !dependsOnOtherFields && (!config || !config.fields || !config.fields.length);
      return React.createElement(OptimiseField, {
        shouldOptimise: shouldOptimise,
        configTimestamp: configTimestamp,
        value: this.state.value,
        fieldErrors: fieldErrors,
        fieldExternalErrors: fieldExternalErrors,
        touched: fieldTouched,
        computed: fieldComputedProperties,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 181
        },
        __self: this
      }, React.createElement(Component, {
        path: path,
        htmlId: "".concat(formId, ".").concat(treePath),
        config: config,
        runActions: this.runActions,
        handleChange: function handleChange(value) {
          var triggersTouched = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          clearExternalError(path);

          _this3.runActions(value);

          if (triggersTouched) {
            formik.setFieldTouched(path, true, false);
          }

          formik.setFieldValue(path, value, true);
        },
        handleBlur: function handleBlur()
        /* e */
        {
          clearExternalError(path);
          formik.setFieldTouched(path, true, true);
        },
        handleChangeFast: function handleChangeFast(value) {
          _this3.setState({
            value: value
          });
        },
        handleBlurFast: function handleBlurFast()
        /* e */
        {
          clearExternalError(path);

          _this3.runActions(_this3.state.value);

          formik.setFieldValue(path, _this3.state.value, false);
          formik.setFieldTouched(path, true, true);
        },
        handleKeyPressFast: function handleKeyPressFast(event) {
          if (event.key === 'Enter') {
            formik.setFieldValue(path, _this3.state.value, false);
          }
        },
        computed: fieldComputedProperties,
        value: this.state.value,
        errors: fieldErrors,
        externalErrors: fieldExternalErrors,
        touched: fieldTouched,
        getDisplayError: function getDisplayError() {
          return renderFieldError(fieldErrors, fieldExternalErrors, fieldTouched);
        },
        getChildError: function getChildError(childName) {
          return renderChildError(childName, fieldErrors, fieldExternalErrors, fieldTouched);
        },
        renderTextNode: function renderTextNode(node, wrappingTag) {
          return _renderTextNode(node, wrappingTag, context);
        },
        setValues: formik.setValues,
        formValues: formik.values,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 190
        },
        __self: this
      }, (config.fields || []).map(function (nestedField) {
        var nestedFieldTreePath = "".concat(treePath, ".").concat(nestedField.id);
        var nestedFieldComputedProperties = getComputedProperties(computed, nestedFieldTreePath); // Don't render if not shown :)

        if (!nestedFieldComputedProperties.shown) {
          return null;
        }

        return React.createElement(FormBuilderField, {
          key: nestedField.id,
          context: context,
          formId: formId,
          formik: formik,
          config: nestedField,
          configTimestamp: configTimestamp,
          path: nestedField.path,
          treePath: nestedFieldTreePath,
          computed: computed,
          registeredActions: registeredActions,
          registeredComponents: registeredComponents,
          registeredRuleConditions: registeredRuleConditions,
          externalErrors: externalErrors,
          clearExternalError: clearExternalError,
          pathsToTreeMap: pathsToTreeMap,
          onTriggerCallback: onTriggerCallback,
          runAction: _this3.props.runAction,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 250
          },
          __self: this
        });
      })));
    }
  }]);

  return FormBuilderField;
}(React.Component);

FormBuilderField.propTypes = {
  formId: PropTypes.string.isRequired,
  path: PropTypes.string,
  treePath: PropTypes.string.isRequired,

  /***
   * The form config object used to build the form
   */
  config: PropTypes.object.isRequired,
  configTimestamp: PropTypes.number.isRequired,

  /***
   * A key-value mapping of custom field types to the components that should render them.
   *
   * This mapping would usually be passed down from FormBuilder.js, see that component for more details.
   */
  registeredComponents: PropTypes.object.isRequired,
  registeredActions: PropTypes.object.isRequired,
  registeredRuleConditions: PropTypes.object.isRequired,
  externalErrors: PropTypes.object.isRequired,
  clearExternalError: PropTypes.func.isRequired,
  computed: PropTypes.object.isRequired,

  /***
   * Props passed from Formik
   */
  formik: PropTypes.object.isRequired,
  onTriggerCallback: PropTypes.func.isRequired,
  pathsToTreeMap: PropTypes.object.isRequired,
  runAction: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired
};
FormBuilderField.defaultProps = {
  path: undefined
};
export { FormBuilderField as default };
//# sourceMappingURL=FormBuilderField.js.map