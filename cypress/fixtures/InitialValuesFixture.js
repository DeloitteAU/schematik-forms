import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	initialValues: {
		second: 'test',
		group: {
			subgroup: {
				first: 'nesting',
				third: 'more nesting',
			},
		},
	},
	fields: [
		{
			id: '1',
			path: 'group.subgroup.first',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: '2',
			path: 'second',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #3',
			},
		},
		{
			id: '3',
			type: 'dummy-section',
			data: {
				title: 'Dummy section #1',
			},
			fields: [
				{
					id: '4',
					path: 'group.subgroup.third',
					type: 'dummy-input',
					data: {
						label: 'Dummy input #3',
					},
				},
			],
		},
	],
};

const DummySection = ({config, children}) => (
	<fieldset id={config.id} className="dummy-section">
		<legend>{config.data.title}</legend>
		{children}
	</fieldset>
);

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

export default class InitialValuesFixture extends React.Component {
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
