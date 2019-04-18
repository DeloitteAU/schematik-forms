import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from '../setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'c1',
			path: 'control.one',
			type: 'dummy-radio',
			data: {
				label: 'control.one',
			},
		},
		{
			id: 'c2',
			path: 'control.two',
			type: 'dummy-radio',
			data: {
				label: 'control.two',
			},
		},
		{
			id: 'retains',
			path: 'retains',
			type: 'dupe-safe-radio',
			retainValue: true,
			data: {
				label: 'retains',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'control.one',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'notRetains',
			path: 'notRetains',
			type: 'dummy-radio',
			data: {
				label: 'notRetains',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'control.one',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'section',
			type: 'dummy-section',
			data: {
				title: 'Section 1',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'control.one',
							values: ['yes'],
						},
					},
				},
			],
			fields: [
				{
					id: 'textRetains',
					path: 'textRetains',
					type: 'dummy-input',
					retainValue: true,
					data: {
						label: 'textRetains',
					},
				},
			],
		},
		{
			id: 'retainsDuplicate',
			path: 'retains',
			type: 'dupe-safe-radio',
			retainValue: true,
			data: {
				label: 'retainsDuplicate',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'control.two',
							values: ['yes'],
						},
					},
				},
			],
		},
	],
};

const DupeSafeRadio = ({ htmlId, path, config, handleChange, errors, value }) => (
	<div className="dummy-radio" id={htmlId}>
		<label>{config.data.label}</label>
		<label>
			<span>Yes</span>
			<input type="radio" onChange={() => handleChange('yes')} name={htmlId} value="yes" checked={value === 'yes'} />
		</label>
		<label>
			<span>No</span>
			<input type="radio" onChange={() => handleChange('no')} name={htmlId} value="no" checked={value === 'no'} />
		</label>
	</div>
);

const components = {
	...registeredComponents,
	'dupe-safe-radio': {
		defaultValue: '',
		component: DupeSafeRadio,
	}
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
};

window.handleSubmitFn = values => { };

export default class NestedRulesFixture extends React.Component {
	render() {
		return (
			<FormBuilder
				config={config}
				registeredComponents={components}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
