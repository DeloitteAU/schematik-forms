import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';
import renderErrorSummary from './setup/dummyRenderErrorSummary';

const config = {
	version: 0,
	id: 'testForm',
	initialErrors: {
		group: {
			first: ['External error 1'],
			second: 'External error 2',
		},
	},
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
			id: 'section',
			type: 'dummy-section',
			data: {
				title: 'Section',
			},
			fields: [
				{
					id: 'input2',
					path: 'group.second',
					type: 'dummy-input',
					required: true,
					requiredMessage: 'Custom required message',
					errorSummaryLabel: 'Custom error summary label',
					data: {
						label: 'Dummy input #2',
					},
				},
			],
		},
		{
			id: 'input3',
			path: 'third',
			type: 'dummy-input',
			required: true,
			requiredMessage: 'Custom required message',
			data: {
				label: 'Dummy input #3',
			},
		},
	],
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
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
				renderErrorSummary={renderErrorSummary}
			/>
		);
	}
}
