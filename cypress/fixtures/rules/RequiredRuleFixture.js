import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'group.first',
			type: 'dummy-radio',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'input2',
			path: 'group.second',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #2',
			},
			rules: [
				{
					property: 'required',
					when: {
						eq: {
							fieldPath: 'group.first',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'alwaysRequired',
			path: 'alwaysRequired',
			type: 'dummy-input',
			required: true,
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'alwaysNotRequired',
			path: 'alwaysNotRequired',
			type: 'dummy-input',
			required: false,
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'order1',
			path: 'order.one',
			type: 'dummy-input',
			data: {
				label: 'Order test #1',
			},
			rules: [
				{
					property: 'required',
					when: {
						eq: {
							fieldPath: 'order.two',
							values: ['no'],
						},
					},
				},
			],
		},
		{
			id: 'order2',
			path: 'order.two',
			type: 'dummy-radio',
			data: {
				label: 'Order test #2',
			},
		},
	],
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => {};

export default class RequiredRuleFixture extends React.Component {
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
