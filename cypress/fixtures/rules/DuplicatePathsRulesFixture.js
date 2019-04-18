import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'p0',
			type: 'dummy-radio',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'input2a',
			path: 'p1',
			type: 'dummy-input',
			retainValue: true,
			data: {
				label: 'Dummy input #2a (show when yes)',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'p0',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'input2b',
			path: 'p1',
			type: 'dummy-input',
			retainValue: true,
			data: {
				label: 'Dummy input #2b (show when no)',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'p0',
							values: ['no'],
						},
					},
				},
			],
		},
		{
			id: 'input3',
			path: 'p3',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #3',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'p1',
							values: ['test'],
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
