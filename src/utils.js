import cloneDeep from 'lodash.clonedeep';
import {setIn} from 'formik';
import unset from 'lodash.unset';
import {getComputedProperties} from './rules';

export const getComponent = (registeredComponents, componentName) => {
	if (!registeredComponents || !registeredComponents[componentName] || !registeredComponents[componentName].component) {
		console.warn(`SchematikForms: No component of type '${componentName}' is registered`);
		return undefined;
	}

	return registeredComponents[componentName].component;
};

export const getValidator = (registeredValidators, validatorName) => {
	if (!registeredValidators || !registeredValidators[validatorName]) {
		console.warn(`SchematikForms: No validator of type '${validatorName}' is registered`);
		return undefined;
	}

	return registeredValidators[validatorName];
};

const _iterateFieldsAux = function* (config, partialTreePath = '') {
	if (!config || !config.fields) {
		return;
	}

	for (const fieldConfig of config.fields) {
		const treePath = partialTreePath ? `${partialTreePath}.${fieldConfig.id}` : fieldConfig.id;

		yield{
			treePath: treePath,
			fieldConfig: fieldConfig,
		};

		yield* _iterateFieldsAux(fieldConfig, treePath);
	}
};

/**
 * Creates an iterator which loops over each field in the form config.
 *
 * Nested fields will be iterated over depth first.
 *
 * @param {object} config
 */
export const iterateFields = function* (config) {
	// Use a private auxilary function to hide implementation detail, user shouldn't have
	// to worry about specifying the path in the tree.
	yield* _iterateFieldsAux(config, '');
};

/**
 * Create a map of paths to 'treePaths'
 *
 * @param {*} config
 */
export const mapPathsToTree = config => {
	const mapping = {};

	for (const {fieldConfig, treePath} of iterateFields(config)) {
		mapping[fieldConfig.path] = mapping[fieldConfig.path] || [];

		mapping[fieldConfig.path].push({fieldConfig, treePath});
	}

	return mapping;
};

/**
 * Filter out values from fields that are disabled or have the doNotSubmit flag
 *
 * @param {*} values - form values
 * @param {*} computed - map of computed properties
 */
export const filterFormValues = (values, config, computed, pathsToTreeMap) => {
	const valuesClone = cloneDeep(values);

	for (const {treePath, fieldConfig} of iterateFields(config)) {
		let shouldFilter = fieldConfig.doNotSubmit || computed[treePath].disabled;

		if (shouldFilter) {
			const fieldsWithThisPath = pathsToTreeMap[fieldConfig.path];

			shouldFilter = (fieldsWithThisPath || []).reduce((acc, field) => {
				// Don't check this field
				if (field.treePath === treePath) {
					return acc;
				}

				const fieldComputedProperties = getComputedProperties(computed, field.treePath);

				return acc && (field.fieldConfig.doNotSubmit || fieldComputedProperties.disabled);
			}, true);
		}

		if (shouldFilter) {
			unset(valuesClone, fieldConfig.path);
		}
	}

	return valuesClone;
};

export const getDefaultValues = (config, registeredComponents) => {
	let defaultValues = {};

	for (const {fieldConfig} of iterateFields(config)) {
		const type = fieldConfig.type;
		const path = fieldConfig.path;

		if (!path) {
			continue;
		}

		let defaultVal = undefined;

		if (registeredComponents[type] && typeof registeredComponents[type].defaultValue !== 'undefined') {
			defaultVal = registeredComponents[type].defaultValue;
		}

		if (fieldConfig && typeof fieldConfig.defaultValue !== 'undefined') {
			defaultVal = fieldConfig.defaultValue;
		}

		defaultValues = setIn(defaultValues, path, defaultVal);
	}

	return defaultValues;
};
