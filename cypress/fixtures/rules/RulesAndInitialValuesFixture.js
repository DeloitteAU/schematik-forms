import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	initialValues: {
		radio: {
			one: 'yes',
			two: 'no',
		},
		text: {
			one: 'initial 1',
			two: 'initial 2',
		},
	},
	fields: [
		{
			id: '1',
			path: 'radio.one',
			type: 'dummy-radio',
			data: {
				label: 'radio.one',
			},
		},
		{
			id: '2',
			path: 'radio.two',
			type: 'dummy-radio',
			data: {
				label: 'radio.two',
			},
		},
		{
			id: '3',
			path: 'text.one',
			type: 'dummy-input',
			required: true,
			data: {
				label: 'text.one',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'radio.one',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 't4',
			path: 'text.two',
			type: 'dummy-input',
			required: true,
			data: {
				label: 'text.one',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'radio.two',
							values: ['yes'],
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

window.handleSubmitFn = values => { };

export default class RulesAndInitialValuesFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
