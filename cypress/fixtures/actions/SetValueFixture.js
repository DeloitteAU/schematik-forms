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
			actions: [
				{
					type: 'setValue',
					when: { eq: 'yes' },
					data: {
						sets: [
							{
								path: 'radio.two',
								value: 'yes',
							},
						],
					},
				},
			],
		},
		{
			id: 'r2',
			path: 'radio.two',
			type: 'dummy-radio',
			data: {
				label: 'Q2',
			},
		},
		{
			id: 'r3',
			path: 'radio.three',
			type: 'dummy-radio',
			data: {
				label: 'Q1',
			},
			actions: [
				{
					type: 'setValue',
					when: { eq: 'no' },
					data: {
						sets: [
							{
								path: 'text.one',
								value: 'testing',
							},
							{
								path: 'radio.two',
								value: 'no',
							},
						],
					},
				},
			],
		},
		{
			id: 'r4',
			path: 'text.one',
			type: 'dummy-input',
			data: {
				label: 'Q2',
			},
			actions: [
				{
					type: 'setValue',
					when: { eq: 'match-one' },
					data: {
						sets: [
							{
								path: 'radio.one',
								value: 'yes',
							},
						],
					},
				},
				{
					type: 'setValue',
					when: { eq: 'match-two' },
					data: {
						sets: [
							{
								path: 'radio.one',
								value: 'no',
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

const registeredActions = {
	setValue: ({action, setFieldValue}) => {
		// Get the list of 'sets' objects from the action config.
		// 'sets' are defined as:
		// {
		//   path: String, // the path of the field to set the value of,
		//   value: any,   // the value to set the field to
		// }
		const sets = (action.data && action.data.sets) ? action.data.sets : [];

		// Use Formik's setFieldValue to update the field, but set the validateForm to false
		// to avoid unneccasary re-renders.
		sets.forEach(set => {
			setFieldValue(set.path, set.value);
		});
	}
}

window.handleSubmitFn = values => {};

export default class SetValueFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={registeredComponents}
				registeredActions={registeredActions}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
