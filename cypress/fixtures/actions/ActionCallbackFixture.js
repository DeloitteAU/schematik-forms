import React from 'react';
import FormBuilder from '~form-builder';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: '1',
			path: 'button',
			type: 'dummy-button',
			data: {
				label: 'Q1',
			},
			actions: [
				{
					type: 'triggers',
				},
			],
		},
	],
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

const registeredComponents = {
	'dummy-button': {
		component: ({path, runActions}) => {
			return <button id={path} type="button" onClick={e => {runActions()}}>Test button</button>
		}
	}
}

const registeredActions = {
	triggers: ({triggerCallback}) => {
		triggerCallback('TEST_TYPE', 'TEST_DATA');
	},
};

window.handleSubmitFn = values => {};
window.handleActionCallbackFn = () => {};

export default class SetValueFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredActions={registeredActions}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				onActionCallback={(...params) => { window.handleActionCallbackFn(...params); }}
				renderButtons={renderButtons}
			/>
		);
	}
}
