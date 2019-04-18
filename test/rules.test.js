import { parseRules } from '../src/rules';
import { mapPathsToTree } from '../src/utils';

describe('parseRules(config, pathsToTreeMap, formValues)', () => {
	it('should compute shown property for a flat config', () => {
		const formConfig = {
			version: 0,
			id: 'testForm',
			fields: [
				{
					id: 'input1',
					path: 'group.first',
					type: 'dummy-input',
				},
				{
					id: 'input2',
					path: 'group.second',
					type: 'dummy-input',
					rules: [
						{
							property: 'shown',
							when: {
								eq: {
									fieldPath: 'group.first',
									values: ['match'],
								},
							},
						},
					],
				},
			],
		};

		const pathsToTreeMap = mapPathsToTree(formConfig);

		const result1 = parseRules(formConfig, pathsToTreeMap, { group: { first: 'not a match' } });

		expect(result1.input1.shown).toEqual(true);
		expect(result1.input2.shown).toEqual(false);

		const result2 = parseRules(formConfig, pathsToTreeMap, { group: { first: 'match' } });

		expect(result2.input1.shown).toEqual(true);
		expect(result2.input2.shown).toEqual(true);
	});

	it('should compute shown property for a nested config', () => {
		const formConfig = {
			version: 0,
			id: 'testForm',
			fields: [
				{
					id: 'input1',
					path: 'group.first',
					type: 'dummy-section',
				},
				{
					id: 'section',
					type: 'dummy-input',
					rules: [
						{
							property: 'shown',
							when: {
								eq: {
									fieldPath: 'second',
									values: ['match'],
								},
							},
						},
					],
					fields: [
						{
							id: 'input2a',
							path: 'second',
							type: 'dummy-input',
						},
					],
				},
			],
		};

		const pathsToTreeMap = mapPathsToTree(formConfig);

		const result1 = parseRules(formConfig, pathsToTreeMap, { second: 'not a match' });

		expect(result1.section.shown).toEqual(false);
		expect(result1['section.input2a'].shown).toEqual(false);
		expect(result1.input1.shown).toEqual(true);

		const result2 = parseRules(formConfig, pathsToTreeMap, { second: 'match' });

		expect(result2.section.shown).toEqual(true);
		expect(result2['section.input2a'].shown).toEqual(true);
		expect(result2.input1.shown).toEqual(true);
	});
});
