import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { getIn, setIn } from 'formik';
import { getComponent } from '../utils';
import { getComputedProperties } from '../rules';
import { renderFieldError, renderChildError } from '../errors';
import renderTextNode from '../renderTextNode';
import OptimiseField from './OptimiseField';

export default class FormBuilderField extends React.Component {
	static propTypes = {
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
	};

	static defaultProps = {
		path: undefined,
	};

	constructor(props) {
		super(props);

		this.state = {
			value: getIn(props.formik.values, props.path),
		};
	}

	componentDidMount() {
		this.props.formik.setFieldTouched(this.props.path, false, false);
	}

	componentDidUpdate(prevProps) {
		const nextFieldValue = getIn(this.props.formik.values, this.props.path);
		const prevFieldValue = getIn(prevProps.formik.values, prevProps.path);

		if (!isEqual(nextFieldValue, prevFieldValue)) {
			this.setState({ value: nextFieldValue }); // eslint-disable-line react/no-did-update-set-state
		}
	}

	componentWillUnmount() {
		// When a field unmounts (usually because of a show/hide rule), we need to clear it's value.
		this._checkAndClearValue();
	}

	_checkAndClearValue() {
		// Here we are getting every field that has the same path as this field.
		const fields = this.props.pathsToTreeMap[this.props.path];

		// Before we remove this fields value, we first need to check if there are any other fields with the
		// same path still visible. If there is another field visible, we don't want to remove the value.
		const isPathShown = (fields || []).reduce((acc, field) => {
			// Don't check this field
			if (field.treePath === this.props.treePath) {
				return acc;
			}

			const fieldComputedProperties = getComputedProperties(this.props.computed, field.treePath);

			return acc || fieldComputedProperties.shown;
		}, false);


		// If we are safe to remove the value: set the field as untouched and reset back
		// to the fields defaultValue.
		if (!isPathShown) {
			let defaultValue

			if (typeof this.props.config.defaultValue !== 'undefined') {
				defaultValue = this.props.config.defaultValue;
			} else {
				defaultValue = this.props.registeredComponents[this.props.config.type].defaultValue;
			}

			const currentValue = this.state.value;

			this.props.formik.setFieldTouched(this.props.path, false, false);

			if (!this.props.config.retainValue && currentValue !== defaultValue) {
				this.props.formik.setFieldValue(this.props.path, defaultValue, false);
			}
		}
	}

	runActions = value => {
		// Unfortunately this action happens before Formik updates the state of the form.
		// In order to ensure that the all values are sent with this request, we manually add
		// the field value of the changed field.
		const formValues = setIn(this.props.formik.values, this.props.config.path, value);

		(this.props.config.actions || []).forEach(action => {
			this.props.runAction(action, value, formValues);
		});
	}

	render() {
		const {
			formId,
			treePath,
			path,
			config,
			configTimestamp,
			context,
			registeredComponents,
			registeredRuleConditions,
			onTriggerCallback,
			registeredActions,
			computed,
			formik,
			externalErrors,
			clearExternalError,
			pathsToTreeMap,
		} = this.props;

		const Component = getComponent(registeredComponents, config.type);

		if (!Component) {
			throw new Error(`FormBuilderField: Could not find component of type "${config.type}".`);
		}

		if (!formId) {
			throw new Error('FormBuilderField: "config.id" is a required prop.');
		}

		const fieldComputedProperties = getComputedProperties(computed, treePath);

		const fieldTouched = !!getIn(formik.touched, path); // Ensure this is a boolean to keep prop-type warnings away
		const fieldErrors = path ? getIn(formik.errors, path) : undefined;
		let fieldExternalErrors = path ? getIn(externalErrors, path) : undefined;

		if (typeof fieldExternalErrors === 'string') {
			fieldExternalErrors = [fieldExternalErrors];
		}

		const dependsOnOtherFields = this.props.registeredComponents[this.props.config.type].dependsOnOtherFields

		const shouldOptimise = !dependsOnOtherFields && (!config || !config.fields || !config.fields.length);

		return (
			<OptimiseField
				shouldOptimise={shouldOptimise}
				configTimestamp={configTimestamp}
				value={this.state.value}
				fieldErrors={fieldErrors}
				fieldExternalErrors={fieldExternalErrors}
				touched={fieldTouched}
				computed={fieldComputedProperties}
			>
				<Component
					path={path}
					htmlId={`${formId}.${treePath}`}
					config={config}
					runActions={this.runActions}
					handleChange={(value, triggersTouched = true) => {
						clearExternalError(path);
						this.runActions(value);

						if (triggersTouched) {
							formik.setFieldTouched(path, true, false);
						}

						formik.setFieldValue(path, value, true);
					}}
					handleBlur={(/* e */) => {
						clearExternalError(path);
						formik.setFieldTouched(path, true, true);
					}}
					handleChangeFast={value => {
						this.setState({
							value: value,
						});
					}}
					handleBlurFast={(/* e */) => {
						clearExternalError(path);
						this.runActions(this.state.value);
						formik.setFieldValue(path, this.state.value, false);
						formik.setFieldTouched(path, true, true);
					}}
					handleKeyPressFast={event => {
						if (event.key === 'Enter') {
							formik.setFieldValue(path, this.state.value, false);
						}
					}}
					computed={fieldComputedProperties}
					value={this.state.value}
					errors={fieldErrors}
					externalErrors={fieldExternalErrors}
					touched={fieldTouched}
					getDisplayError={() => {
						return renderFieldError(fieldErrors, fieldExternalErrors, fieldTouched);
					}}
					getChildError={childName => {
						return renderChildError(childName, fieldErrors, fieldExternalErrors, fieldTouched);
					}}
					renderTextNode={(node, wrappingTag) => renderTextNode(node, wrappingTag, context)}
					setValues={formik.setValues}
					formValues={formik.values}
				>
					{(config.fields || []).map(nestedField => {
						const nestedFieldTreePath = `${treePath}.${nestedField.id}`;
						const nestedFieldComputedProperties = getComputedProperties(computed, nestedFieldTreePath);

						// Don't render if not shown :)
						if (!nestedFieldComputedProperties.shown) {
							return null;
						}

						return (
							<FormBuilderField
								key={nestedField.id}
								context={context}
								formId={formId}
								formik={formik}
								config={nestedField}
								configTimestamp={configTimestamp}
								path={nestedField.path}
								treePath={nestedFieldTreePath}
								computed={computed}
								registeredActions={registeredActions}
								registeredComponents={registeredComponents}
								registeredRuleConditions={registeredRuleConditions}
								externalErrors={externalErrors}
								clearExternalError={clearExternalError}
								pathsToTreeMap={pathsToTreeMap}
								onTriggerCallback={onTriggerCallback}
								runAction={this.props.runAction}
							/>
						);
					})}
				</Component>
			</OptimiseField>
		);
	}
}
