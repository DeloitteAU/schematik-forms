import { getIn } from 'formik';
import { validateForm, defaultRequiredFn, REQUIRED_VALIDATOR_KEY } from '../src/validation';

const basicFormConfig = Object.freeze({
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'group.first',
			type: 'dummy-input',
			validators: [
				{
					type: 'stringMax',
					message: 'Value must be less than 10 characters long',
					options: {
						max: 10,
					},
				},
			],
		},
		{
			id: 'input2',
			path: 'group.second',
			type: 'dummy-input',
		},
		{
			id: 'section1',
			type: 'dummy-section',
			fields: [
				{
					id: 'section2',
					type: 'dummy-section',
					fields: [
						{
							id: 'input2',
							path: 'nested.again.second',
							type: 'dummy-input',
							validators: [
								{
									type: 'noNumbers',
									message: 'Shouldn\'t contain numbers',
								},
							],
						},
					],
				},
				{
					id: 'input2',
					path: 'nested.first',
					type: 'dummy-input',
					validators: [
						{
							type: 'matchesOtherField',
							message: 'Doesn\'t match other field',
							options: {
								fieldPath: 'nested.again.second',
							},
						},
					],
				},
			],
		},
		{
			id: 'input3',
			path: 'third',
			type: 'dummy-input',
			validators: [
				{
					type: 'matchesOtherField',
					message: 'Doesn\'t match other field',
					options: {
						fieldPath: 'group.second',
					},
				},
			],
		},
		{
			id: 'input4',
			path: 'fourth',
			type: 'dummy-input',
			validators: [
				{
					type: 'stringMax',
					message: 'Value must be less than 10 characters long',
					options: {
						max: 10,
					},
				},
				{
					type: 'noNumbers',
					message: 'Value must not contain numbers',
				},
			],
		},
	],
});

const dummyComputed = {
	'input1': { shown: true, },
	'input2': { shown: true, },
	'section1': { shown: true, },
	'section1.section2': { shown: true, },
	'section1.section2.input2': { shown: true, },
	'section1.input2': { shown: true, },
	'input3': { shown: true, },
	'input4': { shown: true, },
}

describe('validateForm()', () => {
	let registeredValidators;

	beforeEach(() => {
		registeredValidators = {
			noNumbers: ({ fieldValue, formValues, message, options }) => {
				if (!fieldValue) {
					return undefined;
				}

				if (/\d/.test(fieldValue)) {
					return message;
				}

				return undefined;
			},
			stringMax: ({ fieldValue, formValues, message, options }) => {
				if (!fieldValue) {
					return undefined;
				}

				if (fieldValue.length > options.max) {
					return message;
				}

				return undefined;
			},
			matchesOtherField: ({ fieldValue, formValues, message, options }) => {
				if (!fieldValue) {
					return undefined;
				}

				const otherFieldValue = getIn(formValues, options.fieldPath);

				if (fieldValue !== otherFieldValue) {
					return message;
				}

				return undefined;
			},
			[REQUIRED_VALIDATOR_KEY]: ({ fieldValue, formValues, message = 'Default required message' }) => {
				if (!fieldValue) {
					return message;
				}

				return undefined;
			},
		};
	});

	it('should return an empty object if the form is valid', () => {
		const values = {};

		const errors = validateForm(basicFormConfig, registeredValidators, values);

		expect(errors).toEqual({});
	});

	it('should return an object with errors if the form is not valid', () => {
		const values = {
			group: {
				first: 'Text that is more than ten characters long',
			},
		};

		const errors = validateForm(basicFormConfig, registeredValidators, values, dummyComputed);

		expect(errors).toEqual({
			group: {
				first: ['Value must be less than 10 characters long'],
			},
		});
	});

	it('validators can reference other fields', () => {
		const invalidValues = {
			group: {
				second: 'value to match',
			},
			third: 'asd',
		};

		expect(validateForm(basicFormConfig, registeredValidators, invalidValues, dummyComputed)).toEqual({
			third: ['Doesn\'t match other field'],
		});

		const validValues = {
			group: {
				second: 'value to match',
			},
		};

		expect(validateForm(basicFormConfig, registeredValidators, validValues, dummyComputed)).toEqual({});
	});

	describe('multiple validators are handled correctly', () => {
		it('when the values satisfy all validators on a field', () => {
			const validValues = {
				fourth: 'abcdefg',
			};

			expect(validateForm(basicFormConfig, registeredValidators, validValues, dummyComputed)).toEqual({});
		});

		it('when the values satisfy only one of the validators on a field', () => {
			const validValues = {
				fourth: 'ab3d',
			};

			expect(validateForm(basicFormConfig, registeredValidators, validValues, dummyComputed)).toEqual({
				fourth: [
					'Value must not contain numbers',
				],
			});
		});

		it('when the values satisfy none of the validators on a field', () => {
			const validValues = {
				fourth: 'ab3defghijklmno',
			};

			expect(validateForm(basicFormConfig, registeredValidators, validValues, dummyComputed)).toEqual({
				fourth: [
					'Value must be less than 10 characters long',
					'Value must not contain numbers',
				],
			});
		});
	});

	it('validation functions are called with the correct parameters', () => {
		const values = {
			first: 'test',
		};

		const mockValidatorConfig = {
			type: 'mock',
			message: 'TEST MESSAGE',
			options: {
				test: 'options',
			},
		};

		const formConfig = {
			version: 0,
			id: 'testForm',
			fields: [
				{
					id: 'input2',
					path: 'first',
					type: 'dummy-input',
					validators: [
						mockValidatorConfig,
					],
				},
			],
		};

		const mockValidatorFn = jest.fn();

		const registeredValidatorsWithMock = {
			...registeredValidators,
			mock: mockValidatorFn,
		};

		expect(mockValidatorFn.mock.calls.length).toBe(0);

		validateForm(formConfig, registeredValidatorsWithMock, values, dummyComputed);

		expect(mockValidatorFn.mock.calls.length).toBe(1);
		expect(mockValidatorFn.mock.calls[0][0].fieldValue).toEqual(values.first);
		expect(mockValidatorFn.mock.calls[0][0].formValues).toEqual(values);
		expect(mockValidatorFn.mock.calls[0][0].message).toEqual(mockValidatorConfig.message);
		expect(mockValidatorFn.mock.calls[0][0].options).toEqual(mockValidatorConfig.options);
	});

	it('nested fields are validated', () => {
		const invalidValues1 = {
			nested: {
				first: 'ab3d',
				again: {
					second: 'ab3de',
				},
			},
		};

		expect(validateForm(basicFormConfig, registeredValidators, invalidValues1, dummyComputed)).toEqual({
			nested: {
				first: ['Doesn\'t match other field'],
				again: {
					second: ['Shouldn\'t contain numbers'],
				},
			},
		});

		const invalidValues2 = {
			nested: {
				first: 'ab3d',
				again: {
					second: 'ab3d',
				},
			},
		};

		expect(validateForm(basicFormConfig, registeredValidators, invalidValues2, dummyComputed)).toEqual({
			nested: {
				again: {
					second: ['Shouldn\'t contain numbers'],
				},
			},
		});

		const validValues = {
			nested: {
				first: 'abcd',
				again: {
					second: 'abcd',
				},
			},
		};

		expect(validateForm(basicFormConfig, registeredValidators, validValues, dummyComputed)).toEqual({
			// empty
		});
	});

	describe('should handle required fields', () => {
		it('when a field is not required', () => {
			const formConfig = {
				version: 0,
				id: 'testForm',
				fields: [
					{
						id: 'input1',
						path: 'first',
						type: 'dummy-input',
					},
					{
						id: 'input2',
						path: 'second',
						type: 'dummy-input',
						required: false,
					},
				],
			};

			expect(validateForm(formConfig, registeredValidators, {}, {input1: {shown: true}, input2: {shown: true}})).toEqual({
				// empty
			});
		});

		it('when a field is required', () => {
			const formConfig = {
				version: 0,
				id: 'testForm',
				fields: [
					{
						id: 'input2',
						path: 'first',
						type: 'dummy-input',
						required: true,
					},
				],
			};

			expect(validateForm(formConfig, registeredValidators, {}, {input2: {shown: true, required: true}})).toEqual({
				first: ['Default required message'],
			});
		});

		it('when a field is required and a requiredMessage is provided', () => {
			const formConfig = {
				version: 0,
				id: 'testForm',
				fields: [
					{
						id: 'input2',
						path: 'first',
						type: 'dummy-input',
						required: true,
						requiredMessage: 'Custom required message',
					},
				],
			};

			expect(validateForm(formConfig, registeredValidators, {}, {input2: {shown: true, required: true}})).toEqual({
				first: ['Custom required message'],
			});
		});

		it('when a field is required and has other validators', () => {
			const formConfig = {
				version: 0,
				id: 'testForm',
				fields: [
					{
						id: 'input2',
						path: 'first',
						type: 'dummy-input',
						required: true,
						requiredMessage: 'Custom required message',
						validators: [
							{
								type: 'stringMax',
								message: 'Value must be less than 10 characters long',
								options: {
									max: 10,
								},
							},
						],
					},
				],
			};

			expect(validateForm(formConfig, registeredValidators, { first: '' }, {input2: {shown: true, required: true}})).toEqual({
				first: ['Custom required message'],
			});

			expect(validateForm(formConfig, registeredValidators, { first: 'long string test' }, {input2: {shown: true, required: true}})).toEqual({
				first: ['Value must be less than 10 characters long'],
			});
		});
	});
});

describe('defaultRequiredFn()', () => {
	it('returns undefined for valid values', () => {
		expect(defaultRequiredFn({
			fieldValue: 'string value',
		})).toBe(undefined);

		expect(defaultRequiredFn({
			fieldValue: '  a',
		})).toBe(undefined);

		expect(defaultRequiredFn({
			fieldValue: ['array with value'],
		})).toBe(undefined);

		expect(defaultRequiredFn({
			fieldValue: {},
		})).toBe(undefined);
	});

	it('returns default message for invalid values', () => {
		const defaultMessage = 'This field is required';

		expect(defaultRequiredFn({
			fieldValue: null,
		})).toBe(defaultMessage);

		expect(defaultRequiredFn({
			fieldValue: undefined,
		})).toBe(defaultMessage);

		expect(defaultRequiredFn({
			fieldValue: '',
		})).toBe(defaultMessage);

		expect(defaultRequiredFn({
			fieldValue: ' ',
		})).toBe(defaultMessage);

		expect(defaultRequiredFn({
			fieldValue: [],
		})).toBe(defaultMessage);
	});

	it('returns custom message for invalid values', () => {
		const customMessage = 'Test custom message';

		expect(defaultRequiredFn({
			fieldValue: null,
			message: customMessage,
		})).toBe(customMessage);

		expect(defaultRequiredFn({
			fieldValue: undefined,
			message: customMessage,
		})).toBe(customMessage);

		expect(defaultRequiredFn({
			fieldValue: '',
			message: customMessage,
		})).toBe(customMessage);

		expect(defaultRequiredFn({
			fieldValue: ' ',
			message: customMessage,
		})).toBe(customMessage);

		expect(defaultRequiredFn({
			fieldValue: [],
			message: customMessage,
		})).toBe(customMessage);
	});
});
