import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input2',
			path: 'number',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'input4',
			path: 'two',
			type: 'dummy-radio',
			data: {
				label: 'Dummy input #1',
			},
			rules: [
				{
					property: 'shown',
					when: {
						gt: {
							fieldPath: 'number',
							value: 50,
						},
					},
				},
			],
		},
	],
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => {};

const registeredRuleConditions = {
	gt: ({fieldValue, params}) => {
		return parseInt(fieldValue) > params.value;
	},
};

export default class BasicRenderingFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredRuleConditions={registeredRuleConditions}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
