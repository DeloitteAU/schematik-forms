import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';
import registeredValidators from '../setup/registeredValidators';

const config = {
	version: 0,
	id: 'testForm',
	initialErrors: {
		person1: [
			{
				message: 'Field level server error',
				children: [
					{
						name: 'given',
						message: 'Given name server error',
						summaryLabel: 'Person 1 - Given name',
					},
					{
						name: 'family',
						message: 'Family name server error',
						summaryLabel: 'Person 1 - Family name',
					},
				],
			},
		],
	},
	fields: [
		{
			id: 'person1',
			path: 'person1',
			type: 'dummy-grouped-input',
			data: {
				label: 'Person 2',
			},
		},
		{
			id: 'person2',
			path: 'person2',
			type: 'dummy-grouped-input',
			data: {
				label: 'Person 2',
			},
			validators: [
				{
					type: 'nameIsNotJohnSmith',
					message: 'Name error',
					options: {
						max: 10,
					},
				},
			],
		},
	],
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => {
	console.log(values);
};

export default class ChildValidationFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredValidators={registeredValidators}
				onSubmit={values => {
					console.log(values);
				}}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
