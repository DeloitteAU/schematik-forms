const path = require('path');
const config = require('@deloitte-digital-au/webpack-config-react');

const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

config.entry = {
	main: [
		'core-js',
		'./index.js',
	],
};

config.resolve = {
	alias: {
		'~form-builder': path.resolve(__dirname, '../../lib/'),
	},
},

config.serve = {
	...config.serve,
	add: (app, middleware, options) => {
		const historyOptions = {
			// ... see: https://github.com/bripkens/connect-history-api-fallback#options
		};

		app.use(convert(history(historyOptions)));
	},
};

module.exports = config;
