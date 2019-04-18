import { getIn } from 'formik';
import { iterateFields } from './utils';

export const properties = {
	SHOWN: 'shown',
	DISABLED: 'disabled',
	REQUIRED: 'required',
};

const conditionTypes = {
	EQUALITY: 'eq',
	ALL: 'all',
	ANY: 'any',
	NOT: 'not',
};

/**
 * Gets the type (e.g. 'eq', 'all') from a condition object.
 *
 * If no type can be determined, returns undefined
 *
 * @param {Object} condition
 * @returns {String|undefined}
 */
const getConditionType = (condition, customRuleConditions = {}) => {
	if (!condition) {
		return undefined;
	}

	for (const type of Object.values(conditionTypes)) {
		if (condition.hasOwnProperty(type)) {
			return type;
		}
	}

	for (const type of Object.keys(customRuleConditions)) {
		if (condition.hasOwnProperty(type)) {
			return type;
		}
	}

	return undefined;
};

export const isShown = (computedProperties, treePath) => {
	if (!computedProperties || !treePath) {
		return true;
	}

	const fieldProperties = computedProperties[treePath];

	if (fieldProperties && fieldProperties.shown) {
		return true;
	}

	return false;
};

export const getComputedProperties = (computedProperties, treePath) => {
	if (!computedProperties || !treePath) {
		return {};
	}

	return computedProperties[treePath] || {};
};

/**
 * Implements the 'eq' condition.
 *
 * Returns true if any values in `args` match `value`, false otherwise.
 *
 * @param {*} value - The value to compare against
 * @param {Array<*>} args - The values to compare
 *
 * @returns {boolean}
 */
const equal = ({ fieldValue, params }) => {
	return params.values.includes(fieldValue);
};

class RulesParser {
	constructor(config, pathsToTreeMap, formValues, registeredRuleCondtions) {
		this.config = config;
		this.pathsToTreeMap = pathsToTreeMap;
		this.formValues = formValues;
		this.registeredRuleCondtions = {
			[conditionTypes.EQUALITY]: equal,
			...registeredRuleCondtions,
		};
	}

	parseRules() {
		const shown = {};
		const computed = {};
		let lastHiddenParent = null;

		for (const { fieldConfig, treePath } of iterateFields(this.config)) {
			let isShown;
			let parentWasHidden;

			if (lastHiddenParent && treePath.startsWith(lastHiddenParent)) {
				isShown = false;
				parentWasHidden = true;
			} else {
				isShown = this.computeShown(fieldConfig, shown);
			}

			shown[fieldConfig.path] = isShown;

			if (!parentWasHidden && !isShown) {
				lastHiddenParent = treePath;
			}

			computed[treePath] = {
				shown: isShown,
			};
		}

		// After the shown property is resolved for all fields, other properties can be computed
		for (const { fieldConfig, treePath } of iterateFields(this.config)) {
			computed[treePath] = {
				...(computed[treePath] || {}),
				disabled: this.computeProperty(properties.DISABLED, !!fieldConfig.disabled, fieldConfig, shown),
				required: this.computeProperty(properties.REQUIRED, !!fieldConfig.required, fieldConfig, shown),
			};
		}

		return computed;
	}

	computeShown(fieldConfig, partialShownMap) {
		const shownRule = (fieldConfig.rules || []).find(rule => rule.property === properties.SHOWN);

		if (!shownRule) {
			return true;
		}

		const dependencies = new Set();
		// This will add any dependencies to the dependencies set, need to make this functional
		this.getConditionDependencies(shownRule.when, dependencies);

		dependencies.forEach(dependencyPath => {
			const dependencyFields = this.pathsToTreeMap[dependencyPath];

			// If we know there's a field with this path already shown, there's no need for extra calculations
			if (dependencyFields && !partialShownMap[dependencyPath]) {
				const isShown = dependencyFields.reduce((acc, field) => {
					const dependencyConfig = field.fieldConfig;
					return acc || this.computeShown(dependencyConfig, partialShownMap);
				}, false);

				partialShownMap[dependencyPath] = isShown;
			}
		});

		return this.parseCondition(shownRule.when, partialShownMap);
	}

	computeProperty(property, defaultValue, fieldConfig, shownMap) {
		const rule = (fieldConfig.rules || []).find(rule => rule.property === property);

		if (!rule) {
			return defaultValue;
		}

		return this.parseCondition(rule.when, shownMap);
	}

	/**
	* TODO make this functional
	*
	* Recursively find the dependencies of a condition.
	*
	* In this context, a field is a dependency of a condition if the field's path is referenced in the condition.
	*
	* @param {Object} condition - the condition
	* @param {Object} found - The partial list of dependencies found so far
	*/
	getConditionDependencies(condition, found) {
		const type = getConditionType(condition, this.registeredRuleCondtions);

		switch (type) {
			case conditionTypes.ALL:
			case conditionTypes.ANY:
				const args = condition[type];
				(args || []).forEach(arg => {
					this.getConditionDependencies(arg, found);
				});
				break;
			case conditionTypes.NOT:
				const arg = condition[type];
				this.getConditionDependencies(arg, found);
				break;
			default:
				const params = condition[type];

				if (params && params.fieldPath) {
					found.add(params.fieldPath);
				}

				break;
		}
	}

	/**
	 * Takes a condition object, evaluates the condition against the current form values and returns a
	 * boolean value.
	 *
	 * If a field is hidden, checking equality with that field should always return false. For this
	 * reason, any field that is referenced in a condition must be evaluated first.
	 *
	 * @param {Object} condition - the condition to evaluate
	 * @param {Object} formValues - The current values of the form
	 * @param {Object} shownMap - The current visibility of fields in the form
	 *
	 * @returns {boolean}
	 */
	parseCondition(condition, shownMap) {
		if (typeof condition === 'boolean') {
			return condition;
		}

		const type = getConditionType(condition, this.registeredRuleCondtions);

		switch (type) {
			case conditionTypes.ALL:
				return this.all(shownMap)(...condition[conditionTypes.ALL]);
			case conditionTypes.ANY:
				return this.any(shownMap)(...condition[conditionTypes.ANY]);
			case conditionTypes.NOT:
				return this.not(shownMap)(condition[conditionTypes.NOT]);
			default: {
				const params = condition[type];

				if (!type || !params) {
					return false;
				}

				let fieldValue;
				let isFieldShown = true;

				// IF PATH CORRESPONDS TO A FIELD IN THIS FORM:
				// 		Continue normally
				// IF PATH IS NOT IN FORM:
				// 		Get that value from 'context', value is undefined if not found
				if (this.pathsToTreeMap[params.fieldPath]) {
					if (typeof params.fieldPath !== 'undefined') {
						fieldValue = getIn(this.formValues, params.fieldPath);
					}

					if (shownMap && !shownMap[params.fieldPath]) {
						fieldValue = undefined;
						isFieldShown = false;
					}
				} else {
					fieldValue = getIn(this.config.context, params.fieldPath);
				}

				const conditionFn = this.registeredRuleCondtions[type];

				if (conditionFn) {
					return conditionFn({
						fieldValue,
						isFieldShown,
						params,
					});
				}

				return false;
			}
		}
	}

	/**
	 * Implements the 'all' condition.
	 *
	 * Returns a function that evaluates each condition and returns true if all provided conditions evalute to true.
	 *
	 * @param {Object} formValues - The current values of the form
	 * @param {Object} shownMap - The current visibility of fields in the form
	 *
	 * @returns {function} - Takes n conditions and returns a boolean
	 */
	all(shownMap) {
		return (...conditions) => {
			return conditions.reduce((acc, currentCondition) => {
				return acc && this.parseCondition(currentCondition, shownMap); // eslint-disable-line no-use-before-define
			}, true);
		};
	}

	/**
	 * Implements the 'any' condition.
	 *
	 * Returns a function that evaluates each condition and returns true if at least one of the provided conditions evalutes to true.
	 *
	 * @param {Object} formValues - The current values of the form
	 * @param {Object} shownMap - The current visibility of fields in the form
	 *
	 * @returns {function} - Takes n conditions and returns a boolean
	 */
	any(shownMap) {
		return (...conditions) => {
			return conditions.reduce((acc, currentCondition) => {
				return acc || this.parseCondition(currentCondition, shownMap); // eslint-disable-line no-use-before-define
			}, false);
		};
	}

	/**
	 * Implements the 'not' condition.
	 *
	 * Returns a function that evaluates to the negation of the provided condition.
	 *
	 * @param {Object} formValues - The current values of the form
	 * @param {Object} shownMap - The current visibility of fields in the form
	 *
	 * @returns {function} - Takes a condition and returns a boolean
	 */
	not(shownMap) {
		return condition => {
			return !this.parseCondition(condition, shownMap); // eslint-disable-line no-use-before-define
		};
	}
}


export const parseRules = (config, pathsToTreeMap, formValues, registeredRuleCondtions) => {
	const parser = new RulesParser(config, pathsToTreeMap, formValues, registeredRuleCondtions);
	return parser.parseRules();
};
