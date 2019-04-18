import React from 'react';
import ReactDOM from 'react-dom';
import { iterateFields, getComponent, getValidator, filterFormValues } from '../src/utils';

describe('[UTIL] getComponent()', () => {
	it('should return undefined if no components are registered', () => {
		const found1 = getComponent(undefined, 'typeThatIsNotThere');
		expect(found1).toBe(undefined);

		const found2 = getComponent({}, 'typeThatIsNotThere');
		expect(found2).toBe(undefined);
	}),

	it('should return undefined if the component isn\'t found', () => {
		const components = {
			test1: {
				component: function Test1() {
					return <div />;
				},
			},
			test2: {
				component: function Test1() {
					return <div />;
				},
			},
		};
		const found = getComponent(components, 'typeThatIsNotThere');
		expect(found).toBe(undefined);
	}),

	it('should return the component if it exists', () => {
		const components = {
			test1: {
				component: function Test1() {
					return <div />;
				},
			},
			test2: {
				component: function Test1() {
					return <div />;
				},
			},
		};
		const found = getComponent(components, 'test2');
		expect(found).toBe(components.test2.component);
	});
});

describe('[UTIL] getValidator()', () => {
	it('should return undefined if no validators are registered', () => {
		const found1 = getComponent(undefined, 'typeThatIsNotThere');
		expect(found1).toBe(undefined);

		const found2 = getComponent({}, 'typeThatIsNotThere');
		expect(found2).toBe(undefined);
	}),

	it('should return undefined if the validator isn\'t found', () => {
		const components = {
			test1: function Test1() {
				return true;
			},
			test2: function Test1() {
				return true;
			},
		};
		const found = getValidator(components, 'typeThatIsNotThere');
		expect(found).toBe(undefined);
	}),

	it('should return the validator if it exists', () => {
		const validators = {
			test1: function Test1() {
				return true;
			},
			test2: function Test1() {
				return true;
			},
		};
		const found = getValidator(validators, 'test2');
		expect(found).toBe(validators.test2);
	});
});

describe('[UTIL] iterateFields()', () => {
	it('should handle empty configs', () => {
		const iterator1 = iterateFields();
		expect(iterator1.next().done).toBe(true);

		const iterator2 = iterateFields(null);
		expect(iterator2.next().done).toBe(true);

		const iterator3 = iterateFields({});
		expect(iterator3.next().done).toBe(true);

		const iterator4 = iterateFields({
			fields: null,
		});
		expect(iterator4.next().done).toBe(true);

		const iterator5 = iterateFields({
			fields: [],
		});
		expect(iterator5.next().done).toBe(true);
	});

	it('should iterate over flat fields', () => {
		const formConfig = {
			fields: [
				{
					id: 'input1',
				},
				{
					id: 'input2',
				},
				{
					id: 'input3',
				},
			],
		};

		const iterator = iterateFields(formConfig);
		let current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input1');
		expect(current.value.treePath).toEqual('input1');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input2');
		expect(current.value.treePath).toEqual('input2');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input3');
		expect(current.value.treePath).toEqual('input3');

		current = iterator.next();
		expect(current.done).toBe(true);
	});

	it('should iterate over nested fields', () => {
		const formConfig = {
			fields: [
				{
					id: 'input1',
				},
				{
					id: 'input2',
					fields: [
						{
							id: 'input2a',
							fields: [
								{
									id: 'input2aa',
								},
							],
						},
						{
							id: 'input2b',
						},
					],
				},
				{
					id: 'input3',
					fields: [
						{
							id: 'input3a',
						},
					],
				},
			],
		};

		const iterator = iterateFields(formConfig);
		let current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input1');
		expect(current.value.treePath).toEqual('input1');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input2');
		expect(current.value.treePath).toEqual('input2');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input2a');
		expect(current.value.treePath).toEqual('input2.input2a');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input2aa');
		expect(current.value.treePath).toEqual('input2.input2a.input2aa');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input2b');
		expect(current.value.treePath).toEqual('input2.input2b');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input3');
		expect(current.value.treePath).toEqual('input3');

		current = iterator.next();
		expect(current.value.fieldConfig.id).toEqual('input3a');
		expect(current.value.treePath).toEqual('input3.input3a');

		current = iterator.next();
		expect(current.done).toBe(true);
	});
});
