import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	context: {
		valueOne: 'yes',
		valueTwo: 'yes',
		valueThree: 'test',
		nonFormValue: 'hello world',
	},
	fields: [
		{
			id: 'input1',
			path: 'valueOne',
			type: 'dummy-radio',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'input2',
			path: 'valueTwo',
			type: 'dummy-radio',
			data: {
				label: 'Dummy input #2',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'valueOne',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'input3',
			path: 'valueThree',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #3',
			},
			rules: [
				{
					property: 'shown',
					when: {
						all: [
							{
								eq: {
									fieldPath: 'valueTwo',
									values: ['yes'],
								},
							},
							{
								eq: {
									fieldPath: 'nonFormValue',
									values: ['hello world'],
								},
							},
						],
					},
				},
			],
		},
		{
			id: 'input4',
			path: 'valueFour',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #4',
			},
			rules: [
				{
					property: 'shown',
					when: {
						all: [
							{
								eq: {
									fieldPath: 'valueTwo',
									values: ['yes'],
								},
								eq: {
									fieldPath: 'nonFormValue',
									values: ['hello'],
								},
							},
						],
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
