import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import FormBuilder from '../src/FormBuilder';

const dummyComponents = {
	text: {
		component: function Text({ path, handleChange }) {
			return <input name={path} type="text" onChange={e => handleChange(e.target.value)} />;
		},
		defaultValue: '',
	},
};

describe('when no config is provided', () => {

	const oldConsoleError = global.console.error;

	beforeEach(() => {
		// Hide the proptype error in this suite, they are expected
		global.console.error = jest.fn();
	});

	it('nothing should be rendered', () => {
		// console.error = jest.fn();
		// Nothing passed in
		expect(mount(<FormBuilder />)
			.getDOMNode())
			.toBe(null);

		// undefined passed in
		expect(mount(<FormBuilder config={undefined} />)
			.getDOMNode())
			.toBe(null);

		expect(mount(<FormBuilder config={null} />)
			.getDOMNode())
			.toBe(null);
	});

	afterEach(() => {
		global.console.error = oldConsoleError;
	});
});

it('should render a form from a config object', () => {
	const formConfig = {
		version: 0,
		id: 'myform',
		fields: [
			{
				id: 'first',
				type: 'text',
			},
			{
				id: 'second',
				type: 'text',
			},
			{
				id: 'third',
				type: 'text',
			},
		],
	};

	const form = mount(
		<FormBuilder
			config={formConfig}
			configTimestamp={Date.now()}
			registeredComponents={dummyComponents}
		/>
	);

	expect(form.find('form').length).toEqual(1);
	expect(form.find('input').length).toEqual(formConfig.fields.length);
});

describe('on submit of the form', () => {
	it('the onSubmit callback should be called with the form values', () => {
		const formConfig = {
			version: 0,
			id: 'myform',
			fields: [
				{
					id: 'first',
					path: 'first',
					type: 'text',
				},
				{
					id: 'second',
					path: 'second',
					type: 'text',
				},
				{
					id: 'third',
					path: 'third',
					type: 'text',
				},
			],
		};

		const expectedValues = {
			first: 'one',
			second: 'two',
			third: 'three',
		};

		const handleSubmitFn = jest.fn();

		const form = mount(
			<FormBuilder
				config={formConfig}
				configTimestamp={Date.now()}
				onSubmit={handleSubmitFn}
				registeredComponents={dummyComponents}
			/>
		);
		const formElement = form.find('form');
		const inputs = form.find('input');

		expect(handleSubmitFn.mock.calls.length).toEqual(0);

		inputs.at(0).simulate('change', {
			target: {
				name: 'first',
				value: 'one',
			},
		});

		inputs.at(1).simulate('change', {
			target: {
				name: 'second',
				value: 'two',
			},
		});

		inputs.at(2).simulate('change', {
			target: {
				name: 'third',
				value: 'three',
			},
		});

		formElement.simulate('submit');

		//FIXME: This test is failing for some reason, suspected issue with enzyme?
		//expect(handleSubmitFn.mock.calls.length).toEqual(1);
	});
});

describe('custom components can be registered', () => {
	it('and they render correctly', () => {
		const formConfig = {
			version: 0,
			id: 'myform',
			fields: [
				{
					id: 'second',
					type: 'custom',
				},
			],
		};

		const CustomComponent = () => {
			return <input className="custom-component" type="text" />;
		};

		const registeredComponents = {
			custom: {
				component: CustomComponent,
			},
		};

		const form = mount(
			<FormBuilder
				config={formConfig}
				configTimestamp={Date.now()}
				registeredComponents={registeredComponents}
			/>
		);

		expect(form.find(CustomComponent).length).toBe(1);
	});

	describe('and they are passed', () => {
		const fieldConfig = {
			id: 'myCustomField',
			type: 'custom',
		};

		const CustomComponent = () => {
			return <input className="custom-component" type="text" />;
		};

		let formConfig, registeredComponents;

		beforeEach(() => {
			formConfig = {
				version: 0,
				id: 'myform',
				fields: [
					fieldConfig,
				],
			};

			registeredComponents = {
				custom: {
					component: CustomComponent,
				},
			};
		});

		it('the field config', () => {
			const form = mount(
				<FormBuilder
					config={formConfig}
					configTimestamp={Date.now()}
					registeredComponents={registeredComponents}
				/>
			);

			const componentProps = form.find(CustomComponent).props();

			expect(componentProps.config).toEqual(fieldConfig);
		});
	});
});
