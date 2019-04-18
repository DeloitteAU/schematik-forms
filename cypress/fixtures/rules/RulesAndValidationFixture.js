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
		},
		{
			id: 't1',
			path: 'text.one',
			type: 'dummy-input',
			required: true,
			data: {
				label: 'text.one',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'radio.one',
							values: ['yes'],
						},
					},
				},
			],
		},
		{
			id: 'section1',
			type: 'dummy-section',
			data: {
				title: 'Section 1',
			},
			rules: [
				{
					property: 'shown',
					when: {
						eq: {
							fieldPath: 'radio.one',
							values: ['yes'],
						},
					},
				},
			],
			fields: [
				{
					id: 'section1a',
					type: 'dummy-section',
					data: {
						title: 'Section 1.a',
					},
					fields: [
						{
							id: '2',
							path: 'radio.three',
							type: 'dummy-radio',
							data: {
								label: 'radio.three',
							},
						},
					],
				},
				{
					id: 'section1b',
					type: 'dummy-section',
					data: {
						title: 'Section 1.b',
					},
					fields: [
						{
							id: 'section1bi',
							type: 'dummy-section',
							data: {
								title: 'Section 1',
							},
							rules: [
								{
									property: 'shown',
									when: {
										eq: {
											fieldPath: 'radio.three',
											values: ['yes'],
										},
									},
								},
							],
							fields: [
								{
									id: '3',
									path: 'text.two',
									type: 'dummy-input',
									required: true,
									data: {
										label: 'text.two',
									},
								},
							],
						},
					],
					rules: [
						{
							property: 'shown',
							when: {
								eq: {
									fieldPath: 'radio.two',
									values: ['yes'],
								},
							},
						},
					],
				},
			],
		},
	],
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
				registeredComponents={registeredComponents}
				onSubmit={(...params) => { window.handleSubmitFn(...params); }}  // Method used to spy on callbacks in cypress
				renderButtons={renderButtons}
			/>
		);
	}
}
