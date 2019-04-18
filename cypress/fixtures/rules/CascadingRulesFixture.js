import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'r1',
			path: 'radio.one',
			type: 'dummy-radio',
			data: {
				label: 'Q1',
			},
		},
		{
			id: 'r2',
			path: 'radio.two',
			type: 'dummy-radio',
			data: {
				label: 'Q2',
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
			id: 'r3',
			path: 'radio.three',
			type: 'dummy-radio',
			data: {
				label: 'Q3',
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
		{
			id: 'input',
			path: 'input',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #2',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'radio.three',
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

window.handleSubmitFn = values => {};

export default class BasicRenderingFixture extends React.Component {
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
