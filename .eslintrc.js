module.exports = {
    parser: 'babel-eslint',
	extends: [
		'@deloitte-digital-au/eslint-config-react',
	],
	overrides: [
		{
			files: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
			env: {
				jest: true, // now **/*.test.js files' env has both es6 *and* jest
			},
		},
	],
	rules: {
		'react/no-multi-comp': ['error', {ignoreStateless: true}],
	},
};
