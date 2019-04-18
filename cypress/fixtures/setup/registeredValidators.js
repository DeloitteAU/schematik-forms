import {getIn} from 'formik';

export default {
	noNumbers: ({fieldValue, formValues, message, options}) => {
		if (!fieldValue) {
			return undefined;
		}

		if (/\d/.test(fieldValue)) {
			return message;
		}

		return undefined;
	},
	stringMax: ({fieldValue, formValues, message, options}) => {
		if (!fieldValue) {
			return undefined;
		}

		if (fieldValue.length > options.max) {
			return message;
		}

		return undefined;
	},
	matchesOtherField: ({fieldValue, formValues, message, options}) => {
		if (!fieldValue) {
			return undefined;
		}

		const otherFieldValue = getIn(formValues, options.fieldPath);

		if (fieldValue !== otherFieldValue) {
			return message;
		}

		return undefined;
	},
	nameIsNotJohnSmith: ({fieldValue, formValues, message, options}) => {
		const givenNameValid = fieldValue.given !== 'John';
		const familyNameValid = fieldValue.family !== 'Smith';

		if (givenNameValid && familyNameValid) {
			return undefined;
		}

		const error = {
			message: message,
			children: [],
		};

		if (!givenNameValid) {
			error.children.push({
				name: 'given',
				message: 'Given name cannot be John',
				summaryLabel: 'Given name',
			});
		}

		if (!familyNameValid) {
			error.children.push({
				name: 'family',
				message: 'Family name cannot be Smith',
				summaryLabel: 'Family name',
			});
		}

		return error;
	},
};
