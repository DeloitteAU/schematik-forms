import {getIn} from 'formik';
import {iterateFields} from './utils';
import renderTextNode from './renderTextNode';
import {getComputedProperties} from './rules';

export const getFieldErrors = (path, internal, external) => {
	let internalErrors = getIn(internal, path) || [];
	let externalErrors = getIn(external, path) || [];

	if (typeof internalErrors === 'string') {
		internalErrors = [internalErrors];
	}

	if (typeof externalErrors === 'string') {
		externalErrors = [externalErrors];
	}

	return [
		...externalErrors,
		...internalErrors,
	];
};

const getErrorSummaryFieldLabel = (fieldConfig, context) => {
	if (fieldConfig.errorSummaryLabel) {
		return fieldConfig.errorSummaryLabel;
	}

	// Attempt to use the field's 'label', this is just a convention.
	if (fieldConfig.data && fieldConfig.data.label) {
		return renderTextNode(fieldConfig.data.label, 'span', context);
	}

	return '';
};

export const getErrorSummaryData = (config, internalErrors, externalErrors, computedProperties) => {
	const errorSummaryData = [];

	for (const {treePath, fieldConfig} of iterateFields(config)) {
		let fieldErrors = null;

		const fieldComputedProperties = getComputedProperties(computedProperties, treePath);

		if (fieldConfig.path && fieldComputedProperties.shown) {
			fieldErrors = getFieldErrors(fieldConfig.path, internalErrors, externalErrors);
		}

		if (fieldErrors && fieldErrors.length) {
			errorSummaryData.push({
				fieldId: `${config.id}.${treePath}`,
				label: getErrorSummaryFieldLabel(fieldConfig, config.context),
				errors: fieldErrors,
			});
		}
	}

	return errorSummaryData;
};

const getFieldErrorToDisplay = (errors, externalErrors, touched) => {
	if (externalErrors && externalErrors.length) {
		return externalErrors[0];
	}

	if (touched && errors && errors.length) {
		return errors[0];
	}

	return undefined;
};


export const renderFieldError = (errors, externalErrors, touched) => {
	const error = getFieldErrorToDisplay(errors, externalErrors, touched);

	if (error && typeof error === 'string') {
		return error;
	}

	if (error && error.message) {
		return error.message;
	}

	return undefined;
};


export const renderChildError = (childName, errors, externalErrors, touched) => {
	const error = getFieldErrorToDisplay(errors, externalErrors, touched);
	let childError;

	if (error && error.children && error.children.length) {
		childError = error.children.find(child => {
			return child.name === childName;
		});
	}

	return childError ? childError.message : undefined;
};
