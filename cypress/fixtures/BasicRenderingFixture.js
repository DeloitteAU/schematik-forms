import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';


const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input1',
			path: 'group.first',
			type: 'dummy-input',
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
		},
		{
			id: 'input3',
			path: 'third',
			type: 'dummy-input',
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
			/>
		);
	}
}
