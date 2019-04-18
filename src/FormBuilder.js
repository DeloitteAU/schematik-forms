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

export default class FormBuilder extends React.Component {
	static propTypes = {
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

		formikRef: PropTypes.func,
	};

	static defaultProps = {
		onSubmit: () => {},
		initialValues: undefined,
		renderForm: defaultRenderForm,
		renderErrorSummary: defaultRenderErrorSummary,
		renderButtons: () => {},
		registeredComponents: {},
		registeredRuleConditions: {},
		registeredValidators: {},
		registeredActions: {},
		onActionCallback: () => {},
		formikRef: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			externalErrors: this.getInitialErrors(),
		};

		this.formCallbackRef = this.formCallbackRef.bind(this);

		this.formikRef = null;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.configTimestamp !== this.props.configTimestamp) {
			this.formikRef.setValues(this.getInitialValues());

			/* eslint-disable-next-line react/no-did-update-set-state */
			this.setState({
				externalErrors: this.getInitialErrors(),
			});
		}
	}

	clearAllExternalErrors() {
		this.setState({
			externalErrors: {},
		});
	}

	getInitialValues() {
		const initial = this.props.initialValues ? this.props.initialValues : this.props.config.initialValues;

		return {
			...getDefaultValues(this.props.config, this.props.registeredComponents),
			...initial,
		};
	}

	getInitialErrors() {
		return (this.props.config && this.props.config.initialErrors) || {};
	}

	runAction = (action, fieldValue, formValues) => {
		const setFieldValue = (path, val) => {
			this.formikRef.setFieldValue(path, val, false);
		};

		const triggerCallback = (...params) => {
			this.props.onActionCallback(...params, formValues);
		};

		const availableActions = {
			...this.props.registeredActions,
		};

		if (action.when && action.when.eq && action.when.eq !== fieldValue) {
			return;
		}

		if (availableActions.hasOwnProperty(action.type)) {
			availableActions[action.type]({
				action,
				formValues,
				fieldValue,
				setFieldValue,
				triggerCallback,
				submitForm: () => {
					this.formikRef.submitForm();
				},
			});
		}
	}

	formCallbackRef(node) {
		this.formikRef = node;
		this.props.formikRef(node);
	}

	render() {
		const {
			config,
			configTimestamp,
			registeredComponents,
			registeredActions,
			registeredRuleConditions,
			registeredValidators,
			renderForm,
			renderButtons,
			renderErrorSummary,
		} = this.props;

		// Don't render anything if no config is provided.
		if (!config) {
			return null;
		}

		if (config.version !== JSON_SPEC_VERSION) {
			throw new Error(`JSON forms spec version mismatch. Was: ${config.version}, expected: ${JSON_SPEC_VERSION}`);
		}

		const pathsToTreeMap = mapPathsToTree(config);

		return (
			<Formik
				ref={this.formCallbackRef}
				validateOnBlur
				validateOnChange
				enableReinitialize={false}
				onSubmit={values => {
					const computed = parseRules(config, pathsToTreeMap, values, registeredRuleConditions);

					const filteredValues = filterFormValues(values, config, computed, pathsToTreeMap);

					this.props.onSubmit(filteredValues);
				}}
				initialValues={this.getInitialValues()}
				validate={values => {
					const computed = parseRules(config, pathsToTreeMap, values, registeredRuleConditions);

					return validateForm(config, registeredValidators, values, computed, registeredComponents);
				}}
				render={formikProps => {
					const computed = parseRules(config, pathsToTreeMap, formikProps.values, registeredRuleConditions);

					// Start a recursive loop through each field in the config
					const fields = (config.fields || []).map(field => {
						const fieldComputedProperties = getComputedProperties(computed, field.id);

						// Don't render if not shown :)
						if (!fieldComputedProperties.shown) {
							return null;
						}

						return (
							<FormBuilderField
								key={field.id}
								formId={config.id}
								formik={formikProps}
								config={field}
								configTimestamp={configTimestamp}
								path={field.path}
								treePath={field.id}
								computed={computed}
								context={config.context}
								registeredComponents={registeredComponents}
								registeredRuleConditions={registeredRuleConditions}
								registeredActions={registeredActions}
								clearExternalError={errorPath => {
									this.setState(prevState => ({
										externalErrors: setIn(prevState.externalErrors, errorPath, undefined),
									}));
								}}
								externalErrors={this.state.externalErrors}
								pathsToTreeMap={pathsToTreeMap}
								onTriggerCallback={this.props.onActionCallback}
								runAction={this.runAction}
							/>
						);
					});

					// TODO pass correct props to renderButtons()
					const buttons = renderButtons();

					const errorSummaryData = getErrorSummaryData(config, formikProps.errors, this.state.externalErrors, computed);
					const errorSummary = renderErrorSummary({
						summaryData: errorSummaryData,
						submitCount: formikProps.submitCount,
						isValidating: formikProps.isValidating,
					});

					return renderForm({
						children: fields,
						buttons: buttons,
						errorSummary: errorSummary,
						// TODO: form error summary might go in here
						handleSubmit: event => {
							this.clearAllExternalErrors();
							formikProps.handleSubmit(event);
						},
						runAction: action => {
							this.runAction(action, undefined, formikProps.values);
						},
						formValues: formikProps.values,
					});
				}}
			/>
		);
	}
}
