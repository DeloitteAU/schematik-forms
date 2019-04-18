import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

let timeout = null;

const getNewConfig = (requestData, formValues = {}) => {
	const initialConfig = {
		version: 0,
		id: 'testForm',
		initialValues: formValues,
		fields: [
			{
				id: 'r1',
				path: 'radio.one',
				type: 'dummy-radio',
				data: {
					label: 'Q1',
				},
				actions: [
					{
						type: 'requestNewConfig',
						data: 'test data from old config',
					},
				],
			},
			{
				id: 't1',
				path: 'willchangetype',
				type: 'dummy-input',
				data: {
					label: 'Q2',
				},
			},
			{
				id: 't3',
				path: 'text.three',
				type: 'dummy-input',
				data: {
					label: 'Q4',
				},
			},
		],
	};

	const newConfig = {
		version: 0,
		id: 'testForm',
		initialValues: {
			...formValues,
			new: requestData,
		},
		initialErrors: {
			text: {
				three: ['test server error'],
			},
		},
		fields: [
			{
				id: 'r1',
				path: 'radio.one',
				type: 'dummy-radio',
				data: {
					label: 'Q1',
				},
				actions: [
					{
						type: 'requestNewConfig',
						data: 'test data from new config',
					},
				],
			},
			{
				id: 't1',
				path: 'willchangetype',
				type: 'dummy-radio',
				data: {
					label: 'Q2',
				},
			},
			{
				id: 't2',
				path: 'new',
				type: 'dummy-input',
				data: {
					label: 'Q3',
				},
			},
			{
				id: 't3',
				path: 'text.three',
				type: 'dummy-input',
				data: {
					label: 'Q4',
				},
			},
		],
	};

	if (timeout) {
		clearTimeout(timeout);
	}

	return new Promise((resolve, reject) => {
		timeout = setTimeout(() => {
			if (formValues.radio && formValues.radio.one === 'yes') {
				return resolve(newConfig);
			} else {
				return resolve(initialConfig);
			}
		}, 200);
	});
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => { };

export default class RequestNewConfigFixture extends React.Component {
	state = {
		configTimestamp: Date.now(),
		config: null,
	}

	registeredActions = {
		requestNewConfig: ({action, formValues}) => {
			this._handleRequestNewConfig(action.data, formValues);
		},
	}

	_handleRequestNewConfig(requestData, formValues) {
		getNewConfig(requestData, formValues)
			.then(config => {
				this.setState({
					configTimestamp: Date.now(),
					config,
				});
			});
	}

	componentDidMount() {
		getNewConfig()
			.then(config => {
				this.setState({
					configTimestamp: Date.now(),
					config,
				});
			});
	}

	render() {
		return (
			<FormBuilder
				config={this.state.config}
				configTimestamp={this.state.configTimestamp}
				registeredComponents={registeredComponents}
				registeredActions={this.registeredActions}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
