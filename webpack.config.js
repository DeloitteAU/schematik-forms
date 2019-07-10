const path = require('path');
const { createConfig } = require('@deloitte-digital-au/webpack-config-react');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = createConfig({
	entry: {
		main: [
			'core-js',
			'./index.js',
		],
	},
	devtool: 'cheap-eval-source-map',
	output: {
		path: path.resolve(__dirname, './dist/'),
		publicPath: '/',
	},
	devServer: {
		port: 8080,
		inline: true,
		contentBase: ['./src', './dist'],
		publicPath:'/',
		hot: true,
		historyApiFallback: true,
	},
	resolve: {
		alias: {
			'~form-builder': path.resolve(__dirname, './src/'),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve('index.ejs'),
		})
	]
});
