const path = require('path');
//const HTMLWebpackPlugin = require('html-webpack-plugin');
//const syntaxDynamicImportPlugin = require('babel-plugin-syntax-dynamic-import');
// const CodeSplitWebpackPlugin =  require('code-split-component/webpack');
// const proposal =  require('proposal');
// const webpack = require('webpack');
// var Promise = require('es6-promise').Promise;


module.exports = {
	entry: './view/assets/js/cpm.js',

	output: {
		path: path.resolve( __dirname, 'view/assets/js'),
		filename: 'cpm-bundle.js',
		publicPath: '/api/wp-content/plugins/cpmapi/view/assets/js/',
		chunkFilename: 'chunk/[id].chunk-bundle.js',
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
	    // new HTMLWebpackPlugin({
	    //     title: 'Code Splitting'
	    // }),
    ]
}
