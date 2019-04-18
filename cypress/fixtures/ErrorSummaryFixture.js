import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';
import renderErrorSummary from './setup/dummyRenderErrorSummary';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'group.first',
			type: 'dummy-input',
			required: true,
			requiredMessage: 'Custom required message',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'input2',
			path: 'group.second',
			type: 'dummy-input',
			required: true,
			errorSummaryLabel: 'Custom error summary label',
			data: {
				label: 'Dummy input #2',
			},
		},
		{
			id: 'input3',
			path: 'third',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #3',
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
	],
};

const validators = {
	stringMax: ({fieldValue, formValues, message, options}) => {
		if (!fieldValue) {
			return undefined;
		}

		if (fieldValue.length > options.max) {
			return message;
		}

		return undefined;
	},
};


const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => {

};

export default class BasicRenderingFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredValidators={validators}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
				renderErrorSummary={renderErrorSummary}
			/>
		);
	}
}
