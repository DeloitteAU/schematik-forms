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
				label: 'radio.one',
			},
		},
		{
			id: 'r2',
			path: 'radio.two',
			type: 'dummy-radio',
			data: {
				label: 'radio.two',
			},
			rules: [
				{
					property: 'shown',
					when: {
						all: [
							{
								eq: {
									fieldPath: 'radio.one',
									values: ['yes'],
								},
							},
							{
								eq: {
									fieldPath: 'text.one',
									values: ['match'],
								},
							},
						],
					},
				},
			],
		},
		{
			id: 'r3',
			path: 'text.one',
			type: 'dummy-input',
			data: {
				label: 'text.one',
			},
		},
		{
			id: 'r5',
			path: 'radio.four',
			type: 'dummy-radio',
			data: {
				label: 'radio.four',
			},
			rules: [
				{
					property: 'shown',
					when: {
						any: [
							{
								eq: {
									fieldPath: 'radio.one',
									values: ['yes'],
								},
							},
							{
								eq: {
									fieldPath: 'text.one',
									values: ['match'],
								},
							},
						],
					},
				},
			],
		},
		{
			id: 'r6',
			path: 'text.two',
			type: 'dummy-input',
			data: {
				label: 'text.two',
			},
			rules: [
				{
					property: 'shown',
					when: {
						all: [
							{
								any: [
									{
										eq: {
											fieldPath: 'radio.one',
											values: ['yes'],
										},
									},
									{
										eq: {
											fieldPath: 'text.one',
											values: ['match'],
										},
									},
								],
							},
							{
								not: {
									eq: {
										fieldPath: 'radio.four',
										values: ['yes'],
									},
								},
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

window.handleSubmitFn = values => { };

export default class ComplexRulesFixture extends React.Component {
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
