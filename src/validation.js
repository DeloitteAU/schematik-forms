import {getIn, setIn} from 'formik';
import {getValidator} from './utils';
import {getComputedProperties} from './rules';

export const REQUIRED_VALIDATOR_KEY = 'required';

export const defaultRequiredFn = ({fieldValue, message = 'This field is required', falseCountsAsNoValue}) => {
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

export const makeFieldValidationFunction = (registeredValidators, formValues, computedProperties, registeredComponents = {}) => {
	const validateField = (fieldConfig, partialId = '', partialErrors = {}) => {
		const fieldIsShown = !computedProperties || !partialId || (computedProperties && computedProperties[partialId] && computedProperties[partialId].shown);
		if (!fieldIsShown) {
			return partialErrors;
		}

		const fieldComputedProperties = getComputedProperties(computedProperties, partialId);

		const componentDefinition = registeredComponents[fieldConfig.type] || {};

		// Some component may have boolean values, and some components may wish that `false` be treated as an empty
		// value so that it gets picked up by the required validator
		let falseCountsAsNoValue = false;
		if (typeof componentDefinition.falseCountsAsNoValue === 'boolean') {
			falseCountsAsNoValue = componentDefinition.falseCountsAsNoValue;
		}

		let validators = [];

		if (fieldConfig.validators) {
			validators = [...fieldConfig.validators];
		}

		// A required validator is just a validator, but it's added to the config differently.
		// Here we add a required validator to the top of the existing list of validators.
		// In this way we can treat it the same way as the rest of the validation rules applied
		// to this field.
		if (fieldComputedProperties.required) {
			validators = [
				{
					type: REQUIRED_VALIDATOR_KEY,
					message: fieldConfig.requiredMessage || undefined,
				},
				...validators,
			];
		}

		// Loop through each validator on the field
		const fieldErrors = validators.reduce((errorsAccumulator, validatorConfig) => {
			const validationFn = getValidator(registeredValidators, validatorConfig.type);

			if (typeof validationFn !== 'function') {
				throw Error(`SchematikForms: No validation function found for type '${validatorConfig.type}'`);
			}

			// Call the validation function
			const error = validationFn({
				fieldConfig,
				fieldValue: getIn(formValues, fieldConfig.path),
				formValues,
				message: validatorConfig.message,
				options: validatorConfig.options,
				falseCountsAsNoValue,
			});

			if (error) {
				return [
					...errorsAccumulator,
					error,
				];
			} else {
				return errorsAccumulator;
			}
		}, []);

		let errors = partialErrors;

		// Populate the errors object if there were errors
		if (fieldErrors.length) {
			errors = setIn(errors, fieldConfig.path, fieldErrors);
		}

		if (fieldConfig.fields && fieldConfig.fields.length) {
			for (const field of fieldConfig.fields) {
				const fullId = partialId ? `${partialId}.${field.id}` : field.id;
				errors = validateField(field, fullId, errors);
			}
		}

		return errors;
	};

	return validateField;
};

export const validateForm = (config, registeredValidators, formValues, computedProperties, registeredComponents) => {
	// Add the default required validation function to the custom validation functions.
	// The default will be overridden by a custom 'required' validation function.
	const validationFunctions = {
		[REQUIRED_VALIDATOR_KEY]: defaultRequiredFn,
		...registeredValidators,
	};

	const validateFieldFn = makeFieldValidationFunction(validationFunctions, formValues, computedProperties, registeredComponents);

	return validateFieldFn(config);
};
