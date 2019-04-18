import React from 'react';
import FormBuilder from '~form-builder';
import registeredComponents from './setup/registeredComponents';

const config = {
	version: 0,
	id: 'testForm',
	fields: [
		{
			id: 'input01',
			path: 'first',
			type: 'dummy-input',
			data: {
				label: 'Dummy input #1',
			},
		},
		{
			id: 'section1',
			type: 'dummy-section',
			data: {
				title: 'Dummy section #1',
			},
			fields: [
				{
					id: 'section2',
					type: 'dummy-section',
					data: {
						title: 'Dummy section #2',
					},
					fields: [
						{
							id: 'input21',
							path: 'second',
							type: 'dummy-input',
							data: {
								label: 'Dummy input #3',
							},
						},
						{
							id: 'section3',
							type: 'dummy-section',
							data: {
								title: 'Dummy section #3',
							},
							fields: [
								{
									id: 'input31',
									path: 'group.third',
									type: 'dummy-input',
									data: {
										label: 'Dummy input #3',
									},
								},
								{
									id: 'input32',
									path: 'fourth',
									type: 'dummy-input',
									data: {
										label: 'Dummy input #7',
									},
								},
							],
						},
					],
				},
				{
					id: 'input11',
					path: 'group.subgroup.fifth',
					type: 'dummy-input',
					data: {
						label: 'Dummy input #3',
					},
				},
			],
		},
	],
};

const renderButtons = () => {
	return <button id="submit-it" type="submit">Submit</button>;
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
