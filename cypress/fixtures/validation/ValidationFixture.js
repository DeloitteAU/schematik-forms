import React from 'react';
import {getIn} from 'formik';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';
import registeredValidators from '../setup/registeredValidators';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'group.first',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #1',
			},
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
			data: {
				label: 'Dummy input #2',
			},
		},
		{
			id: 'section1',
			type: 'dummy-section',
			data: {
				title: 'Section 1',
			},
			fields: [
				{
					id: 'section2',
					type: 'dummy-section',
					data: {
						title: 'Section 2',
					},
					fields: [
						{
							id: 'input3',
							path: 'nested.again.second',
							type: 'dummy-input',
							data: {
								label: 'Dummy input #3',
							},
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
					id: 'input4',
					path: 'nested.first',
					type: 'dummy-input',
					data: {
						label: 'Dummy input #4',
					},
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
			id: 'input4',
			path: 'third',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #4',
			},
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
			id: 'input5',
			path: 'fourth',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #5',
			},
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
		{
			id: 'input6',
			path: 'sixth',
			type: 'dummy-input',
			required: true,
			data: {
				label: 'Dummy input #6',
			},
		},
	],
};

const validators = {
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
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => {};

export default class ValidationFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredValidators={registeredValidators}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
