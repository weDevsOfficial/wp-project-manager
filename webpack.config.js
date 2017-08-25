var path    = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './view/assets/js/cpm.js',

	output: {
		path: path.resolve( __dirname, 'view/assets/js'),
		filename: 'cpm-bundle.js',
		publicPath: '/view/assets/js'
	},

	module: {
		rules: [
			// doc url https://vue-loader.vuejs.org/en/options.html#loaders
			{   
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
			        	//js: 'babel-loader!eslint-loader'
			        }
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/	
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				exclude: /node_modules/,
				options: {
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},

	plugins: [
		//new webpack.optimize.UglifyJsPlugin({
			// ....
		//})
	]
}