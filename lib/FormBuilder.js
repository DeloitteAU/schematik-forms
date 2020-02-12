import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.array.for-each";
import "core-js/modules/es6.array.filter";
import "core-js/modules/es6.symbol";
import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.object.define-property";
import "core-js/modules/es6.object.create";
import "core-js/modules/es6.object.set-prototype-of";
import "core-js/modules/es6.array.map";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.function.bind";
var _jsxFileName = "/Users/tejeong/Desktop/deloitte-projects/schematik-forms/src/FormBuilder.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React from 'react';
import PropTypes from 'prop-types';
import { Formik, setIn } from 'formik';
import FormBuilderField from './components/FormBuilderField';
import { parseRules, getComputedProperties } from './rules';
import { mapPathsToTree, filterFormValues, getDefaultValues } from './utils';
import { getErrorSummaryData } from './errors';
import defaultRenderErrorSummary from './defaultRenderErrorSummary';
import defaultRenderForm from './defaultRenderForm';
import { validateForm } from './validation';
import { JSON_SPEC_VERSION } from './constants';

var FormBuilder =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FormBuilder, _React$Component);

  function FormBuilder(props) {
    var _this;

    _classCallCheck(this, FormBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormBuilder).call(this, props));

    _this.runAction = function (action, fieldValue, formValues) {
      var setFieldValue = function setFieldValue(path, val) {
        _this.formikRef.setFieldValue(path, val, false);
      };

      var triggerCallback = function triggerCallback() {
        var _this$props;

        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        (_this$props = _this.props).onActionCallback.apply(_this$props, params.concat([formValues]));
      };

      var availableActions = _objectSpread({}, _this.props.registeredActions);

      if (action.when && action.when.eq && action.when.eq !== fieldValue) {
        return;
      }

      if (availableActions.hasOwnProperty(action.type)) {
        availableActions[action.type]({
          action: action,
          formValues: formValues,
          fieldValue: fieldValue,
          setFieldValue: setFieldValue,
          triggerCallback: triggerCallback,
          submitForm: function submitForm() {
            _this.formikRef.submitForm();
          },
          setFieldError: _this.formikRef.setFieldError
        });
      }
    };

    _this.state = {
      externalErrors: _this.getInitialErrors()
    };
    _this.formCallbackRef = _this.formCallbackRef.bind(_assertThisInitialized(_this));
    _this.formikRef = null;
    return _this;
  }

  _createClass(FormBuilder, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.configTimestamp !== this.props.configTimestamp) {
        this.formikRef.setValues(this.getInitialValues());
        /* eslint-disable-next-line react/no-did-update-set-state */

        this.setState({
          externalErrors: this.getInitialErrors()
        });
      }
    }
  }, {
    key: "clearAllExternalErrors",
    value: function clearAllExternalErrors() {
      this.setState({
        externalErrors: {}
      });
    }
  }, {
    key: "getInitialValues",
    value: function getInitialValues() {
      var initial = this.props.initialValues ? this.props.initialValues : this.props.config.initialValues;
      return _objectSpread({}, getDefaultValues(this.props.config, this.props.registeredComponents), initial);
    }
  }, {
    key: "getInitialErrors",
    value: function getInitialErrors() {
      return this.props.config && this.props.config.initialErrors || {};
    }
  }, {
    key: "formCallbackRef",
    value: function formCallbackRef(node) {
      this.formikRef = node;
      this.props.formikRef(node);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          config = _this$props2.config,
          configTimestamp = _this$props2.configTimestamp,
          registeredComponents = _this$props2.registeredComponents,
          registeredActions = _this$props2.registeredActions,
          registeredRuleConditions = _this$props2.registeredRuleConditions,
          registeredValidators = _this$props2.registeredValidators,
          renderForm = _this$props2.renderForm,
          renderButtons = _this$props2.renderButtons,
          renderErrorSummary = _this$props2.renderErrorSummary; // Don't render anything if no config is provided.

      if (!config) {
        return null;
      }

      if (config.version !== JSON_SPEC_VERSION) {
        throw new Error("JSON forms spec version mismatch. Was: ".concat(config.version, ", expected: ").concat(JSON_SPEC_VERSION));
      }

      var pathsToTreeMap = mapPathsToTree(config);
      return React.createElement(Formik, {
        ref: this.formCallbackRef,
        validateOnBlur: true,
        validateOnChange: true,
        enableReinitialize: false,
        onSubmit: function onSubmit(values) {
          var computed = parseRules(config, pathsToTreeMap, values, registeredRuleConditions);
          var filteredValues = filterFormValues(values, config, computed, pathsToTreeMap);

          _this2.props.onSubmit(filteredValues);
        },
        initialValues: this.getInitialValues(),
        validate: function validate(values) {
          var computed = parseRules(config, pathsToTreeMap, values, registeredRuleConditions);
          return validateForm(config, registeredValidators, values, computed, registeredComponents);
        },
        render: function render(formikProps) {
          var computed = parseRules(config, pathsToTreeMap, formikProps.values, registeredRuleConditions); // Start a recursive loop through each field in the config

          var fields = (config.fields || []).map(function (field) {
            var fieldComputedProperties = getComputedProperties(computed, field.id); // Don't render if not shown :)

            if (!fieldComputedProperties.shown) {
              return null;
            }

            return React.createElement(FormBuilderField, {
              key: field.id,
              formId: config.id,
              formik: formikProps,
              config: field,
              configTimestamp: configTimestamp,
              path: field.path,
              treePath: field.id,
              computed: computed,
              context: config.context,
              registeredComponents: registeredComponents,
              registeredRuleConditions: registeredRuleConditions,
              registeredActions: registeredActions,
              clearExternalError: function clearExternalError(errorPath) {
                _this2.setState(function (prevState) {
                  return {
                    externalErrors: setIn(prevState.externalErrors, errorPath, undefined)
                  };
                });
              },
              externalErrors: _this2.state.externalErrors,
              pathsToTreeMap: pathsToTreeMap,
              onTriggerCallback: _this2.props.onActionCallback,
              runAction: _this2.runAction,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 291
              },
              __self: this
            });
          }); // TODO pass correct props to renderButtons()

          var buttons = renderButtons();
          var errorSummaryData = getErrorSummaryData(config, formikProps.errors, _this2.state.externalErrors, computed);
          var errorSummary = renderErrorSummary({
            summaryData: errorSummaryData,
            submitCount: formikProps.submitCount,
            isValidating: formikProps.isValidating
          });
          return renderForm({
            children: fields,
            buttons: buttons,
            errorSummary: errorSummary,
            // TODO: form error summary might go in here
            handleSubmit: function handleSubmit(event) {
              _this2.clearAllExternalErrors();

              formikProps.handleSubmit(event);
            },
            runAction: function runAction(action) {
              _this2.runAction(action, undefined, formikProps.values);
            },
            formValues: formikProps.values
          });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 260
        },
        __self: this
      });
    }
  }]);

  return FormBuilder;
}(React.Component);

FormBuilder.propTypes = {
  /***
         * The form config object used to build the form
         */
  config: PropTypes.object.isRequired,

  /***
         * A timestamp of the last time a new config was provided.
         *
         * This is important for letting the form builder know when the config has changed, failure to
         * update the timestamp will result in unexpected results.
         *
         * This is an alternative to performing a deep equality check on `config`, which would affect
         * performance.
         */
  configTimestamp: PropTypes.number.isRequired,

  /***
         * A key-value mapping of custom field types to the components that should render them.
         *
         * See DOCS.md for more details
         *
         * @example
         * {
         *   'my-custom-type': {
         *      component: MyComponentThatImplementsIt,
         *      defaultValue: ''
         *    }
         * }
         */
  registeredComponents: PropTypes.object,

  /***
         * A key-value mapping of custom validation functions.
         *
         * See DOCS.md for more details
         *
         * @example
         * {
         *   'my-custom-validator': ({fieldValue, formValues, options, message="Default message"}) => {
         *      if (... thing is valid) {
         *          return undefined;
         *      } else {
         *          return message;
         *      }
         *   }
         * }
         */
  registeredValidators: PropTypes.object,

  /***
         * A key-value mapping of custom action functions.
   *
   * Actions are called when a field changes, and are referenced by a 'type'.
   *
   * The action function is passed a number of parameters for use in acheiving the action.
         *
         * See DOCS.md for more details
         *
         * @example
         * {
         *   'my-custom-action': ({fieldValue, formValues, action, setFieldValue}) => {
         *      // Do whatever your action required here
   * 		// No return value is expected
         *   }
         * }
         */
  registeredActions: PropTypes.object,

  /***
         * @example
         * {
         *   'my-custom-action': ({fieldValue, formValues, action, setFieldValue}) => {
         *      // Do whatever your action required here
   * 		// No return value is expected
         *   }
         * }
         */
  registeredRuleConditions: PropTypes.object,

  /***
         * A render prop you can use to render your form's buttons (submit, cancel etc.)
         *
         * See DOCS.md for more details
         */
  renderButtons: PropTypes.func,

  /***
         * A render prop you can use to customise the rendering of the error summary.
         *
         * The error summary is passed an array of objects in the following format:
         * {
         *   fieldId: string,
         *   label: node,
         *   errors: Array<node>
         * }
         */
  renderErrorSummary: PropTypes.func,

  /***
         * A render prop you can use to customise the rendering of your form, by default your form is
         * rendered as a simple <form> tag.
         *
         * See DOCS.md for more details
         */
  renderForm: PropTypes.func,

  /***
         * Called on successful (no validation errors) submission with the form values
         *
         * @param {Object} values - The forms values
         */
  onSubmit: PropTypes.func,

  /**
         * Initial values of the form
         *
         * The form config itself can also hold initial values.
         *
         * If values are passed to this prop, the config value will be ignored.
         */
  initialValues: PropTypes.object,
  onActionCallback: PropTypes.func,
  formikRef: PropTypes.func
};
FormBuilder.defaultProps = {
  onSubmit: function onSubmit() {},
  initialValues: undefined,
  renderForm: defaultRenderForm,
  renderErrorSummary: defaultRenderErrorSummary,
  renderButtons: function renderButtons() {},
  registeredComponents: {},
  registeredRuleConditions: {},
  registeredValidators: {},
  registeredActions: {},
  onActionCallback: function onActionCallback() {},
  formikRef: function formikRef() {}
};
export { FormBuilder as default };
//# sourceMappingURL=FormBuilder.js.map