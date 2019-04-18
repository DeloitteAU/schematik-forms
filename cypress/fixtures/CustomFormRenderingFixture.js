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

const renderForm = ({ children, buttons, errorSummary, handleSubmit }) => {
	return (
		<form id="customForm" onSubmit={handleSubmit} >
			<div id="fields" style={{background: 'pink'}}>{children}</div>
			<hr id="divider" />
			<div id="buttons" style={{background: 'green'}}>{buttons}</div>
			<div id="summary" style={{background: 'yellow'}}>{errorSummary}</div>
		</form>
	);
};

const renderButtons = () => {
	return (
		<div>
			<button id="custom-cancel" type="button">Cancel</button>
			<button id="submit-it" type="submit">Submit</button>
		</div>
	);
};

const renderErrorSummary = () => {
	return (
		<div id="error-summary">
            This is the error summary
		</div>
	);
};

window.handleSubmitFn = values => {};

export default class CustomFormRenderingFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderForm={renderForm}
				renderButtons={renderButtons}
				renderErrorSummary={renderErrorSummary}
			/>
		);
	}
}
